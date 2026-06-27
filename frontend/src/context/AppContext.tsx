import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export interface AnalysisResult {
  id?: string;
  resumeText: string;
  jobRole: string;
  extractedSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  roadmap: Array<{
    step: string;
    description: string;
    resources: string[];
  }>;
  createdAt?: string;
}

export interface TrendsData {
  jobRole: string;
  marketDemand: Array<{ name: string; value: number }>;
  trendingTech: Array<{ name: string; growth: string; level: string }>;
  salaryMin: number;
  salaryMax: number;
  salaryMedian: number;
  hiringCompanies: string[];
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  matchLevel: string;
  applyLink: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  history: AnalysisResult[];
  fetchHistory: () => Promise<void>;
  trends: TrendsData | null;
  fetchTrends: (role: string) => Promise<void>;
  matchedJobs: JobMatch[];
  fetchMatchedJobs: (skills: string[], role: string, filters?: any) => Promise<void>;
  bookmarks: string[];
  toggleBookmark: (jobId: string) => void;
  jobsLoading: boolean;
  jobsError: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [analysisResult, setAnalysisResultState] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarked_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist bookmarks in localStorage
  useEffect(() => {
    localStorage.setItem('bookmarked_jobs', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Apply dark class to document element on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAnalysisResult = (result: AnalysisResult | null) => {
    setAnalysisResultState(result);
    if (result && !history.some(h => h.id === result.id)) {
      setHistory(prev => [result, ...prev]);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analyses`);
      // Backend returns stringified JSONs from SQLite, parser helper maps it
      const parsedHistory = response.data.map((item: any) => ({
        ...item,
        extractedSkills: typeof item.extractedSkills === 'string' ? JSON.parse(item.extractedSkills) : item.extractedSkills,
        requiredSkills: typeof item.requiredSkills === 'string' ? JSON.parse(item.requiredSkills) : item.requiredSkills,
        missingSkills: typeof item.missingSkills === 'string' ? JSON.parse(item.missingSkills) : item.missingSkills,
        roadmap: typeof item.roadmap === 'string' ? JSON.parse(item.roadmap) : item.roadmap,
      }));
      setHistory(parsedHistory);
    } catch (err) {
      console.error('Failed to fetch analysis history', err);
    }
  };

  const fetchTrends = async (role: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/trends/${encodeURIComponent(role)}`);
      setTrends(response.data);
    } catch (err) {
      console.error('Failed to fetch market trends', err);
      // Fallback fallback trends mock data if backend not setup yet
      setTrends({
        jobRole: role,
        marketDemand: [
          { name: 'Core Skillset', value: 85 },
          { name: 'Emerging Frameworks', value: 65 },
          { name: 'Cloud Integration', value: 75 },
          { name: 'Architectural Design', value: 90 },
        ],
        trendingTech: [
          { name: 'GraphQL / Apollo', growth: '+42%', level: 'High' },
          { name: 'AWS Cloud Architecture', growth: '+28%', level: 'Medium' },
          { name: 'Tailwind CSS v4', growth: '+15%', level: 'Medium' },
          { name: 'React Server Components', growth: '+55%', level: 'Critical' },
        ],
        salaryMin: 95000,
        salaryMax: 175000,
        salaryMedian: 135000,
        hiringCompanies: ['Google', 'Stitch Inc', 'Meta', 'Amazon', 'Vercel'],
      });
    }
  };

  const fetchMatchedJobs = async (skills: string[], role: string, filters?: any) => {
    setJobsLoading(true);
    setJobsError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/jobs/match`, {
        user_skills: skills,
        target_role: role,
        filters: filters || {}
      });
      setMatchedJobs(response.data);
    } catch (err: any) {
      console.error('Failed to fetch matched jobs', err);
      setJobsError(err.response?.data?.error || 'Failed to match jobs.');
    } finally {
      setJobsLoading(false);
    }
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarks(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        analysisResult,
        setAnalysisResult,
        loading,
        setLoading,
        error,
        setError,
        history,
        fetchHistory,
        trends,
        fetchTrends,
        matchedJobs,
        fetchMatchedJobs,
        bookmarks,
        toggleBookmark,
        jobsLoading,
        jobsError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
