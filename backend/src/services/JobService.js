const MOCK_JOBS = [
    // Computer Science & Tech (8 Jobs)
    {
        id: 'job-1',
        title: 'Senior Backend Engineer',
        company: 'Systems Limited',
        location: 'Lahore, Pakistan',
        description: 'We are seeking a Senior Backend Engineer to design and construct robust API architectures, optimize SQL database queries, and implement containerized deployments.',
        requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'SQL', 'APIs', 'Docker'],
        applyLink: 'https://www.systemsltd.com/careers'
    },
    {
        id: 'job-2',
        title: 'Junior Frontend Developer',
        company: 'NETSOL Technologies',
        location: 'Karachi, Pakistan',
        description: 'NETSOL is looking for a Junior Frontend Developer to build responsive user layouts, translate UI layouts into HTML/CSS components, and collaborate using Git.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'UI Design'],
        applyLink: 'https://netsoltech.com/careers'
    },
    {
        id: 'job-3',
        title: 'Senior Frontend Developer',
        company: 'Arbisoft',
        location: 'Lahore, Pakistan',
        description: 'Join Arbisoft as a Senior Frontend Developer to lead construction of next-generation rendering pipelines using React, Next.js, and TypeScript.',
        requiredSkills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Figma'],
        applyLink: 'https://arbisoft.com/careers'
    },
    {
        id: 'job-4',
        title: 'Senior Full Stack Engineer',
        company: '10Pearls',
        location: 'Karachi, Pakistan',
        description: 'Work across the entire stack using React, Node.js, TypeScript, and GraphQL to ship enterprise application features.',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'CSS'],
        applyLink: 'https://10pearls.com/careers'
    },
    {
        id: 'job-5',
        title: 'Cloud Architect & DevOps',
        company: 'Contour Software',
        location: 'Islamabad, Pakistan',
        description: 'Configure and scale highly available AWS cloud architecture and CI/CD pipelines using Docker, Kubernetes, and Terraform.',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        applyLink: 'https://contour-software.com/careers'
    },
    {
        id: 'job-6',
        title: 'Lead Product Designer',
        company: 'SadaPay',
        location: 'Remote, Pakistan',
        description: 'Join our design crew to craft premium user experiences, define design systems, and lead user research activities.',
        requiredSkills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Wireframing'],
        applyLink: 'https://sadapay.pk/careers'
    },
    {
        id: 'job-7',
        title: 'UI/UX Engineer',
        company: 'VentureDive',
        location: 'Lahore, Pakistan',
        description: 'Bridge the gap between design specifications and frontend execution. Develop accessible tokens and interactive user components.',
        requiredSkills: ['Figma', 'UI Design', 'React', 'TypeScript', 'CSS', 'Accessibility'],
        applyLink: 'https://www.venturedive.com/careers'
    },
    {
        id: 'job-8',
        title: 'Lead Data Scientist',
        company: 'Devsinc',
        location: 'Islamabad, Pakistan',
        description: 'Lead research in generative models and predictive analytics. Optimize fine-tuning processes using Python and PyTorch.',
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'Pandas', 'Jupyter'],
        applyLink: 'https://www.devsinc.com/careers'
    },
    // Non-Computer Science & Business/Services (8 Jobs)
    {
        id: 'job-9',
        title: 'Financial Analyst',
        company: 'Habib Bank Limited (HBL)',
        location: 'Karachi, Pakistan',
        description: 'HBL is seeking a Financial Analyst to perform valuation models, review audits, compile financial analysis, and maintain robust valuation metrics.',
        requiredSkills: ['Financial Modeling', 'Valuation', 'Excel', 'Financial Analysis', 'Accounting'],
        applyLink: 'https://www.hbl.com/careers'
    },
    {
        id: 'job-10',
        title: 'Brand Manager',
        company: 'Unilever Pakistan',
        location: 'Karachi, Pakistan',
        description: 'Unilever is looking for an experienced Brand Manager to design local marketing campaigns, lead market research activities, and study consumer behavior.',
        requiredSkills: ['Brand Management', 'Marketing Strategy', 'Market Research', 'Advertising', 'Consumer Behavior'],
        applyLink: 'https://www.unilever.pk/careers'
    },
    {
        id: 'job-11',
        title: 'Mechanical Engineer',
        company: 'Engro Corporation',
        location: 'Karachi, Pakistan',
        description: 'Engro is recruiting a Mechanical Engineer to supervise plant operations, design safety procedures, and review industrial CAD designs.',
        requiredSkills: ['Plant Operations', 'Maintenance', 'CAD', 'Engineering Design', 'Safety Standards'],
        applyLink: 'https://www.engro.com/careers'
    },
    {
        id: 'job-12',
        title: 'Supply Chain Executive',
        company: 'Indus Motor Company (Toyota)',
        location: 'Karachi, Pakistan',
        description: 'Join the logistics division to manage warehouse inventory, schedule vendor shipments, and configure SAP operations.',
        requiredSkills: ['Logistics', 'Inventory Management', 'SAP', 'Vendor Management', 'Procurement'],
        applyLink: 'https://www.toyota-indus.com/careers'
    },
    {
        id: 'job-13',
        title: 'Registered Nurse',
        company: 'Shaukat Khanum Memorial Hospital',
        location: 'Lahore, Pakistan',
        description: 'We are seeking a compassionate Registered Nurse to provide patient care, complete clinical assessments, and manage medication administration.',
        requiredSkills: ['Patient Care', 'Clinical Assessment', 'Medication Administration', 'CPR', 'Nursing'],
        applyLink: 'https://shaukatkhanum.org.pk/careers'
    },
    {
        id: 'job-14',
        title: 'High School English Teacher',
        company: 'The City School',
        location: 'Islamabad, Pakistan',
        description: 'Design educational plans, construct classroom management strategies, and facilitate student assignments in English Literature.',
        requiredSkills: ['Lesson Planning', 'Classroom Management', 'English Literature', 'Student Assessment', 'Communication'],
        applyLink: 'https://thecityschool.edu.pk/careers'
    },
    {
        id: 'job-15',
        title: 'Customer Experience Executive',
        company: 'Jazz (Mobilink)',
        location: 'Lahore, Pakistan',
        description: 'Resolve customer service queries, manage communications via helpdesk CRM systems, and troubleshoot billing accounts.',
        requiredSkills: ['Customer Service', 'Communication', 'CRM', 'Troubleshooting', 'Active Listening'],
        applyLink: 'https://jazz.com.pk/careers'
    },
    {
        id: 'job-16',
        title: 'HR Operations Specialist',
        company: 'Fatima Group',
        location: 'Lahore, Pakistan',
        description: 'Administer onboarding protocols, maintain compliance with HR policies, and manage employee relations structures.',
        requiredSkills: ['Employee Relations', 'HR Policies', 'Payroll Administration', 'Onboarding', 'Recruiting'],
        applyLink: 'https://fatima-group.com/careers'
    }
];
export class JobService {
    /**
     * Matches user skills against the job database.
     * @param userSkills List of skills parsed from the user's resume.
     * @param targetRole Target role parameters to filter initial listings (optional).
     */
    matchJobs(userSkills, targetRole) {
        const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
        return MOCK_JOBS.map(job => {
            const matchedSkills = [];
            const missingSkills = [];
            job.requiredSkills.forEach(reqSkill => {
                const reqSkillLower = reqSkill.toLowerCase().trim();
                // Find if user has this skill (case-insensitive substring match)
                const isMatched = normalizedUserSkills.some(userSkill => userSkill.includes(reqSkillLower) || reqSkillLower.includes(userSkill));
                if (isMatched) {
                    matchedSkills.push(reqSkill);
                }
                else {
                    missingSkills.push(reqSkill);
                }
            });
            const totalRequired = job.requiredSkills.length;
            const matchedCount = matchedSkills.length;
            const matchPercentage = totalRequired > 0
                ? Math.round((matchedCount / totalRequired) * 100)
                : 0;
            let matchLevel = 'Low';
            if (matchPercentage >= 75) {
                matchLevel = 'Strong';
            }
            else if (matchPercentage >= 60) {
                matchLevel = 'Good';
            }
            else if (matchPercentage >= 40) {
                matchLevel = 'Moderate';
            }
            return {
                ...job,
                matchedSkills,
                missingSkills,
                matchPercentage,
                matchLevel
            };
        }).sort((a, b) => b.matchPercentage - a.matchPercentage);
    }
}
//# sourceMappingURL=JobService.js.map