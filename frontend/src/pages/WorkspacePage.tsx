import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import API_BASE_URL from '../config/api';
import { ROLE_DATASET } from '../data/roles';
import type { RoleEntry } from '../data/roles';

export default function WorkspacePage() {
  const { setAnalysisResult, setError } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from landing page upload
  const initialFile = location.state?.resumeFile || null;
  const isDemo = location.state?.isDemo || false;

  const [file, setFile] = useState<File | null>(initialFile);
  const [roleQuery, setRoleQuery] = useState('');
  const [selectedRole, setSelectedRoleState] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_role_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0); // 0: parsing, 1: isolating, 2: generating

  const trendingRoles = ["AI Engineer", "Software Engineer", "UI/UX Designer", "Data Scientist"];

  const getFilteredSuggestions = (query: string): RoleEntry[] => {
    if (!query.trim()) return [];
    const normalizedQuery = query.toLowerCase().trim();

    return ROLE_DATASET.map(role => {
      const nameLower = role.name.toLowerCase();
      let score = 0;

      if (nameLower === normalizedQuery) {
        score += 100;
      } else if (nameLower.startsWith(normalizedQuery)) {
        score += 50;
      } else if (nameLower.includes(` ${normalizedQuery}`)) {
        score += 30;
      } else if (nameLower.includes(normalizedQuery)) {
        score += 10;
      }

      // Fuzzy matching
      if (score === 0) {
        let queryIdx = 0;
        for (let i = 0; i < nameLower.length; i++) {
          if (nameLower[i] === normalizedQuery[queryIdx]) {
            queryIdx++;
            if (queryIdx === normalizedQuery.length) {
              score += 5;
              break;
            }
          }
        }
      }

      return { role, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.role.popularity - a.role.popularity;
    })
    .map(item => item.role)
    .slice(0, 8);
  };

  const suggestions = getFilteredSuggestions(roleQuery);

  const handleSelectRole = (roleName: string) => {
    setSelectedRoleState(roleName);
    setRoleQuery(roleName);
    setShowSuggestions(false);
    setFocusedIndex(-1);

    // Save to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== roleName);
      const updated = [roleName, ...filtered].slice(0, 5);
      localStorage.setItem('recent_role_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Redirect if no file is present and not a demo
  useEffect(() => {
    if (!file && !isDemo) {
      // Allow user to upload file here if they navigated directly
    }
  }, [file, isDemo]);

  // Handle local file selection if user navigated directly
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerAnalysis = async () => {
    const finalRole = selectedRole || roleQuery.trim();

    if (!finalRole) {
      alert("Please specify a target role first.");
      return;
    }

    setAnalyzing(true);
    setProgressStep(0); // Start at parsing

    // Fake visual progress increments for a premium feel
    const stepInterval = setInterval(() => {
      setProgressStep(prev => {
        if (prev < 2) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      let resultData;
      if (isDemo || file?.name === 'resume_demo.pdf') {
        // Mock API call for demo
        await new Promise(resolve => setTimeout(resolve, 4500));
        
        const rLower = finalRole.toLowerCase();
        
        // 1. Finance & Business
        if (rLower.includes('finance') || rLower.includes('analyst') || rLower.includes('accountant') || rLower.includes('banker') || rLower.includes('audit') || rLower.includes('portfolio') || rLower.includes('risk') || rLower.includes('tax') || rLower.includes('bookkeeper')) {
          resultData = {
            resumeText: "Demo Resume",
            jobRole: finalRole,
            extractedSkills: ['Excel', 'Accounting', 'Financial Analysis', 'Financial Reporting'],
            requiredSkills: ['Financial Modeling', 'Valuation', 'Excel', 'Financial Analysis', 'Accounting'],
            missingSkills: ['Financial Modeling', 'Valuation'],
            matchPercentage: 80,
            roadmap: [
              {
                step: "Financial Modeling Mastery",
                description: "Develop advanced skills in constructing integrated financial projection models and forecasting corporate accounts.",
                resources: ["FMVA Certification by CFI", "Advanced Financial Modeling Course"]
              },
              {
                step: "Corporate Valuation Methodologies",
                description: "Learn how to carry out Discounted Cash Flow (DCF), LBO, and Comparable Company Analysis (Comps).",
                resources: ["Investment Banking Valuation Guide", "Wall Street Prep Modeling Courses"]
              }
            ]
          };
        }
        // 2. Healthcare & Medical
        else if (rLower.includes('nurse') || rLower.includes('doctor') || rLower.includes('med') || rLower.includes('pharmacist') || rLower.includes('dentist') || rLower.includes('surgeon') || rLower.includes('clinic')) {
          resultData = {
            resumeText: "Demo Resume",
            jobRole: finalRole,
            extractedSkills: ['Patient Care', 'CPR', 'Medication Administration'],
            requiredSkills: ['Patient Care', 'Clinical Assessment', 'Medication Administration', 'CPR', 'Nursing'],
            missingSkills: ['Clinical Assessment', 'Nursing'],
            matchPercentage: 60,
            roadmap: [
              {
                step: "Clinical Assessment Certification",
                description: "Master patient physical assessments, diagnostic parameters, and structured clinical charting standards.",
                resources: ["Advanced Clinical Assessment by Coursera", "ACLS & BLS Provider Certifications"]
              },
              {
                step: "Nursing Practice & Compliance",
                description: "Calibrate understanding of national healthcare guidelines and nursing ethics frameworks.",
                resources: ["NCLEX-RN Exam Preparation Study Guide", "National Nursing Practice Guidelines"]
              }
            ]
          };
        }
        // 3. Education & Teaching
        else if (rLower.includes('teach') || rLower.includes('professor') || rLower.includes('tutor') || rLower.includes('school') || rLower.includes('education') || rLower.includes('academic')) {
          resultData = {
            resumeText: "Demo Resume",
            jobRole: finalRole,
            extractedSkills: ['Lesson Planning', 'Communication', 'English Literature'],
            requiredSkills: ['Lesson Planning', 'Classroom Management', 'English Literature', 'Student Assessment', 'Communication'],
            missingSkills: ['Classroom Management', 'Student Assessment'],
            matchPercentage: 60,
            roadmap: [
              {
                step: "Classroom Management and Engagement",
                description: "Learn proactive behavioral techniques, conflict resolution, and strategies to foster student participation.",
                resources: ["Classroom Management Essentials", "Teach Like a Champion Field Guide"]
              },
              {
                step: "Student Assessment & Curriculum Alignment",
                description: "Design formal evaluation metrics and rubrics that map to national learning objectives.",
                resources: ["Educational Testing & Evaluation Methods", "Curriculum Development Frameworks"]
              }
            ]
          };
        }
        // 4. Engineering & Supply Chain Operations
        else if (rLower.includes('mechanical') || rLower.includes('electrical') || rLower.includes('civil') || rLower.includes('chemical') || rLower.includes('industrial') || rLower.includes('supply') || rLower.includes('logistics') || rLower.includes('procure') || rLower.includes('operations')) {
          resultData = {
            resumeText: "Demo Resume",
            jobRole: finalRole,
            extractedSkills: ['Project Management', 'CAD', 'Maintenance'],
            requiredSkills: ['Plant Operations', 'Maintenance', 'CAD', 'Engineering Design', 'Safety Standards'],
            missingSkills: ['Plant Operations', 'Engineering Design', 'Safety Standards'],
            matchPercentage: 60,
            roadmap: [
              {
                step: "Plant Operations & Industrial Controls",
                description: "Master PLC logic, SCADA control networks, and automated manufacturing equipment monitoring.",
                resources: ["Industrial Automation Fundamentals", "Process Control Engineering Guide"]
              },
              {
                step: "Safety Standards & Occupational Health",
                description: "Study factory hazard mitigation procedures, emergency protocols, and regulatory compliance standards.",
                resources: ["OSHA 30-Hour General Industry Certification", "HSE Management Systems and Standards"]
              }
            ]
          };
        }
        // 5. Default CS/Design/Tech Role (Figma, Systems etc)
        else {
          resultData = {
            resumeText: "Demo Resume",
            jobRole: finalRole,
            extractedSkills: ['Figma', 'User Research', 'Wireframing', 'UI Design', 'Prototyping', 'Design Systems'],
            requiredSkills: ['Figma', 'User Research', 'Design Systems', 'AWS Cloud Architecture', 'GraphQL Apollo Server', 'TypeScript'],
            missingSkills: ['AWS Cloud Architecture', 'GraphQL Apollo Server', 'TypeScript'],
            matchPercentage: 66,
            roadmap: [
              {
                step: "Cloud Architecture Integration",
                description: "Learn how to build and host scalable cloud services for design delivery.",
                resources: ["AWS Certified Developer - Associate", "AWS Cloud Practitioner Course"]
              },
              {
                step: "GraphQL & Apollo Clients",
                description: "Build high performance semantic data queries for design graphs.",
                resources: ["Advanced GraphQL with Node.js", "Apollo GraphQL Odyssey"]
              },
              {
                step: "Modern Component Development",
                description: "Bridge the gap between design specs and React engineering using TypeScript.",
                resources: ["TypeScript Deep Dive", "Total TypeScript Roadmap"]
              }
            ]
          };
        }
      } else {
        if (!file) {
          alert("Please upload a resume file.");
          setAnalyzing(false);
          clearInterval(stepInterval);
          return;
        }

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobRole', finalRole);

        const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Backend returns stringified values from Prisma SQLite sometimes, so we parse them if necessary
        const data = response.data;
        resultData = {
          id: data.id,
          resumeText: data.resumeText,
          jobRole: data.jobRole,
          extractedSkills: typeof data.extractedSkills === 'string' ? JSON.parse(data.extractedSkills) : data.extractedSkills,
          requiredSkills: typeof data.requiredSkills === 'string' ? JSON.parse(data.requiredSkills) : data.requiredSkills,
          missingSkills: typeof data.missingSkills === 'string' ? JSON.parse(data.missingSkills) : data.missingSkills,
          matchPercentage: data.matchPercentage,
          roadmap: typeof data.roadmap === 'string' ? JSON.parse(data.roadmap) : data.roadmap,
        };
      }

      clearInterval(stepInterval);
      setProgressStep(3); // Complete
      setAnalysisResult(resultData);
      
      // Delay navigation slightly so they see the completed state
      setTimeout(() => {
        setAnalyzing(false);
        const search = resultData.id ? `?id=${resultData.id}` : '';
        navigate(`/results${search}`);
      }, 500);

    } catch (err: any) {
      console.error(err);
      clearInterval(stepInterval);
      setAnalyzing(false);
      setError(err.response?.data?.error || "Failed to analyze resume. Please verify backend configurations.");
      alert("Error: " + (err.response?.data?.error || "Failed to run analysis. Make sure the backend server is running on port 5000."));
    }
  };

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <div className="max-w-max-width mx-auto px-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
          Analysis Workspace
        </h2>

        {!analyzing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Left Column: Parameter Selection (2 Columns wide) */}
            <div className="lg:col-span-2 flex flex-col gap-lg bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm relative">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                Target Role Selector
              </h3>
              
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
                Select your target career path to calibrate requirements alignment. Start typing to search from 100+ industry-standard job roles.
              </p>

              <div className="flex flex-col gap-md relative">
                <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">
                  Search & Select Role
                </label>
                
                {/* Search Input Container */}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/70">
                    search
                  </span>
                  <input
                    type="text"
                    value={roleQuery}
                    onChange={(e) => {
                      setRoleQuery(e.target.value);
                      setSelectedRoleState(''); // Reset selected role state until they pick or confirm
                      setShowSuggestions(true);
                      setFocusedIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (!showSuggestions) {
                          setShowSuggestions(true);
                          return;
                        }
                        setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setFocusedIndex(prev => Math.max(prev - 1, -1));
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
                          handleSelectRole(suggestions[focusedIndex].name);
                        } else if (roleQuery.trim() !== '') {
                          handleSelectRole(roleQuery.trim());
                        }
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Search for a job role (e.g. Data Scientist, Backend Developer)"
                    className="w-full pl-xl pr-xl py-md bg-surface border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-primary/50 text-body-md transition-colors"
                  />
                  {roleQuery && (
                    <button
                      onClick={() => {
                        setRoleQuery('');
                        setSelectedRoleState('');
                        setShowSuggestions(false);
                        setFocusedIndex(-1);
                      }}
                      className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px] select-none block">cancel</span>
                    </button>
                  )}
                </div>

                {/* Autocomplete suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 top-[80px] bg-surface-container border border-outline-variant/30 rounded-lg shadow-lg max-h-64 overflow-y-auto mt-xs">
                    {suggestions.map((item, idx) => (
                      <button
                        key={item.name}
                        onClick={() => handleSelectRole(item.name)}
                        className={`w-full px-md py-sm text-left flex justify-between items-center transition-colors border-b border-outline-variant/10 text-body-md last:border-b-0 cursor-pointer ${
                          idx === focusedIndex
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        <div>
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-[11px] block text-on-surface-variant/70 mt-xs">
                            {item.category}
                          </span>
                        </div>
                        <span className="font-mono-label text-[10px] text-primary/70 uppercase">
                          Popularity: {item.popularity}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions click-outside handler */}
                {showSuggestions && (
                  <div
                    className="fixed inset-0 z-45 bg-transparent"
                    onClick={() => setShowSuggestions(false)}
                  />
                )}

                {/* Custom Role Helper Banner */}
                {roleQuery.trim() !== '' && !suggestions.some(s => s.name.toLowerCase() === roleQuery.toLowerCase().trim()) && (
                  <div className="p-md bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-md mt-sm">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      No exact match found. Press <strong>Enter</strong> to use this custom role: <strong className="text-primary">"{roleQuery}"</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Trending Roles block */}
              <div className="flex flex-col gap-sm mt-md pt-md border-t border-outline-variant/20">
                <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold">
                  Trending Target Roles
                </span>
                <div className="flex flex-wrap gap-sm">
                  {trendingRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => handleSelectRole(role)}
                      className="font-body-sm text-body-sm px-md py-xs bg-surface border border-outline-variant/30 text-on-surface rounded-full hover:border-primary hover:text-primary transition-all active:scale-95 duration-150 cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches block */}
              {recentSearches.length > 0 && (
                <div className="flex flex-col gap-sm mt-sm">
                  <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold">
                    Recent Target Searches
                  </span>
                  <div className="flex flex-wrap gap-sm">
                    {recentSearches.map(role => (
                      <div key={role} className="flex items-center gap-xs px-md py-xs bg-surface border border-outline-variant/30 text-on-surface rounded-full text-body-sm">
                        <button
                          onClick={() => handleSelectRole(role)}
                          className="hover:text-primary transition-colors text-left cursor-pointer"
                        >
                          {role}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches(prev => {
                              const updated = prev.filter(r => r !== role);
                              localStorage.setItem('recent_role_searches', JSON.stringify(updated));
                              return updated;
                            });
                          }}
                          className="text-on-surface-variant hover:text-red-500 transition-colors flex items-center cursor-pointer"
                          title="Remove search"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: File Status & Action CTA */}
            <div className="lg:col-span-1 flex flex-col gap-lg bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-sm justify-between">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                  Active Document
                </h3>
                
                {file ? (
                  <div className="flex items-center gap-md p-md bg-surface-container-lowest border border-outline-variant/20 rounded-lg">
                    <span className="material-symbols-outlined text-[36px] text-primary">
                      description
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-label-md text-label-md text-on-surface truncate font-bold">
                        {file.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-lg border border-dashed border-outline-variant/50 rounded-lg bg-surface-container-lowest text-center">
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                      No CV file active.
                    </p>
                    <input
                      id="file-input-workspace"
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => document.getElementById("file-input-workspace")?.click()}
                      className="bg-transparent border border-primary text-primary px-md py-sm rounded-lg hover:bg-primary/5 transition-all text-sm font-semibold"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={triggerAnalysis}
                disabled={!file && !isDemo}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg active:scale-95 transition-all flex items-center justify-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/95"
              >
                Analyze Profile
                <span className="material-symbols-outlined text-[18px]">insights</span>
              </button>
            </div>
          </div>
        ) : (
          /* Shimmer progress loading screen */
          <div className="max-w-3xl mx-auto bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-lg mt-xl">
            <div className="flex flex-col items-center justify-center gap-lg py-xl">
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center mb-md" />
              
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Processing Profile Data
              </h3>
              
              <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-[450px]">
                Our AI model is extracting credentials, comparing roles, and formulating resource trajectories.
              </p>

              <div className="w-full flex flex-col gap-lg mt-xl pr-md pl-md">
                {/* Step 1: Document Parsing */}
                <div className="flex items-center gap-md">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    progressStep > 0
                      ? 'bg-green-600 text-white'
                      : progressStep === 0
                        ? 'bg-primary text-on-primary animate-pulse'
                        : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {progressStep > 0 ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      <span className="text-[12px] font-bold">1</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-headline-sm text-[16px] text-on-surface">Document Parsing</h5>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mt-xs">
                      {progressStep === 0 && <div className="h-full w-full shimmer rounded-full" />}
                      {progressStep > 0 && <div className="h-full w-full bg-green-600 rounded-full" />}
                    </div>
                  </div>
                </div>

                {/* Step 2: Skill Isolation */}
                <div className="flex items-center gap-md">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    progressStep > 1
                      ? 'bg-green-600 text-white'
                      : progressStep === 1
                        ? 'bg-primary text-on-primary animate-pulse'
                        : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {progressStep > 1 ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      <span className="text-[12px] font-bold">2</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-headline-sm text-[16px] text-on-surface">Skill Isolation</h5>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mt-xs">
                      {progressStep === 1 && <div className="h-full w-full shimmer rounded-full" />}
                      {progressStep > 1 && <div className="h-full w-full bg-green-600 rounded-full" />}
                    </div>
                  </div>
                </div>

                {/* Step 3: Gap Analysis Generation */}
                <div className="flex items-center gap-md">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    progressStep > 2
                      ? 'bg-green-600 text-white'
                      : progressStep === 2
                        ? 'bg-primary text-on-primary animate-pulse'
                        : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {progressStep > 2 ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      <span className="text-[12px] font-bold">3</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-headline-sm text-[16px] text-on-surface">Gap Analysis Generation</h5>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mt-xs">
                      {progressStep === 2 && <div className="h-full w-full shimmer rounded-full" />}
                      {progressStep > 2 && <div className="h-full w-full bg-green-600 rounded-full" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
