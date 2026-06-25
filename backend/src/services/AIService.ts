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
      You are an expert career coach and professional recruiter for the selected industry.
      Analyze the following resume text for the target job role: "${jobRole}".

      Resume Text:
      ---
      ${resumeText}
      ---

      Please provide a detailed analysis in the following JSON format:
      {
        "extracted_skills": ["skill1", "skill2", ...],
        "required_skills": ["skillA", "skillB", ...],
        "missing_skills": ["skillC", "skillD", ...],
        "match_percentage": 85,
        "roadmap": [
          {
            "step": "Step Name",
            "description": "Detailed learning path",
            "resources": ["Course link or tool name", ...]
          }
        ]
      }

      Ensure that "missing_skills" are skills present in "required_skills" but not in "extracted_skills".
      The "roadmap" should specifically address the "missing_skills".
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional recruitment AI that outputs strictly valid JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) throw new Error('AI failed to generate a response.');

    // Clean up potential markdown code block wrappers (e.g. ```json ... ```) returned by the LLM
    const cleanedResult = result.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/, '$1').trim();

    return JSON.parse(cleanedResult) as AnalysisResponse;
  }
}
