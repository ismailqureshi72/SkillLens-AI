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
3. **AI Analysis**: The text is sent to OpenAI GPT-4o with a structured prompt to:
   - Extract existing skills.
   - Define required skills for the chosen role.
   - Calculate a match percentage.
   - Generate a step-by-step roadmap to bridge the gap.
4. **Visualization**: The frontend displays the result using a match-gauge and interactive roadmap cards.

## 🔒 Security & Optimizations
- **File Validation**: Only `.pdf` and `.docx` are accepted.
- **Strict JSON Output**: Using OpenAI's `response_format: { type: 'json_object' }` to ensure stability.
- **Clean Architecture**: Separation of concerns into Controllers, Services, and Routes.
