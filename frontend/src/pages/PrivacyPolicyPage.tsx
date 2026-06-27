import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
            <span className="material-symbols-outlined text-primary text-[36px]">shield</span>
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Privacy Policy</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Last updated: June 2026</p>
            </div>
          </div>

          <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-md leading-relaxed">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">1. Data Collection & Processing</h2>
            <p>
              SkillLens AI processes your uploaded resume file (`.pdf` or `.docx`) to isolate plain text and parse skills. 
              This parsing takes place locally on our servers and passes temporary data to local or configured AI models for calibration.
            </p>

            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">2. Resume Handling</h2>
            <p>
              Your uploaded resume documents are used **only** for the duration of the analysis. Once the skills are isolated, the 
              uploaded files are immediately deleted from the server storage. The extracted text is saved to our local SQLite database 
              so you can view your history on the dashboard, but you can request data deletion at any time.
            </p>

            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">3. No Data Selling Statement</h2>
            <div className="p-md bg-green-500/5 border border-green-500/20 rounded-lg text-on-surface flex items-start gap-sm">
              <span className="material-symbols-outlined text-green-600 text-[20px] shrink-0">verified</span>
              <p className="font-body-sm text-body-sm">
                <strong>We respect your privacy:</strong> SkillLens AI does not sell, lease, trade, or distribute your resume, profile data, or contact information to any third-party recruiting agencies, advertisers, or datasets.
              </p>
            </div>

            <h2 className="font-headline-sm text-headline-sm text-on-surface mt-sm">4. Data Protection</h2>
            <p>
              We implement industry-standard technical security practices to secure metadata stored in the history database. 
              Session keys and JWT configurations are used to secure individual user spaces when logged in.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
