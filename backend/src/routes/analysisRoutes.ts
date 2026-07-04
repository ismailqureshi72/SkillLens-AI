import { Router } from 'express';
import { AnalysisController } from '../controllers/AnalysisController.js';
import { JobController } from '../controllers/JobController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../services/PrismaService.js';

const router = Router();
const analysisController = new AnalysisController();
const jobController = new JobController();

// Ensure uploads directory exists on startup
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed.'));
    }
  },
});

router.post('/analyze', upload.single('resume'), analysisController.analyze);
router.get('/analyses', (req, res, next) => {
  analysisController.listAnalyses(req, res).catch(next);
});
router.get('/trends/:role', (req, res, next) => {
  analysisController.getTrends(req, res).catch(next);
});

// Job Matching Routes
router.post('/jobs/match', (req, res, next) => {
  jobController.matchJobs(req, res).catch(next);
});
// Support Ticketing Routes
router.post('/support', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const ticket = await prisma.supportTicket.create({
      data: { name, email, message }
    });
    return res.status(201).json(ticket);
  } catch (error: any) {
    console.error('Support Ticket Creation Error:', error);
    return res.status(500).json({ error: 'Failed to create support ticket in database.' });
  }
});

export default router;
