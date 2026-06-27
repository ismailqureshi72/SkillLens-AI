import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import CompanySection from '../components/CompanySection';

export default function TrendsPage() {
  const { trends, fetchTrends, theme } = useApp();
  const navigate = useNavigate();

  // Load default trends (e.g. for Senior Product Designer) if none selected
  useEffect(() => {
    if (!trends) {
      fetchTrends('Senior Product Designer');
    }
  }, [trends]);

  if (!trends) {
    return (
      <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
        <div className="max-w-max-width mx-auto px-margin-desktop text-center py-xl bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-sm">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-md" />
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Loading Market Data...</h3>
        </div>
      </main>
    );
  }

  const { jobRole, marketDemand, trendingTech, salaryMin, salaryMax, salaryMedian, hiringCompanies } = trends;

  const chartColor = theme === 'dark' ? '#3b82f6' : '#0052cc';
  const gridColor = theme === 'dark' ? 'rgba(144,144,151,0.1)' : 'rgba(115,118,133,0.1)';

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-max-width mx-auto px-margin-desktop flex flex-col gap-xl">
        {/* Header Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md border-b border-outline-variant/30 pb-lg">
          <div>
            <div className="inline-flex items-center gap-sm bg-surface-container px-sm py-xs rounded-full w-fit border border-outline-variant/30 mb-sm">
              <span className="material-symbols-outlined text-primary text-[16px]">trending_up</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Live Market Calibration</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Market Trends: {jobRole}
            </h2>
          </div>

          <button
            onClick={() => navigate('/workspace')}
            className="w-full md:w-auto bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm hover:opacity-95 shadow-sm"
          >
            New Analysis
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
          </button>
        </div>

        {/* First Row: Demand Chart & Trending Tech table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
          {/* Skill Demand Forecast Chart (2 Columns wide) */}
          <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-primary">ssid_chart</span>
              Skill Demand Forecast
            </h3>
            
            <div className="flex-grow h-72 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      color: theme === 'dark' ? '#d4e4fa' : '#191c1e',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill={chartColor} radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <p className="font-body-sm text-[12px] text-on-surface-variant mt-sm">
              Percentage of job profiles indicating critical need for this competency group.
            </p>
          </div>

          {/* Trending Technologies Table (1 Column wide) */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">local_fire_department</span>
              Trending Technologies
            </h3>

            <div className="flex flex-col gap-md mt-xs flex-grow justify-center">
              {trendingTech.map((tech) => (
                <div key={tech.name} className="flex justify-between items-center p-md bg-surface-container-lowest border border-outline-variant/10 rounded-lg hover:border-primary/20 transition-all duration-150">
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">
                      {tech.name}
                    </h4>
                    <span className={`inline-block font-label-sm text-[10px] uppercase font-bold px-sm py-xs rounded mt-xs ${
                      tech.level === 'Critical'
                        ? 'bg-red-500/10 text-red-500'
                        : tech.level === 'High'
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'bg-primary/10 text-primary'
                    }`}>
                      {tech.level} Demand
                    </span>
                  </div>
                  <span className="font-mono-label text-[16px] text-green-600 font-extrabold">
                    {tech.growth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row: Salary Benchmarking & Hiring Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
          {/* Salary Benchmarking Scale (2 Columns wide) */}
          <div className="lg:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col justify-between gap-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                Salary Benchmarking
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                Expected monthly baseline ranges in the Pakistan technology sector.
              </p>
            </div>

            {/* Custom Horizontal Scale bar */}
            <div className="py-md pr-sm pl-sm mt-md flex flex-col gap-sm">
              <div className="h-4 w-full bg-surface-container-highest rounded-full relative">
                {/* Median marker bar */}
                <div 
                  className="absolute top-[-4px] bottom-[-4px] w-1 bg-primary rounded-full"
                  style={{ left: '50%' }}
                />
                {/* Visual filled range */}
                <div 
                  className="absolute top-0 bottom-0 bg-primary/20 rounded-full"
                  style={{ left: '20%', right: '20%' }}
                />
              </div>

              <div className="flex justify-between items-center text-center mt-sm">
                <div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant block uppercase tracking-wider">
                    Min Baseline
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface font-extrabold">
                    PKR {salaryMin.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-primary block uppercase tracking-wider font-bold">
                    Median Expectation
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
                    PKR {salaryMedian.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant block uppercase tracking-wider">
                    Max Potential
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface font-extrabold">
                    PKR {salaryMax.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-md bg-surface border border-outline-variant/10 rounded-lg flex items-start gap-md mt-sm">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <strong>Actionable Insight:</strong> Developing competency in missing skills listed in your report can increase your market valuation by an estimated <span className="text-green-600 font-bold">14.8%</span>.
              </p>
            </div>
          </div>

          {/* Hiring Partners Card (1 Column wide) */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm flex flex-col gap-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm pb-xs border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">business</span>
              Top Hiring Companies
            </h3>
            
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Active enterprise partners listing requirements for {jobRole} components.
            </p>

            <div className="flex flex-col gap-sm mt-sm flex-grow justify-center">
              {hiringCompanies.map((company) => (
                <div key={company} className="flex items-center gap-md p-sm bg-surface-container-lowest border border-outline-variant/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    corporate_fare
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Localized Company Intelligence Section */}
        <CompanySection />
      </section>
    </main>
  );
}
