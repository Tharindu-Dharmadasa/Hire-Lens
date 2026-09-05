# 🚀 HireLens

**AI-Powered Career Intelligence Platform**

HireLens is a professional, role-agnostic career intelligence platform designed to help users analyze their CVs, discover relevant job opportunities, evaluate job compatibility, and practice interviews with AI-powered feedback.

## ✨ Features

### MVP Features (Current - Step 9A)

- **CV Analysis** - Upload and analyze your CV
- **Candidate Profile Extraction** - Automatic parsing of skills, experience, and education
- **CV Management** - Store and organize multiple CVs

### Coming Soon (Phase 2-3)

- **Job Matching** - Discover jobs aligned with your profile
- **Interview Coach** - Practice interviews with AI feedback
- **Advanced Analytics** - Track your career progression

## 🏗️ Architecture

### Tech Stack

| Component        | Technology                   |
| ---------------- | ---------------------------- |
| Backend          | Express.js + TypeScript      |
| Frontend         | Next.js + TypeScript + React |
| Database         | PostgreSQL + Prisma          |
| Authentication   | Clerk                        |
| Testing          | Vitest + Supertest           |
| Containerization | Docker & Docker Compose      |

### System Architecture

```
Frontend (Next.js)          Backend (Express)          Database (PostgreSQL)
   Port 3000    ◄────────►    Port 3001      ◄────────►   Port 5432
```

## 📁 Project Structure

```
hire-lens/
├── backend/                # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── database/       # Database connection
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript types
│   │   ├── validators/     # Input validation
│   │   ├── app.ts          # Express app
│   │   ├── server.ts       # Server startup
│   │   └── app.spec.ts     # Tests
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/               # Next.js frontend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── prisma/                 # Database schema
│   ├── schema.prisma
│   └── migrations/
├── docker/                 # Docker configuration
├── docs/                   # Documentation
├── postman/                # API collection
└── docker-compose.yml      # Development environment
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or pnpm

### Local Setup

1. **Start Database**

```bash
docker-compose up -d
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Setup Environment**

```bash
cp ../.env.example ../.env
# Configure environment variables
```

4. **Setup Database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Validate schema
npx prisma validate
```

5. **Start Backend**

```bash
npm run dev
```

Backend runs on `http://localhost:3001`

6. **Install Frontend Dependencies** (in new terminal)

```bash
cd frontend
npm install
```

7. **Start Frontend**

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🧪 Testing

### Run Tests

```bash
cd backend
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📚 API Endpoints

### Health Checks

- `GET /` - Welcome message
- `GET /api/health` - Health status
- `GET /api/database` - Database connectivity

### CV Management

- `POST /api/cvs` - Create CV
- `GET /api/cvs?userId=...` - List user's CVs
- `GET /api/cvs/:id?userId=...` - Get specific CV
- `DELETE /api/cvs/:id?userId=...` - Delete CV

See [API Documentation](docs/api-documentation.md) for details.

## 📖 Documentation

- [Project Specification](docs/project-specification.md) - Frozen MVP scope
- [Architecture](docs/architecture.md) - System design
- [Database Design](docs/database-design.md) - Schema & relationships
- [API Documentation](docs/api-documentation.md) - Endpoint reference
- [Testing](docs/testing.md) - Test strategy
- [Development Status](docs/DEVELOPMENT-STATUS.md) - Current progress

## 🧪 API Testing

### Using Postman

Import `postman/HireLens.postman_collection.json` into Postman

### Using curl

```bash
# Health check
curl http://localhost:3001/api/health

# Create CV
curl -X POST http://localhost:3001/api/cvs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "fileName": "resume.pdf",
    "rawText": "John Doe...",
  }'
```

## 🔐 Environment Variables

Create `.env` file in project root:

```env
NODE_ENV=development
BACKEND_PORT=3001
DATABASE_URL=postgresql://hirelens:hirelens123@localhost:5432/hirelens_db?schema=public
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

## 📦 Docker

### Development

```bash
docker-compose up
```

### Stop

```bash
docker-compose down
```

### Database CLI

```bash
docker-compose exec postgres psql -U hirelens -d hirelens_db
```

## 📊 Database

- **Type**: PostgreSQL 16
- **Container**: postgres:16-alpine
- **Database**: hirelens_db
- **User**: hirelens
- **Password**: hirelens123 (development only)
- **Port**: 5432

## 🔄 Development Workflow

```bash
# Terminal 1 - Database
docker-compose up

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000`

## 📈 Current Status

**Phase**: Step 9A - Complete ✅

### Completed

- ✅ Backend foundation
- ✅ Frontend scaffold
- ✅ Database design & setup
- ✅ Health check endpoints
- ✅ CV Analyzer backend
- ✅ Testing framework

### Next Phase: Job Matching (Phase 2)

- Job data model
- Matching algorithm
- Job search endpoints

See [Development Status](docs/DEVELOPMENT-STATUS.md) for details.

## 🤝 Contributing

This project follows strict architecture guidelines. See [Project Specification](docs/project-specification.md) for frozen requirements.

## 📝 License

MIT

---

**Last Updated**: Step 9A
**Status**: Development Phase 1 Complete
