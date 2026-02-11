# Copilot Instructions for expense-spreadsheet-v3

## Architecture Overview

This is a **Turbo monorepo** with two decoupled apps sharing an npm workspace:

- **`apps/api/`**: NestJS backend serving REST endpoints and static client files
- **`apps/client/`**: Next.js 16 + React 19 + TypeScript frontend (currently in template phase; see `client-old/` for reference Vite implementation)

The API runs on port 3000 (or `$PORT` env var) with global prefix `/api`. The client dev server runs on port 5173 and makes direct API calls to `http://localhost:3000` or uses absolute paths `/api/*`.

## Key Tech Patterns

### API Architecture (NestJS)
- **Module-based structure**: Each domain (Users, Bills) is a feature module under `src/{feature}/`
- **Standard scaffold**: `{feature}.module.ts` → `{feature}.service.ts` → `{feature}.controller.ts`
- **Data models**:
  - **Entities** (`entities/*.entity.ts`): TypeORM decorated classes, map to database tables
  - **DTOs** (`dto/*.dto.ts`): class-validator decorated input models for request bodies
  - Services inject `@InjectRepository(Entity)` to access TypeORM repositories
- **Dependency injection**: All providers registered in module `providers: []` array
- **Decorators**: Controllers use `@Controller()`, `@Get()`, `@Post()`, `@Patch()`, `@Delete()`

