export interface MarketTrend {
  marketDemand: { name: string; value: number }[];
  trendingTech: { name: string; growth: string; level: 'Critical' | 'High' | 'Medium' | 'Low' }[];
  salaryMin: number;
  salaryMax: number;
  salaryMedian: number;
  hiringCompanies: string[];
  jobAvailability: string;
}

export const MARKET_TRENDS_DATASET: Record<string, MarketTrend> = {
  "Computer Science": {
    marketDemand: [
      { name: 'Core Software Engineering', value: 90 },
      { name: 'Web Frameworks (React/Next)', value: 85 },
      { name: 'Cloud Integration & DevOps', value: 75 },
      { name: 'Database Scalability', value: 70 }
    ],
    trendingTech: [
      { name: 'Next.js 15 & React 19', growth: '+52%', level: 'Critical' },
      { name: 'Python & PyTorch (AI)', growth: '+65%', level: 'Critical' },
      { name: 'Docker & Kubernetes', growth: '+30%', level: 'High' },
      { name: 'TypeScript', growth: '+40%', level: 'High' }
    ],
    salaryMin: 90000,
    salaryMedian: 200000,
    salaryMax: 450000,
    hiringCompanies: ['Systems Limited', 'Arbisoft', 'NETSOL Technologies', '10Pearls', 'VentureDive'],
    jobAvailability: "High demand for Full Stack and AI developers across Karachi, Lahore, and Islamabad."
  },
  "Business / Management": {
    marketDemand: [
      { name: 'Project Management (Agile)', value: 88 },
      { name: 'Operations Optimization', value: 80 },
      { name: 'Business Intelligence', value: 85 },
      { name: 'Stakeholder Relations', value: 75 }
    ],
    trendingTech: [
      { name: 'Jira / Confluence', growth: '+35%', level: 'High' },
      { name: 'PowerBI', growth: '+48%', level: 'High' },
      { name: 'Scrum / Agile Methodologies', growth: '+25%', level: 'Medium' },
      { name: 'Slack & MS Teams Integration', growth: '+15%', level: 'Medium' }
    ],
    salaryMin: 60000,
    salaryMedian: 150000,
    salaryMax: 350000,
    hiringCompanies: ['Unilever Pakistan', 'Jazz (Mobilink)', 'Engro Corporation', 'Telenor Pakistan', 'Habib Bank Limited'],
    jobAvailability: "Moderate demand for project managers, product leads, and operations leads."
  },
  "Marketing": {
    marketDemand: [
      { name: 'Digital Advertising', value: 92 },
      { name: 'SEO & Content Strategy', value: 80 },
      { name: 'Brand Analytics', value: 85 },
      { name: 'Growth Hacking', value: 78 }
    ],
    trendingTech: [
      { name: 'Google Ads & Meta Business', growth: '+55%', level: 'Critical' },
      { name: 'SEO Tools (Ahrefs/SEMrush)', growth: '+40%', level: 'High' },
      { name: 'HubSpot CRM Suite', growth: '+30%', level: 'Medium' },
      { name: 'Canva / Adobe Creative', growth: '+35%', level: 'High' }
    ],
    salaryMin: 50000,
    salaryMedian: 120000,
    salaryMax: 280000,
    hiringCompanies: ['Daraz (Alibaba Group)', 'Bazaar Technologies', 'Zong 4G', 'L\'Oréal Pakistan', 'Foodpanda Pakistan'],
    jobAvailability: "High demand in E-commerce and startups for digital marketers and SEO specialists."
  },
  "Finance": {
    marketDemand: [
      { name: 'Financial Modeling', value: 92 },
      { name: 'Tax & Audit Compliance', value: 85 },
      { name: 'Risk Management', value: 80 },
      { name: 'Corporate Accounting', value: 88 }
    ],
    trendingTech: [
      { name: 'SAP FICO ERP Suite', growth: '+42%', level: 'High' },
      { name: 'QuickBooks / Xero', growth: '+30%', level: 'Medium' },
      { name: 'Excel Advanced VBA', growth: '+20%', level: 'Medium' },
      { name: 'PowerBI Data Modeling', growth: '+50%', level: 'Critical' }
    ],
    salaryMin: 70000,
    salaryMedian: 160000,
    salaryMax: 380000,
    hiringCompanies: ['Habib Bank Limited (HBL)', 'EY Pakistan', 'KPMG Taseer Hadi', 'PwC Pakistan', 'MCB Bank'],
    jobAvailability: "Steady hiring in banking, commercial auditing, and corporate finance consulting."
  },
  "Design": {
    marketDemand: [
      { name: 'Design Systems', value: 95 },
      { name: 'User Experience Research', value: 78 },
      { name: 'Figma Prototyping', value: 92 },
      { name: 'Branding & Identity', value: 80 }
    ],
    trendingTech: [
      { name: 'Figma variables & Auto-layout', growth: '+60%', level: 'Critical' },
      { name: 'Adobe Illustrator', growth: '+25%', level: 'Medium' },
      { name: 'Spline 3D Web Design', growth: '+45%', level: 'High' },
      { name: 'Framer Web Builder', growth: '+55%', level: 'Critical' }
    ],
    salaryMin: 60000,
    salaryMedian: 140000,
    salaryMax: 300000,
    hiringCompanies: ['VentureDive', 'SadaPay', 'Systems Limited', '10Pearls', 'Arbisoft'],
    jobAvailability: "Growing demand for UI/UX product designers and interactive graphic specialists."
  }
};
