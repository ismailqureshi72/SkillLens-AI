import { getMarketCategory } from './roles.js';

const REFERENCES = {
  'Computer Science': { skills: ['Software engineering', 'Web development', 'Cloud infrastructure', 'Database design'], companies: ['Systems Limited', 'Arbisoft', 'NETSOL Technologies', '10Pearls', 'VentureDive'] },
  'Business / Management': { skills: ['Project planning', 'Operations', 'Business analysis', 'Stakeholder communication'], companies: ['Unilever Pakistan', 'Jazz', 'Engro Corporation'] },
  Marketing: { skills: ['Marketing strategy', 'SEO', 'Brand research', 'Advertising'], companies: ['Daraz', 'Unilever Pakistan'] },
  Finance: { skills: ['Financial analysis', 'Accounting', 'Tax compliance', 'Financial modelling'], companies: ['Habib Bank Limited', 'EY Pakistan'] },
  Design: { skills: ['User research', 'Prototyping', 'Design systems', 'Accessibility'], companies: ['VentureDive', 'SadaPay'] },
  Healthcare: { skills: ['Patient care', 'Clinical assessment', 'Professional standards', 'Health records'], companies: ['Shaukat Khanum Memorial Hospital', 'Aga Khan University Hospital'] },
  'Traditional Engineering': { skills: ['Engineering design', 'CAD', 'Safety standards', 'Quality control'], companies: ['Engro Corporation', 'DESCON Engineering'] },
};

export function getMarketData(role) {
  const category = getMarketCategory(role);
  const reference = REFERENCES[category];
  return {
    jobRole: role, category, status: reference ? 'reference' : 'unavailable',
    source: reference ? 'SkillLens reference catalogue' : null,
    updatedAt: null, region: 'Pakistan', currency: 'PKR',
    marketDemand: [],
    trendingTech: (reference?.skills || []).map(name => ({ name, growth: null, level: 'Reference' })),
    salaryMin: null, salaryMedian: null, salaryMax: null,
    hiringCompanies: reference?.companies || [],
    jobAvailability: 'Verified salary, demand and current vacancy data are not available. Reference examples do not confirm that a company is hiring.',
  };
}
