import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import type { JobMatch } from '../context/AppContext';
import { splitHighlight } from '../utils/text';

interface JobFilters {
  location: string;
  role: string;
  match_level: string;
  remote: boolean;
}

function getFiltersFromUrl(search: string): JobFilters {
  const params = new URLSearchParams(search);
  return {
    location: params.get('location') || 'All',
    role: params.get('role') || 'All',
    match_level: params.get('match_level') || 'All',
    remote: params.get('remote') === 'true',
  };
}


export default function JobsPage() {
  const {
    analysisResult,
    historyLoading,
    matchedJobs,
    setMatchedJobs,
    fetchMatchedJobs,
    bookmarks,
    toggleBookmark,
    jobsLoading,
    jobsError,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const initialFilters = getFiltersFromUrl(location.search);

  // Filter states
  const [draft, setDraft] = useState({ navigationKey: location.key, filters: initialFilters });
  if (draft.navigationKey !== location.key) {
    setDraft({ navigationKey: location.key, filters: initialFilters });
  }
  const tempFilters = draft.navigationKey === location.key ? draft.filters : initialFilters;
  const setTempFilters = (update: JobFilters | ((previous: JobFilters) => JobFilters)) => setDraft(previous => {
    const current = previous.navigationKey === location.key ? previous.filters : getFiltersFromUrl(location.search);
    return { navigationKey: location.key, filters: typeof update === 'function' ? update(current) : update };
  });
  
  // Instant search, search flag, & UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'matchDesc' | 'matchAsc' | 'company' | 'title'>('matchDesc');

  useEffect(() => {
    if (historyLoading) return;
    fetchMatchedJobs(analysisResult?.extractedSkills || [], analysisResult?.jobRole || '', getFiltersFromUrl(location.search));
  }, [analysisResult, historyLoading, location.search, fetchMatchedJobs]);

  // Pakistan Cities for Location Filter
  const locations = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Remote (Pakistan)'];
  
  const roleCategories = [
    'All',
    'Technology & Software',
    'Design & Creative',
    'Finance & Business',
    'Healthcare & Medical',
    'Education & Training',
    'Traditional Engineering',
    'Operations & Support',
    'Legal',
    'Other'
  ];

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (tempFilters.location !== 'All') params.set('location', tempFilters.location);
    if (tempFilters.role !== 'All') params.set('role', tempFilters.role);
    if (tempFilters.match_level !== 'All') params.set('match_level', tempFilters.match_level);
    if (tempFilters.remote) params.set('remote', 'true');
    
    const nextSearch = params.toString();
    if (nextSearch !== location.search.slice(1)) { navigate(`/jobs${nextSearch ? '?' + nextSearch : ''}`); return; }

    // Fetch matching jobs explicitly on user action
    const skills = analysisResult ? analysisResult.extractedSkills : [];
    const role = analysisResult ? analysisResult.jobRole : '';
    fetchMatchedJobs(skills, role, tempFilters);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setShowBookmarkedOnly(false);
    setSortBy('matchDesc');
    setTempFilters({
      location: 'All',
      role: 'All',
      match_level: 'All',
      remote: false,
    });

    setMatchedJobs([]);
    if (location.search) navigate('/jobs');
    else fetchMatchedJobs(analysisResult?.extractedSkills || [], analysisResult?.jobRole || '', {});
  };

  // Filter jobs locally for search query and bookmarks toggle
  const filteredJobs = matchedJobs
    .filter(job => {
      // Search text query (matches title, company, description, or required skills)
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Bookmarked toggle
      const matchesBookmarked = !showBookmarkedOnly || bookmarks.includes(job.id);

      return matchesSearch && matchesBookmarked;
    })
    .sort((a, b) => {
      // Sorting logic
      if (sortBy === 'matchDesc') return b.matchPercentage - a.matchPercentage;
      if (sortBy === 'matchAsc') return a.matchPercentage - b.matchPercentage;
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const highlightText = (text: string, query: string) => splitHighlight(text, query).map((part, i) =>
    part.matched ? <mark key={i} className="bg-primary/20 text-on-surface rounded px-xs font-semibold">{part.text}</mark> : part.text
  );

  // Animated shimmer loading skeletons for job cards
  const renderSkeletons = () => {
    return (
      <div className="flex flex-col gap-lg w-full">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg flex flex-col gap-md shadow-sm relative animate-pulse"
          >
            <div className="flex justify-between items-start gap-md">
              <div className="flex flex-col gap-sm w-3/4">
                <div className="flex flex-wrap items-center gap-sm">
                  {/* Job Title placeholder */}
                  <div className="h-6 bg-surface-container-highest rounded w-1/2" />
                  {/* Match badge placeholder */}
                  <div className="h-5 bg-surface-container-highest rounded w-28" />
                  {/* Type placeholder */}
                  <div className="h-5 bg-surface-container-highest rounded w-24" />
                </div>
                <div className="flex items-center gap-md mt-xs">
                  {/* Company placeholder */}
                  <div className="h-4 bg-surface-container-highest rounded w-32" />
                  {/* Location placeholder */}
                  <div className="h-4 bg-surface-container-highest rounded w-24" />
                </div>
              </div>
              {/* Bookmark placeholder */}
              <div className="h-9 w-9 bg-surface-container-highest rounded-lg" />
            </div>
            {/* Description placeholder */}
            <div className="flex flex-col gap-xs mt-xs">
              <div className="h-4 bg-surface-container-highest rounded w-full" />
              <div className="h-4 bg-surface-container-highest rounded w-5/6" />
            </div>
            {/* Skills placeholder */}
            <div className="flex flex-wrap gap-xs pt-xs">
              <div className="h-6 bg-surface-container-highest rounded-full w-16" />
              <div className="h-6 bg-surface-container-highest rounded-full w-20" />
              <div className="h-6 bg-surface-container-highest rounded-full w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-xl">
        {/* Header Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant/30 pb-lg">
          <div>
            <div className="inline-flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full w-fit border border-outline-variant/30 mb-sm">
              <span className="material-symbols-outlined text-primary text-[16px]">work</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Careers & Opportunities</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Job Matches
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              {analysisResult ? (
                <>
                  Sample profiles for your analyzed role:{' '}
                  <strong className="text-primary">{analysisResult.jobRole}</strong>
                </>
              ) : (
                'Browse sample job profiles or upload a resume to compare skills.'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-sm w-full md:w-auto">
            {analysisResult && (
              <button
                onClick={() => navigate('/results')}
                className="bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm hover:opacity-90 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Analysis
              </button>
            )}
            <button
              onClick={() => navigate('/workspace')}
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm hover:opacity-95 shadow-sm"
            >
              New Analysis
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
            </button>
          </div>
        </div>

        {/* Global UX Informative Banner */}
        <div className="p-md bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-md shadow-sm">
          <span className="material-symbols-outlined text-primary text-[22px] shrink-0">info</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <strong>Application Notice:</strong> These are sample job profiles, not verified current vacancies. Check the employer’s careers page for actual openings.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col gap-md">
          <div className="flex flex-col lg:flex-row gap-md items-stretch lg:items-center">
            {/* Search Input */}
            <div className="flex-grow relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/70">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search job profiles" maxLength={200} placeholder="Search jobs by title, company, description, or skills..."
                className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-primary/50 text-body-md transition-colors"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-sm min-w-[200px]">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">sort</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'matchDesc' | 'matchAsc' | 'company' | 'title')}
                className="w-full p-md bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="matchDesc">Match Score (High to Low)</option>
                <option value="matchAsc">Match Score (Low to High)</option>
                <option value="company">Company (A to Z)</option>
                <option value="title">Job Title (A to Z)</option>
              </select>
            </div>
          </div>

          {/* Subfilters Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md pt-sm border-t border-outline-variant/20 items-end">
            {/* Role Category Filter */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                Category
              </label>
              <select
                value={tempFilters.role}
                onChange={e => setTempFilters(prev => ({ ...prev, role: e.target.value }))}
                className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-sm focus:outline-none cursor-pointer"
              >
                {roleCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                Location
              </label>
              <select
                value={tempFilters.location}
                onChange={e => setTempFilters(prev => ({ ...prev, location: e.target.value }))}
                className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-sm focus:outline-none cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Match % Filter */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                Match Percentage
              </label>
              <select
                value={tempFilters.match_level}
                onChange={e => setTempFilters(prev => ({ ...prev, match_level: e.target.value }))}
                className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-sm focus:outline-none cursor-pointer"
              >
                <option value="All">All Match Scores</option>
                <option value="75">Strong Match (75%+)</option>
                <option value="60">Good Match (60%+)</option>
                <option value="40">Moderate Match (40%+)</option>
                <option value="under40">Low Match (Under 40%)</option>
              </select>
            </div>

            {/* Remote Checkbox */}
            <div className="flex items-center h-10">
              <label className="inline-flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={tempFilters.remote}
                  onChange={e => setTempFilters(prev => ({ ...prev, remote: e.target.checked }))}
                  className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                />
                <span className="font-label-md text-label-md text-on-surface">Remote Jobs Only</span>
              </label>
            </div>

            {/* Bookmarks Toggle */}
            <div className="flex items-center h-10">
              <label className="inline-flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showBookmarkedOnly}
                  onChange={e => setShowBookmarkedOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                />
                <span className="font-label-md text-label-md text-on-surface">Show Bookmarked ({bookmarks.length})</span>
              </label>
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-md sm:col-span-2 lg:col-span-5 justify-end mt-md pt-md border-t border-outline-variant/10">
              <button
                onClick={handleResetFilters}
                className="bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm hover:bg-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Reset Filters
              </button>
              <button
                onClick={handleApplyFilters}
                disabled={jobsLoading}
                className={`font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm shadow-sm font-bold ${
                  !jobsLoading
                    ? 'bg-primary text-on-primary hover:opacity-95 hover:shadow-md'
                    : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/10 shadow-none'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Refresh Results
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List / Grid Container */}
        {jobsLoading || historyLoading ? (
          renderSkeletons()
        ) : jobsError ? (
          <div className="py-xl bg-error-container text-on-error-container border border-error/30 rounded-xl p-lg text-center flex flex-col items-center gap-sm">
            <span className="material-symbols-outlined text-[48px]">warning</span>
            <h3 className="font-headline-sm text-headline-sm font-bold">Unable to Load Sample Profiles</h3>
            <p className="font-body-md text-body-md max-w-md">{jobsError}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-xl bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl text-center flex flex-col items-center gap-md animate-fade-in">
            <span className="material-symbols-outlined text-primary text-[48px]">search_off</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No relevant sample profiles found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                This catalogue may not cover your role. Try another filter or check employers’ careers pages.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-label-md px-lg py-md rounded-lg transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-lg animate-fade-in">
            {filteredJobs.map((job: JobMatch) => {
              const isLowMatch = Boolean(analysisResult) && job.matchPercentage < 40;
              const isBookmarked = bookmarks.includes(job.id);

              // Color configuration for match percentage badge
              let badgeBg = analysisResult ? 'bg-error/10 text-error border-error/20' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30';
              if (job.matchPercentage >= 75) {
                badgeBg = 'bg-green-600/10 text-green-600 border-green-600/20';
              } else if (job.matchPercentage >= 60) {
                badgeBg = 'bg-primary/10 text-primary border-primary/20';
              } else if (job.matchPercentage >= 40) {
                badgeBg = 'bg-orange-500/10 text-orange-500 border-orange-500/20';
              }

              return (
                <div
                  key={job.id}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg flex flex-col gap-md shadow-sm relative hover:shadow-md transition-all hover:border-outline-variant/50 duration-150"
                >
                  {/* Top Row: Info & Bookmark Toggle */}
                  <div className="flex justify-between items-start gap-md">
                    <div className="flex flex-col gap-xs">
                      <div className="flex flex-wrap items-center gap-sm">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {highlightText(job.title, searchQuery)}
                        </h3>
                        <span className={`inline-block font-mono-label text-[12px] font-extrabold px-sm py-xs rounded border ${badgeBg}`}>
                          {analysisResult ? `${job.matchPercentage}% Match (${job.matchLevel} Match)` : 'Upload a resume to compare'}
                        </span>
                        <span className="inline-block font-mono-label text-[11px] font-bold px-sm py-xs rounded border border-outline-variant/30 bg-surface text-on-surface-variant">
                          Sample profile
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-md text-on-surface-variant text-body-sm mt-xs">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-primary">corporate_fare</span>
                          <strong>{highlightText(job.company, searchQuery)}</strong>
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                          {highlightText(job.location, searchQuery)}
                        </span>
                      </div>
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className={`p-sm rounded-lg border transition-all duration-150 ${
                        isBookmarked
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark job'}
                    >
                      <span className="material-symbols-outlined text-[20px] select-none block">
                        {isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  {/* Low Match Warning Banner */}
                  {isLowMatch && (
                    <div className="p-md bg-error/5 border border-error/20 rounded-lg flex items-start gap-md">
                      <span className="material-symbols-outlined text-error text-[20px] shrink-0">warning</span>
                      <p className="font-body-sm text-body-sm text-error">
                        <strong>Match Warning:</strong> Your match rating is below 40%. Consider learning the missing skills listed below before applying to increase your selection probability.
                      </p>
                    </div>
                  )}

                  {/* Job Description */}
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {highlightText(job.description, searchQuery)}
                  </p>

                  {/* Skills Alignment Matrix */}
                  <div className="flex flex-col gap-sm pt-sm border-t border-outline-variant/20">
                    <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                      {analysisResult ? 'Skills Alignment' : 'Profile Skills'}
                    </span>

                    <div className="flex flex-wrap gap-md">
                      {!analysisResult && <div className="flex flex-wrap gap-xs">{job.requiredSkills.map(skill => <span key={skill} className="text-label-md bg-surface-container-high text-on-surface-variant px-sm py-xs rounded">{skill}</span>)}</div>}
                      {/* Matched Skills */}
                      {job.matchedSkills.length > 0 && (
                        <div className="flex flex-col gap-xs flex-1 min-w-[200px]">
                          <span className="font-body-sm text-[12px] text-green-600 font-bold flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Matched Skills ({job.matchedSkills.length})
                          </span>
                          <div className="flex flex-wrap gap-xs">
                            {job.matchedSkills.map(skill => (
                              <span
                                key={skill}
                                className="font-label-md text-label-md bg-green-600/10 text-green-600 px-sm py-xs rounded border border-green-600/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {analysisResult && job.missingSkills.length > 0 && (
                        <div className="flex flex-col gap-xs flex-1 min-w-[200px]">
                          <span className="font-body-sm text-[12px] text-error font-bold flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                            Missing Competencies ({job.missingSkills.length})
                          </span>
                          <div className="flex flex-wrap gap-xs">
                            {job.missingSkills.map(skill => (
                              <span
                                key={skill}
                                className="font-label-md text-label-md bg-error/10 text-error px-sm py-xs rounded border border-error/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Row Actions */}
                  <div className="flex flex-wrap gap-md justify-between items-center mt-sm pt-md border-t border-outline-variant/20">
                    <span className="font-body-sm text-[12px] text-on-surface-variant">
                      Sample profile · <strong>{job.company}</strong>
                    </span>

                    <div className="flex gap-sm">
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center gap-xs shadow-sm hover:opacity-95 font-bold"
                      >
                        Visit Careers Page
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
