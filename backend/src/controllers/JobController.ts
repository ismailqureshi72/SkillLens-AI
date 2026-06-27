import type { Request, Response } from 'express';
import { JobService } from '../services/JobService.js';

const jobService = new JobService();

export class JobController {
  /**
   * Matches jobs based on user skills and target role.
   * POST /api/jobs/match
   */
  async matchJobs(req: Request, res: Response) {
    try {
      const userSkills = req.body.user_skills || req.body.userSkills;
      const targetRole = req.body.target_role || req.body.targetRole;
      const filters = req.body.filters;

      if (!userSkills || !Array.isArray(userSkills)) {
        return res.status(400).json({ error: 'user_skills must be a valid array of strings.' });
      }

      const matchedJobs = jobService.matchJobs(userSkills, targetRole, filters);

      // Return both snake_case and camelCase to satisfy specifications and keep frontend typing clean
      const mappedJobs = matchedJobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        required_skills: job.requiredSkills,
        requiredSkills: job.requiredSkills,
        matched_skills: job.matchedSkills,
        matchedSkills: job.matchedSkills,
        missing_skills: job.missingSkills,
        missingSkills: job.missingSkills,
        match_percentage: job.matchPercentage,
        matchPercentage: job.matchPercentage,
        match_level: job.matchLevel,
        matchLevel: job.matchLevel,
        apply_link: job.applyLink,
        applyLink: job.applyLink,
      }));

      return res.json(mappedJobs);
    } catch (error: any) {
      console.error('Job Match Error:', error);
      return res.status(500).json({ error: error.message || 'An internal error occurred during job matching.' });
    }
  }

  /**
   * Retrieves all mock jobs.
   * GET /api/jobs/all
   */
  async getAllJobs(req: Request, res: Response) {
    try {
      const allJobs = jobService.matchJobs([], '');
      return res.json(allJobs);
    } catch (error: any) {
      console.error('Get All Jobs Error:', error);
      return res.status(500).json({ error: 'Failed to fetch jobs database.' });
    }
  }
}
