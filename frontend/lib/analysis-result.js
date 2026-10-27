const strings = value => Array.isArray(value)
  ? [...new Set(value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()))]
  : [];

export function normalizeAnalysis(value) {
  if (value?.is_resume === false) {
    throw Object.assign(new Error('This document does not appear to be a resume. Please upload a CV with experience, skills or education.'), { status: 400 });
  }
  const extracted = strings(value?.extracted_skills);
  const required = strings(value?.required_skills);
  const missing = strings(value?.missing_skills);
  const percent = value?.match_percentage;
  const roadmap = Array.isArray(value?.roadmap) ? value.roadmap.filter(step => typeof step?.step === 'string' && typeof step?.description === 'string')
    .map(step => ({ step: step.step.trim(), description: step.description.trim(), resources: strings(step.resources) })).slice(0, 3) : [];
  if (value?.is_resume !== true || !required.length || !Number.isFinite(percent) || !Array.isArray(value?.missing_skills) || !roadmap.length) {
    throw new Error('The AI returned an incomplete analysis.');
  }
  return { extractedSkills: extracted, requiredSkills: required, missingSkills: missing,
    matchPercentage: Math.max(0, Math.min(100, Math.round(percent))), roadmap };
}
