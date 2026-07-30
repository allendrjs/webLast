# webLast

Web frontend for the OSDA (Office for Student Discipline) system - React + TypeScript, talking to the `rc-osd-backend` Spring Boot API.

## Stack

- Vite + React + TypeScript
- React Router for routing and role-based route guards
- Axios for API calls

## Getting started

```
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your running backend
npm run dev
```

## Structure

Each feature is split into three layers, matching the Jira ticket breakdown (`OSDA-web-jira-import.csv`):

- `src/api/` - one file per backend controller, wraps the actual HTTP calls (Axios). This is the "Create API Integration for X" subtask.
- `src/state/` - shared state and hooks (currently just auth). Feature-specific state/logic (the "Create State/Logic for X" subtask) should live alongside its feature, e.g. `src/features/student/useStudents.ts`.
- `src/features/<name>/` - the actual pages/components (the "Create UI for X" subtask).
- `src/types/` - TypeScript interfaces mirroring the backend's domain entities and DTOs.
- `src/routes/` - route definitions and `ProtectedRoute`, which enforces both authentication and role restrictions per route.

## What's implemented vs stubbed

`Login` is fully wired end-to-end (UI + state + API) as a reference for how the other features should be built - see `src/features/login/LoginPage.tsx`, `src/state/AuthContext.tsx`, and `src/api/loginApi.ts`.

Every other feature (Student, Offense, Disciplinary Action, Employee, Guardian, Enrollment, Record, Appeal, Request) has a stub page and a placeholder API file with `TODO(OSDA-web)` comments - pick these up per their Jira tickets.

## Role model

- **Administrator** - full access to most modules.
- **Department Head** (`ROLE_STAFF`) - search/view records and staff, and submit/track record Requests. No create/update/delete rights outside Requests.
- **Student** (`ROLE_USER`) - views own Records and Enrollment, submits and tracks own Appeals.
- **Prefect** is intentionally absent from this app - Prefect works through a separate Desktop application against the same backend API, not through Web.

Route-level restrictions live in `src/routes/AppRoutes.tsx`. The backend enforces the same restrictions independently via `@PreAuthorize` - route guards here are a UX convenience, not the actual security boundary.

## Not yet backed by the API

AI-Assisted Appeal Review (OCR text extraction, keyword/policy matching, suggestions) has no backend endpoints yet - see the `blocked` label on that ticket. Don't start the frontend for it until the backend Document/Suggestion endpoints exist.
