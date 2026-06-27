export interface Company {
  name: string;
  roles: string[];
  techStack: string[];
  level: string[];
  type: 'Remote' | 'On-site' | 'Hybrid';
  difficulty: 'Easy' | 'Moderate' | 'Competitive';
  freshers: boolean;
}

export const COMPANY_DATASET: Company[] = [
  {
    name: "Systems Limited",
    roles: ["Backend Developer", "Data Engineer"],
    techStack: ["Java", "Spring Boot", "SQL"],
    level: ["Junior", "Mid"],
    type: "On-site",
    difficulty: "Moderate",
    freshers: false
  },
  {
    name: "Arbisoft",
    roles: ["QA Engineer", "Backend Developer"],
    techStack: ["Python", "Django", "React"],
    level: ["Intern", "Junior"],
    type: "Hybrid",
    difficulty: "Easy",
    freshers: true
  },
  {
    name: "NetSol Technologies",
    roles: ["Frontend Developer", "DevOps Engineer"],
    techStack: ["Angular", "Azure"],
    level: ["Mid", "Senior"],
    type: "On-site",
    difficulty: "Competitive",
    freshers: false
  },
  {
    name: "10Pearls",
    roles: ["Full Stack Developer"],
    techStack: ["React", "Node.js", "AWS"],
    level: ["Junior", "Mid"],
    type: "Hybrid",
    difficulty: "Competitive",
    freshers: true
  },
  {
    name: "VentureDive",
    roles: ["Mobile Developer", "Backend Developer"],
    techStack: ["Kotlin", "Node.js"],
    level: ["Junior", "Mid"],
    type: "Remote",
    difficulty: "Moderate",
    freshers: true
  }
];
