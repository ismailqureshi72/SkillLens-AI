import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import match from '../api/jobs/match.js';
import trends from '../api/trends/[role].js';
import analyses from '../api/analyses.js';
import { matchJobs } from '../lib/jobs.js';
import { getMarketCategory, getRoleCategory } from '../lib/roles.js';
import { normalizeAnalysis } from '../lib/analysis-result.js';
import { currentOwner, ensureOwner } from '../lib/session.js';
import { splitHighlight } from '../src/utils/text.ts';

function response() {
  return { statusCode: 200, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.statusCode=code; return this; }, json(body) { this.body=body; return this; }, end() { return this; } };
}

test('literal search handles punctuation, repeated matches and R without a regex', () => {
  for (const query of ['(', '[', '+', '*', '\\', '.', 'C++']) assert.doesNotThrow(() => splitHighlight('React (C++) [tools] + more.*\\',query));
  assert.equal(splitHighlight('React REACT React','react').filter(p=>p.matched).length,3);
  assert.equal(splitHighlight('UI (web)','(').filter(p=>p.matched)[0].text,'(');
});

test('specialist fields do not become graphic design, CS or software technicians', () => {
  for (const role of ['Hydrographic Surveyor','Bioacoustics Research Technician','Museum Textile Conservator']) {
    assert.equal(getRoleCategory(role),'Other');
    assert.equal(getMarketCategory(role),null);
    assert.deepEqual(matchJobs(['Python','QGIS'],role),[]);
  }
  assert.equal(getMarketCategory('Frontend Developer'),'Computer Science');
  assert.equal(getMarketCategory('Registered Nurse'),'Healthcare');
});

test('blank skills never match every requirement and non-string entries are rejected', async () => {
  const blank=response();await match({method:'POST',body:{user_skills:['','   ']}},blank);
  assert.equal(blank.statusCode,200);assert.equal(blank.body.length,19);
  assert.ok(blank.body.every(job=>job.matchPercentage===0&&job.isSample===true));
  for(const user_skills of [[42],[null],[{}]]) {
    const res=response();await match({method:'POST',body:{user_skills}},res);assert.equal(res.statusCode,400);
  }
  for(const body of [{user_skills:[],target_role:[]},{user_skills:[],filters:{location:42}},{user_skills:[],filters:'remote'}]) {
    const res=response();await match({method:'POST',body},res);assert.equal(res.statusCode,400);
  }
});

test('whole skill matching preserves positive matches without matching R to React', () => {
  assert.ok(matchJobs(['R'],'Frontend Developer').every(job=>job.matchPercentage===0));
  assert.ok(matchJobs(['Design','Care']).every(job=>job.matchPercentage===0));
  const jobs=matchJobs(['HTML','CSS','JS','React','Git','UI Design'],'Frontend Developer');
  assert.equal(jobs[0].title,'Junior Frontend Developer');assert.equal(jobs[0].matchPercentage,100);
  assert.equal(matchJobs(['React'],'Frontend Developer',{location:'Islamabad',match_level:'75'}).length,0);
});

test('market API supplies references without invented numeric figures or fallback professions', async () => {
  for(const role of ['Frontend Developer','Hydrographic Surveyor','Bioacoustics Research Technician','SKILLLENS imaginary role','%']) {
    const res=response();await trends({method:'GET',query:{role}},res);
    assert.equal(res.statusCode,200);assert.equal(res.body.salaryMedian,null);assert.deepEqual(res.body.marketDemand,[]);
    assert.ok(res.body.trendingTech.every(skill=>skill.growth===null));
    if(role!=='Frontend Developer') { assert.equal(res.body.status,'unavailable');assert.deepEqual(res.body.hiringCompanies,[]); }
  }
  const invalid=response();await trends({method:'GET',query:{role:['a','b']}},invalid);assert.equal(invalid.statusCode,400);
});

test('anonymous history is empty and never caches resume data publicly', async () => {
  const res=response();await analyses({method:'GET',headers:{}},res);
  assert.deepEqual(res.body,[]);assert.match(res.headers['Cache-Control'],/no-store/);
  assert.equal(res.headers.Vary,'Cookie');
});

test('browser ownership stores a hash, uses a protected cookie and isolates another token', async () => {
  let stored;
  const db={user:{findUnique:async({where})=>stored?.email===where.email?{...stored,id:'owner-1'}:null,create:async({data})=>{stored=data;return{id:'owner-1'};}}};
  const res=response();await ensureOwner({headers:{'x-forwarded-proto':'https'}},res,db);
  const cookie=res.headers['Set-Cookie'];
  assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Lax/);assert.match(cookie,/Secure/);
  const token=cookie.split(';')[0].split('=')[1];assert.equal(token.length,64);assert.ok(!JSON.stringify(stored).includes(token));
  assert.equal(await currentOwner({headers:{cookie}},db),'owner-1');
  assert.equal(await currentOwner({headers:{cookie:'skilllens_session='+ 'a'.repeat(64)}},db),null);
  assert.equal(await currentOwner({headers:{cookie:'skilllens_session=invalid'}},db),null);
});

test('AI score and gap assessment are preserved instead of adding a word-match baseline', () => {
  const value={is_resume:true,extracted_skills:['Dry cleaning'],required_skills:['Wet cleaning'],missing_skills:['Wet cleaning'],match_percentage:0,roadmap:[{step:'Learn wet cleaning',description:'Study the missing method.',resources:[]}]};
  const normalized=normalizeAnalysis(value);
  assert.equal(normalized.matchPercentage,0);assert.deepEqual(normalized.missingSkills,['Wet cleaning']);
  assert.throws(()=>normalizeAnalysis({...value,is_resume:false}),error=>error.status===400);
  assert.throws(()=>normalizeAnalysis({...value,match_percentage:null}));
});

test('bad resume inputs return client errors without contacting the AI provider', async () => {
  process.env.OPENAI_API_KEY||='test-only-placeholder';
  const analyze=(await import('../api/analyze.js')).default;
  for(const body of [{jobRole:'',resumeText:'experience skills '.repeat(20)},{jobRole:'Engineer',resumeText:'Inventory memo with no candidate details.'}]) {
    const res=response();await analyze({method:'POST',headers:{'content-type':'application/json'},body},res);assert.equal(res.statusCode,400);
  }
  for(const [filename,status] of [['bad.pdf',400],['bad.txt',415]]) {
    const buffer=Buffer.from('--test\r\nContent-Disposition: form-data; name="jobRole"\r\n\r\nEngineer\r\n--test\r\nContent-Disposition: form-data; name="resume"; filename="'+filename+'"\r\n\r\n%PDF-1.7 invalid\r\n--test--\r\n');
    const req=Readable.from([buffer]);req.method='POST';req.headers={'content-type':'multipart/form-data; boundary=test'};
    const res=response();await analyze(req,res);assert.equal(res.statusCode,status);
  }
});
