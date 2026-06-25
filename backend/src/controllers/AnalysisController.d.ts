import type { Request, Response } from 'express';
export declare class AnalysisController {
    /**
     * Handles resume analysis.
     * POST /api/analyze
     */
    analyze(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Retrieves all analysis history.
     * GET /api/analyses
     */
    listAnalyses(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Retrieves detailed trends data for a role.
     * GET /api/trends/:role
     */
    getTrends(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=AnalysisController.d.ts.map