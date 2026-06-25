import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (file && (file.type === "application/pdf" || file.name.endsWith('.docx') || file.name.endsWith('.pdf'))) {
      // Direct user to workspace page with state containing the file
      navigate('/workspace', { state: { resumeFile: file } });
    } else {
      alert("Please upload a valid PDF or DOCX file (max 5MB).");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    const fileInput = document.getElementById("file-upload-input");
    if (fileInput) fileInput.click();
  };

  const handleStartAnalysis = () => {
    navigate('/workspace');
  };

  const handleViewDemo = () => {
    // Navigate to workspace with a dummy file for demo
    const dummyFile = new File(["dummy_content"], "resume_demo.pdf", { type: "application/pdf" });
    navigate('/workspace', { state: { resumeFile: dummyFile, isDemo: true } });
  };

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      {/* Hero & Upload Dropzone Section */}
      <section className="max-w-max-width mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center min-h-[716px]">
        {/* Left Column: Copywriting CTAs */}
        <div className="flex flex-col gap-lg pr-lg">
          <div className="inline-flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full w-fit border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[16px]">temp_preferences_custom</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Expert Partner Engine v2.4</span>
          </div>
          
          <h1 className="font-display-lg text-display-lg text-on-surface leading-tight">
            Master Your Career Path with AI Precision.
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[480px]">
            Deploy enterprise-grade semantic analysis to identify skill gaps, map market trajectories, and generate highly personalized professional development roadmaps in seconds.
          </p>
          
          <div className="flex gap-md mt-sm">
            <button 
              onClick={handleStartAnalysis}
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center gap-sm hover:opacity-95 shadow-md"
            >
              Start Free Analysis
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button 
              onClick={handleViewDemo}
              className="bg-transparent text-primary border border-primary/50 font-label-md text-label-md px-lg py-md rounded-lg hover:bg-primary/10 transition-colors"
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Dropzone */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`bg-surface-container-lowest border ${
            dragActive ? 'border-primary bg-primary-fixed/20 shadow-inner' : 'border-outline-variant/30'
          } rounded-xl p-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer transition-all duration-200`}
        >
          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
          
          <input
            id="file-upload-input"
            type="file"
            accept=".pdf,.docx"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-full h-64 border-2 border-dashed border-outline-variant/50 rounded-lg flex flex-col items-center justify-center gap-md bg-surface transition-colors group-hover:border-primary group-hover:bg-surface-container-lowest">
            <div className="h-16 w-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container mb-sm">
              <span className="material-symbols-outlined text-[32px] font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                upload_file
              </span>
            </div>
            
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Upload your CV to begin</h3>
            
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[250px]">
              Drag and drop your PDF or Word document here, or click to browse your files securely.
            </p>
            
            <span className="font-label-md text-label-md text-primary mt-sm hover:underline">Browse Files</span>
          </div>

          <div className="w-full flex items-center gap-sm mt-lg">
            <span className="material-symbols-outlined text-outline-variant text-[16px]">lock</span>
            <span className="font-label-md text-label-md text-outline-variant">End-to-end encrypted. GDPR Compliant.</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-max-width mx-auto px-margin-desktop py-xl mt-xl">
        <div className="text-center mb-xl flex flex-col items-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">How It Works</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[600px]">
            Our proprietary engine extracts semantic meaning from your experience and maps it directly to global industry taxonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Step 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg flex flex-col gap-md relative hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] transition-all">
            <div className="absolute top-lg right-lg font-mono-label text-mono-label text-outline-variant opacity-50">01</div>
            <div className="h-12 w-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface text-primary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Upload CV</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Securely ingest your current resume or professional history via our high-fidelity parsing module.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg flex flex-col gap-md relative hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] transition-all">
            <div className="absolute top-lg right-lg font-mono-label text-mono-label text-outline-variant opacity-50">02</div>
            <div className="h-12 w-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface text-primary">
              <span className="material-symbols-outlined">target</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Select Job</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Define your target role, seniority level, and industry sector to establish the calibration baseline.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg flex flex-col gap-md relative hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] transition-all">
            <div className="absolute top-lg right-lg font-mono-label text-mono-label text-outline-variant opacity-50">03</div>
            <div className="h-12 w-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface text-primary">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Get Analysis</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Receive a quantifiable gap report, dynamic radar charts, and a sequenced learning trajectory.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
