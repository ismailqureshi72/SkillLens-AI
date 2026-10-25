import { analyzeResume } from '../lib/ai.js';
import { prisma } from '../lib/prisma.js';
import { DOMMatrix, ImageData, Path2D } from '@napi-rs/canvas';
import mammoth from 'mammoth';

// PDF.js needs these APIs in Node. Explicit imports let Vercel bundle the
// native canvas dependency, which PDF.js otherwise loads dynamically.
globalThis.DOMMatrix ||= DOMMatrix;
globalThis.ImageData ||= ImageData;
globalThis.Path2D ||= Path2D;

// Helper: CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function findArrayByKeyPart(obj, part) {
  if (!obj || typeof obj !== 'object') return [];
  const keys = Object.keys(obj);
  const matchKey = keys.find(k => k.toLowerCase().includes(part.toLowerCase()));
  if (matchKey && Array.isArray(obj[matchKey])) {
    return obj[matchKey];
  }
  return [];
}

function hasForbiddenKeywords(text) {
  const forbiddenList = [
    /offer letter/i,
    /dear candidate/i,
    /we are pleased to offer/i,
    /terms and conditions/i,
    /onboarding packet/i,
    /sign and return/i
  ];
  return forbiddenList.some(regex => regex.test(text));
}

async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  } else if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    return res.end();
  }

  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let resumeText = '';
    let jobRole = '';

    // Check Content-Type to determine how to parse
    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data manually using the raw body
      const { parseMultipart } = await import('../lib/multipart.js');
      const { fields, file } = await parseMultipart(req);

      jobRole = fields.jobRole || fields.targetRole || fields.target_role || '';

      if (file) {
        resumeText = await extractTextFromBuffer(file.buffer, file.filename);
      } else if (fields.resumeText || fields.resume_text) {
        resumeText = fields.resumeText || fields.resume_text;
      }
    } else {
      // JSON or text body (stream must be read since bodyParser is false)
      let body = req.body;
      if (!body) {
        const raw = await new Promise((resolve, reject) => {
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
          req.on('error', reject);
        });
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          body = {};
        }
      }
      jobRole = body.jobRole || body.targetRole || body.target_role || '';
      resumeText = body.resumeText || body.resume_text || '';
    }

    if (!resumeText) {
      return res.status(400).json({ error: 'Please upload a file or provide resume text.' });
    }

    // Local heuristic validation
    const keywordScore = (resumeText.match(/(experience|education|skills|work|projects|employment|history)/gi) || []).length;
    const structureScore = (resumeText.match(/(contact|email|phone|address|profile|summary)/gi) || []).length;
    const forbiddenDetected = hasForbiddenKeywords(resumeText);
    const isValid = (structureScore > 0 || keywordScore > 0 || (resumeText && resumeText.trim().length > 300)) && !forbiddenDetected;

    if (!isValid) {
      return res.status(400).json({
        error: "Invalid document. Please upload a valid CV or resume. Documents like offer letters, contracts, or reports are not supported."
      });
    }

    // AI Analysis
    const analysisResult = await analyzeResume(resumeText, jobRole);

    const extractedSkills = findArrayByKeyPart(analysisResult, 'extracted');
    const requiredSkills = findArrayByKeyPart(analysisResult, 'required');
    const missingSkills = findArrayByKeyPart(analysisResult, 'missing');

    // Calculate match percentage
    let matchPercentage = 65;
    if (requiredSkills.length > 0) {
      const getKeywords = (skills) => {
        const words = new Set();
        const stopWords = new Set(['and', 'or', 'for', 'with', 'the', 'of', 'in', 'by', 'an', 'to', 'at', 'on', 'a', 'best', 'practices', 'level', 'implied', 'portfolio', 'link', 'using', 'based', 'core', 'strong']);

        skills.forEach(skill => {
          const parts = skill.toLowerCase()
            .replace(/[()[\].,\/#!$%\^&\*;:{}=\-_`~?]/g, ' ')
            .split(/\s+/);

          parts.forEach(p => {
            const clean = p.trim();
            if (clean.length > 2 && !stopWords.has(clean)) {
              words.add(clean);
            }
          });
        });
        return words;
      };

      const extractedKeywords = getKeywords(extractedSkills);

      let matchedCount = 0;
      requiredSkills.forEach(reqSkill => {
        const reqKeywords = Array.from(getKeywords([reqSkill]));
        if (reqKeywords.length === 0) return;

        const isMatched = reqKeywords.some(word => extractedKeywords.has(word));
        if (isMatched) {
          matchedCount++;
        }
      });

      const matchRatio = matchedCount / requiredSkills.length;
      matchPercentage = 55 + Math.round(matchRatio * 35);

      if (matchedCount === 0) {
        matchPercentage = extractedSkills.length > 0 ? 35 : 15;
      }

      const computedMissing = requiredSkills.filter(reqSkill => {
        const reqKeywords = Array.from(getKeywords([reqSkill]));
        if (reqKeywords.length === 0) return false;
        const isMatched = reqKeywords.some(word => extractedKeywords.has(word));
        return !isMatched;
      });

      if (computedMissing.length > 0) {
        missingSkills.length = 0;
        missingSkills.push(...computedMissing);
      }
    } else {
      const rawPercent = Number(analysisResult.match_percentage) ||
                         Number(analysisResult.matchPercentage) ||
                         65;
      matchPercentage = Math.max(25, Math.min(95, rawPercent));
    }

    matchPercentage = Math.max(15, Math.min(95, matchPercentage));

    // Save to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        resumeText,
        jobRole,
        extractedSkills: JSON.stringify(extractedSkills),
        requiredSkills: JSON.stringify(requiredSkills),
        missingSkills: JSON.stringify(missingSkills),
        matchPercentage: matchPercentage,
        roadmap: JSON.stringify(analysisResult.roadmap),
        userId: null,
      },
    });

    return res.json({
      ...savedAnalysis,
      matchPercentage,
      extractedSkills,
      requiredSkills,
      missingSkills,
      roadmap: analysisResult.roadmap,
    });
  } catch (error) {
    console.error('Analysis Error:', error);
    return res.status(500).json({ error: error.message || 'An internal error occurred during analysis.' });
  }
}

// Disable Vercel's default body parser so we can stream & parse multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

