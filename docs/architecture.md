# HireLens Architecture

## ❄️ FROZEN ARCHITECTURE

The following architectural decisions are frozen and must not be changed without explicit approval:

- **Backend**: Express.js + TypeScript
- **Frontend**: Next.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk planned/in progress; development MVP uses `userId` ownership validation
- **API**: REST
- **Testing**: Manual Postman testing, TypeScript checks, Prisma validation, and manual frontend testing; automated tests planned later
- **Containerization**: Docker / Docker Compose
- **Deployment Target**: AWS (free-tier compatible)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        HireLens System                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌─────────────────────┐  │
│  │  Frontend (Next) │◄────────────►│  Backend (Express)  │  │
│  │  Port: 3000      │   REST API   │  Port: 3001         │  │
│  │  TypeScript      │   JSON       │  TypeScript         │  │
│  │  React 18        │              │                     │  │
│  │  Tailwind CSS    │              ├─────────────────────┤  │
│  └──────────────────┘              │   API Routes        │  │
│         ▲                          │  - Health           │  │
│         │                          │  - Database Health  │  │
│         │                          │  - CV Operations    │  │
│         │                          │  - Job Matching     │  │
│         │                          │  - Interview Coach  │  │
│         │                          └─────────────────────┘  │
│         │                                   ▲                │
│         │                                   │                │
│    Clerk Auth                         Prisma ORM            │
│  (User Management)                    PostgreSQL            │
│                                    ┌──────────────────┐     │
│                                    │  Database        │     │
│                                    │  (PostgreSQL)    │     │
│                                    │  Port: 5432      │     │
│                                    └──────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

```
Routes
  ↓
Controllers (Request/Response handling)
  ↓
Validators (Input validation)
  ↓
Services (Business logic)
  ↓
Prisma ORM
  ↓
PostgreSQL
```

### Modules

- **Health**: Server health checks
- **Database**: Database connectivity checks
- **CV Analyzer**: CV parsing and candidate profile extraction
- **CV**: CV management, AI analysis, and candidate profile extraction
- **Jobs**: Job management
- **Matching**: AI job matching, persistence, and duplicate protection
- **Interview**: Interview sessions, question generation, answer evaluation, and overall scoring
- **AI**: Centralized Gemini integration with retry and fallback model support

## Frontend Architecture

- Component-based architecture using React 18
- Next.js app directory structure
- Frontend Clerk integration is planned/in progress
- API client for backend communication
- Responsive design with Tailwind CSS

## Data Flow

### CV Creation Flow

```
User ──► Frontend ──► POST /api/cvs ──► Validator
                                           ↓
                                        CVService
                                           ↓
                                        Prisma
                                           ↓
                                      PostgreSQL
                                           ↓
                                    CandidateProfile
```

## Security Architecture

- Clerk is the planned authentication provider and is not yet enforced by backend middleware
- Current MVP routes use `userId` in request bodies or query parameters for development ownership validation
- Production should replace client-provided `userId` validation with server-side Clerk middleware
- Database User model maps to Clerk users via `clerkId`
- CV ownership verified on every operation
- Secrets never exposed to frontend
- CORS enabled for frontend communication

## Deployment Architecture

- Docker Compose for local development
- PostgreSQL 16 Alpine container
- Express backend containerizable
- Next.js frontend containerizable
- AWS deployment ready (free tier)

---

**Last Updated**: Backend MVP
**Status**: FROZEN ARCHITECTURE - Do not change without approval
