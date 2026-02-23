# Copilot Instructions for expense-spreadsheet-v3

## Architecture Overview

This is a **Turbo monorepo** with decoupled apps sharing an npm workspace and global interfaces:

- **`apps/api/`**: NestJS 11 backend (REST API).
- **`apps/client/`**: Next.js 16 + React 19 (App Router) frontend.
- **`apps/interfaces/`**: Shared TypeScript contracts (e.g., `Bill`, `User`).

The API runs on port 3000 (or `$PORT`) with global prefix `/api`. The client dev server runs on port 5173.

## Key Tech Patterns

### Backend (NestJS 11 + TypeORM + PostgreSQL)
- **Module-based structure**: Features are grouped in `src/{feature}/`.
- **Validation**: DTOs use `class-validator`. NestJS uses a global validation pipe.
- **Authentication**: JWT-based. Tokens are hashed with `bcrypt` (10 rounds).
- **Database**: TypeORM entities in `entities/*.entity.ts`. Queries via repositories.
- **Endpoints**:
  - `POST /api/users/login`: Returns JWT token.
  - `GET /api/users/me/:id`: Protected user data.
  - `GET/POST/DELETE /api/bills`: Management of expenses.

### Frontend (Next.js 16 + React 19 + Tailwind 4)
- **App Router**: Uses the `app/` directory structure.
- **Data Fetching**:
  - **Server Components**: Used for initial data fetching (e.g., `dashboard/page.tsx` calls `getBills`).
  - **Server Actions**: Defined in `apps/client/actions/index.tsx` for mutations (login, add bill, delete bill).
- **State & UI**:
  - **Authentication**: JWT stored in `httpOnly` cookies via Server Actions.
  - **Revalidation**: Uses `revalidatePath('/dashboard')` after mutations to refresh server-side data.
  - **Styling**: Tailwind CSS 4 (PostCSS).
  - **Icons**: `react-icons` (Md, Fa, Go, Io).

### Shared Interfaces (`apps/interfaces/`)
- Always import interfaces from `../../interfaces/`.
- **Note**: There is a typo in the file name `bill.iterface.ts` which is currently used across the project. Maintain this usage for consistency unless refactoring.

## Critical Developer Workflows

### Running the App
```bash
# Root: starts API (3000) and Client (5173)
npm run dev
```

### Building
```bash
# Root: builds both apps via Turbo
npm run build
```

### Testing
- **Client**: Vitest (run with `npm run test:ui` in `apps/client`).
- **API**: Jest.
- **E2E**: Playwright (run with `npm run e2e` from root).

## Common Tasks

### Adding a New Feature (API)
1. Create folder `apps/api/src/{feature}/`.
2. Define Entity, DTOs, Service, and Controller.
3. Register in `AppModule`.

### Creating a New Page/Action (Client)
1. Use **Server Components** by default.
2. For mutations, add/update functions in `apps/client/actions/index.tsx` using `'use server'`.
3. Use `revalidatePath` to ensure the UI stays in sync with the database.
4. For interactive UI (modals, inputs), use `'use client'` at the top of the component.

## Project Structure Reference
```
apps/
├── api/src/                # NestJS Backend
│   ├── users/              # Auth & Profile
│   ├── bills/              # Expense Management
│   └── main.ts             # Prefix '/api', port 3000
├── client/                 # Next.js Frontend
│   ├── app/                # App Router (dashboard, create-account)
│   ├── actions/            # Server Actions (API calls & Cookie management)
│   ├── components/         # React Components (BillsList, Modals, etc.)
│   └── globals.css         # Tailwind 4 directives
└── interfaces/             # Shared TS types
    ├── bill.iterface.ts    # Main Bill interface (note typo)
    └── user.interface.ts   # User & Auth interfaces
```

## Debugging Tips
- **Auth Issues**: Verify if the `token` cookie is present in the browser and if `JWT_SECRET` matches between API and Client.
- **Data not updating**: Ensure `revalidatePath` is called in the corresponding Server Action.
- **Tailwind**: Check if `@tailwindcss/postcss` is correctly processing `globals.css`.
