import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setAnalysisResult } = useApp();

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 transition-colors duration-200">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-lg max-w-max-width mx-auto gap-md">
        <div className="font-label-md text-label-md font-bold text-on-surface">
          © {new Date().getFullYear()} SkillLens AI. Precision Skill Intelligence.
        </div>
        <div className="flex gap-md font-body-sm text-body-sm text-on-surface-variant">
          <Link
            to="/"
            onClick={() => setAnalysisResult(null)}
            className="hover:text-primary transition-colors hover:underline underline-offset-4"
          >
            Home
          </Link>
          <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">
            API
          </a>
          <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
