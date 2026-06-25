import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200 flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm">
        <span className="material-symbols-outlined text-[80px] text-primary mb-md block">
          explore_off
        </span>

        <h1 className="font-display-lg text-[72px] font-black text-primary tracking-tighter leading-none mb-sm">
          404
        </h1>

        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Page Not Found
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant mb-xl max-w-[350px] mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-md justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all inline-flex items-center justify-center gap-sm hover:opacity-95 shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Back to Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-surface-container-high text-on-surface font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all inline-flex items-center justify-center gap-sm border border-outline-variant/30 hover:bg-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
