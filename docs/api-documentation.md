# HireLens API Documentation

## Base URL

**Development**: `http://localhost:3001/api`
**Production**: `TBD`

## Authentication

All endpoints requiring authentication should include the user's ID in query parameters or request body.

Current approach uses user ID verification for data ownership.

## Response Format

All endpoints return JSON responses with the following format:

```json
{
  "status": "ok" | "error",
  "message": "optional message",
  "data": {}
}
```

## Endpoints

### Health Checks

#### GET /health

Check API health status.

**Response**: `200 OK`

```json
{
  "status": "ok",
  "data": {
    "status": "ok",
    "service": "HireLens API"
  }
}
```

#### GET /database

Check database connectivity.

**Response**: `200 OK`

```json
{
  "status": "ok",
  "data": {
    "database": "connected"
  }
}
```

### CV Management

#### POST /cvs

Create a new CV record and extract candidate profile.

**Request**:

```json
{
  "userId": "cmta9lsqx0000i8idvwtwbbpe",
  "fileName": "resume.pdf",
  "rawText": "John Doe...",
  "fileUrl": "optional-url-to-file"
}
```

**Response**: `201 Created`

```json
{
  "status": "ok",
  "data": {
    "cv": {
      "id": "cmtaa23sd0000p0idma94ph9n",
      "userId": "cmta9lsqx0000i8idvwtwbbpe",
      "fileName": "resume.pdf",
      "fileUrl": null,
      "rawText": "John Doe...",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "candidateProfile": {
      "id": "cmtaa23sd0000p0idma94ph9o",
      "cvId": "cmtaa23sd0000p0idma94ph9n",
      "fullName": "John Doe",
      "headline": null,
      "summary": null,
      "skills": ["JavaScript", "TypeScript", "React"],
      "experience": [],
      "education": [],
      "certifications": []
    }
  }
}
```

**Validation**:

- `userId`: Required, must be string
- `fileName`: Required, must be string
- `rawText`: Required, must be string
- `fileUrl`: Optional, must be string if provided

**Error Responses**:

- `400 Bad Request`: Missing or invalid parameters
- `500 Internal Server Error`: Database error

#### GET /cvs

List all CVs for a user.

**Query Parameters**:

- `userId`: Required, user ID

**Example**: `GET /cvs?userId=cmta9lsqx0000i8idvwtwbbpe`

**Response**: `200 OK`

```json
{
  "status": "ok",
  "data": [
    {
      "id": "cmtaa23sd0000p0idma94ph9n",
      "userId": "cmta9lsqx0000i8idvwtwbbpe",
      "fileName": "resume.pdf",
      "fileUrl": null,
      "rawText": "...",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "candidateProfile": {
        "id": "cmtaa23sd0000p0idma94ph9o",
        "cvId": "cmtaa23sd0000p0idma94ph9n",
        "fullName": "John Doe",
        "headline": null,
        "summary": null,
        "skills": ["JavaScript", "TypeScript", "React"],
        "experience": [],
        "education": [],
        "certifications": []
      }
    }
  ]
}
```

**Error Responses**:

- `400 Bad Request`: Missing userId parameter

#### GET /cvs/:id

Retrieve a specific CV.

**Query Parameters**:

- `userId`: Required, for ownership verification

**Example**: `GET /cvs/cmtaa23sd0000p0idma94ph9n?userId=cmta9lsqx0000i8idvwtwbbpe`

**Response**: `200 OK`

```json
{
  "status": "ok",
  "data": {
    "id": "cmtaa23sd0000p0idma94ph9n",
    "userId": "cmta9lsqx0000i8idvwtwbbpe",
    "fileName": "resume.pdf",
    "fileUrl": null,
    "rawText": "...",
    "uploadedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "candidateProfile": {
      "id": "cmtaa23sd0000p0idma94ph9o",
      "cvId": "cmtaa23sd0000p0idma94ph9n",
      "fullName": "John Doe",
      "headline": null,
      "summary": null,
      "skills": ["JavaScript", "TypeScript", "React"],
      "experience": [],
      "education": [],
      "certifications": []
    }
  }
}
```

**Error Responses**:

- `400 Bad Request`: Missing userId parameter
- `403 Forbidden`: User does not own this CV
- `404 Not Found`: CV not found

#### DELETE /cvs/:id

Delete a CV.

**Query Parameters**:

- `userId`: Required, for ownership verification

**Example**: `DELETE /cvs/cmtaa23sd0000p0idma94ph9n?userId=cmta9lsqx0000i8idvwtwbbpe`

**Response**: `200 OK`

```json
{
  "status": "ok",
  "data": {
    "success": true,
    "message": "CV deleted successfully"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Missing userId parameter
- `403 Forbidden`: User does not own this CV
- `404 Not Found`: CV not found

---

## Future Endpoints

### Job Matching (Phase 2)

- `POST /jobs/match` - Match profile against jobs
- `GET /jobs` - List available jobs
- `GET /jobs/:id` - Get job details

### Interview Coach (Phase 3)

- `POST /interviews/sessions` - Create interview session
- `GET /interviews/sessions` - List user's sessions
- `POST /interviews/answer` - Submit answer to question
- `GET /interviews/:sessionId` - Get session details

---

**Status**: Step 9A Complete
**Last Updated**: 2024-01-15
