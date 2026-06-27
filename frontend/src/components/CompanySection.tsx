import { useState } from 'react';
import { COMPANY_DATASET } from '../data/companies';
import CompanyCard from './CompanyCard';

export default function CompanySection() {
  const [roleFilter, setRoleFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Derive unique roles from the dataset for the filter dropdown
  const rolesList = ['All', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'Data Engineer', 'QA Engineer', 'DevOps Engineer', 'Mobile Developer'];
  const levelsList = ['All', 'Intern', 'Junior', 'Mid', 'Senior'];
  const typesList = ['All', 'Remote', 'On-site', 'Hybrid'];

  // Filter logic
  const filteredCompanies = COMPANY_DATASET.filter(company => {
    const matchesRole = roleFilter === 'All' || company.roles.includes(roleFilter);
    const matchesLevel = levelFilter === 'All' || company.level.includes(levelFilter);
    const matchesType = typeFilter === 'All' || company.type === typeFilter;
    return matchesRole && matchesLevel && matchesType;
  });

  // Fresh Graduate Friendly Companies (filtered where freshers is true)
  const freshersFriendlyCompanies = filteredCompanies.filter(c => c.freshers);

  return (
    <div className="flex flex-col gap-lg mt-md">
      {/* Filters Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col gap-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">filter_alt</span>
          Filter Companies
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          {/* Role Filter */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
              Role Focus
            </label>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-sm focus:outline-none cursor-pointer"
            >
              {rolesList.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
              Hiring Level
            </label>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-sm focus:outline-none cursor-pointer"
            >
              {levelsList.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
              Work Setting
            </label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface text-body-sm focus:outline-none cursor-pointer"
            >
              {typesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top Hiring Companies Section */}
      <div className="flex flex-col gap-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">business</span>
          Top Hiring Companies in Pakistan
        </h3>
        
        {filteredCompanies.length === 0 ? (
          <div className="py-xl bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl text-center flex flex-col items-center gap-md">
            <span className="material-symbols-outlined text-primary text-[48px]">search_off</span>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">No companies match your filters</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Try resetting or clearing your select inputs.
              </p>
            </div>
            <button
              onClick={() => {
                setRoleFilter('All');
                setLevelFilter('All');
                setTypeFilter('All');
              }}
              className="bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-label-md px-lg py-md rounded-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.name} company={company} showFresherBadge={true} />
            ))}
          </div>
        )}
      </div>

      {/* Fresh Graduate Friendly Section */}
      <div className="flex flex-col gap-md border-t border-outline-variant/20 pt-lg mt-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-green-600 text-[28px]">school</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Fresh Graduate Friendly Companies
          </h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
          These companies explicitly offer Intern or Junior pathways with dedicated fresh graduate onboarding structures.
        </p>

        {freshersFriendlyCompanies.length === 0 ? (
          <div className="py-lg bg-surface-container-low border border-outline-variant/30 rounded-xl text-center text-on-surface-variant font-body-md">
            No freshers-friendly opportunities match the current active filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {freshersFriendlyCompanies.map(company => (
              <CompanyCard key={`${company.name}-fresh`} company={company} showFresherBadge={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
