import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_LINKS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/results', label: 'Skill Gap' },
  { to: '/workspace', label: 'Dashboard' },
  { to: '/trends', label: 'Market Trends' },
  { to: '/jobs', label: 'Job Matches' },
];

export default function Navbar() {
  const { theme, toggleTheme, setAnalysisResult } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUploadCVClick = () => {
    setAnalysisResult(null);
    navigate('/');
    setMobileOpen(false);
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `font-body-md text-body-md px-md py-sm rounded-lg transition-all duration-150 ${
      isActive
        ? 'bg-surface-container-highest/50 text-primary font-semibold'
        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest/30'
    }`;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-colors duration-200">
      <div className="flex justify-between items-center px-margin-desktop h-16 max-w-max-width mx-auto">
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => { setAnalysisResult(null); setMobileOpen(false); }}
          className="font-headline-md text-headline-md font-bold text-primary tracking-tight hover:opacity-90"
        >
          SkillLens AI
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-gutter">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => link.to === '/' && setAnalysisResult(null)}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-md">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="hover:bg-surface-container-highest/50 rounded-lg p-sm transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <span className="material-symbols-outlined">light_mode</span>
            ) : (
              <span className="material-symbols-outlined">dark_mode</span>
            )}
          </button>

          {/* Quick Upload Action (Desktop) */}
          <button
            onClick={handleUploadCVClick}
            className="hidden md:flex bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-lg items-center gap-sm active:scale-95 duration-150 transition-all hover:bg-primary/95"
          >
            Upload CV
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="md:hidden hover:bg-surface-container-highest/50 rounded-lg p-sm transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/30 shadow-lg animate-in">
          <nav className="flex flex-col px-margin-desktop py-md gap-xs">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => {
                  if (link.to === '/') setAnalysisResult(null);
                  setMobileOpen(false);
                }}
                className={linkClasses}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="border-t border-outline-variant/20 mt-sm pt-sm">
              <button
                onClick={handleUploadCVClick}
                className="w-full bg-primary text-on-primary font-label-md text-label-md px-md py-md rounded-lg flex items-center justify-center gap-sm active:scale-95 duration-150 transition-all hover:bg-primary/95"
              >
                Upload CV
                <span className="material-symbols-outlined text-[18px]">upload</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
