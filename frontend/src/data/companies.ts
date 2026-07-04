export interface Company {
  name: string;
  roles: string[];
  techStack: string[];
  level: string[];
  type: 'Remote' | 'On-site' | 'Hybrid';
  difficulty: 'Easy' | 'Moderate' | 'Competitive';
  freshers: boolean;
  category: string;
}

export const COMPANY_DATASET: Company[] = [
  // Computer Science
  {
    name: "Systems Limited",
    roles: ["Backend Developer", "Data Engineer"],
    techStack: ["Java", "Spring Boot", "SQL"],
    level: ["Junior", "Mid"],
    type: "On-site",
    difficulty: "Moderate",
    freshers: false,
    category: "Computer Science"
  },
  {
    name: "Arbisoft",
    roles: ["QA Engineer", "Backend Developer"],
    techStack: ["Python", "Django", "React"],
    level: ["Intern", "Junior"],
    type: "Hybrid",
    difficulty: "Easy",
    freshers: true,
    category: "Computer Science"
  },
  {
    name: "NetSol Technologies",
    roles: ["Frontend Developer", "DevOps Engineer"],
    techStack: ["Angular", "Azure"],
    level: ["Mid", "Senior"],
    type: "On-site",
    difficulty: "Competitive",
    freshers: false,
    category: "Computer Science"
  },
  {
    name: "10Pearls",
    roles: ["Full Stack Developer"],
    techStack: ["React", "Node.js", "AWS"],
    level: ["Junior", "Mid"],
    type: "Hybrid",
    difficulty: "Competitive",
    freshers: true,
    category: "Computer Science"
  },
  {
    name: "VentureDive",
    roles: ["Mobile Developer", "Backend Developer"],
    techStack: ["Kotlin", "Node.js"],
    level: ["Junior", "Mid"],
    type: "Remote",
    difficulty: "Moderate",
    freshers: true,
    category: "Computer Science"
  },

  // Marketing
  {
    name: "Unilever Pakistan",
    roles: ["Brand Manager", "Marketing Executive"],
    techStack: ["Marketing Strategy", "Market Research", "Brand Audits"],
    level: ["Junior", "Mid", "Senior"],
    type: "On-site",
    difficulty: "Competitive",
    freshers: false,
    category: "Marketing"
  },
  {
    name: "Daraz (Alibaba Group)",
    roles: ["SEO Specialist", "Digital Marketer"],
    techStack: ["SEO Strategy", "Google Ads", "Meta Business Manager"],
    level: ["Intern", "Junior", "Mid"],
    type: "Hybrid",
    difficulty: "Moderate",
    freshers: true,
    category: "Marketing"
  },

  // Finance
  {
    name: "Habib Bank Limited (HBL)",
    roles: ["Financial Analyst", "Audit Specialist"],
    techStack: ["Financial Modeling", "Corporate Auditing", "Advanced Excel"],
    level: ["Junior", "Mid"],
    type: "On-site",
    difficulty: "Moderate",
    freshers: true,
    category: "Finance"
  },
  {
    name: "EY Pakistan (Ernst & Young)",
    roles: ["Audit Associate", "Tax Consultant"],
    techStack: ["Accounting Standards", "Tax Compliance", "Corporate Finance"],
    level: ["Intern", "Junior", "Mid"],
    type: "On-site",
    difficulty: "Competitive",
    freshers: true,
    category: "Finance"
  },

  // Design
  {
    name: "SadaPay",
    roles: ["UI/UX Designer", "Product Designer"],
    techStack: ["Figma", "Design Systems", "Prototyping"],
    level: ["Junior", "Mid"],
    type: "Remote",
    difficulty: "Competitive",
    freshers: true,
    category: "Design"
  },

  // Healthcare
  {
    name: "Shaukat Khanum Memorial Hospital",
    roles: ["Registered Nurse", "Clinical Assistant"],
    techStack: ["Patient Care", "Medication Administration", "CPR/First Aid"],
    level: ["Junior", "Mid"],
    type: "On-site",
    difficulty: "Moderate",
    freshers: true,
    category: "Healthcare"
  },
  {
    name: "Aga Khan University Hospital",
    roles: ["Dental Surgeon", "Resident Doctor"],
    techStack: ["Clinical Assessment", "Oral Surgery", "Diagnosis Protocols"],
    level: ["Mid", "Senior"],
    type: "On-site",
    difficulty: "Competitive",
    freshers: false,
    category: "Healthcare"
  },

  // Traditional Engineering
  {
    name: "Engro Corporation",
    roles: ["Mechanical Engineer", "Plant Supervisor"],
    techStack: ["Plant Operations", "Safety Standards", "CAD Designing"],
    level: ["Junior", "Mid", "Senior"],
    type: "On-site",
    difficulty: "Competitive",
    freshers: false,
    category: "Traditional Engineering"
  },
  {
    name: "DESCON Engineering",
    roles: ["Civil Engineer", "Project Coordinator"],
    techStack: ["CAD Modeling", "Structural Drafting", "Site Inspections"],
    level: ["Intern", "Junior", "Mid"],
    type: "On-site",
    difficulty: "Moderate",
    freshers: true,
    category: "Traditional Engineering"
  }
];
