# HireLens Testing Guide

This document explains the current testing approach for the HireLens MVP.

## Current Testing Strategy

At the current MVP stage, HireLens is tested manually using:

- Postman
- TypeScript type-checking
- Prisma validation
- Manual frontend testing

Automated tests are planned after the MVP flow becomes stable.

Reason:

The project is still under active feature development. Manual testing is faster for validating API behavior during early MVP development. Automated tests will be added once the backend and frontend flow are stable.

---

# Backend Type Checking

Run from the backend folder:

```bash
cd backend
npm run type-check
```

Expected result:

```text
tsc --noEmit
```

No TypeScript errors should appear.

---

# Backend Server Test

Run:

```bash
cd backend
npm run dev
```

Expected result:

```text
HireLens API running on port 3001
```

Then test:

```text
GET http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "HireLens API"
}
```

---

# Database Test

Test:

```text
GET http://localhost:3001/api/database
```

Expected response:

```json
{
  "status": "ok",
  "message": "Database connection successful"
}
```

---

# CV API Manual Tests

## 1. Create CV

```text
POST /api/cvs
```

Request body:

```json
{
  "userId": "USER_ID",
  "fileName": "Test_CV.pdf",
  "rawText": "Software engineer with experience in Java, React, Next.js, Node.js, PostgreSQL and Prisma."
}
```

Expected:

- Status `201`
- CV record created
- Response contains CV `id`

Save:

```text
cv_id = data.id
```

---

## 2. List CVs

```text
GET /api/cvs?userId=USER_ID
```

Expected:

- Status `200`
- Array of CVs
- Created CV appears in response

---

## 3. Get CV

```text
GET /api/cvs/CV_ID?userId=USER_ID
```

Expected:

- Status `200`
- Single CV returned
- Correct ownership validation

---

## 4. Analyze CV

```text
POST /api/cvs/CV_ID/analyze?userId=USER_ID
```

Expected:

- Status `200`
- AI analysis returned
- Candidate profile created or updated

Response should include:

- score
- summary
- strengths
- weaknesses
- skills
- ATS compatibility
- recommendations
- candidate profile

---

# Job API Manual Tests

## 1. Create Job

```text
POST /api/jobs
```

Request body:

```json
{
  "userId": "USER_ID",
  "title": "Full-Stack Software Engineer Intern",
  "company": "Tech Startup",
  "location": "Colombo, Sri Lanka",
  "description": "We are looking for an intern with React, Node.js, SQL, REST API and Git knowledge.",
  "requirements": {
    "skills": ["React", "Node.js", "SQL", "REST API", "Git"]
  },
  "source": "Manual Test"
}
```

Expected:

- Status `201`
- Job created
- Response contains job `id`

Save:

```text
job_id = data.id
```

---

## 2. List Jobs

```text
GET /api/jobs?userId=USER_ID
```

Expected:

- Status `200`
- Array of jobs returned

---

## 3. Get Job

```text
GET /api/jobs/JOB_ID?userId=USER_ID
```

Expected:

- Status `200`
- Single job returned

---

## 4. Delete Job

```text
DELETE /api/jobs/JOB_ID?userId=USER_ID
```

Expected:

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "message": "Job deleted successfully"
  }
}
```

---

# Job Matching Manual Tests

Before testing job matching, make sure:

- User exists
- CV exists
- CV has been analyzed
- CandidateProfile exists
- Job exists

## 1. Match Job

```text
POST /api/jobs/JOB_ID/match?userId=USER_ID
```

Optional body:

```json
{
  "cvId": "CV_ID"
}
```

Expected:

- Status `200`
- Match result created
- Response includes match score
- Response includes matched skills
- Response includes missing skills
- Response includes explanation

---

## 2. Duplicate Match Protection

Send the same request again:

```text
POST /api/jobs/JOB_ID/match?userId=USER_ID
```

Expected:

- Existing match is updated
- Duplicate record is not created
- This is enforced by the unique database constraint on `userId + jobId`

---

## 3. List Matches

```text
GET /api/matches?userId=USER_ID
```

Expected:

- Status `200`
- User's matches returned
- Related job included

---

## 4. Get Match

```text
GET /api/matches/MATCH_ID?userId=USER_ID
```

Expected:

- Status `200`
- Single match returned
- Match belongs to the requested user

---

## 5. Delete Match

```text
DELETE /api/matches/MATCH_ID?userId=USER_ID
```

Expected:

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "message": "Job match deleted successfully"
  }
}
```

