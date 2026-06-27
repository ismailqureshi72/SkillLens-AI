import { useNavigate } from 'react-router-dom';

export default function TermsOfServicePage() {
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
            <span className="material-symbols-outlined text-primary text-[36px]">gavel</span>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Terms of Service</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: June 2026</p>
            </div>
          </div>

          <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-md leading-relaxed">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">1. Terms Acceptance</h2>
            <p>
              By accessing and using SkillLens AI, you agree to comply with and be bound by these Terms of Service. 
              If you do not agree, you should discontinue using the platform.
            </p>

            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">2. Usage Rules</h2>
            <p>
              Users are permitted to upload resume files (`.pdf` or `.docx`) for individual career path analysis and skill gap calibration. 
              You agree not to:
            </p>
            <ul className="list-disc pl-lg flex flex-col gap-xs">
              <li>Upload malicious code, infected files, or files containing offensive/illegal material.</li>
              <li>Attempt to scrape, reverse engineer, or DOS-attack the API endpoints.</li>
              <li>Spam or abuse the automated resume parsing services.</li>
            </ul>

            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">3. Advisory Disclaimer</h2>
            <div className="p-md bg-primary/5 border border-primary/20 rounded-lg text-on-surface flex items-start gap-sm">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
              <p className="font-body-sm text-body-sm">
                <strong>Important Advisory Notice:</strong> SkillLens AI provides job matches and skill roadmap suggestions for informational and career calibration purposes only. We do not guarantee employment, callback rates, or qualifications for any particular job posting. Career roadmaps are advisory recommendations based on simulated AI analysis.
              </p>
            </div>

            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">4. External Application Redirection</h2>
            <p>
              All job applications triggered from the matching interface redirect users to the companies' official external careers portal. 
              We do not submit applications on your behalf, and we are not responsible for policies or content on external hiring sites.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
