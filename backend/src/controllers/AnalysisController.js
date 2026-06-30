import { FileParserService } from '../services/FileParserService.js';
import { AIService } from '../services/AIService.js';
import { prisma } from '../services/PrismaService.js';
import fs from 'fs';
const parser = new FileParserService();
const ai = new AIService();
export class AnalysisController {
    /**
     * Handles resume analysis.
     * POST /api/analyze
     */
    async analyze(req, res) {
        try {
            const jobRole = req.body.jobRole || req.body.targetRole || req.body.target_role;
            const file = req.file;
            const resumeTextBody = req.body.resumeText || req.body.resume_text;
            if (!file && !resumeTextBody) {
                return res.status(400).json({ error: 'No resume file uploaded or resume text provided.' });
            }
            if (!jobRole) {
                return res.status(400).json({ error: 'Job role is required.' });
            }
            // 1. Extract text from resume or use body text
            const resumeText = file ? await parser.extractText(file.path) : resumeTextBody;
            // 2. Validate Resume
            const structureScore = checkStructureScore(resumeText);
            const aiSaysYes = await ai.classifyResume(resumeText);
            const forbiddenDetected = hasForbiddenKeywords(resumeText);
            const isValid = aiSaysYes && (structureScore > 0) && !forbiddenDetected;
            if (!isValid) {
                // Remove uploaded file from server after processing
                if (file && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                return res.status(400).json({
                    error: "Invalid document. Please upload a valid CV or resume. Documents like offer letters, contracts, or reports are not supported."
                });
            }
            // 3. AI Analysis
            const analysisResult = await ai.analyzeResume(resumeText, jobRole);
            // 3. Save to database
            const savedAnalysis = await prisma.analysis.create({
                data: {
                    resumeText,
                    jobRole,
                    extractedSkills: JSON.stringify(analysisResult.extracted_skills),
                    requiredSkills: JSON.stringify(analysisResult.required_skills),
                    missingSkills: JSON.stringify(analysisResult.missing_skills),
                    matchPercentage: analysisResult.match_percentage,
                    roadmap: JSON.stringify(analysisResult.roadmap),
                    userId: req.user?.id || null,
                },
            });
            // Remove uploaded file from server after processing
            if (file && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return res.json({
                ...savedAnalysis,
                extractedSkills: analysisResult.extracted_skills,
                requiredSkills: analysisResult.required_skills,
                missingSkills: analysisResult.missing_skills,
                roadmap: analysisResult.roadmap,
            });
        }
        catch (error) {
            console.error('Analysis Error:', error);
            return res.status(500).json({ error: error.message || 'An internal error occurred during analysis.' });
        }
    }
    /**
     * Retrieves all analysis history.
     * GET /api/analyses
     */
    async listAnalyses(req, res) {
        try {
            const analyses = await prisma.analysis.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return res.json(analyses);
        }
        catch (error) {
            console.error('List Analyses Error:', error);
            return res.status(500).json({ error: 'Failed to fetch analysis history.' });
        }
    }
    /**
     * Retrieves detailed trends data for a role.
     * GET /api/trends/:role
     */
    async getTrends(req, res) {
        try {
            const role = typeof req.params.role === 'string' ? req.params.role : 'Senior Product Designer';
            const roleLower = role.toLowerCase();
            let marketDemand = [
                { name: 'Core Skillset', value: 80 },
                { name: 'System Design', value: 60 },
                { name: 'Collaboration', value: 75 },
                { name: 'Emerging Frameworks', value: 70 },
            ];
            let trendingTech = [
                { name: 'Figma DevMode', growth: '+35%', level: 'High' },
                { name: 'React Server Components', growth: '+52%', level: 'Critical' },
                { name: 'AWS Lambda / Serverless', growth: '+25%', level: 'Medium' },
                { name: 'Tailwind CSS v4', growth: '+45%', level: 'High' },
            ];
            let salaryMin = 100000;
            let salaryMax = 350000;
            let salaryMedian = 220000;
            let hiringCompanies = ['Systems Limited', 'Arbisoft', 'NETSOL Technologies', '10Pearls', 'VentureDive'];
            // Customize output based on semantic keyword mapping
            if (roleLower.includes('nurse') ||
                roleLower.includes('doctor') ||
                roleLower.includes('pharmac') ||
                roleLower.includes('dentist') ||
                roleLower.includes('therapist') ||
                roleLower.includes('psycholog') ||
                roleLower.includes('surgeon') ||
                roleLower.includes('medical') ||
                roleLower.includes('clinical') ||
                roleLower.includes('hospital') ||
                roleLower.includes('lab tech')) {
                marketDemand = [
                    { name: 'Patient Care & Safety', value: 95 },
                    { name: 'Clinical Assessment', value: 90 },
                    { name: 'Emergency Response', value: 85 },
                    { name: 'Electronic Health Records', value: 80 },
                ];
                trendingTech = [
                    { name: 'EHR Software (Epic/Cerner)', growth: '+40%', level: 'High' },
                    { name: 'Telehealth Platforms', growth: '+55%', level: 'Critical' },
                    { name: 'AI Diagnostics Assist', growth: '+68%', level: 'Critical' },
                    { name: 'Point-of-Care Testing (POCT)', growth: '+25%', level: 'Medium' },
                ];
                salaryMin = 80000;
                salaryMax = 350000;
                salaryMedian = 180000;
                hiringCompanies = ['Shaukat Khanum Hospital', 'Aga Khan University Hospital', 'Indus Hospital', 'National Health Services'];
            }
            else if (roleLower.includes('financial') ||
                roleLower.includes('accountant') ||
                roleLower.includes('accounting') ||
                roleLower.includes('banker') ||
                roleLower.includes('banking') ||
                roleLower.includes('audit') ||
                roleLower.includes('tax') ||
                roleLower.includes('portfolio') ||
                roleLower.includes('risk') ||
                roleLower.includes('bookkeeper') ||
                roleLower.includes('finance')) {
                marketDemand = [
                    { name: 'Financial Modeling', value: 92 },
                    { name: 'Valuation & Advisory', value: 85 },
                    { name: 'Regulatory Compliance', value: 88 },
                    { name: 'Auditing Standards', value: 82 },
                ];
                trendingTech = [
                    { name: 'SAP FICO / ERP', growth: '+35%', level: 'High' },
                    { name: 'Microsoft Excel (Advanced/VBA)', growth: '+20%', level: 'Medium' },
                    { name: 'PowerBI & Tableau', growth: '+58%', level: 'Critical' },
                    { name: 'Automated Billing Systems', growth: '+45%', level: 'High' },
                ];
                salaryMin = 70000;
                salaryMax = 300000;
                salaryMedian = 140000;
                hiringCompanies = ['Habib Bank Limited (HBL)', 'EY Pakistan', 'KPMG Taseer Hadi', 'Unilever Pakistan', 'Fatima Group'];
            }
            else if (roleLower.includes('teach') ||
                roleLower.includes('professor') ||
                roleLower.includes('tutor') ||
                roleLower.includes('counselor') ||
                roleLower.includes('education') ||
                roleLower.includes('academic') ||
                roleLower.includes('school')) {
                marketDemand = [
                    { name: 'Curriculum Design', value: 88 },
                    { name: 'Classroom Management', value: 92 },
                    { name: 'Student Assessment', value: 85 },
                    { name: 'Online Pedagogy', value: 78 },
                ];
                trendingTech = [
                    { name: 'Google Classroom', growth: '+25%', level: 'Medium' },
                    { name: 'Canvas / Blackboard LMS', growth: '+42%', level: 'High' },
                    { name: 'Interactive SMART Boards', growth: '+30%', level: 'Medium' },
                    { name: 'Gamified Learning (Kahoot/Quizizz)', growth: '+60%', level: 'Critical' },
                ];
                salaryMin = 40000;
                salaryMax = 150000;
                salaryMedian = 80000;
                hiringCompanies = ['The City School', 'Beaconhouse School System', 'Lahore Grammar School', 'Roots Millennium Schools'];
            }
            else if (roleLower.includes('mechanical') ||
                roleLower.includes('civil') ||
                roleLower.includes('electrical') ||
                roleLower.includes('chemical') ||
                roleLower.includes('industrial') ||
                roleLower.includes('aerospace') ||
                roleLower.includes('environmental')) {
                marketDemand = [
                    { name: 'CAD Design & Drafting', value: 90 },
                    { name: 'Plant Operations & Safety', value: 87 },
                    { name: 'Maintenance Engineering', value: 82 },
                    { name: 'Project Quality Assurance', value: 80 },
                ];
                trendingTech = [
                    { name: 'AutoCAD / SolidWorks', growth: '+30%', level: 'High' },
                    { name: 'MATLAB / Simulink', growth: '+25%', level: 'Medium' },
                    { name: 'Primavera P6 Scheduling', growth: '+35%', level: 'High' },
                    { name: 'PLC / SCADA Integration', growth: '+50%', level: 'Critical' },
                ];
                salaryMin = 60000;
                salaryMax = 250000;
                salaryMedian = 120000;
                hiringCompanies = ['Engro Corporation', 'Indus Motor Company', 'Fatima Group', 'Fauji Fertilizer Company', 'DESCON'];
            }
            else if (roleLower.includes('lawyer') ||
                roleLower.includes('paralegal') ||
                roleLower.includes('legal') ||
                roleLower.includes('compliance') ||
                roleLower.includes('contract')) {
                marketDemand = [
                    { name: 'Case Law Research', value: 92 },
                    { name: 'Contract Drafting', value: 95 },
                    { name: 'Litigation & Advocacy', value: 88 },
                    { name: 'Corporate Compliance', value: 85 },
                ];
                trendingTech = [
                    { name: 'LexisNexis / Westlaw', growth: '+20%', level: 'Medium' },
                    { name: 'DocuSign / CLM Software', growth: '+45%', level: 'High' },
                    { name: 'AI Legal Reviewer Tools', growth: '+75%', level: 'Critical' },
                    { name: 'Digital Evidence Vaults', growth: '+35%', level: 'High' },
                ];
                salaryMin = 50000;
                salaryMax = 220000;
                salaryMedian = 110000;
                hiringCompanies = ['RIAA Barker Gillette', 'ABS & Co', 'Liaquat Merchant Associates', 'Unilever Legal'];
            }
            else if (roleLower.includes('supply') ||
                roleLower.includes('logistic') ||
                roleLower.includes('operations') ||
                roleLower.includes('customer service') ||
                roleLower.includes('customer experience') ||
                roleLower.includes('technical support') ||
                roleLower.includes('success manager') ||
                roleLower.includes('hr ') ||
                roleLower.includes('human resources') ||
                roleLower.includes('recruiting') ||
                roleLower.includes('onboarding') ||
                roleLower.includes('sap') ||
                roleLower.includes('salesforce')) {
                marketDemand = [
                    { name: 'Inventory & Logistical Control', value: 88 },
                    { name: 'Customer Satisfaction / NPS', value: 85 },
                    { name: 'Employee Relations & Compliance', value: 82 },
                    { name: 'Process Optimization', value: 78 },
                ];
                trendingTech = [
                    { name: 'SAP ERP / Supply Chain', growth: '+40%', level: 'High' },
                    { name: 'Salesforce Service Cloud', growth: '+35%', level: 'High' },
                    { name: 'Zendesk Suite Helpdesk', growth: '+30%', level: 'Medium' },
                    { name: 'Workday HR / HCM', growth: '+55%', level: 'Critical' },
                ];
                salaryMin = 55000;
                salaryMax = 200000;
                salaryMedian = 100000;
                hiringCompanies = ['Indus Motor Company', 'Unilever Pakistan', 'Jazz (Mobilink)', 'Fatima Group', 'DHL Pakistan'];
            }
            else if (roleLower.includes('design') || roleLower.includes('ux') || roleLower.includes('ui') || roleLower.includes('graphic') || roleLower.includes('creative') || roleLower.includes('art')) {
                marketDemand = [
                    { name: 'Design Systems', value: 92 },
                    { name: 'User Research', value: 78 },
                    { name: 'Figma Prototyping', value: 95 },
                    { name: 'Micro-interactions', value: 68 },
                ];
                trendingTech = [
                    { name: 'Figma variables', growth: '+44%', level: 'High' },
                    { name: 'Prototyping tools', growth: '+25%', level: 'Medium' },
                    { name: 'Tailwind CSS v4', growth: '+48%', level: 'High' },
                    { name: 'Web accessibility WCAG', growth: '+60%', level: 'Critical' },
                ];
                salaryMin = 80000;
                salaryMax = 280000;
                salaryMedian = 160000;
                hiringCompanies = ['VentureDive', 'SadaPay', 'Systems Limited', '10Pearls', 'Arbisoft'];
            }
            else if (roleLower.includes('data') || roleLower.includes('science') || roleLower.includes('ml') || roleLower.includes('ai')) {
                marketDemand = [
                    { name: 'Machine Learning', value: 94 },
                    { name: 'Statistical Python', value: 88 },
                    { name: 'Big Data Spark/SQL', value: 82 },
                    { name: 'MLOps Architectures', value: 76 },
                ];
                trendingTech = [
                    { name: 'PyTorch / TensorFlow', growth: '+58%', level: 'Critical' },
                    { name: 'Jupyter Enterprise', growth: '+20%', level: 'Medium' },
                    { name: 'Vector Databases (Pinecone)', growth: '+85%', level: 'Critical' },
                    { name: 'LangChain / LLM fine-tuning', growth: '+120%', level: 'Critical' },
                ];
                salaryMin = 120000;
                salaryMax = 450000;
                salaryMedian = 260000;
                hiringCompanies = ['Devsinc', 'Arbisoft', 'Systems Limited', '10Pearls', 'VentureDive'];
            }
            else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('sre')) {
                marketDemand = [
                    { name: 'Kubernetes / K8s', value: 91 },
                    { name: 'Terraform IaC', value: 87 },
                    { name: 'CI/CD Pipelines', value: 84 },
                    { name: 'Security Compliance', value: 80 },
                ];
                trendingTech = [
                    { name: 'AWS CloudFormation', growth: '+28%', level: 'Medium' },
                    { name: 'Docker Containers', growth: '+40%', level: 'High' },
                    { name: 'GitHub Actions', growth: '+65%', level: 'High' },
                    { name: 'Kubernetes Operators', growth: '+75%', level: 'Critical' },
                ];
                salaryMin = 110000;
                salaryMax = 400000;
                salaryMedian = 240000;
                hiringCompanies = ['Contour Software', 'NETSOL Technologies', 'Systems Limited', '10Pearls', 'Devsinc'];
            }
            else if (roleLower.includes('engineer') || roleLower.includes('developer') || roleLower.includes('full stack') || roleLower.includes('frontend') || roleLower.includes('backend')) {
                marketDemand = [
                    { name: 'TypeScript / JS', value: 90 },
                    { name: 'Next.js Framework', value: 82 },
                    { name: 'Cloud Integration', value: 75 },
                    { name: 'Database Scalability', value: 79 },
                ];
                trendingTech = [
                    { name: 'React Server Components', growth: '+54%', level: 'Critical' },
                    { name: 'Apollo GraphQL Clients', growth: '+32%', level: 'Medium' },
                    { name: 'AWS Lambda / Serverless', growth: '+28%', level: 'Medium' },
                    { name: 'Tailwind CSS v4', growth: '+45%', level: 'High' },
                ];
                salaryMin = 90000;
                salaryMax = 350000;
                salaryMedian = 200000;
                hiringCompanies = ['Systems Limited', 'Arbisoft', 'NETSOL Technologies', '10Pearls', 'VentureDive'];
            }
            return res.json({
                jobRole: role,
                marketDemand,
                trendingTech,
                salaryMin,
                salaryMax,
                salaryMedian,
                hiringCompanies,
            });
        }
        catch (error) {
            console.error('Get Trends Error:', error);
            return res.status(500).json({ error: 'Failed to fetch trends details.' });
        }
    }
}
function checkStructureScore(text) {
    const structureList = [
        { keywords: [/education/i, /degree/i, /academic/i, /university/i, /school/i, /college/i] },
        { keywords: [/experience/i, /work history/i, /employment/i, /career/i, /job history/i, /professional background/i] },
        { keywords: [/skills/i, /technologies/i, /core competencies/i, /expertise/i, /proficiencies/i] },
        { keywords: [/projects/i, /key projects/i, /personal projects/i, /selected projects/i] },
    ];
    let matchedSections = 0;
    for (const section of structureList) {
        const isMatched = section.keywords.some(regex => regex.test(text));
        if (isMatched) {
            matchedSections++;
        }
    }
    return matchedSections >= 2 ? 40 : 0;
}
function hasForbiddenKeywords(text) {
    const forbiddenList = [
        /offer letter/i,
        /dear candidate/i,
        /we are pleased to offer/i,
        /terms and conditions/i,
        /agreement/i,
        /contract/i
    ];
    return forbiddenList.some(regex => regex.test(text));
}
function checkKeywordScore(text) {
    const requiredKeywords = ["education", "experience", "skills", "projects", "internship", "university"];
    const lowerText = text.toLowerCase();
    let keywordCount = 0;
    for (const kw of requiredKeywords) {
        if (lowerText.includes(kw)) {
            keywordCount++;
        }
    }
    return keywordCount >= 2 ? 30 : 0;
}
//# sourceMappingURL=AnalysisController.js.map