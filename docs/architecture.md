# HireLens Architecture

## ❄️ FROZEN ARCHITECTURE

The following architectural decisions are frozen and must not be changed without explicit approval:

- **Backend**: Express.js + TypeScript
- **Frontend**: Next.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **API**: REST
- **Testing**: Vitest + Supertest
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
- **Job Matcher**: Job matching algorithm (Phase 2)
- **Interview Coach**: Interview practice and feedback (Phase 3)
- **AI Services**: AI-powered functionality (Phase 2+)

## Frontend Architecture

- Component-based architecture using React 18
- Next.js app directory structure
- Protected routes with Clerk authentication
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

- Clerk handles user authentication
- User IDs are passed in requests to verify ownership
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

**Last Updated**: Step 9A
**Status**: FROZEN - Do not change without approval
