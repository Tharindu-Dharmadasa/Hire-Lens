# 🚀 HireLens

**AI-Powered Career Intelligence Platform**

HireLens is a professional, role-agnostic AI career intelligence platform that helps candidates analyze their CVs, evaluate job compatibility, and practise interview answers with AI-powered feedback.

The platform is designed to support different professional backgrounds without requiring role-specific database structures.

---

## 📌 Project Status

**Backend MVP:** Completed  
**Frontend:** In progress  
**Database:** Implemented  
**AI Integration:** Implemented  
**Manual API Testing:** Completed

HireLens currently includes three core AI-powered career modules:

- CV Analyzer
- AI Job Matcher
- AI Interview Coach

---

## ✨ Key Features

### ✅ Implemented

#### CV Analyzer

- Create, list, retrieve, and delete CV records
- Analyze CV content using Gemini AI
- Generate CV quality score
- Identify strengths and weaknesses
- Extract technical and soft skills
- Generate ATS compatibility score
- Provide practical improvement recommendations
- Create structured candidate profiles from CV analysis

#### Job Management

- Create job records
- List available jobs
- Retrieve individual job details
- Delete job records
- Store flexible job requirements using JSON

#### AI Job Matcher

- Compare candidate profiles against job descriptions
- Generate job match score
- Identify matched skills
- Identify missing skills
- Store job matching results
- Prevent duplicate match records for the same user and job
- Support matching against the latest CV or a selected CV

#### AI Interview Coach

- Create interview sessions
- Generate AI-powered interview questions
- Support technical, behavioral, situational, general, and role-specific sessions
- Submit interview answers
- Evaluate answers using AI
- Generate answer score and feedback
- Calculate overall interview score
- Update existing answers without creating duplicates

#### Backend Reliability

- Gemini retry handling
- Fallback model support
- Clean error handling for temporary AI overload
- Ownership validation using `userId`
- Manual Postman API testing

---

## 🧠 AI Capabilities

HireLens uses Google Gemini through a centralized backend AI service.

### CV Analysis Output

The CV Analyzer produces:

- Overall CV score
- Professional summary
- Strengths
- Weaknesses
- Technical skills
- Soft skills
- Experience analysis
- Education analysis
- ATS compatibility score
- Recommendations

### Job Matching Output

The Job Matcher produces:

- Match score
- Explanation
- Matched skills
- Missing skills

### Interview Coach Output

The Interview Coach produces:

- Interview questions
- Question category
- Question difficulty
- Answer score
- AI feedback
- Overall session score

---

## 🏗️ Architecture

HireLens follows a **modular monolith architecture**.

```text
Frontend
Next.js + TypeScript
Port 3000
        │
        │ REST API
        ▼
Backend
Express.js + TypeScript
Port 3001
        │
        ├── PostgreSQL + Prisma
        │
        └── Gemini AI
```

The backend is organized by feature modules, with controllers, services, routes, validators, middleware, and shared types separated clearly.

---

## 🛠️ Tech Stack

| Layer            | Technology                                                                        |
| ---------------- | --------------------------------------------------------------------------------- |
| Frontend         | Next.js, React, TypeScript, Tailwind CSS                                          |
| Backend          | Node.js, Express.js, TypeScript                                                   |
| Database         | PostgreSQL 16                                                                     |
| ORM              | Prisma                                                                            |
| AI               | Google Gemini                                                                     |
| Authentication   | Clerk                                                                             |
| API Style        | REST                                                                              |
| API Testing      | Postman                                                                           |
| Containerization | Docker, Docker Compose                                                            |
| Testing          | TypeScript checks, Prisma validation, manual API testing, manual frontend testing |

---

## 📁 Project Structure

```text
hire-lens/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   ├── cv/
│   │   │   ├── jobs/
│   │   │   ├── matching/
│   │   │   └── interview/
│   │   ├── types/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── docs/
├── postman/
├── docker/
├── docker-compose.yml
├── prisma.config.ts
└── .env.example
```

---

## 🗄️ Database Design

HireLens uses eight core database models:

```text
User
 ├── CV
 │    └── CandidateProfile
 │
 ├── JobMatch
 │    └── Job
 │
 └── InterviewSession
      └── InterviewQuestion
           └── InterviewAnswer
```

### Core Models

