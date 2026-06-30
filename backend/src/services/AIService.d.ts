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
export declare class AIService {
    /**
     * Analyzes a resume for a specific job role using OpenAI GPT-4o.
     * @param resumeText The extracted text from the resume.
     * @param jobRole The target job role or description.
     * @returns Structured analysis response.
     */
    analyzeResume(resumeText: string, jobRole: string): Promise<AnalysisResponse>;
    /**
     * Classifies if a document is a resume or CV.
     * @param resumeText The extracted text from the document.
     * @returns boolean indicating if the AI confirms it is a resume.
     */
    classifyResume(resumeText: string): Promise<boolean>;
}
//# sourceMappingURL=AIService.d.ts.map