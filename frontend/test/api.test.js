import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import health from '../api/health.js';
import match from '../api/jobs/match.js';
import trends from '../api/trends/[role].js';
import { parseMultipart } from '../lib/multipart.js';

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}

test('health endpoint returns a healthy JSON response', async () => {
  const res = response();
  await health({ method: 'GET' }, res);
  assert.equal(res.body.status, 'OK');
  assert.ok(Number.isFinite(Date.parse(res.body.timestamp)));
});

test('job matching accepts the frontend payload and rejects invalid input', async () => {
  const res = response();
  await match({ method: 'POST', body: { user_skills: ['Node.js', 'SQL'], target_role: 'Backend Engineer' } }, res);
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.length > 0);
  assert.ok(res.body.every(job => Array.isArray(job.required_skills)));
  const invalid = response();
  await match({ method: 'POST', body: {} }, invalid);
  assert.equal(invalid.statusCode, 400);
});

test('dynamic trends route accepts a role and rejects writes', async () => {
  const res = response();
  await trends({ method: 'GET', query: { role: 'Backend Engineer' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(typeof res.body, 'object');
  const invalid = response();
  await trends({ method: 'POST' }, invalid);
  assert.equal(invalid.statusCode, 405);
});

test('multipart upload preserves binary resume bytes across stream chunks', async () => {
  const file = Buffer.from([0, 255, 13, 10, 128, 65]);
  const body = Buffer.concat([
    Buffer.from('--resume-test\r\nContent-Disposition: form-data; name="jobRole"\r\n\r\nBackend Engineer\r\n--resume-test\r\nContent-Disposition: form-data; name="resume"; filename="resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n'),
    file,
    Buffer.from('\r\n--resume-test--\r\n'),
  ]);
  const req = Readable.from([body.subarray(0, 37), body.subarray(37)]);
  req.headers = { 'content-type': 'multipart/form-data; boundary="resume-test"' };
  const parsed = await parseMultipart(req);
  assert.equal(parsed.fields.jobRole, 'Backend Engineer');
  assert.equal(parsed.file.filename, 'resume.pdf');
  assert.deepEqual(parsed.file.buffer, file);
});

test('all database and AI route modules load with deployment dependencies', async () => {
  process.env.OPENAI_API_KEY ||= 'test-only-placeholder';
  for (const path of ['../api/analyses.js', '../api/support.js', '../api/analyze.js']) {
    assert.equal(typeof (await import(path)).default, 'function');
  }
});
