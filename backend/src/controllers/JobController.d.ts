import type { Request, Response } from 'express';
export declare class JobController {
    /**
     * Matches jobs based on user skills and target role.
     * POST /api/jobs/match
     */
    matchJobs(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Retrieves all mock jobs.
     * GET /api/jobs/all
     */
    getAllJobs(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=JobController.d.ts.map