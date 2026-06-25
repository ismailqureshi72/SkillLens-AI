import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function ResultsPage() {
  const { analysisResult, setAnalysisResult, theme, fetchTrends, matchedJobs, fetchMatchedJobs, history } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id');

  useEffect(() => {
    // If we have a queryId but no active analysisResult, try to load it from history/backend
    if (queryId && !analysisResult) {
      const loadFromHistory = async () => {
        let currentHistory = history;
        if (history.length === 0) {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/analyses`);
            currentHistory = response.data.map((item: any) => ({
              ...item,
              extractedSkills: typeof item.extractedSkills === 'string' ? JSON.parse(item.extractedSkills) : item.extractedSkills,
              requiredSkills: typeof item.requiredSkills === 'string' ? JSON.parse(item.requiredSkills) : item.requiredSkills,
              missingSkills: typeof item.missingSkills === 'string' ? JSON.parse(item.missingSkills) : item.missingSkills,
              roadmap: typeof item.roadmap === 'string' ? JSON.parse(item.roadmap) : item.roadmap,
            }));
          } catch (err) {
            console.error('Failed to fetch history for query ID', err);
          }
        }
        
        const match = currentHistory.find(item => String(item.id) === queryId);
        if (match) {
          setAnalysisResult(match);
        }
      };
      loadFromHistory();
    }
  }, [queryId, analysisResult, history, setAnalysisResult]);

  useEffect(() => {
    if (analysisResult) {
      fetchMatchedJobs(analysisResult.extractedSkills, analysisResult.jobRole);
    }
  }, [analysisResult]);

  // If no analysis is active, load a fallback from history or show placeholder state
  if (!analysisResult) {
    return (
      <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
        <div className="max-w-max-width mx-auto px-margin-desktop text-center py-xl bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[64px] text-outline mb-md">
            analytics
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">No Active Analysis</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[400px] mx-auto mt-xs">
            Upload your resume and select a target job role parameters to generate your detailed skill gap analysis.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-lg bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all inline-flex items-center gap-sm hover:opacity-95 shadow-md"
          >
            Upload Resume
            <span className="material-symbols-outlined">upload</span>
          </button>
        </div>
      </main>
    );
  }

  const { extractedSkills, missingSkills, matchPercentage, jobRole, roadmap } = analysisResult;

  // Chart data configuration
  const chartData = [
    { name: 'Matched', value: matchPercentage },
    { name: 'Gap', value: 100 - matchPercentage }
  ];

  // Colors aligned to current design theme override tokens
  const MATCH_COLOR = theme === 'dark' ? '#3b82f6' : '#0052cc';
  const GAP_COLOR = theme === 'dark' ? '#1c2b3c' : '#edeef0';

  const handleExportPDF = () => {
    window.print();
  };

  const handleShareProfile = () => {
    const shareUrl = analysisResult?.id
      ? `${window.location.origin}/results?id=${analysisResult.id}`
      : window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("Skill gap report link copied to clipboard!");
  };

  const handleViewTrends = async () => {
    await fetchTrends(jobRole);
    navigate('/trends');
  };

  // Helper to categorize skills (e.g. tools vs core skills)
  const isTool = (skill: string) => {
    const tools = ['figma', 'aws', 'docker', 'git', 'kubernetes', 'apollo', 'graphql', 'webpack', 'react', 'vue', 'angular', 'postgres', 'mysql', 'sqlite', 'mongodb', 'typescript'];
    return tools.some(t => skill.toLowerCase().includes(t));
  };

  const coreSkills = extractedSkills.filter(s => !isTool(s));
  const toolsAndPlatforms = extractedSkills.filter(s => isTool(s));

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-max-width mx-auto px-margin-desktop flex flex-col gap-xl">
        {/* Header Action Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant/30 pb-lg">
          <div>
            <div className="inline-flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full w-fit border border-outline-variant/30 mb-sm">
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Calibration Complete</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Detailed Results: {jobRole}
            </h2>
          </div>

          <div className="flex gap-md w-full md:w-auto">
            <button
              onClick={handleExportPDF}
              className="flex-grow md:flex-grow-0 bg-surface-container-high text-on-surface font-label-md text-label-md px-md py-sm rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm border border-outline-variant/30 hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </button>
            <button
              onClick={handleShareProfile}
              className="flex-grow md:flex-grow-0 bg-surface-container-high text-on-surface font-label-md text-label-md px-md py-sm rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm border border-outline-variant/30 hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Profile
            </button>
          </div>
        </div>

        {/* Dashboard Top Row: Score Circular Chart + Summary Message */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
          {/* Circular Gauge Card */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Match Score</h3>
            
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill={MATCH_COLOR} />
                    <Cell fill={GAP_COLOR} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-on-surface tracking-tight">
                  {matchPercentage}%
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                  Match
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mt-lg max-w-[220px]">
              Your background aligns with {matchPercentage}% of key role competencies.
            </p>
          </div>

          {/* Core Alignment Info Box */}
          <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-md">
              <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-sm">
                <span className="material-symbols-outlined">workspace_premium</span>
                {matchPercentage >= 70 ? 'Strong Alignment Detected' : 'Core Skill Gap Identified'}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The semantic matching engine parsed your resume against target requirements. You demonstrate deep competency in core methodologies. However, bridging specific infrastructure and API configuration gaps will optimize your compatibility for top-tier hiring requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-md border-t border-outline-variant/20 pt-lg mt-lg">
              <div className="flex-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                  Extracted Skills Count
                </span>
                <span className="font-headline-md text-headline-md text-on-surface font-extrabold mt-xs block">
                  {extractedSkills.length} Competencies
                </span>
              </div>
              <div className="flex-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                  Pending Gaps
                </span>
                <span className="font-headline-md text-headline-md text-error font-extrabold mt-xs block">
                  {missingSkills.length} Requirements
                </span>
              </div>
              <div className="flex-grow-0">
                <button
                  onClick={handleViewTrends}
                  className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm hover:opacity-95 shadow-sm"
                >
                  View Market Trends
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Row: Skills Matched vs Gaps Identified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
          {/* Matched Core Skills & Tools (2 Columns wide) */}
          <div className="lg:col-span-2 flex flex-col gap-lg bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              Matched Competencies
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-xs">
              {/* Core Skills Subpanel */}
              <div className="flex flex-col gap-md">
                <h4 className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">code</span>
                  Core Methodologies
                </h4>
                <div className="flex flex-wrap gap-sm">
                  {coreSkills.length > 0 ? (
                    coreSkills.map(skill => (
                      <span key={skill} className="font-body-sm text-body-sm px-md py-xs bg-surface border border-outline-variant/30 text-on-surface rounded-lg">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="font-body-sm text-body-sm text-on-surface-variant italic">No core methodologies parsed</span>
                  )}
                </div>
              </div>

              {/* Tools & Platforms Subpanel */}
              <div className="flex flex-col gap-md">
                <h4 className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">build</span>
                  Tools & Platforms
                </h4>
                <div className="flex flex-wrap gap-sm">
                  {toolsAndPlatforms.length > 0 ? (
                    toolsAndPlatforms.map(tool => (
                      <span key={tool} className="font-body-sm text-body-sm px-md py-xs bg-surface border border-outline-variant/30 text-primary font-semibold rounded-lg">
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="font-body-sm text-body-sm text-on-surface-variant italic">No tools or platforms parsed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gaps Identified Card (1 Column wide) */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-error">cancel</span>
              Gaps Identified
            </h3>

            <div className="flex flex-col gap-md mt-xs">
              {missingSkills.length > 0 ? (
                missingSkills.map((gap, index) => (
                  <div key={gap} className="flex gap-md items-start p-md bg-surface-container-lowest border-l-4 border-error border border-outline-variant/10 rounded-lg">
                    <span className="font-mono-label text-mono-label text-error bg-error/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-bold">
                        {gap}
                      </h4>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-xs">
                        Missing requirement in current target profile parameters.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-md p-md bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 rounded-lg text-green-700 dark:text-green-300">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span className="font-body-sm text-body-sm">Perfect alignment! No gaps detected.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RoadmapTimeline Section */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary">school</span>
            Recommended Upskilling Roadmap
          </h3>

          <div className="flex flex-col gap-lg mt-md pl-sm relative">
            {/* Horizontal Timeline Connector Bar */}
            <div className="absolute left-[24px] top-4 bottom-4 w-[2px] bg-outline-variant/30 pointer-events-none" />

            {roadmap.map((item, index) => (
              <div key={index} className="flex gap-lg items-start relative z-10">
                {/* Timeline Circle */}
                <div className="h-10 w-10 rounded-full bg-primary text-on-primary border-4 border-surface flex items-center justify-center flex-shrink-0 font-bold text-sm shadow-md">
                  {index + 1}
                </div>
                
                <div className="flex-grow bg-surface border border-outline-variant/20 rounded-xl p-lg flex flex-col gap-sm hover:border-primary/40 transition-colors duration-150">
                  <h4 className="font-headline-sm text-[18px] text-on-surface font-bold">
                    {item.step}
                  </h4>
                  
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {item.description}
                  </p>

                  <div className="flex flex-col gap-xs mt-sm pt-sm border-t border-outline-variant/10">
                    <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold">
                      Suggested Learning & Certifications
                    </span>
                    <div className="flex flex-wrap gap-sm mt-xs">
                      {item.resources.map(res => (
                        <a
                          key={res}
                          href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-label text-[12px] text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-sm py-xs rounded transition-colors duration-150 inline-flex items-center gap-xs"
                        >
                          {res}
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Matches Preview Section */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md pb-xs border-b border-outline-variant/20">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">work</span>
              Top Matching Job Openings
            </h3>
            <button
              onClick={() => navigate('/jobs')}
              className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-xs font-semibold group transition-all"
            >
              Browse All Matches
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Based on your parsed skills and target role parameters, here are the top 3 matches from our job database.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-sm">
            {matchedJobs.length === 0 ? (
              <div className="col-span-3 text-center py-md text-on-surface-variant italic text-body-sm">
                No matching jobs found. Try updating your target role profile.
              </div>
            ) : (
              matchedJobs.slice(0, 3).map((job) => {
                let badgeBg = 'bg-error/10 text-error border-error/20';
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
                    className="bg-surface border border-outline-variant/20 rounded-xl p-lg flex flex-col justify-between gap-md hover:border-primary/30 transition-all duration-150 shadow-sm"
                  >
                    <div className="flex flex-col gap-sm">
                      <div className="flex justify-between items-start gap-xs">
                        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                          {job.company}
                        </span>
                        <span className={`inline-block font-mono-label text-[10px] font-extrabold px-sm py-xs rounded border ${badgeBg}`}>
                          {job.matchPercentage}% Match
                        </span>
                      </div>

                      <h4 className="font-headline-sm text-[16px] text-on-surface font-bold line-clamp-1">
                        {job.title}
                      </h4>

                      <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-outline-variant/10 pt-sm mt-xs">
                      <span className="font-label-sm text-[11px] text-on-surface-variant flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {job.location.split(',')[0]}
                      </span>

                      <button
                        onClick={() => navigate('/jobs')}
                        className="text-primary hover:underline text-label-sm font-semibold flex items-center gap-xs"
                      >
                        View Details
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
