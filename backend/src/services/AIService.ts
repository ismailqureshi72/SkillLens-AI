import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

export interface AnalysisResponse {
  extracted_skills: string[];
  required_skills: string[];
  missing_skills: string[];
  match_percentage: number;
  roadmap: Array<{
    step: string;
    description: string;
    resources: string[];
  }>;
}

export class AIService {
  /**
   * Analyzes a resume for a specific job role using OpenAI GPT-4o.
   * @param resumeText The extracted text from the resume.
   * @param jobRole The target job role or description.
   * @returns Structured analysis response.
   */
  async analyzeResume(resumeText: string, jobRole: string): Promise<AnalysisResponse> {
    const prompt = `
      You are an expert career strategist, senior recruiter, and domain expert in the target field.
      Your task is to conduct a highly detailed, professional, and industry-grade semantic analysis of the provided resume text against the target job role: "${jobRole}".

      Resume Text:
      ---
      ${resumeText}
      ---

      Please evaluate the candidate's alignment with target industry standards for the role "${jobRole}" and output a valid JSON containing:
      
      1. "extracted_skills": A comprehensive list of specific skills, methodologies, frameworks, programming languages, libraries, platforms, or domain expertise found in the resume. Extract actual granular skills rather than generic concepts.
      
      2. "required_skills": The core skills, certifications, tools, and methodologies expected for a competitive candidate in the target role "${jobRole}" at its typical seniority level. Avoid generic lists. Tailor the required skills directly to "${jobRole}" (e.g., if it is a medical/nutritionist/healthcare role, focus on healthcare protocols, client assessment, clinical dietetics; if it is marketing, focus on SEO, digital ads, web analytics, copywriting; if it is engineering, focus on structural design, physics, CAD tools).
      
      3. "missing_skills": The crucial skills that are required for "${jobRole}" but are completely absent or insufficient in the candidate's resume.
      
      4. "match_percentage": A placeholder percentage (an integer between 0 and 100) representing initial alignment. Note: This will be calibrated programmatically.
      
      5. "roadmap": A sequenced, practical 3-step upskilling trajectory to bridge the missing skills gap.
         Each step must include:
         - "step": A concise title (e.g., "Phase 1: Master Nutrition Assessment Protocols" or "Phase 1: Deepen TypeScript & State Management").
         - "description": A highly structured, actionable paragraph explaining exactly what the candidate needs to learn, why it is critical for the target role, and what specific project they should build to practice.
         - "resources": 2-3 specific, reputable learning resources, course names, textbooks, or official certification names (e.g., "Coursera: Dietetics and Nutrition Specialization", "Official React Documentation", "AWS Certified Solutions Architect"). Avoid generic search queries.

      JSON Schema:
      {
        "extracted_skills": ["skill1", "skill2", ...],
        "required_skills": ["skillA", "skillB", ...],
        "missing_skills": ["skillC", "skillD", ...],
        "match_percentage": 75,
        "roadmap": [
          {
            "step": "Phase 1: ...",
            "description": "...",
            "resources": ["...", "..."]
          }
        ]
      }

      Strict Guidelines:
      - All JSON keys must match the schema exactly.
      - Ensure the analysis is tailored explicitly to the target role "${jobRole}".
      - The upskilling roadmap must directly address the identified missing skills.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional recruitment AI that outputs strictly valid JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const result = response.choices?.[0]?.message?.content;
    if (!result) throw new Error('AI failed to generate a response.');

    // Clean up potential markdown code block wrappers (e.g. ```json ... ```) returned by the LLM
    const cleanedResult = result.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/, '$1').trim();

    return JSON.parse(cleanedResult) as AnalysisResponse;
  }

  /**
   * Classifies if a document is a resume or CV.
   * @param resumeText The extracted text from the document.
   * @returns boolean indicating if the AI confirms it is a resume.
   */
  async classifyResume(resumeText: string): Promise<boolean> {
    const prompt = `Classify this document.
Is it a professional CV or resume?

Rules:
* A CV/resume includes sections like education, experience, skills, projects.
* It summarizes a person's qualifications.
* It is NOT an offer letter, contract, report, or business document.

Answer ONLY one word:
YES or NO.

Document:
${resumeText}`;

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an assistant that only responds with YES or NO.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0,
      });

      const result = response.choices?.[0]?.message?.content?.trim().toUpperCase();
      return result === 'YES' || result?.includes('YES') === true;
    } catch (err) {
      console.error('AI Classification Error:', err);
      // Fallback to true on network/API failure to avoid blocking users
      return true;
    }
  }
}
