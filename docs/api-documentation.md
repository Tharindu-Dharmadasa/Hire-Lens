# HireLens API Documentation

Base URL:

```text
http://localhost:3001
```

API prefix:

```text
/api
```

Development authentication note:

During MVP development, APIs use `userId` in the request body or query parameters to validate ownership. In production, this should be replaced with Clerk authentication middleware.

---

# Root

## GET `/`

Returns basic API information.

### Response

```json
{
  "status": "ok",
  "service": "HireLens API",
  "message": "Welcome to HireLens API. Use GET /api/health for health status."
}
```

---

# Health API

## GET `/api/health`

Checks whether the backend is running.

### Response

```json
{
  "status": "ok",
  "service": "HireLens API"
}
```

---

# Database API

## GET `/api/database`

Checks database connectivity.

### Response

```json
{
  "status": "ok",
  "message": "Database connection successful"
}
```

---

# CV API

## POST `/api/cvs`

Creates a CV record.

### Request Body

```json
{
  "userId": "USER_ID",
  "fileName": "Tharindu_Dharmadasa_CV.pdf",
  "rawText": "CV text content here",
  "fileUrl": "optional-file-url"
}
```

### Response

```json
{
  "status": "ok",
  "data": {
    "id": "CV_ID",
    "userId": "USER_ID",
    "fileName": "Tharindu_Dharmadasa_CV.pdf",
    "rawText": "CV text content here",
    "fileUrl": "optional-file-url"
  }
}
```

---

## GET `/api/cvs?userId=USER_ID`

Lists CVs for a user.

### Response

```json
{
  "status": "ok",
  "data": [
    {
      "id": "CV_ID",
      "userId": "USER_ID",
      "fileName": "Tharindu_Dharmadasa_CV.pdf"
    }
  ]
}
```

---

## GET `/api/cvs/:id?userId=USER_ID`

Gets a single CV owned by the user.

### Response

```json
{
  "status": "ok",
  "data": {
    "id": "CV_ID",
    "userId": "USER_ID",
    "fileName": "Tharindu_Dharmadasa_CV.pdf",
    "candidateProfile": {}
  }
}
```

---

## DELETE `/api/cvs/:id?userId=USER_ID`

Deletes a CV owned by the user.

