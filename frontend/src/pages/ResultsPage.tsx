import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/useApp';

export default function ResultsPage() {
  const { analysisResult, setAnalysisResult, theme, matchedJobs, fetchMatchedJobs, history, historyLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id');

  const [copyMessage, setCopyMessage] = useState('');
  useEffect(() => {
    if (!queryId || historyLoading || analysisResult?.id === queryId) return;
    const found = history.find(item => item.id === queryId);
    setAnalysisResult(found || null);
  }, [queryId, historyLoading, history, analysisResult?.id, setAnalysisResult]);
  useEffect(() => {
    if (analysisResult) fetchMatchedJobs(analysisResult.extractedSkills, analysisResult.jobRole);
  }, [analysisResult, fetchMatchedJobs]);

  if (historyLoading && queryId) return <main className="flex-grow pt-24 px-margin-mobile md:px-margin-desktop" role="status">Loading your private analysis…</main>;

  // If no analysis is active, load a fallback from history or show placeholder state
  if (!analysisResult || (queryId && analysisResult.id !== queryId)) {
    return (
      <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center py-xl bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[64px] text-outline mb-md">
            analytics
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">No Active Analysis</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[400px] mx-auto mt-xs">
            This analysis is available only in the browser session that created it. Upload a resume here to create a private report.
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

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(analysisResult.id ? window.location.origin + '/results?id=' + analysisResult.id : window.location.href);
      setCopyMessage('Private link copied. It opens only in this browser session.');
    } catch { setCopyMessage('The link could not be copied. You can copy the address from your browser.'); }
  };
  const handleViewTrends = () => navigate('/trends?role=' + encodeURIComponent(jobRole));

  // Helper to categorize skills (e.g. tools vs core skills)
  const isTool = (skill: string) => {
    const tools = ['figma', 'aws', 'docker', 'git', 'kubernetes', 'apollo', 'graphql', 'webpack', 'react', 'vue', 'angular', 'postgres', 'mysql', 'sqlite', 'mongodb', 'typescript', 'python', 'r', 'raven', 'caris', 'qgis'];
    const words = skill.toLowerCase().split(/[^a-z0-9]+/);
    return tools.some(tool => words.includes(tool));
  };

  const coreSkills = extractedSkills.filter(s => !isTool(s));
  const toolsAndPlatforms = extractedSkills.filter(s => isTool(s));

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-xl">
        {/* Header Action Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant/30 pb-lg">
          <div>
            <div className="inline-flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full w-fit border border-outline-variant/30 mb-sm">
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{analysisResult.isDemo ? 'Demo report — sample data' : 'Analysis complete'}</span>
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
              disabled={!analysisResult.id}
              title={analysisResult.id ? 'Copy a link available only to this browser session' : 'Demo reports do not have a saved link'}
              className="flex-grow md:flex-grow-0 bg-surface-container-high text-on-surface font-label-md text-label-md px-md py-sm rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm border border-outline-variant/30 hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Copy Private Link
            </button>
          </div>
        </div>

        {copyMessage && <p role="status" className="text-body-sm text-on-surface-variant">{copyMessage}</p>}

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
              AI-estimated alignment with the target role: {matchPercentage}%.
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
                This AI estimate compares the experience and skills stated in your resume with the target role. Review the identified gaps and suggested learning steps; it is guidance rather than a hiring decision.
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

        {/* Matched Competencies Section (Full width) */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary">check_circle</span>
            Skills Found in Your Resume
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

        {/* Gaps Identified Section (Full width, placed below Matched Competencies) */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-error">cancel</span>
            Gaps Identified
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mt-xs">
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
              <div className="col-span-full flex items-center gap-md p-md bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 rounded-lg text-green-700 dark:text-green-300">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span className="font-body-sm text-body-sm">Perfect alignment! No gaps detected.</span>
              </div>
            )}
          </div>
        </div>

        {/* RoadmapTimeline Section */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-lg">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary">school</span>
            Recommended Upskilling Roadmap
          </h3>

          <div className="flex flex-col gap-lg mt-md pl-sm relative">
            {/* Timeline Connector Bar: Hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute left-[24px] top-4 bottom-4 w-[2px] bg-outline-variant/30 pointer-events-none" />

            {roadmap.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-md md:gap-lg items-stretch md:items-start relative z-10">
                {/* Timeline Circle: Hidden on mobile, visible on desktop */}
                <div className="hidden md:flex h-10 w-10 rounded-full bg-primary text-on-primary border-4 border-surface items-center justify-center flex-shrink-0 font-bold text-sm shadow-md">
                  {index + 1}
                </div>
                
                <div className="flex-grow bg-surface border border-outline-variant/20 rounded-xl p-md md:p-lg flex flex-col gap-sm hover:border-primary/40 transition-colors duration-150">
                  {/* Step Header with Mobile step badge */}
                  <div className="flex items-center gap-sm justify-between">
                    <h4 className="font-headline-sm text-[16px] md:text-[18px] text-on-surface font-bold leading-tight">
                      {item.step}
                    </h4>
                    {/* Badge only on mobile */}
                    <span className="md:hidden font-mono-label text-[11px] font-bold text-primary bg-primary/10 px-md py-xs rounded-full flex-shrink-0">
                      Step {index + 1}
                    </span>
                  </div>
                  
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-col gap-xs mt-sm pt-sm border-t border-outline-variant/10">
                    <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold">
                      AI-Suggested References
                    </span>
                    <p className="text-body-sm text-on-surface-variant">Links search the web for suggested topics. Verify the source, course availability and suitability before using them.</p>
                    <div className="flex flex-wrap gap-sm mt-xs">
                      {item.resources.map(res => (
                        <a
                          key={res}
                          href={`https://www.google.com/search?q=${encodeURIComponent(res)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-label text-[11px] md:text-[12px] text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-sm py-xs rounded transition-colors duration-150 inline-flex items-center gap-xs"
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
              Related Sample Job Profiles
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
            These illustrative profiles are not verified vacancies. Check employers’ careers pages for current openings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-sm">
            {matchedJobs.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center py-md text-on-surface-variant italic text-body-sm">
                No relevant sample profiles are available for this role. Check employers’ careers pages for current openings.
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
