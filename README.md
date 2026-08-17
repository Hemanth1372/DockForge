# DockForge

A starter monorepo for a DockForge application with a React frontend and Express backend.

## Structure

- `frontend/` — React app sources and public assets
- `backend/` — Express server, API routes, controllers, middleware, services, and utilities
- `backend/tempUploads/` — Temporary upload storage
- `backend/extractedProjects/` — Extracted project files

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Notes

- `backend/src/app.js` starts the Express server
- `frontend/src/main.jsx` is the React entry point
- Add actual application logic and dependencies as needed
