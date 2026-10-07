# 🚀 HireLens

**AI-Powered Career Intelligence Platform**

HireLens is a professional, role-agnostic AI career intelligence platform that helps candidates analyze their CVs, evaluate job compatibility, and practise interview answers with AI-powered feedback.

The platform is designed to support different professional backgrounds without requiring role-specific database structures.

---

## 📌 Project Status

| Area                       | Status      |
| -------------------------- | ----------- |
| Backend MVP                | Completed   |
| Frontend MVP               | Functional  |
| Database                   | Implemented |
| AI Integration             | Implemented |
| Docker Backend             | Completed   |
| Google Cloud Run Readiness | Prepared    |
| Manual API Testing         | Completed   |

HireLens currently includes three core AI-powered career modules:

- CV Analyzer
- AI Job Matcher
- AI Interview Coach

---

## ✨ Key Features

### CV Analyzer

- Create, list, retrieve, and delete CV records
- Upload and extract text from PDF/DOCX CV files
- Analyze CV content using Gemini AI
- Generate CV quality score
- Identify strengths and weaknesses
- Extract technical and soft skills
- Generate ATS compatibility score
- Provide practical improvement recommendations
- Create structured candidate profiles from CV analysis

### AI Job Matcher

- Create and manage job records
- Compare candidate profiles against job descriptions
- Generate job match score
- Identify matched skills
- Identify missing skills
- Store job matching results
- Prevent duplicate match records for the same user and job
- Support matching against the latest CV or selected CV

### AI Interview Coach

- Create interview sessions
- Generate AI-powered interview questions
- Support technical, behavioral, situational, general, and role-specific sessions
- Submit interview answers
- Evaluate answers using AI
- Generate answer score and feedback
- Calculate overall interview score
- Update existing answers without creating duplicates

### Backend Reliability

- Gemini retry handling
- Fallback model support
- Clean error handling for temporary AI overload
- Ownership validation using `userId`
- Manual Postman API testing

---

## 📸 Screenshots

### Landing Page

![HireLens Landing Page](docs/screenshots/landing-page.png)

### CV Analyzer

![CV Analyzer](docs/screenshots/cv-analyzer.png)

### AI Job Matcher

![AI Job Matcher](docs/screenshots/job-matcher.png)

### AI Interview Coach

![AI Interview Coach](docs/screenshots/interview-coach.png)

---

## 🧠 AI Capabilities

HireLens uses Google Gemini through a centralized backend AI service.

The AI modules generate:

- CV score and CV improvement feedback
- Professional summary and extracted candidate profile
- ATS compatibility score
- Job match score with matched and missing skills
- Interview questions based on role/session type
- Interview answer scores and feedback
- Overall interview session score

---

## 🏗️ Architecture

HireLens follows a modular monolith architecture.

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
   └── Gemini AI