1. User
2. CV
3. CandidateProfile
4. Job
5. JobMatch
6. InterviewSession
7. InterviewQuestion
8. InterviewAnswer

The database design intentionally avoids creating separate tables for every AI-generated concept. Flexible AI-generated information is stored using structured JSON where appropriate.

---

## 🔐 Authentication and Ownership

HireLens uses Clerk as the planned authentication provider.

During the current MVP development stage, backend ownership is validated using `userId` supplied through request bodies or query parameters.

Example:

```text
GET /api/jobs?userId=<user_id>
```

The backend validates ownership before accessing user-specific resources.

In the production version, this development mechanism should be replaced with server-side Clerk authentication middleware so the backend derives the user identity from the authenticated session instead of trusting client-provided `userId`.

---

## 📚 API Overview

Base URL:

```text
http://localhost:3001
```

API prefix:

```text
/api
```

### Health and Database

```text
GET /api/health
GET /api/database
```

### CV Management

```text
POST   /api/cvs
GET    /api/cvs?userId=<user_id>
GET    /api/cvs/:id?userId=<user_id>
DELETE /api/cvs/:id?userId=<user_id>
POST   /api/cvs/:id/analyze
```

### Job Management

```text
POST   /api/jobs
GET    /api/jobs?userId=<user_id>
GET    /api/jobs/:id?userId=<user_id>
DELETE /api/jobs/:id?userId=<user_id>
```

### Job Matching

```text
POST   /api/jobs/:id/match?userId=<user_id>
GET    /api/matches?userId=<user_id>
GET    /api/matches/:id?userId=<user_id>
DELETE /api/matches/:id?userId=<user_id>
```

### Interview Coach

```text
POST   /api/interviews
GET    /api/interviews?userId=<user_id>
GET    /api/interviews/:id?userId=<user_id>
POST   /api/interviews/:id/questions/:questionId/answer?userId=<user_id>
DELETE /api/interviews/:id?userId=<user_id>
```

For full request and response examples, see:

```text
docs/api-documentation.md
```

---

## 🧪 Testing

Current MVP testing approach:

- Manual Postman API testing
- TypeScript type-checking
- Prisma schema validation
- Manual frontend testing

Automated tests are planned after the frontend MVP flow is completed and the API shape becomes stable.

### Type Check Backend

```bash
cd backend
npm run type-check
```

### Manual API Testing

The repository includes a Postman collection:

```text
postman/HireLens.postman_collection.json
```

Postman variables:

```text
base_url
user_id
cv_id
job_id
match_id
session_id
question_id
```

Run the manual MVP flow in this order:

1. Set `base_url` and `user_id`.
2. Create a CV and save `cv_id`.
3. Analyze the CV.
4. Create a job and save `job_id`.
5. Match the job and save `match_id`.
6. Create an interview session and save `session_id`.
7. Save the first generated question as `question_id`.
8. Submit an interview answer.
9. Confirm the answer score, feedback, and updated `overallScore`.

Automated backend tests are planned after the MVP frontend flow stabilizes.

---

## 🤖 AI Reliability Handling

Gemini may occasionally return temporary overload or rate-limit errors.

HireLens handles retryable AI errors such as:

- `429 RESOURCE_EXHAUSTED`
- `503 UNAVAILABLE`
- temporary high-demand errors
- temporary model unavailable errors

The backend uses:

- Retry handling
- Exponential backoff
- Fallback model support
- Clean API error responses

If Gemini remains unavailable, the backend returns:

```json
{
  "status": "error",
  "message": "AI service is temporarily unavailable. Please try again later."
}
```

The server should not crash because of temporary AI service failures.

---

## 🚀 Quick Start

### Prerequisites

Install:

- Node.js 18+
- npm
- Docker
- Docker Compose
- Gemini API key
- Clerk keys for planned/in-progress authentication integration

---

### 1. Clone Repository

```bash
git clone <repository-url>
cd hire-lens
```

---

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

Check running containers:

```bash
docker-compose ps
```

---

### 3. Configure Environment Variables

Create a root `.env` file:

