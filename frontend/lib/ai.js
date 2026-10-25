import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

export async function analyzeResume(resumeText, jobRole) {
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
      
      4. "match_percentage": A realistic match percentage (an integer between 0 and 100) representing how well the candidate's extracted skills match the required skills for the target role.
      
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

  let lastError = null;
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
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
      if (!result) {
        throw new Error('AI returned empty completion content.');
      }

      const cleanedResult = result.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/, '$1').trim();
      const parsed = JSON.parse(cleanedResult);

      // Ensure keys exist and are arrays to prevent parsing crashes
      if (!parsed.extracted_skills && !parsed.extractedSkills) parsed.extracted_skills = [];
      if (!parsed.required_skills && !parsed.requiredSkills) parsed.required_skills = [];
      if (!parsed.missing_skills && !parsed.missingSkills) parsed.missing_skills = [];
      if (!parsed.roadmap) parsed.roadmap = [];

      return parsed;
    } catch (error) {
      console.warn(`[AIService] Analysis attempt ${attempt} failed: ${error.message || error}`);
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }
  }

  throw new Error(`AI was unable to generate a response after ${maxAttempts} attempts. Details: ${lastError?.message || lastError}`);
}
