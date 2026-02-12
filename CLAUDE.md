# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

### Backend (Java 17 / Maven / Spring Boot 3.2.1)

```bash
cd backend
mvn clean package -DskipTests              # Build all modules
mvn spring-boot:run -pl task-service       # Run task-service (port 8080)
mvn test -Dspring.profiles.active=test -Dtest=!*IntegrationTest -Dsurefire.failIfNoSpecifiedTests=false  # Unit tests
mvn verify                                  # Integration tests (uses Testcontainers)
```

Run a single test class:
```bash
mvn test -pl task-service -Dtest=TaskControllerTest
```

### Frontend (React 18 / TypeScript / npm)

```bash
cd frontend
npm install --legacy-peer-deps    # --legacy-peer-deps required (React+Vue mix)
npm start                          # Dev server (port 3000 via craco)
npm run build                      # Production build
npm test                           # Jest tests (watch mode)
npm test -- --watchAll=false       # Jest tests (single run)
npm test -- --watchAll=false --coverage  # With coverage
```

Run a single test file:
```bash
cd frontend
npm test -- --watchAll=false --testPathPattern="TasksPage"
```

### E2E Tests (Playwright)

```bash
cd frontend/e2e
npx playwright test --config=playwright.config.ts
```

### Docker (Full Stack)

```bash
cd infrastructure/docker
docker compose up -d                          # Local dev
docker compose -f docker-compose.prod.yml up -d  # Production
```

Local dev ports: Frontend :8091, Backend API :8082, PostgreSQL :5435

## Architecture

### Monorepo Structure

- `backend/` - Maven multi-module: **shared** (DTOs/events), **task-service** (main API), **notification-service** (Kafka consumer)
- `frontend/` - React 18 + TypeScript SPA with craco build wrapper
- `infrastructure/docker/` - Compose files (project name: `taskflow`)
- `infrastructure/nginx/` - Production reverse proxy config

### Backend Layers (task-service)

Package: `io.celox.taskflow.task`

`controller` -> `service` -> `repository` -> `domain` (JPA entities)

Supporting packages: `dto` (validated request/response), `mapper` (MapStruct), `config` (Security/JWT/Kafka/RateLimit), `kafka` (event producers), `workflow` (node executors), `exception`

### Event-Driven Flow

Task CRUD operations publish events to Kafka topics (`task.created`, `task.updated`, `task.completed`, `task.deleted`). The notification-service consumes these.

### Workflow Engine

Workflows are DAGs stored as JSONB (nodes + edges). Node executors in `workflow/executors/` handle: CreateTask, UpdateTask, DeleteTask, HttpRequest, Database (SELECT only), Email, Code (GraalVM sandbox), Condition, Delay.

### Frontend State & API

- Redux Toolkit slices in `store/` (authSlice, tasksSlice)
- Axios instance in `api/axios.ts` with JWT interceptor and auto-logout on 401
- API URL: production uses relative `/api` (nginx proxy), dev uses `http://localhost:8082/api`
- Workflow editor uses React Flow + a Vue/Pinia hybrid (hence `--legacy-peer-deps`)

### Database

PostgreSQL 15 with Liquibase migrations in `backend/task-service/src/main/resources/db/changelog/`. Tables: users, tasks, task_tags, workflows, workflow_executions, credentials.

Demo users seeded by Liquibase: `admin`/`admin123`, `demo`/`demo123`.

### Security

JWT auth via `JwtTokenProvider` + `JwtAuthenticationFilter`. Rate limiting in `RateLimitFilter` (per-endpoint, disabled in test profile). SQL injection protection in DatabaseExecutor. Code sandboxing via GraalVM.

## Deployment

- **VPS**: 69.62.121.168 (SSH as root), deploy script: `scripts/deploy-vps.sh`
- **Production URL**: https://taskflow.celox.io
- **Nginx**: HTTPS (Let's Encrypt) proxies `/` -> :3003 (frontend container), `/api` -> :8080 (task-service)
- **Compose project name**: `taskflow` (set in docker-compose.prod.yml to avoid conflicts with other projects on the VPS)

## CI/CD

GitHub Actions (`.github/workflows/tests.yml`) runs on push/PR to main/develop:
1. Backend unit tests (PostgreSQL service, `mvn test` with test profile)
2. Frontend tests + build (`npm test`, `npm run build`)
3. E2E tests (full stack with Playwright)
