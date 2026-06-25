import { Router } from 'express';
import { AnalysisController } from '../controllers/AnalysisController.js';
import { JobController } from '../controllers/JobController.js';
import multer from 'multer';
import path from 'path';
const router = Router();
const analysisController = new AnalysisController();
const jobController = new JobController();
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
        }
        else {
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
router.get('/jobs/all', (req, res, next) => {
    jobController.getAllJobs(req, res).catch(next);
});
export default router;
//# sourceMappingURL=analysisRoutes.js.map