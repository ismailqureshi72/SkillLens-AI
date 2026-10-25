# Skill Gap Analyzer

An AI-powered application that analyzes resumes against target job roles to identify skill gaps and provide a personalized learning roadmap.

## 🚀 Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Lucide React.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: PostgreSQL.
- **AI**: OpenAI GPT-4o.
- **File Parsing**: `pdf-parse` (PDF), `mammoth` (DOCX).

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- OpenAI API Key

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/skillgap_db?schema=public"
   OPENAI_API_KEY="your_openai_api_key"
   JWT_SECRET="your_jwt_secret"
   PORT=5000
   ```
4. Initialize database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## ⚙️ How it Works
1. **Resume Upload**: The user uploads a `.pdf` or `.docx` file.
2. **Text Extraction**: The backend uses `pdf-parse` or `mammoth` to extract raw text.
3. **AI Analysis**: The text is sent to OpenAI GPT-4o (or OpenCode Zen) with a structured prompt to:
   - Extract existing skills.
   - Define required skills for the chosen role.
   - Calculate a match percentage.
   - Generate a step-by-step roadmap to bridge the gap.
4. **Visualization**: The frontend displays the result using a match-gauge and interactive roadmap cards.
5. **Support Tickets**: Users can submit help desk tickets via the interactive Support page. Inquiries are validated and saved directly to the Neon PostgreSQL database under the `SupportTicket` table.

## 🔒 Security & Optimizations
- **File Validation**: Only `.pdf` and `.docx` are accepted.
- **Strict JSON Output**: Using OpenAI's `response_format: { type: 'json_object' }` to ensure stability.
- **Clean Architecture**: Separation of concerns into Controllers, Services, and Routes.

## Vercel deployment

The Vercel project's Root Directory must be `frontend`, with the Vite preset,
build command `npm run build`, and output directory `dist`. The `frontend/api`
functions replace the Railway API. Shared server code lives in `frontend/lib`.
Production browser requests use the same domain, even if an old `VITE_API_URL`
remains in the project settings.

Set these server-only environment variables in Vercel for Production (and
Preview if needed): `DATABASE_URL`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and
`OPENAI_MODEL`. Copy the existing private values from your environment; never
commit `.env` or put these secrets in variables starting with `VITE_`.
The existing Neon database and tables are reused without resetting data.

From `frontend`, run `npm ci`, `npm test`, and `npm run build` before deploying.
After deployment, check `/api/health`, `/api/analyses`, `/api/jobs/match`, and
`/api/trends/Backend%20Engineer`, then test a resume upload. Resume analysis has
a 60-second function duration. Vercel's request size limit also applies to uploads.
