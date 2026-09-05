# HireLens Project Specification

## ❄️ FROZEN SPECIFICATION

This specification is frozen. Do not change without explicit approval.

## Product Identity

**HireLens** is a professional, role-agnostic, AI-powered career intelligence platform.

It is NOT positioned as an internship-level toy project.

## Overview

HireLens helps professionals:

1. Analyze and optimize their CVs
2. Discover job opportunities aligned with their profile
3. Practice interviews with AI feedback
4. Make informed career decisions

## MVP Scope

The minimum viable product contains exactly three major AI capabilities:

### 1. CV Analyzer

- Upload CV (PDF/Text)
- Extract candidate profile (name, skills, experience, education)
- Parse CV content automatically
- Store structured CV data

### 2. Job Matcher

- Match CV against job postings
- Calculate compatibility score
- Identify matching skills
- Highlight skill gaps

### 3. Interview Coach

- Generate practice interview questions
- Evaluate interview answers
- Provide feedback on responses
- Track interview performance

## Core Features

### Authentication

- User registration via Clerk
- Secure login/logout
- User profile management
- Protected application routes

### CV Management

- Upload and store CVs
- Automatic candidate profile extraction
- View CV history
- Delete CVs

### Job Discovery

- Browse job postings
- View job details
- Match jobs against profile
- Save matched jobs

### Interview Practice

- Generate interview questions
- Answer questions and receive feedback
- Track performance over time
- Review past sessions

## Non-MVP Features

The following are explicitly NOT in MVP scope:

- Job scraping automation
- Advanced AI services (paid APIs)
- Mobile app
- Real-time notifications
- Social features
- Advanced analytics
- Payment processing
- Premium tiers

These will be considered in future phases only.

## Technology Stack

| Component        | Technology                      |
| ---------------- | ------------------------------- |
| Backend          | Express.js + TypeScript         |
| Frontend         | Next.js + TypeScript + React 18 |
| Database         | PostgreSQL 16                   |
| ORM              | Prisma 7.9.1                    |
| Authentication   | Clerk                           |
| API Testing      | Postman                         |
| Testing          | Vitest + Supertest              |
| Containerization | Docker / Docker Compose         |
| Deployment       | AWS (free tier)                 |

## Data Models

### Core Models

1. **User** - Authenticated user (Clerk integration)
2. **CV** - Uploaded CV document
3. **CandidateProfile** - Extracted profile from CV
4. **Job** - Job posting
5. **JobMatch** - Match between user and job
6. **InterviewSession** - Interview practice session
7. **InterviewQuestion** - Question in interview
8. **InterviewAnswer** - Answer to interview question

## API Architecture

The backend provides a REST API with the following endpoint structure:

```
GET    /                          - Welcome message
GET    /api/health                - Health check
GET    /api/database              - Database health

POST   /api/cvs                   - Create CV
GET    /api/cvs?userId=...        - List user's CVs
GET    /api/cvs/:id?userId=...    - Get specific CV
DELETE /api/cvs/:id?userId=...    - Delete CV

POST   /api/jobs/match            - Match jobs against profile (Phase 2)
GET    /api/jobs                  - List jobs (Phase 2)

POST   /api/interviews/sessions   - Create interview session (Phase 3)
GET    /api/interviews/sessions   - List sessions (Phase 3)
POST   /api/interviews/answer     - Submit answer (Phase 3)
```

## Authentication Flow

```
1. User visits application
2. Clerk authentication check
3. If not authenticated → Redirect to login
4. Login/Sign up via Clerk
5. Clerk returns user info and tokens
6. Frontend stores authentication state
7. Backend validates via Clerk middleware
8. User ID used for data ownership
```

## Development Phases

### Phase 1 - Foundation (Completed - Step 9A)

- Backend setup
- Database design
- Frontend scaffold
- Health endpoints
- CV Analyzer backend
- Authentication architecture

### Phase 2 - Job Matching (Future)

- Job data model
- Job API endpoints
- Matching algorithm
- Job filtering
- Frontend UI for job discovery

### Phase 3 - Interview Coach (Future)

- Interview session management
- Question generation
- Answer evaluation
- Feedback system
- Frontend practice interface

### Phase 4 - AI Integration (Future)

- Advanced CV analysis
- Intelligent job matching
- Interview coaching feedback
- Free AI service integration

### Phase 5 - Polish & Deployment (Future)

- Performance optimization
- Security hardening
- Production deployment
- Monitoring and logging

## Current Status

**STEP 9A — COMPLETED**

✅ Backend Foundation
✅ Frontend Foundation
✅ Database Architecture
✅ PostgreSQL/Docker
✅ Prisma Setup
✅ Health API
✅ Database Health API
✅ Authentication Foundation
✅ CV Analyzer Backend

⏭️ Next: Job Matcher Backend (Phase 2)

---

**FROZEN**: Do not change specification without explicit approval.
