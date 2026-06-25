export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requiredSkills: string[];
    applyLink: string;
}
export interface MatchedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requiredSkills: string[];
    matchedSkills: string[];
    missingSkills: string[];
    matchPercentage: number;
    matchLevel: 'Low' | 'Moderate' | 'Good' | 'Strong';
    applyLink: string;
}
export declare class JobService {
    /**
     * Matches user skills against the job database.
     * @param userSkills List of skills parsed from the user's resume.
     * @param targetRole Target role parameters to filter initial listings (optional).
     */
    matchJobs(userSkills: string[], targetRole?: string): MatchedJob[];
}
//# sourceMappingURL=JobService.d.ts.map