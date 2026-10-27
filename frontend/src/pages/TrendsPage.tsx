import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CompanySection from '../components/CompanySection';
import API_BASE_URL from '../config/api';
import { MARKET_CATEGORIES } from '../../lib/roles.js';

interface MarketData {
  jobRole: string;
  category: string | null;
  status: 'reference' | 'unavailable';
  source: string | null;
  trendingTech: Array<{ name: string }>;
  jobAvailability: string;
}

export default function TrendsPage() {
  const [params, setParams] = useSearchParams();
  const role = (params.get('role') ?? params.get('search') ?? 'Computer Science').trim().slice(0, 120);
  const isCustom = params.get('mode') === 'custom' || !MARKET_CATEGORIES.includes(role);
  return <MarketView key={`${isCustom}-${role}`} role={role} isCustom={isCustom} setParams={value => setParams(value)} />;
}

function MarketView({ role, isCustom, setParams }: { role: string; isCustom: boolean; setParams: (value: Record<string, string>) => void }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(role);
  const [data, setData] = useState<MarketData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(role));

  useEffect(() => {
    const controller = new AbortController();
    if (!role) return;
    axios.get<MarketData>(`${API_BASE_URL}/api/trends/${encodeURIComponent(role)}`, { signal: controller.signal })
      .then(response => { if (!controller.signal.aborted) setData(response.data); })
      .catch(() => { if (!controller.signal.aborted) setError('Market information could not be loaded. Please try again.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [role]);

  const applyCustom = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) { setError('Enter a role or field first.'); return; }
    setParams({ role: input.trim(), mode: 'custom' });
  };

  return (
    <main className="flex-grow pt-24 pb-xl">
      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-lg">
        <div className="flex flex-wrap items-start justify-between gap-md border-b border-outline-variant/30 pb-lg">
          <div>
            <p className="text-label-md text-on-surface-variant mb-sm">Market reference guide</p>
            <h1 className="text-headline-lg font-bold break-words">Market Trends: {role || 'Choose a role'}</h1>
          </div>
          <button onClick={() => navigate('/workspace')} className="bg-primary text-on-primary rounded-lg px-lg py-md font-semibold">New Analysis</button>
        </div>

        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-lg flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label htmlFor="market-category" className="text-label-md font-semibold">Select Market</label>
            <select id="market-category" value={isCustom ? 'Custom' : role}
              onChange={event => {
                if (event.target.value === 'Custom') setParams({ role: '', mode: 'custom' });
                else setParams({ role: event.target.value });
              }} className="w-full p-md bg-surface-container-lowest border border-outline-variant/30 rounded-lg">
              {MARKET_CATEGORIES.map((category: string) => <option key={category} value={category}>{category}</option>)}
              <option value="Custom">Custom role</option>
            </select>
          </div>
          {isCustom && (
            <form onSubmit={applyCustom} className="flex flex-col gap-xs">
              <label htmlFor="custom-market" className="text-label-md font-semibold">Role or field</label>
              <div className="flex flex-col sm:flex-row gap-sm">
                <input id="custom-market" value={input} onChange={event => setInput(event.target.value)} maxLength={120}
                  placeholder="e.g. Hydrographic Surveyor" className="min-w-0 flex-1 p-md bg-surface-container-lowest border border-outline-variant/30 rounded-lg" />
                <button type="submit" className="px-lg py-md rounded-lg bg-primary text-on-primary font-semibold">Apply</button>
              </div>
            </form>
          )}
        </div>

        {error && <p role="alert" className="p-md rounded-lg bg-error/10 text-error">{error}</p>}
        {loading && <p role="status" className="p-lg">Loading market reference…</p>}
        {!loading && data && data.jobRole === role && (
          <>
            <div className="p-lg rounded-xl border border-outline-variant/30 bg-surface-container-low" role="status">
              <h2 className="text-headline-sm font-semibold">Verified market figures unavailable</h2>
              <p className="text-body-md text-on-surface-variant mt-sm">{data.jobAvailability}</p>
              <p className="text-body-sm text-on-surface-variant mt-sm">Region: Pakistan. Salary ranges, growth percentages and demand forecasts are not shown without a verified, dated source.</p>
            </div>

            {data.status === 'unavailable' ? (
              <div className="p-lg rounded-xl border border-outline-variant/30 bg-surface-container-low">
                <h2 className="text-headline-sm font-semibold">No reference data for this role</h2>
                <p className="text-body-md text-on-surface-variant mt-sm">The reference catalogue does not cover {role}. Choose another market to explore example skills and companies.</p>
              </div>
            ) : (
              <>
                <div className="p-lg rounded-xl border border-outline-variant/30 bg-surface-container-low">
                  <h2 className="text-headline-sm font-semibold">Reference skills: {data.category}</h2>
                  <p className="text-body-sm text-on-surface-variant mt-sm">Examples from the {data.source}. These are not measured demand rankings.</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-md">
                    {data.trendingTech.map(skill => <li key={skill.name} className="p-md rounded-lg bg-surface-container-lowest border border-outline-variant/20">{skill.name}</li>)}
                  </ul>
                </div>
                <CompanySection key={data.category} selectedMarket={data.category || 'Other'} />
              </>
            )}
          </>
        )}
        {!role && <p className="text-body-md text-on-surface-variant">Enter a custom role and press Apply.</p>}
      </section>
    </main>
  );
}