---

# Interview Coach Manual Tests

## 1. Create Interview Session

```text
POST /api/interviews
```

Request body:

```json
{
  "userId": "USER_ID",
  "jobTitle": "Full-Stack Software Engineer Intern",
  "company": "Tech Startup",
  "sessionType": "technical",
  "questionCount": 5
}
```

Expected:

- Status `201`
- Interview session created
- AI-generated questions saved
- `overallScore` is `null`
- Questions contain:
  - question
  - category
  - difficulty
  - order

Save:

```text
session_id = data.id
question_id = data.questions[0].id
```

---

## 2. List Interview Sessions

```text
GET /api/interviews?userId=USER_ID
```

Expected:

- Status `200`
- User's interview sessions returned
- Questions and answers included

---

## 3. Get Interview Session

```text
GET /api/interviews/SESSION_ID?userId=USER_ID
```

Expected:

- Status `200`
- Correct session returned
- Questions included
- Answers included if submitted

---

## 4. Submit Interview Answer

```text
POST /api/interviews/SESSION_ID/questions/QUESTION_ID/answer?userId=USER_ID
```

Request body:

```json
{
  "answerText": "I built a full-stack application using Next.js, Node.js, Prisma and PostgreSQL. I started by designing the database, then implemented backend APIs, tested them with Postman, and connected them to the frontend."
}
```

Expected:

- Status `200`
- Answer saved
- AI score returned
- AI feedback returned
- Session `overallScore` updated

---

## 5. Update Same Answer

Send another answer to the same question.

Expected:

- Existing answer is updated
- Duplicate answer is not created
- This is enforced by the unique `questionId` field on `InterviewAnswer`

---

## 6. Missing userId Error

```text
GET /api/interviews
```

Expected:

```json
{
  "status": "error",
  "message": "userId query parameter is required"
}
```

---

## 7. Delete Interview Session

```text
DELETE /api/interviews/SESSION_ID?userId=USER_ID
```

Expected:

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "message": "Interview session deleted successfully"
  }
}
```

Because Prisma cascade delete is configured:

```text
InterviewSession
  ↓
InterviewQuestion
  ↓
InterviewAnswer
```

Related questions and answers should be deleted automatically.

---

# AI Reliability Tests

Gemini may sometimes return temporary overload or unavailable errors.

The backend now handles retryable AI errors such as:

- `429 RESOURCE_EXHAUSTED`
- `503 UNAVAILABLE`
- high-demand errors
- temporary model unavailable errors

Expected backend behavior:

1. Retry the request using exponential backoff
2. Try the fallback model
3. If still unavailable, return a clean API error

Expected final error response:

```json
{
  "status": "error",
  "message": "AI service is temporarily unavailable. Please try again later."
}
```

The backend should not crash.

---

# Ownership Validation Tests

For endpoints that require `userId`, test with a different user's ID.

Expected:

- User cannot access another user's CV
- User cannot access another user's job match
- User cannot access another user's interview session
- Invalid ownership returns `404`

---

# Final MVP Manual Test Flow

Use this full flow before recording screenshots or demo video:

```text
1. Start PostgreSQL
2. Start backend
3. Check /api/health
4. Check /api/database
5. Create CV
6. Analyze CV
7. Create Job
8. Match Job
9. Create Interview Session
10. Submit Interview Answer
11. Confirm scores and feedback
12. Start frontend
13. Test frontend pages
```

## Postman Setup and Flow

Before running the collection, set these variables:

- `base_url` to `http://localhost:3001`
- `user_id` to a development test user ID

Run the requests in this order and save each returned identifier:

1. Create CV and save `cv_id`.
2. Analyze CV.
3. Create Job and save `job_id`.
4. Match Job and save `match_id`.
5. Create Interview Session and save `session_id`.
6. Save the first generated question ID as `question_id`.
7. Submit an Interview Answer.
8. Confirm the answer score and feedback.
9. Confirm that `overallScore` is updated on the interview session.

---

# Current Testing Decision

Automated tests are intentionally postponed until after the MVP frontend is connected and the final API shape is stable.

Recommended future automated tests:

- CV service tests
- Job service tests
- Matching service tests
- Interview service tests
- API integration tests
- Ownership validation tests
- AI service mock tests
