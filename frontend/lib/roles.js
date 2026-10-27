export const MARKET_CATEGORIES = ['Computer Science', 'Business / Management', 'Marketing', 'Finance', 'Design', 'Healthcare', 'Traditional Engineering'];

export const normalizeRole = value => typeof value === 'string'
  ? value.normalize('NFKC').toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim().replace(/\s+/g, ' ')
  : '';

export function getRoleCategory(value) {
  const role = normalizeRole(value);
  if (/\b(textile|conservator|museum|hydrographic|bioacoustics?|acoustic ecology)\b/.test(role)) return 'Other';
  if (/\b(nurse|nursing|doctor|physician|pharmacist|clinical|medical|surgeon|dental|dentist|nutritionist|dietitian|healthcare)\b/.test(role)) return 'Healthcare & Medical';
  if (/\b(software|developer|programmer|frontend|backend|front end|back end|full stack|devops|cloud|sre|computer science|data engineer|data scientist|data analyst|machine learning|artificial intelligence|ai engineer|qa engineer|cybersecurity)\b/.test(role)) return 'Technology & Software';
  if (/\b(mechanical|civil|electrical|chemical|industrial|aerospace|environmental)\b/.test(role)) return 'Traditional Engineering';
  if (/\b(designer|design|ui|ux|creative|illustrator)\b/.test(role)) return 'Design & Creative';
  if (/\b(finance|financial|accounting|accountant|audit|auditor|banker|banking|tax|brand|marketing|marketer|seo|advertising|sales|business)\b/.test(role)) return 'Finance & Business';
  if (/\b(teacher|teaching|professor|tutor|education|school|academic)\b/.test(role)) return 'Education & Training';
  if (/\b(lawyer|paralegal|legal|solicitor)\b/.test(role)) return 'Legal';
  if (/\b(supply|logistics|inventory|procurement|support|operations|customer|hr|human resources|writer|content|copywriter)\b/.test(role)) return 'Operations & Support';
  return 'Other';
}

export function getMarketCategory(value) {
  const role = normalizeRole(value);
  const exact = MARKET_CATEGORIES.find(category => normalizeRole(category) === role);
  if (exact) return exact;
  const category = getRoleCategory(value);
  if (category === 'Finance & Business') {
    if (/\b(marketing|marketer|brand|seo|sales|advertising)\b/.test(role)) return 'Marketing';
    if (/\b(finance|financial|accounting|accountant|audit|auditor|banker|banking|tax)\b/.test(role)) return 'Finance';
    return 'Business / Management';
  }
  if (category === 'Technology & Software') return 'Computer Science';
  if (category === 'Design & Creative') return 'Design';
  if (category === 'Healthcare & Medical') return 'Healthcare';
  if (category === 'Traditional Engineering') return category;
  if (/\b(manager|management|project coordinator)\b/.test(role)) return 'Business / Management';
  return null;
}
