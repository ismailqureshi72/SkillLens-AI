import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import ResultsPage from './pages/ResultsPage';
import TrendsPage from './pages/TrendsPage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ApiDocsPage from './pages/ApiDocsPage';
import SupportPage from './pages/SupportPage';

// ScrollToTop helper to reset window scroll position on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased transition-colors duration-200">
            {/* Global Navigation Header */}
            <Navbar />

            {/* Main Routable Content Area */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/api-docs" element={<ApiDocsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* Global Sticky Footer */}
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