### Response

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "message": "CV deleted successfully"
  }
}
```

---

## POST `/api/cvs/:id/analyze?userId=USER_ID`

Analyzes a CV using AI and creates/updates the candidate profile.

### Response

```json
{
  "status": "ok",
  "message": "CV analyzed successfully",
  "data": {
    "analysis": {
      "score": 80,
      "summary": "Professional CV summary",
      "strengths": [],
      "weaknesses": [],
      "skills": {
        "technical": [],
        "soft": []
      },
      "experienceAnalysis": "Experience analysis",
      "educationAnalysis": "Education analysis",
      "atsCompatibility": 75,
      "recommendations": []
    },
    "candidateProfile": {
      "id": "PROFILE_ID",
      "cvId": "CV_ID"
    }
  }
}
```

---

# AI Reliability

Gemini can return temporary overload or service-unavailable errors. The backend handles retryable errors such as `429 RESOURCE_EXHAUSTED` and `503 UNAVAILABLE` using exponential backoff, then attempts the configured fallback model.

If Gemini remains unavailable, the backend returns:

```json
{
  "status": "error",
  "message": "AI service is temporarily unavailable. Please try again later."
}
```

Temporary Gemini overload must not crash the server.

---

# Job API

## POST `/api/jobs`

Creates a job.

### Request Body

```json
{
  "userId": "USER_ID",
  "title": "Full-Stack Software Engineer Intern",
  "company": "Tech Startup",
  "location": "Colombo, Sri Lanka",
  "description": "Job description here",
  "requirements": {
    "skills": ["React", "Node.js", "PostgreSQL"]
  },
  "sourceUrl": "https://example.com/job",
  "source": "LinkedIn"
}
```

### Response

```json
{
  "status": "ok",
  "data": {
    "id": "JOB_ID",
    "title": "Full-Stack Software Engineer Intern",
    "company": "Tech Startup"
  }
}
```

---

## GET `/api/jobs?userId=USER_ID`

Lists jobs with the user's match data when available.

### Response

```json
{
  "status": "ok",
  "data": [
    {
      "id": "JOB_ID",
      "title": "Full-Stack Software Engineer Intern",
      "company": "Tech Startup",
      "jobMatches": []
    }
  ]
}
```

---

## GET `/api/jobs/:id?userId=USER_ID`

Gets a single job.

### Response

```json
{
  "status": "ok",
  "data": {
    "id": "JOB_ID",
    "title": "Full-Stack Software Engineer Intern",
    "company": "Tech Startup",
    "jobMatches": []
  }
}
```

---

## DELETE `/api/jobs/:id?userId=USER_ID`

Deletes a job.

### Response

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

# Job Matching API

## POST `/api/jobs/:id/match?userId=USER_ID`

Matches a job against the user's latest CV candidate profile, or against a specific CV if `cvId` is provided.

### Optional Request Body

```json
{
  "cvId": "CV_ID"
}
```

### Response

```json
{
  "status": "ok",
  "message": "Job matched successfully",
  "data": {
    "match": {
      "id": "MATCH_ID",
      "userId": "USER_ID",
      "jobId": "JOB_ID",
      "matchScore": 82,
      "explanation": "The candidate matches several required skills.",
      "matchedSkills": ["React", "Node.js"],
      "missingSkills": ["AWS"]
    },
    "job": {
      "id": "JOB_ID",
      "title": "Full-Stack Software Engineer Intern"
    },
    "cv": {
      "id": "CV_ID",
      "fileName": "Tharindu_Dharmadasa_CV.pdf"
    },
    "candidateProfile": {}
  }
}
```

---

## GET `/api/matches?userId=USER_ID`

Lists job matches for the user.

### Response

```json
{
  "status": "ok",
  "data": [
    {
      "id": "MATCH_ID",
      "userId": "USER_ID",
      "jobId": "JOB_ID",
      "matchScore": 82,
      "job": {}
    }
  ]
}
```

---

## GET `/api/matches/:id?userId=USER_ID`

Gets a single job match owned by the user.

### Response

```json
{
  "status": "ok",
  "data": {
    "id": "MATCH_ID",
    "matchScore": 82,
    "job": {}
  }
}
```

---

## DELETE `/api/matches/:id?userId=USER_ID`

Deletes a job match owned by the user.

### Response

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

# Interview Coach API

## POST `/api/interviews`

Creates an interview session and generates interview questions using AI.

### Request Body

```json
{
  "userId": "USER_ID",
  "jobTitle": "Full-Stack Software Engineer Intern",
  "company": "Tech Startup",
  "sessionType": "technical",
  "questionCount": 5
}
```

Optional fields:

```json
{
  "candidateProfile": {}
}
```

### Response

```json
{
  "status": "ok",
  "message": "Interview session created successfully",
  "data": {
    "id": "SESSION_ID",
    "userId": "USER_ID",
    "jobTitle": "Full-Stack Software Engineer Intern",
    "company": "Tech Startup",
    "sessionType": "technical",
    "overallScore": null,
    "questions": [
      {
        "id": "QUESTION_ID",
        "sessionId": "SESSION_ID",
        "question": "Tell me about a full-stack project you built.",
        "category": "technical",
        "difficulty": "medium",
        "order": 1,
        "answer": null
      }
    ]
  }
}
```

---

## GET `/api/interviews?userId=USER_ID`

Lists interview sessions for the user.

### Response

```json
{
  "status": "ok",
  "data": [
    {
      "id": "SESSION_ID",
      "userId": "USER_ID",
      "jobTitle": "Full-Stack Software Engineer Intern",
      "overallScore": null,
      "questions": []
    }
  ]
}
```

---

## GET `/api/interviews/:id?userId=USER_ID`

Gets a single interview session owned by the user.

### Response

```json
{
  "status": "ok",
  "data": {
    "id": "SESSION_ID",
    "userId": "USER_ID",
    "questions": [
      {
        "id": "QUESTION_ID",
        "question": "Tell me about a full-stack project you built.",
        "answer": null
      }
    ]
  }
}
```

---

## POST `/api/interviews/:id/questions/:questionId/answer?userId=USER_ID`

Submits or updates an answer for an interview question. The answer is evaluated by AI.

### Request Body

```json
{
  "answerText": "I built a full-stack project using Next.js, Node.js, Prisma, and PostgreSQL..."
}
```

### Response

```json
{
  "status": "ok",
  "message": "Interview answer submitted successfully",
  "data": {
    "answer": {
      "id": "ANSWER_ID",
      "questionId": "QUESTION_ID",
      "answerText": "I built a full-stack project using Next.js...",
      "score": 78,
      "feedback": "Good answer with relevant technical details. Improve by adding measurable impact."
    },
    "overallScore": 78
  }
}
```

---

## DELETE `/api/interviews/:id?userId=USER_ID`

Deletes an interview session owned by the user. Related questions and answers are deleted through cascade delete.

### Response

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "message": "Interview session deleted successfully"
  }
}
```

---

# Common Error Responses

## Missing `userId`

```json
{
  "status": "error",
  "message": "userId query parameter is required"
}
```

## Resource Not Found

```json
{
  "status": "error",
  "message": "Interview session not found"
}
```

## AI Service Temporarily Unavailable

```json
{
  "status": "error",
  "message": "AI service is temporarily unavailable. Please try again later."
}
```

## Internal Server Error

```json
{
  "status": "error",
  "message": "Internal server error"
}
```
