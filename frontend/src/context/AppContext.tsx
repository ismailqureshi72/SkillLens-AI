import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { readStorage, readStringList, writeStorage } from '../utils/safe-storage';
import { AppContext } from './app-context';

export interface AnalysisResult {
  id?: string;
  resumeText: string;
  jobRole: string;
  extractedSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  roadmap: Array<{ step: string; description: string; resources: string[] }>;
  createdAt?: string;
  isDemo?: boolean;
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
  isSample: boolean;
}

export interface AppContextType {
  theme: 'light' | 'dark'; toggleTheme: () => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  loading: boolean; setLoading: (loading: boolean) => void;
  error: string | null; setError: (error: string | null) => void;
  history: AnalysisResult[]; historyLoading: boolean; fetchHistory: () => Promise<void>;
  matchedJobs: JobMatch[]; setMatchedJobs: (jobs: JobMatch[]) => void;
  fetchMatchedJobs: (skills: string[], role: string, filters?: object) => Promise<void>;
  bookmarks: string[]; toggleBookmark: (jobId: string) => void;
  jobsLoading: boolean; jobsError: string | null;
}

const list = (value: unknown): string[] => {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch { return []; }
};

function parseAnalysis(item: AnalysisResult): AnalysisResult {
  let roadmap = item.roadmap;
  try { if (typeof roadmap === 'string') roadmap = JSON.parse(roadmap); } catch { roadmap = []; }
  return { ...item, extractedSkills: list(item.extractedSkills), requiredSkills: list(item.requiredSkills), missingSkills: list(item.missingSkills),
    matchPercentage: Math.max(0, Math.min(100, Number(item.matchPercentage) || 0)),
    roadmap: Array.isArray(roadmap) ? roadmap.map(step => ({ ...step, resources: list(step.resources) })) : [] };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = readStorage('theme');
    return saved === 'light' || saved === 'dark' ? saved : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [analysisResult, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => readStringList('bookmarked_jobs'));
  const choiceVersion = useRef(0);
  const jobsRequest = useRef<AbortController | null>(null);

  useEffect(() => { writeStorage('bookmarked_jobs', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    writeStorage('theme', theme);
  }, [theme]);

  useEffect(() => {
    const controller = new AbortController();
    axios.get<AnalysisResult[]>(`${API_BASE_URL}/api/analyses`, { signal: controller.signal })
      .then(response => {
        if (controller.signal.aborted) return;
        const rows = Array.isArray(response.data) ? response.data.map(parseAnalysis) : [];
        setHistory(previous => [...previous, ...rows.filter(row => !previous.some(p => p.id === row.id))]);
        const saved = readStorage('skilllens_active_analysis');
        if (choiceVersion.current === 0 && !new URLSearchParams(window.location.search).has('id')) setResult(rows.find(row => row.id === saved) || null);
      })
      .catch(() => { /* A history failure must not prevent uploads or public pages. */ })
      .finally(() => { if (!controller.signal.aborted) setHistoryLoading(false); });
    return () => controller.abort();
  }, []);

  const setAnalysisResult = useCallback((result: AnalysisResult | null) => {
    choiceVersion.current += 1;
    setResult(result);
    writeStorage('skilllens_active_analysis', result?.id || '');
    if (result) setHistory(previous => previous.some(row => row.id === result.id && result.id) ? previous : [result, ...previous]);
  }, []);

  const fetchHistory = useCallback(async () => {
    const response = await axios.get<AnalysisResult[]>(`${API_BASE_URL}/api/analyses`);
    setHistory(Array.isArray(response.data) ? response.data.map(parseAnalysis) : []);
  }, []);

  const fetchMatchedJobs = useCallback(async (skills: string[], role: string, filters: object = {}) => {
    jobsRequest.current?.abort();
    const controller = new AbortController();
    jobsRequest.current = controller;
    setJobsLoading(true); setJobsError(null); setMatchedJobs([]);
    try {
      const response = await axios.post<JobMatch[]>(`${API_BASE_URL}/api/jobs/match`, { user_skills: skills, target_role: role, filters }, { signal: controller.signal });
      if (!controller.signal.aborted) setMatchedJobs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (!controller.signal.aborted) setJobsError(axios.isAxiosError(err) ? err.response?.data?.error || 'Unable to load sample job profiles. Please retry.' : 'Unable to load sample job profiles. Please retry.');
    } finally { if (!controller.signal.aborted) setJobsLoading(false); }
  }, []);

  const toggleBookmark = (id: string) => setBookmarks(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  return <AppContext.Provider value={{ theme, toggleTheme: () => setTheme(previous => previous === 'light' ? 'dark' : 'light'),
    analysisResult, setAnalysisResult, loading, setLoading, error, setError, history, historyLoading, fetchHistory,
    matchedJobs, setMatchedJobs, fetchMatchedJobs, bookmarks, toggleBookmark, jobsLoading, jobsError }}>{children}</AppContext.Provider>;
}