```env
NODE_ENV=development
BACKEND_PORT=3001

DATABASE_URL=postgresql://hirelens:hirelens123@localhost:5432/hirelens_db?schema=public

CORS_ORIGIN=http://localhost:3000

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_primary_gemini_model
GEMINI_FALLBACK_MODEL=your_fallback_gemini_model

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Create a frontend `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_DEMO_USER_ID=your_test_user_id
```

Never commit `.env` or production secrets to Git.

---

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 5. Generate Prisma Client

From the repository root:

```bash
npx prisma generate
```

---

### 6. Validate Database Schema

```bash
npx prisma validate
```

Check migration status:

```bash
npx prisma migrate status
```

The database should report that the schema is up to date.

Do not use `prisma migrate reset` on an existing development database unless you intentionally want to delete all development data.

---

### 7. Start Backend

From `backend/`:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

---

### 8. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

### 9. Start Frontend

```bash
npm run dev
```

For frontend TypeScript validation, run from `frontend/`:

```bash
npm run type-check
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 🐳 Docker

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Containers

```bash
docker-compose ps
```

### PostgreSQL CLI

```bash
docker-compose exec postgres psql -U hirelens -d hirelens_db
```

---

## 📊 Development Database

| Property      | Value                |
| ------------- | -------------------- |
| Database      | PostgreSQL 16        |
| Docker Image  | `postgres:16-alpine` |
| Database Name | `hirelens_db`        |
| Username      | `hirelens`           |
| Password      | `hirelens123`        |
| Port          | `5432`               |
| Host          | `localhost`          |

These credentials are for local development only.

---

## 🔄 Development Workflow

Recommended local development setup:

```text
Terminal 1
──────────
docker-compose up -d

Terminal 2
──────────
cd backend
npm run dev

Terminal 3
──────────
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 📈 Current Development Status

### Completed

- ✅ Project architecture
- ✅ Backend foundation
- ✅ PostgreSQL setup
- ✅ Prisma schema
- ✅ Database migrations
- ✅ Health endpoints
- ✅ Database connectivity endpoint
- ✅ CV management
- ✅ AI CV analysis
- ✅ Candidate profile extraction
- ✅ Job management
- ✅ AI job matching
- ✅ Job match persistence
- ✅ Duplicate job match protection
- ✅ Interview session management
- ✅ AI interview question generation
- ✅ AI interview answer evaluation
- ✅ Interview overall score calculation
- ✅ Gemini retry and fallback handling
- ✅ Manual Postman API testing

### In Progress

- ⏳ Frontend integration
- ⏳ UI polish
- ⏳ Clerk backend authentication enforcement; current MVP uses `userId` for development ownership validation
- ⏳ Portfolio screenshots

### Planned

- 📌 Automated backend tests
- 📌 Production deployment
- 📌 Real CV file upload support
- 📌 External job source integrations
- 📌 Advanced career analytics

---

## 🧭 Roadmap

```text
Project Foundation
        ↓
Database Design
        ↓
CV Management
        ↓
AI CV Analyzer
        ↓
Job Management
        ↓
AI Job Matcher
        ↓
AI Interview Coach
        ↓
Frontend Integration
        ↓
UI Polish
        ↓
Testing & Hardening
        ↓
Deployment
```

---

## 📖 Documentation

| Document                        | Description                       |
| ------------------------------- | --------------------------------- |
| `docs/project-specification.md` | Frozen project requirements       |
| `docs/architecture.md`          | System architecture               |
| `docs/database-design.md`       | Database schema and relationships |
| `docs/api-documentation.md`     | REST API reference                |
| `docs/testing.md`               | Testing strategy                  |
| `docs/DEVELOPMENT-STATUS.md`    | Development progress              |

---

## 🤝 Contributing

HireLens follows a defined architecture and frozen MVP specification.

Before making architectural or database changes:

1. Review the project specification.
2. Review the architecture documentation.
3. Review the database design.
4. Document approved architectural changes.
5. Update affected implementation and documentation.

Do not silently change the frozen architecture or database design.

---

## 📝 License

MIT

---

## 👤 Author

**Tharindu Dharmadasa**  
Software Engineering Graduate  
Sri Lanka

---

## 📌 Project Summary

| Area         | Details                                    |
| ------------ | ------------------------------------------ |
| Project      | HireLens                                   |
| Architecture | Modular Monolith                           |
| Backend      | Express.js + TypeScript                    |
| Frontend     | Next.js + TypeScript                       |
| Database     | PostgreSQL + Prisma                        |
| AI           | Google Gemini                              |
| API Style    | REST                                       |
| Status       | Backend MVP Complete, Frontend In Progress |
