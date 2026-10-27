import { analyzeResume } from '../lib/ai.js';
import { prisma } from '../lib/prisma.js';
import { ensureOwner, privateResponse } from '../lib/session.js';
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
    let parser;
    try {
      parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        return result.text;
      } finally {
        await parser.destroy();
      }
    } catch { throw Object.assign(new Error('This PDF could not be read. Please upload a valid, unlocked PDF.'), { status: 400 }); }
  } else if (ext === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch { throw Object.assign(new Error('This Word document could not be read. Please upload a valid DOCX file.'), { status: 400 }); }
  } else {
    throw Object.assign(new Error('Unsupported file format. Please upload a PDF or DOCX file.'), { status: 415 });
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

  privateResponse(res);
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
        if (file.buffer.length > 4 * 1024 * 1024) return res.status(413).json({ error: 'Please upload a file smaller than 4 MB.' });
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

    if (typeof jobRole !== 'string' || !jobRole.trim() || jobRole.length > 120) return res.status(400).json({ error: 'Enter a target role between 1 and 120 characters.' });
    jobRole = jobRole.trim();
    if (typeof resumeText !== 'string' || resumeText.length > 60000) return res.status(400).json({ error: 'Please use a resume with less than 60,000 characters.' });
    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Please upload a file or provide resume text.' });
    }

    // Local heuristic validation
    const keywordScore = (resumeText.match(/(experience|education|skills|work|projects|employment|history)/gi) || []).length;
    const forbiddenDetected = hasForbiddenKeywords(resumeText);
    const isValid = (keywordScore >= 2 && resumeText.trim().length >= 100) && !forbiddenDetected;

    if (!isValid) {
      return res.status(400).json({
        error: "Invalid document. Please upload a valid CV or resume. Documents like offer letters, contracts, or reports are not supported."
      });
    }

    // AI Analysis
    const analysisResult = await analyzeResume(resumeText, jobRole);

    const { extractedSkills, requiredSkills, missingSkills, matchPercentage, roadmap } = analysisResult;
    const userId = await ensureOwner(req, res);

    // Save to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        resumeText,
        jobRole,
        extractedSkills: JSON.stringify(extractedSkills),
        requiredSkills: JSON.stringify(requiredSkills),
        missingSkills: JSON.stringify(missingSkills),
        matchPercentage: matchPercentage,
        roadmap: JSON.stringify(roadmap),
        userId,
      },
    });

    return res.json({
      ...savedAnalysis,
      matchPercentage,
      extractedSkills,
      requiredSkills,
      missingSkills,
      roadmap,
    });
  } catch (error) {
    const status = [400, 413, 415, 429, 502, 503].includes(error.status) ? error.status : 500;
    if (error.retryAfter) res.setHeader('Retry-After', String(error.retryAfter));
    if (status === 500) console.error('Analysis could not be saved or processed.');
    return res.status(status).json({ error: status === 500 ? 'Unable to complete the analysis. Please try again.' : error.message });
  }
}

// Disable Vercel's default body parser so we can stream & parse multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

