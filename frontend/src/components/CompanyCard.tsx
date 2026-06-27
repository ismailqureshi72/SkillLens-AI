import type { Company } from '../data/companies';

interface CompanyCardProps {
  company: Company;
  showFresherBadge?: boolean;
}

export default function CompanyCard({ company, showFresherBadge = false }: CompanyCardProps) {
  // Color configuration for difficulty level
  let diffColor = 'bg-primary/10 text-primary border-primary/20';
  if (company.difficulty === 'Easy') {
    diffColor = 'bg-green-600/10 text-green-600 border-green-600/20';
  } else if (company.difficulty === 'Competitive') {
    diffColor = 'bg-red-500/10 text-red-500 border-red-500/20';
  }

  // Icon mapping for hiring type
  let typeIcon = 'location_on';
  let typeColor = 'bg-surface-container-highest text-on-surface-variant';
  if (company.type === 'Remote') {
    typeIcon = 'cloud';
    typeColor = 'bg-purple-500/10 text-purple-600 border-purple-500/20 border';
  } else if (company.type === 'Hybrid') {
    typeIcon = 'domain';
    typeColor = 'bg-orange-500/10 text-orange-600 border-orange-500/20 border';
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg flex flex-col gap-md shadow-sm hover:shadow-md transition-all hover:border-outline-variant/50 duration-150 relative">
      {/* Badges row at top */}
      <div className="flex flex-wrap gap-xs justify-between items-start">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
          {company.name}
        </h3>
        <div className="flex flex-wrap gap-xs">
          <span className={`inline-flex items-center gap-xs font-mono-label text-[11px] font-bold px-sm py-xs rounded ${typeColor}`}>
            <span className="material-symbols-outlined text-[14px]">{typeIcon}</span>
            {company.type}
          </span>
          {showFresherBadge && company.freshers && (
            <span className="inline-flex items-center gap-xs font-mono-label text-[11px] font-bold bg-green-600/10 text-green-600 px-sm py-xs rounded border border-green-600/20 animate-pulse">
              <span className="material-symbols-outlined text-[14px]">school</span>
              Freshers Friendly ✅
            </span>
          )}
        </div>
      </div>

      {/* Hiring Roles List */}
      <div>
        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-xs">
          Hiring Roles
        </span>
        <div className="flex flex-wrap gap-xs">
          {company.roles.map(role => (
            <span key={role} className="font-body-sm text-[12px] text-on-surface bg-surface border border-outline-variant/20 px-sm py-xs rounded">
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div>
        <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-xs">
          Technologies
        </span>
        <div className="flex flex-wrap gap-xs">
          {company.techStack.map(tech => (
            <span key={tech} className="font-mono-label text-[11px] bg-primary/5 text-primary border border-primary/20 px-sm py-xs rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer details: difficulty & levels */}
      <div className="flex justify-between items-center mt-sm pt-md border-t border-outline-variant/20">
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
            Levels
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {company.level.join(' / ')}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
            Difficulty
          </span>
          <span className={`inline-block font-mono-label text-[11px] font-bold px-sm py-xs rounded border ${diffColor}`}>
            {company.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
