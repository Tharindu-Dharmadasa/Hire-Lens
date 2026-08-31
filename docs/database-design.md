# HireLens Database Design

## ❄️ FROZEN DATABASE SCHEMA

The following database schema is frozen. Changes require explicit approval.

## Database Configuration

- **Database System**: PostgreSQL 16
- **ORM**: Prisma 7.9.1
- **Port**: 5432
- **Database Name**: hirelens_db
- **User**: hirelens
- **Password**: hirelens123 (development only)
- **Connection String**: `postgresql://hirelens:hirelens123@localhost:5432/hirelens_db?schema=public`

## Data Models

### User Model

Represents an authenticated user in the system.

```prisma
model User {
  id                String             @id @default(cuid())
  clerkId           String             @unique
  email             String             @unique
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  cvs               CV[]
  interviewSessions InterviewSession[]
  jobMatches        JobMatch[]

  @@index([clerkId])
  @@index([email])
}
```

**Fields**:

- `id`: Unique identifier (CUID)
- `clerkId`: Reference to Clerk user ID (unique)
- `email`: User email (unique)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:

- One User → Many CVs
- One User → Many InterviewSessions
- One User → Many JobMatches

### CV Model

Represents an uploaded CV document.

```prisma
model CV {
  id               String            @id @default(cuid())
  userId           String
  fileName         String
  fileUrl          String?
  rawText          String?
  uploadedAt       DateTime          @default(now())
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  candidateProfile CandidateProfile?

  @@index([userId])
}
```

**Fields**:

- `id`: Unique identifier
- `userId`: Reference to User (foreign key)
- `fileName`: Original file name
- `fileUrl`: URL to stored file (optional)
- `rawText`: Extracted text content
- `uploadedAt`: Upload timestamp
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:

- Many CVs → One User
- One CV → One CandidateProfile (optional)

**Cascade Delete**: Deleting a User deletes all associated CVs

### CandidateProfile Model

Extracted candidate information from a CV.

```prisma
model CandidateProfile {
  id             String   @id @default(cuid())
  cvId           String   @unique
  fullName       String?
  headline       String?
  summary        String?
  skills         Json?
  experience     Json?
  education      Json?
  certifications Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  cv             CV       @relation(fields: [cvId], references: [id], onDelete: Cascade)
}
```

**Fields**:

- `id`: Unique identifier
- `cvId`: Reference to CV (unique, one-to-one)
- `fullName`: Candidate's full name
- `headline`: Professional headline/job title
- `summary`: Professional summary
- `skills`: Array of skills (JSON)
- `experience`: Work experience entries (JSON)
- `education`: Education entries (JSON)
- `certifications`: Certifications (JSON)

**Relationships**:

- One CandidateProfile → One CV

**Cascade Delete**: Deleting a CV deletes the associated CandidateProfile

### Job Model

Job posting information.

```prisma
model Job {
  id           String     @id @default(cuid())
  title        String
  company      String
  location     String?
  description  String?
  requirements Json?
  sourceUrl    String?
  source       String?
  postedAt     DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  jobMatches   JobMatch[]

  @@index([title])
  @@index([company])
  @@index([location])
}
```

**Fields**:

- `id`: Unique identifier
- `title`: Job title
- `company`: Company name
- `location`: Job location (optional)
- `description`: Job description
- `requirements`: Required skills/qualifications (JSON)
- `sourceUrl`: URL to original posting
- `source`: Source of posting (e.g., LinkedIn, Indeed)
- `postedAt`: Date posted

**Relationships**:

- One Job → Many JobMatches

**Indexes**: `title`, `company`, `location`

### JobMatch Model

Represents a match between a User and a Job.

```prisma
model JobMatch {
  id            String   @id @default(cuid())
  userId        String
  jobId         String
  matchScore    Float
  explanation   String?
  matchedSkills Json?
  missingSkills Json?
  createdAt     DateTime @default(now())

  job           Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, jobId])
  @@index([userId])
  @@index([jobId])
  @@index([matchScore])
}
```

**Fields**:

- `id`: Unique identifier
- `userId`: Reference to User
- `jobId`: Reference to Job
- `matchScore`: Match score (0-100)
- `explanation`: Explanation of match
- `matchedSkills`: Skills that match (JSON array)
- `missingSkills`: Skills that don't match (JSON array)
- `createdAt`: Match creation timestamp

