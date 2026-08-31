# HireLens Testing Strategy

## Test Framework

- **Testing Library**: Vitest
- **HTTP Testing**: Supertest
- **Environment**: Node.js
- **Coverage Provider**: v8

## Test Structure

```
backend/
├── src/
│   ├── app.spec.ts           - Application tests
│   ├── controllers/
│   │   ├── cv.spec.ts        - CV controller tests
│   │   └── health.spec.ts    - Health controller tests
│   ├── services/
│   │   ├── cv/
│   │   │   └── cv.spec.ts    - CV service tests
│   │   └── health.spec.ts    - Health service tests
│   └── validators/
│       └── index.spec.ts     - Validator tests
```

## Test Categories

### Unit Tests

Test individual functions and classes in isolation.

**Examples**:

- Skill extraction logic
- Name extraction logic
- Input validation

### Integration Tests

Test components working together.

**Examples**:

- CV creation with profile extraction
- Database operations with Prisma
- API endpoints with database

### E2E Tests

Test full request/response flows.

**Examples**:

- POST /api/cvs (create)
- GET /api/cvs (list)
- GET /api/cvs/:id (retrieve)
- DELETE /api/cvs/:id (delete)

## Current Test Suite

### app.spec.ts

✅ Tests health check endpoints and CORS configuration

```
✓ Health Check Endpoints (3)
✓ GET / should return welcome message
✓ GET /api/health should return health status
✓ GET /nonexistent should return 404
✓ CORS Configuration (1)
```

Expected result:

```
Test Files  1 passed
Tests       4 passed
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run in watch mode

```bash
npm run test:watch
```

### Run with coverage

```bash
npm test -- --coverage
```

## Test Best Practices

### Do NOT

- ❌ Mock Prisma if testing with real database
- ❌ Use test-only production methods
- ❌ Incomplete mocks
- ❌ Skip integration testing
- ❌ Test implementation details instead of behavior

### Do

- ✅ Test real behavior
- ✅ Write integration tests
- ✅ Follow TDD when appropriate
- ✅ Test error cases
- ✅ Verify response formats

## CV Service Tests

When implemented, CV service tests should cover:

```typescript
describe("CVService", () => {
  describe("createCV", () => {
    it("should create CV with candidate profile", () => {
      // Test CV creation
      // Test profile extraction
      // Test database persistence
    });

    it("should handle invalid input", () => {
      // Test error handling
    });
  });

  describe("listCVs", () => {
    it("should return user's CVs", () => {
      // Test retrieving CVs by user
      // Test ordering
    });

    it("should not return other users' CVs", () => {
      // Test isolation
    });
  });

  describe("getCV", () => {
    it("should return specific CV", () => {
      // Test retrieval by ID
    });

    it("should verify ownership", () => {
      // Test authorization
    });
  });

  describe("deleteCV", () => {
    it("should delete CV and profile", () => {
      // Test deletion
      // Test cascade delete
    });

    it("should verify ownership", () => {
      // Test authorization
    });
  });

  describe("extractCandidateProfile", () => {
    it("should extract name correctly", () => {
      // Test name extraction
    });

    it("should extract skills", () => {
      // Test skill matching
    });

    it("should handle edge cases", () => {
      // Test empty input
      // Test missing name
    });
  });
});
```

## GitHub Actions CI/CD (Future)

When setting up CI/CD:

```yaml
- name: Run tests
  run: npm test

- name: Check TypeScript
  run: npx tsc --noEmit

- name: Generate Prisma client
  run: npx prisma generate
```

---

**Status**: Step 9A - Foundation tests in place
**Coverage Target**: 80%+ for critical paths