```

The backend is organized by feature modules, with controllers, services, routes, validators, middleware, and shared types separated clearly.

---

## 🛠️ Tech Stack

| Layer            | Technology                                                                        |
| ---------------- | --------------------------------------------------------------------------------- |
| Frontend         | Next.js, React, TypeScript, Mantine UI                                            |
| Backend          | Node.js, Express.js, TypeScript                                                   |
| Database         | PostgreSQL 16                                                                     |
| ORM              | Prisma                                                                            |
| AI               | Google Gemini                                                                     |
| Authentication   | Clerk planned / MVP uses `userId` ownership validation                            |
| API Style        | REST                                                                              |
| API Testing      | Postman                                                                           |
| Containerization | Docker, Docker Compose                                                            |
| Cloud Readiness  | Google Cloud Run, Artifact Registry, Cloud Logging                                |
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
│   ├── Dockerfile
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
├── generated/
├── docs/
├── postman/
├── docker-compose.yml
├── prisma.config.ts
├── .env.example
├── .env.docker.example
└── README.md
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

In a production version, this development mechanism should be replaced with server-side Clerk authentication middleware so the backend derives the user identity from the authenticated session instead of trusting client-provided `userId`.

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
POST   /api/cvs/upload
GET    /api/cvs?userId=<user_id>
GET    /api/cvs/:id?userId=<user_id>
DELETE /api/cvs/:id?userId=<user_id>
POST   /api/cvs/:id/analyze?userId=<user_id>
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
- Dockerized backend runtime testing

### Backend Type Check

```bash
cd backend
npm run type-check
```

### Backend Production Build

```bash
cd backend
npm run build
```

### Manual API Testing

The repository includes a Postman collection:

```text
postman/HireLens.postman_collection.json
```

Recommended manual MVP flow:

1. Set `base_url` and `user_id`.
2. Create or upload a CV and save `cv_id`.
3. Analyze the CV.
4. Create a job and save `job_id`.
5. Match the job and save `match_id`.
6. Create an interview session and save `session_id`.
7. Save the first generated question as `question_id`.
8. Submit an interview answer.
9. Confirm the answer score, feedback, and updated `overallScore`.

Automated backend tests are planned after the MVP flow becomes stable.

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

If Gemini remains unavailable, the backend returns a clean API error response instead of crashing the server.

---

## 🚀 Quick Start

### Prerequisites

Install:

- Node.js 20+
- npm
- Docker
- Docker Compose
- Gemini API key

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
PORT=3001

DATABASE_URL=postgresql://hirelens:hirelens123@localhost:5432/hirelens_db?schema=public

CORS_ORIGIN=http://localhost:3000

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_primary_gemini_model
GEMINI_FALLBACK_MODEL=your_fallback_gemini_model

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Create a frontend `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_DEMO_USER_ID=your_test_user_id
```

Never commit `.env`, `.env.local`, `.env.docker`, or production secrets to Git.

---

### 4. Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
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

### 8. Start Frontend

From `frontend/`:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 🐳 Docker

### Start PostgreSQL

```bash
docker-compose up -d
```

### Build Backend Docker Image

From the repository root:

```bash
docker build -f backend/Dockerfile -t hirelens-backend .
```

### Run Backend Container Locally

If PostgreSQL is running through Docker Compose, use a Docker-specific env file:

```bash
docker run --rm -p 3001:3001 --env-file .env.docker --network hire-lens_default hirelens-backend
```

Replace `hire-lens_default` with your actual Docker network name if different.

### Docker Environment Example

Create `.env.docker` locally using `.env.docker.example`.

The key difference from normal local development is the database host:

```env
DATABASE_URL=postgresql://hirelens:hirelens123@postgres:5432/hirelens_db?schema=public
```

Inside Docker, `postgres` refers to the PostgreSQL service name from `docker-compose.yml`.

---

## ☁️ Google Cloud Run Readiness

The HireLens backend is containerized and prepared for Google Cloud Run deployment.

### Google Cloud Services Prepared

- Cloud Run for containerized backend deployment
- Artifact Registry for storing Docker images
- Cloud Logging for runtime logs
- Secret Manager for production secrets
- Cloud SQL PostgreSQL as a future production database option

### Why Cloud Run Fits This Project

Cloud Run can run the Dockerized Express.js backend as a managed container service. The backend has been prepared to support the `PORT` environment variable required by Cloud Run.

The current MVP uses local Docker PostgreSQL for development. A production GCP deployment can later replace this with Cloud SQL PostgreSQL and store secrets in Secret Manager.

### Current Cloud Readiness Completed

- Backend Dockerfile added
- Production build support added
- Dockerized backend tested locally
- Docker network-based PostgreSQL connectivity tested
- Cloud Run `PORT` support prepared
- GCP deployment flow documented

---

## 📊 Development Database

| Property      | Value                |
| ------------- | -------------------- |
| Database      | PostgreSQL 16        |
| Docker Image  | `postgres:16-alpine` |
| Database Name | `hirelens_db`        |
| Username      | `hirelens`           |
| Password      | `hirelens123`        |
| Local Host    | `localhost`          |
| Docker Host   | `postgres`           |
| Port          | `5432`               |

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

## 👤 Author

**Tharindu Dharmadasa**  
Software Engineering Graduate  
Sri Lanka

---

## 📌 Project Summary

| Area             | Details                                            |
| ---------------- | -------------------------------------------------- |
| Project          | HireLens                                           |
| Architecture     | Modular Monolith                                   |
| Backend          | Express.js + TypeScript                            |
| Frontend         | Next.js + TypeScript                               |
| Database         | PostgreSQL + Prisma                                |
| AI               | Google Gemini                                      |
| Containerization | Docker                                             |
| Cloud Readiness  | Google Cloud Run, Artifact Registry, Cloud Logging |
| API Style        | REST                                               |
| Status           | MVP Complete, Dockerized Backend, Cloud Run Ready  |