### Database (TypeORM + PostgreSQL)
- Connection configured in [AppModule](apps/api/src/app.module.ts) via `ConfigService` (environment variables: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`)
- Entities include metadata (e.g., `@Column({ unique: true })`, `@PrimaryGeneratedColumn()`, `nullable`)
- Relationships: Bills reference Users by `userId` foreign key; currently not modeled as TypeORM relations

### Validation
- DTOs use `class-validator` decorators: `@IsString()`, `@IsEmail()`, `@IsNumber()`, `@IsOptional()`, `@IsBoolean()`
- NestJS automatically validates request bodies against DTOs (requires validation pipe, check main.ts)

### Authentication (NestJS Backend)
- **Session + JWT auth**: Uses `cookie-session` middleware for session storage; JWT tokens returned on login for stateless auth
- **Password hashing**: `bcrypt` (10 salt rounds)
- **Login endpoint**: `POST /api/users/login` accepts `username` + `password`, returns `{ user, token }`
- **Login flow**:
  1. Find user by `username` via `usersRepo.findOneBy()`
  2. Compare input password with hashed password via `bcrypt.compare()`
  3. On success: sign JWT token via `jwtService.sign({ id, username })`, return user + token; on failure: throw `UnauthorizedException`
- **User registration**: `POST /api/users` hashes password before save, prevents duplicate usernames
- **Protected endpoints**: Clients send JWT in `Authorization: Bearer {token}` header (or session cookie is auto-sent)
- **DTOs**: `LoginUserDto` (login), `CreateUserDto` (registration)

### Client Architecture (Next.js + React 19 + Tailwind CSS)
- **Framework**: Next.js 16 with App Router; entry point is [app/layout.tsx](apps/client/app/layout.tsx) wrapping all pages
- **Styling**: Tailwind CSS v4 with PostCSS; global styles in [app/globals.css](apps/client/app/globals.css)
- **Current state**: Next.js template being set up; for reference implementations, see `client-old/` (Vite version)
- **Reference patterns** (from `client-old/`): 
  - State management: React Context for auth, React Query (`@tanstack/react-query`) for server state
  - Toast notifications: `react-hot-toast` for user feedback
  - Auth flow: Login component posts to `/api/users/login`, stores JWT token in localStorage, includes in subsequentAPI headers
  - API layer: Functions in `store/apis/{feature}Api.ts` use `fetch()` with Authorization headers

## Critical Developer Workflows

### Running the App
```
# From root: start both API and client with hot reload
npm run dev

# Individual control:
cd apps/api && npm run dev      # NestJS watch mode (port 3000)
cd apps/client && npm run dev   # Next.js dev server (port 5173)
```

### Building
```bash
npm run build                   # Targets root turbo.json → both apps compile
cd apps/api && npm run build    # Compiles TS → dist/, served by start:prod
cd apps/client && npm run build # Next.js build → .next/, requires separate Next.js server or export
```

### Testing
```bash
cd apps/api
npm test              # Unit tests (Jest, rootDir=src, pattern=*.spec.ts)
npm run test:watch    # Jest watch mode
npm run test:e2e      # End-to-end tests (config at test/jest-e2e.json)
npm run test:cov      # Coverage report
```

### Code Quality
```bash
cd apps/api && npm run lint      # ESLint + Prettier (auto-fix enabled)
cd apps/client && npm run lint   # ESLint flat config
npm run format                   # Prettier format (API only)
```

## Common Tasks

### Adding a New Feature Module
1. Create folder under `apps/api/src/{feature}/`
2. Use `nest generate module {feature}` to scaffold (if CLI installed)
3. Structure: `{feature}.module.ts`, `{feature}.service.ts`, `{feature}.controller.ts`, `entities/`, `dto/`
4. Register in [AppModule](apps/api/src/app.module.ts): add to `imports: []`
5. Define entity properties with `@Column()`, DTOs with `class-validator` decorators
6. Services inject repository via `@InjectRepository(Entity)`, call TypeORM methods (`.find()`, `.save()`, `.delete()`)

### Adding Database Fields
1. Update entity (e.g., [Bill](apps/api/src/bills/entities/bill.entity.ts)): add `@Column()` decorated property
2. Update corresponding DTO if field should be in request body
3. TypeORM auto-migration not configured; manual migration/schema updates required per deployment

### Creating a New React Component (Next.js)
1. Create file under `apps/client/{route}/` or `apps/client/components/` for reusable components
2. Use **Server Components** by default (no `'use client'` directive unless needed for interactivity)
3. For interactive components requiring hooks, add `'use client'` at top of file
4. Use Tailwind classes for styling; see [layout.tsx](apps/client/app/layout.tsx) for class patterns
5. For data-fetching, use `fetch()` during SSR or client-side with `'use client'` wrapper
6. Reference implementation patterns in [client-old/](client-old/) for React Query + hooks examples (when porting Vite code)

## Project Structure Reference

```
apps/api/src/
├── app.module.ts           # Root module; imports features, configures TypeORM, serves static client
├── main.ts                 # Bootstrap; sets global prefix '/api', listens on PORT
├── users/
│   ├── users.module.ts     # Imports UsersService
│   ├── users.service.ts    # @Injectable(); methods: create, login, findAll, findOne, update, remove
│   ├── users.controller.ts # @Controller('users'); routes to service methods; POST /login for authentication
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   └── login-user.dto.ts
│   └── entities/
│       └── user.entity.ts  # @Entity(); id, name, password (hashed), username (unique), email (unique), salary, salarySubtraction
└── bills/
    ├── bills.module.ts
    ├── bills.service.ts
    ├── bills.controller.ts
    ├── dto/
    │   ├── create-bill.dto.ts
    │   └── update-bill.dto.ts
    └── entities/
        └── bill.entity.ts  # @Entity(); id, userId, title, value, installments, billType, finalDate

apps/client/
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout; wraps all pages with HTML/body
│   ├── page.tsx           # Landing/home page (/)
│   └── globals.css        # Global Tailwind CSS directives
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript config for Next.js
└── package.json           # Dependencies: next, react, react-dom, tailwindcss

client-old/               # Reference implementation (Vite + React Query)
└── src/
    ├── Dashboard.tsx       # Main app component; handles auth routing
    ├── main.tsx           # React entry point with QueryClientProvider
    ├── components/
    │   ├── Login.tsx      # Login form component
    │   ├── BillsList.tsx  # Bills display with React Query hooks
    │   └── Header.tsx     # Header with auth context
    ├── context/
    │   ├── AuthContext.tsx
    │   └── useAuth.ts     # Custom hook for auth state
    └── store/
        └── apis/
            └── billsApi.ts # API functions with useQuery/useMutation patterns
```

## Debugging Tips

- **API won't start**: Check `DB_*` env vars and PostgreSQL connectivity
- **API responds with cached old code**: Rebuild: `cd apps/api && npm run build`
- **Client can't reach API**: Ensure API is running on port 3000; check Next.js dev configuration or fallback to `/api` absolute paths
- **Type errors**: Run `tsc -b` in api and client folders to check TypeScript compilation
- **Next.js app not hot-reloading**: Restart dev server; check for syntax errors in page.tsx or layout.tsx
- **Tailwind classes not applied**: Verify `@tailwind` directives in [globals.css](apps/client/app/globals.css) and `content` paths in [next.config.ts](apps/client/next.config.ts)

## Configuration Notes

- **Turbo**: Root [turbo.json](turbo.json) defines `dev` (cache=false) and `build` tasks; `build` depends on `^build` (dependent builds)
- **TypeScript**: Separate configs for API (ES2023, nodenext modules) and client (app + node targets for dev tools)
- **ESLint**: API uses modern flat config (eslint.config.mjs); client uses modern flat config (eslint.config.mjs)
- **Tailwind CSS**: Configured with PostCSS (v4) in [postcss.config.mjs](apps/client/postcss.config.mjs); directives in [globals.css](apps/client/app/globals.css)
- **Next.js Server Components**: Default behavior (no `'use client'` unless interactive); good for data-fetching at build/request time
- **Authentication**: Backend returns JWT tokens on successful login; clients must include `Authorization: Bearer {token}` header for protected endpoints
