# Frontend

Next.js-based frontend for HireLens.

## Features

- Next.js 14
- TypeScript
- React 18
- Tailwind CSS
- Clerk Authentication
- Responsive Design

## Development

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Architecture

- `/src/app` - Next.js app directory
- `/src/components` - React components
- `/src/pages` - Page components
- `/src/lib` - Utility functions and API client
- `/src/styles` - Global styles

## API

Communicates with backend at `NEXT_PUBLIC_API_URL`

Default development: `http://localhost:3001/api`
