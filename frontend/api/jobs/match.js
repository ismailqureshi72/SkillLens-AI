import { matchJobs } from '../../lib/jobs.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const userSkills = body.user_skills || body.userSkills;
    const targetRole = body.target_role ?? body.targetRole ?? '';
    const filters = body.filters ?? {};

    if (!Array.isArray(userSkills) || userSkills.length > 200 || userSkills.some(s => typeof s !== 'string' || s.length > 300)) {
      return res.status(400).json({ error: 'user_skills must be a valid array of strings.' });
    }
    if (typeof targetRole !== 'string' || targetRole.length > 120 || !filters || typeof filters !== 'object' || Array.isArray(filters)
      || ['location', 'role', 'match_level'].some(key => filters[key] !== undefined && typeof filters[key] !== 'string')
      || (filters.remote !== undefined && ![true, false, 'true', 'false'].includes(filters.remote))) {
      return res.status(400).json({ error: 'Enter a valid target role and filters.' });
    }

    const matchedJobs = matchJobs(userSkills, targetRole, filters);

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
      isSample: true,
      source: job.source,
      postedAt: null,
    }));

    return res.json(mappedJobs);
  } catch (error) {
    console.error('Job Match Error:', error);
    return res.status(500).json({ error: 'Unable to load sample job profiles. Please try again.' });
  }
}
