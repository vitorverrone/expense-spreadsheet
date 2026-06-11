# Expense Spreadsheet V3

A full-stack personal expense tracker built as a Turborepo monorepo.

---

## Project Structure

```
apps/
  api/         → NestJS 11 + TypeORM + PostgreSQL + JWT
  client/      → Next.js 16 + React 19 + Tailwind CSS 4
  interfaces/  → Shared TypeScript interfaces
```

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo** | Turborepo, npm workspaces |
| **Backend** | NestJS 11, TypeORM, JWT, class-validator |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| **State** | React Query, React Context API |
| **Forms** | React Hook Form, remask |
| **Database** | PostgreSQL |
| **Testing** | Jest (API), Vitest + RTL (client), Playwright (E2E) |
| **CI** | GitHub Actions |
| **Deploy** | Vercel (client), Railway (API), Neon (PostgreSQL) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

**Linux/macOS:**
```bash
cp apps/api/.env.example apps/api/.env
cp apps/client/.env.example apps/client/.env.local
```

**Windows (PowerShell):**
```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/client/.env.example apps/client/.env.local
```

**`apps/api/.env`**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<password>
DB_NAME=expense_db
JWT_SECRET=<secret>
```

**`apps/client/.env.local`**
```
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=<same secret as api>
```

### 3. Run in development

```bash
npm run dev
```

API runs on port `3000`, client on port `5173`.

---

## Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start all apps with hot reload (Turbo) |
| `npm run build` | Production build for all apps |
| `cd apps/api && npm test` | Run API unit tests (Jest) |
| `cd apps/client && npm test` | Run client unit tests (Vitest, headless) |
| `npm run test:ui` | Open Vitest UI (client) |
| `npm run e2e` | Run Playwright E2E tests (requires build first) |

> Run `npm run build` before `npm run e2e`.

---

## Architecture

### API (NestJS)

- Global prefix: `/api`
- Auth: JWT Bearer Token via custom `AuthGuard`
- Modules: `users/`, `bills/`
- ORM: TypeORM with `synchronize: true` in dev (use migrations in production)
- CORS enabled globally

**Endpoints:**
```
POST   /api/users          → create account
POST   /api/users/login    → login (returns JWT)
GET    /api/users/me       → authenticated user data
PATCH  /api/users/me       → update profile

GET    /api/bills          → list user bills (supports ?month, ?year, ?title)
POST   /api/bills          → create bill
PATCH  /api/bills/:id      → update bill
DELETE /api/bills/:id      → delete bill
```

### Client (Next.js App Router)

- Auth via **httpOnly cookie** (`token`) managed by Server Actions
- `lib/api.server.ts` — centralized fetch wrapper used by Server Actions
- `lib/hooks/use-bills.ts` — React Query hooks (`useBills`, `useAddBill`, `useDeleteBill`)
- `lib/hooks/use-user.ts` — React Query hooks (`useUser`, `useUpdateUser`)
- Pages: `/` (login), `/create-account`, `/dashboard`

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR to `main`:

1. Install dependencies
2. Build (API + client)
3. Test API (Jest)
4. Test Client (Vitest)

Deploy is triggered automatically by the hosting services on push to `main`.

---

> [!WARNING]
> In production, set `NODE_ENV=production` to disable TypeORM auto-sync and configure CORS with your actual frontend domain.

> [!NOTE]
> `apps/interfaces/bill.iterface.ts` has a typo in the filename — kept intentionally for compatibility.
