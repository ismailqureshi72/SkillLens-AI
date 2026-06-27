import { useNavigate } from 'react-router-dom';

export default function ApiDocsPage() {
  const navigate = useNavigate();

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-4xl mx-auto px-margin-desktop flex flex-col gap-lg">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-sm">
          <button
            onClick={() => navigate('/')}
            className="text-on-surface-variant hover:text-primary transition-colors text-body-sm flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-lg">
          <div className="flex items-center gap-md border-b border-outline-variant/20 pb-md">
            <span className="material-symbols-outlined text-primary text-[36px]">api</span>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Developer API Documentation</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Version 1.0.0 (REST Specification)</p>
            </div>
          </div>

          <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-lg leading-relaxed">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Base URL</h2>
              <pre className="p-md bg-surface-container rounded-lg font-mono text-[13px] border border-outline-variant/20">
                http://localhost:5000/api
              </pre>
            </div>

            <div className="border-t border-outline-variant/20 pt-md">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm mb-xs">
                <span className="bg-primary/20 text-primary font-mono text-label-md px-sm py-xs rounded font-bold">POST</span>
                /analyze
              </h2>
              <p className="mb-sm">
                Parses a resume file or plaintext resume against a target job role to identify skill gaps and generate a roadmap.
              </p>
              <h3 className="font-label-md text-label-md text-on-surface mb-xs">Multipart/Form-Data Payload:</h3>
              <ul className="list-disc pl-lg mb-md flex flex-col gap-xs font-body-sm">
                <li><code>resume</code>: File (PDF or DOCX, max 5MB)</li>
                <li><code>jobRole</code>: String (Target role, e.g. "Software Engineer")</li>
              </ul>
              
              <h3 className="font-label-md text-label-md text-on-surface mb-xs">Response Sample (JSON):</h3>
              <pre className="p-md bg-surface-container rounded-lg font-mono text-[12px] overflow-x-auto border border-outline-variant/20">
{`{
  "id": "analysis-uuid-1234",
  "jobRole": "Senior Backend Developer",
  "extractedSkills": ["Node.js", "Express", "REST APIs", "Git"],
  "requiredSkills": ["Node.js", "Express", "PostgreSQL", "Docker", "REST APIs"],
  "missingSkills": ["PostgreSQL", "Docker"],
  "matchPercentage": 60,
  "roadmap": [
    {
      "step": "Learn PostgreSQL",
      "description": "Gain database design & query tuning knowledge.",
      "resources": ["SQL Tutorial", "PostgreSQL official docs"]
    }
  ]
}`}
              </pre>
            </div>

            <div className="border-t border-outline-variant/20 pt-md">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm mb-xs">
                <span className="bg-primary/20 text-primary font-mono text-label-md px-sm py-xs rounded font-bold">POST</span>
                /jobs/match
              </h2>
              <p className="mb-sm">
                Matches the parsed resume skills against available job opportunities in Pakistan, applying selected filters.
              </p>
              <h3 className="font-label-md text-label-md text-on-surface mb-xs">JSON Payload:</h3>
              <pre className="p-md bg-surface-container rounded-lg font-mono text-[12px] overflow-x-auto border border-outline-variant/20">
{`{
  "user_skills": ["Node.js", "Express", "React"],
  "target_role": "Backend Engineer",
  "filters": {
    "location": "Lahore",
    "role": "Technology & Software",
    "match_level": "60"
  }
}`}
              </pre>
              
              <h3 className="font-label-md text-label-md text-on-surface mb-xs">Response Sample (JSON):</h3>
              <pre className="p-md bg-surface-container rounded-lg font-mono text-[12px] overflow-x-auto border border-outline-variant/20">
{`[
  {
    "id": "job-1",
    "title": "Senior Backend Engineer",
    "company": "Systems Limited",
    "location": "Lahore, Pakistan",
    "description": "Design and scale API architectures.",
    "requiredSkills": ["Node.js", "Express", "PostgreSQL"],
    "matchedSkills": ["Node.js", "Express"],
    "missingSkills": ["PostgreSQL"],
    "matchPercentage": 66,
    "matchLevel": "Good",
    "applyLink": "https://careers.systemsltd.com"
  }
]`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
