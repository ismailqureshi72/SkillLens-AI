# Resume privacy and catalogue corrections

The deployed API lives in `frontend/api`. Use Node.js 24 and run `npm test`, `npm run lint` and `npm run build` from this directory before releasing.

- Job search treats punctuation as literal text. Skills are validated and blank strings cannot count as matches. Whole-word role categories leave unsupported specialist professions unmatched.
- The job catalogue contains sample profiles, not verified vacancies. Employer links lead to careers pages. Market reference skills are returned by one API; salary, growth and demand figures remain unavailable until a verified, dated data source is connected.
- New analyses belong to an anonymous browser session using a random 256-bit HttpOnly, SameSite cookie. Only a hash of the token is stored in an anonymous User record; each Analysis uses its owner's existing userId relationship. No schema migration is needed. History is filtered on the server and sent with private/no-store headers. Legacy unowned analyses remain in Neon and are not publicly listed.
- Clearing cookies, cookie expiry or using another browser removes access to that session's history. Copied report links are private links, not public shares. Resume text is not written to browser storage.
- Analysis scores and gaps use the model's semantic assessment instead of a shared-word baseline. Upload and provider errors return friendly responses. The UI accepts PDF/DOCX uploads up to 4 MB.
- Error screens have an explicit responsive width and inline SVG icons. The native cursor remains available. Market selections and job filters survive navigation/reload through URL parameters; private active analyses reload through the owner-filtered API.

Regression cases cover punctuation, empty/invalid skills, three specialist professions, positive frontend matching, unavailable market figures, anonymous history isolation, cookie hashing and bad documents. Browser verification additionally covers mobile layouts, filters, navigation and an intentionally triggered local error boundary.