**Relationships**:

- Many JobMatches → One User
- Many JobMatches → One Job

**Constraints**:

- Unique pair of (userId, jobId)

**Cascade Delete**: Deleting a User or Job deletes associated JobMatches

### InterviewSession Model

Represents an interview practice session.

```prisma
model InterviewSession {
  id           String              @id @default(cuid())
  userId       String
  jobTitle     String?
  company      String?
  sessionType  String?
  overallScore Float?
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt
  questions    InterviewQuestion[]
  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

**Fields**:

- `id`: Unique identifier
- `userId`: Reference to User
- `jobTitle`: Target job title (optional)
- `company`: Target company (optional)
- `sessionType`: Type of interview (e.g., "behavioral", "technical")
- `overallScore`: Overall session score
- `createdAt`: Session creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:

- Many InterviewSessions → One User
- One InterviewSession → Many InterviewQuestions

**Cascade Delete**: Deleting a User deletes associated InterviewSessions

### InterviewQuestion Model

Represents a question in an interview session.

```prisma
model InterviewQuestion {
  id         String           @id @default(cuid())
  sessionId  String
  question   String
  category   String?
  difficulty String?
  order      Int
  createdAt  DateTime         @default(now())
  answer     InterviewAnswer?
  session    InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@unique([sessionId, order])
  @@index([sessionId])
}
```

**Fields**:

- `id`: Unique identifier
- `sessionId`: Reference to InterviewSession
- `question`: Question text
- `category`: Question category (e.g., "behavior", "technical")
- `difficulty`: Difficulty level (e.g., "easy", "medium", "hard")
- `order`: Order in session (sequential)
- `createdAt`: Creation timestamp

**Relationships**:

- Many InterviewQuestions → One InterviewSession
- One InterviewQuestion → One InterviewAnswer (optional)

**Constraints**:

- Unique pair of (sessionId, order)

**Cascade Delete**: Deleting an InterviewSession deletes associated InterviewQuestions

### InterviewAnswer Model

Represents an answer to an interview question.

```prisma
model InterviewAnswer {
  id         String            @id @default(cuid())
  questionId String            @unique
  answerText String
  score      Float?
  feedback   String?
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt
  question   InterviewQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
}
```

**Fields**:

- `id`: Unique identifier
- `questionId`: Reference to InterviewQuestion (unique, one-to-one)
- `answerText`: Answer text
- `score`: Score for the answer
- `feedback`: Feedback on the answer
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Relationships**:

- One InterviewAnswer → One InterviewQuestion

**Cascade Delete**: Deleting an InterviewQuestion deletes the associated InterviewAnswer

## Database Relationships

```
User
├── CVs (One-to-Many)
│   └── CandidateProfile (One-to-One, optional)
├── JobMatches (One-to-Many)
│   └── Job (Many-to-One)
└── InterviewSessions (One-to-Many)
    └── InterviewQuestions (One-to-Many)
        └── InterviewAnswer (One-to-One, optional)
```

## Indexing Strategy

### Indexes Created

| Model             | Field(s)   | Reason                      |
| ----------------- | ---------- | --------------------------- |
| User              | clerkId    | Fast lookup by Clerk ID     |
| User              | email      | Fast lookup by email        |
| CV                | userId     | Find all CVs for a user     |
| Job               | title      | Search by job title         |
| Job               | company    | Search by company           |
| Job               | location   | Search by location          |
| JobMatch          | userId     | Find matches for a user     |
| JobMatch          | jobId      | Find users matched to a job |
| JobMatch          | matchScore | Sort by relevance           |
| InterviewSession  | userId     | Find sessions for a user    |
| InterviewQuestion | sessionId  | Find questions in a session |

## Cascade Delete Behavior

When a parent record is deleted:

- **User deleted**: All CVs, InterviewSessions, and JobMatches are deleted
- **CV deleted**: Associated CandidateProfile is deleted
- **Job deleted**: Associated JobMatches are deleted
- **InterviewSession deleted**: Associated InterviewQuestions are deleted
- **InterviewQuestion deleted**: Associated InterviewAnswer is deleted

---

**Status**: FROZEN - Do not change without approval
**Last Updated**: Step 9A
