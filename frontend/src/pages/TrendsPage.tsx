import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import CompanySection from '../components/CompanySection';
import { MARKET_TRENDS_DATASET } from '../data/marketTrendsData';
import type { MarketTrend } from '../data/marketTrendsData';

export default function TrendsPage() {
  const { theme } = useApp();
  const navigate = useNavigate();

  // State Management
  const [selectedMarket, setSelectedMarket] = useState("Computer Science");
  const [customMarket, setCustomMarket] = useState("");
  const [activeData, setActiveData] = useState<MarketTrend>(MARKET_TRENDS_DATASET["Computer Science"]);

  // Suggest closest category helper
  const getClosestCategory = (input: string): string => {
    const normalized = input.toLowerCase();
    if (
      normalized.includes('tech') ||
      normalized.includes('code') ||
      normalized.includes('software') ||
      normalized.includes('develop') ||
      normalized.includes('react') ||
      normalized.includes('program') ||
      normalized.includes('computer') ||
      normalized.includes('web') ||
      normalized.includes('engineer')
    ) {
      return 'Computer Science';
    }
    if (
      normalized.includes('market') ||
      normalized.includes('seo') ||
      normalized.includes('ad ') ||
      normalized.includes('sales') ||
      normalized.includes('growth') ||
      normalized.includes('social media')
    ) {
      return 'Marketing';
    }
    if (
      normalized.includes('financ') ||
      normalized.includes('account') ||
      normalized.includes('audit') ||
      normalized.includes('tax') ||
      normalized.includes('bank') ||
      normalized.includes('money')
    ) {
      return 'Finance';
    }
    if (
      normalized.includes('design') ||
      normalized.includes('ux') ||
      normalized.includes('ui') ||
      normalized.includes('figma') ||
      normalized.includes('art') ||
      normalized.includes('creative')
    ) {
      return 'Design';
    }
    if (
      normalized.includes('business') ||
      normalized.includes('manage') ||
      normalized.includes('product') ||
      normalized.includes('operation') ||
      normalized.includes('hr ') ||
      normalized.includes('recru')
    ) {
      return 'Business / Management';
    }
    return 'Computer Science'; // Fallback
  };

  // Generate dynamic stats for custom input
  const getCustomMarketData = (input: string): MarketTrend => {
    const cleaned = input.trim() || 'Custom Field';
    return {
      marketDemand: [
        { name: 'Core Skillset', value: 85 },
        { name: 'Strategy & Planning', value: 75 },
        { name: 'Tools Proficiency', value: 80 },
        { name: 'Collaboration', value: 70 }
      ],
      trendingTech: [
        { name: `${cleaned} Frameworks`, growth: '+35%', level: 'High' },
        { name: 'Analytics Dashboards', growth: '+28%', level: 'Medium' },
        { name: 'AI Assist Utilities', growth: '+54%', level: 'Critical' },
        { name: 'Collaboration Platforms', growth: '+40%', level: 'High' }
      ],
      salaryMin: 70000,
      salaryMedian: 160000,
      salaryMax: 320000,
      hiringCompanies: ['Systems Limited', 'Arbisoft', '10Pearls', 'VentureDive', 'Bazaar Technologies'],
      jobAvailability: `Growing demand for specialized ${cleaned} expertise in Lahore, Karachi, and Islamabad.`
    };
  };

  // Sync active data when selectedMarket or customMarket changes
  useEffect(() => {
    if (selectedMarket === "Custom") {
      setActiveData(getCustomMarketData(customMarket));
    } else {
      setActiveData(MARKET_TRENDS_DATASET[selectedMarket]);
    }
  }, [selectedMarket, customMarket]);

  const chartColor = theme === 'dark' ? '#3b82f6' : '#0052cc';
  const gridColor = theme === 'dark' ? 'rgba(144,144,151,0.1)' : 'rgba(115,118,133,0.1)';

  const closestCategory = selectedMarket === "Custom" && customMarket.trim().length > 0
    ? getClosestCategory(customMarket)
    : "";

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
              Market Trends: {selectedMarket === "Custom" && customMarket.trim() ? customMarket : selectedMarket}
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

        {/* Dynamic Market Selector Card */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col md:flex-row md:items-end gap-md">
          <div className="flex-1 flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
              Select Market
            </label>
            <select
              value={selectedMarket}
              onChange={e => setSelectedMarket(e.target.value)}
              className="p-md bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary/50 cursor-pointer transition-colors"
            >
              <option value="Computer Science">Computer Science (default)</option>
              <option value="Business / Management">Business / Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Custom">Custom (user input)</option>
            </select>
          </div>

          {selectedMarket === "Custom" && (
            <div className="flex-1 flex flex-col gap-xs animate-fade-in">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Enter Custom Field or Role
              </label>
              <input
                type="text"
                value={customMarket}
                onChange={e => setCustomMarket(e.target.value)}
                placeholder="e.g. Flutter Developer, Product Manager..."
                className="p-md bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-md focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Custom Role Category Suggestion Banner */}
        {closestCategory && (
          <div className="p-md bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-md animate-fade-in shadow-sm">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary text-[22px]">lightbulb</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We noticed your input is related to <strong>{closestCategory}</strong>. Would you like to load the standardized dataset for this field?
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedMarket(closestCategory);
                setCustomMarket("");
              }}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-label-md px-md py-sm rounded-lg transition-all text-xs whitespace-nowrap"
            >
              Use {closestCategory}
            </button>
          </div>
        )}

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
                <BarChart data={activeData.marketDemand} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" fontSize={11} tickLine={false} />
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
              Trending Skills / Technologies
            </h3>

            <div className="flex flex-col gap-md mt-xs flex-grow justify-center">
              {activeData.trendingTech.map((tech) => (
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
                    PKR {activeData.salaryMin.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-primary block uppercase tracking-wider font-bold">
                    Median Expectation
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
                    PKR {activeData.salaryMedian.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant block uppercase tracking-wider">
                    Max Potential
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface font-extrabold">
                    PKR {activeData.salaryMax.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Job Availability Insights */}
            <div className="p-md bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-md mt-sm">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">analytics</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                <strong>Job Availability Insight:</strong> {activeData.jobAvailability}
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
              Active enterprise partners listing requirements for localized components.
            </p>

            <div className="flex flex-col gap-sm mt-sm flex-grow justify-center">
              {activeData.hiringCompanies.map((company) => (
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
