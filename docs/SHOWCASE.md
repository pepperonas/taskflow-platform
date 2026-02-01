# TaskFlow Platform - Skill Showcase

Dieses Projekt demonstriert professionelle Full-Stack-Entwicklung mit modernen Technologien und Best Practices.

## 🎯 Projektziel

TaskFlow ist eine **Workflow-Automatisierungsplattform**, die als Showcase für Enterprise-Level Software-Entwicklung dient. Das Projekt zeigt:

- **Saubere Architektur** und Code-Qualität
- **Security by Design** mit mehrschichtigen Schutzmaßnahmen
- **Moderne Tech-Stacks** im Frontend und Backend
- **DevOps-Praktiken** mit Docker und CI/CD
- **Dokumentation** auf professionellem Niveau

---

## 🏆 Demonstrierte Kompetenzen

### Backend (Java/Spring Boot)

| Skill | Implementierung | Dateien |
|-------|-----------------|---------|
| **Event-Driven Architecture** | Apache Kafka für asynchrone Events | `TaskEventProducer.java`, `notification-service/` |
| **JWT Authentication** | Sichere Token-basierte Auth | `JwtAuthenticationFilter.java`, `AuthService.java` |
| **Rate Limiting** | In-Memory Rate Limiter | `RateLimitFilter.java` |
| **SQL Injection Protection** | Multi-Layer Validation | `DatabaseController.java`, `SECURITY.md` |
| **Code Sandboxing** | GraalVM JavaScript Execution | `CodeExecutor.java` |
| **Input Validation** | Bean Validation (@Valid, @NotBlank) | `EmailRequest.java`, `CodeExecutionRequest.java` |
| **Global Exception Handling** | @RestControllerAdvice | `GlobalExceptionHandler.java` |
| **API Documentation** | OpenAPI 3.0 / Swagger | `OpenApiConfig.java` |
| **Database Migrations** | Liquibase Changesets | `db/changelog/` |
| **Clean Architecture** | Repository → Service → Controller | Gesamte Backend-Struktur |

### Frontend (React/TypeScript)

| Skill | Implementierung | Dateien |
|-------|-----------------|---------|
| **TypeScript** | Typsicheres JavaScript | Alle `.tsx`/`.ts` Dateien |
| **State Management** | Redux Toolkit | `store/slices/` |
| **Workflow Visualization** | React Flow Library | `WorkflowEditorPageV2.tsx` |
| **Error Boundaries** | Graceful Error Handling | `ErrorBoundary.tsx` |
| **Form Handling** | React Hook Form | `LoginPage.tsx`, `RegisterPage.tsx` |
| **Component Architecture** | Modulare Komponenten | `components/` |
| **Responsive Design** | Material-UI Grid System | Alle Pages |
| **Daten-Visualisierung** | Recharts | `DashboardPage.tsx` |

### DevOps & Infrastructure

| Skill | Implementierung | Dateien |
|-------|-----------------|---------|
| **Containerization** | Docker Multi-Stage Builds | `Dockerfile`, `docker-compose.yml` |
| **Reverse Proxy** | Nginx Configuration | `nginx.conf`, `nginx-https.conf` |
| **SSL/TLS** | Let's Encrypt Integration | Nginx Config |
| **CI/CD** | GitHub Actions | `.github/workflows/tests.yml` |
| **Health Checks** | Kubernetes-ready Endpoints | `HealthController.java` |

### Testing

| Skill | Implementierung | Dateien |
|-------|-----------------|---------|
| **Unit Tests** | JUnit 5, Mockito | `*Test.java` |
| **Integration Tests** | Testcontainers | `*IntegrationTest.java` |
| **Frontend Tests** | Jest, React Testing Library | `*.test.tsx` |
| **E2E Tests** | Playwright | `e2e/tests/` |

---

## 🛡️ Security Features

### Implementierte Schutzmaßnahmen

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│  Rate Limiting         │ 5-20 req/min je nach Endpoint          │
│  JWT Authentication    │ Signierte Tokens mit Expiration        │
│  Input Validation      │ Bean Validation für alle DTOs          │
│  SQL Injection Block   │ Keyword Detection + Pattern Matching   │
│  Code Sandboxing       │ GraalVM mit eingeschränkten Rechten    │
│  CORS Configuration    │ Kontrollierte Cross-Origin Requests    │
│  Exception Handling    │ Keine Stack Traces in Production       │
│  Security Logging      │ Alle Anomalien werden protokolliert    │
└─────────────────────────────────────────────────────────────────┘
```

### Rate Limits

| Endpoint | Limit | Grund |
|----------|-------|-------|
| `/api/v1/auth/login` | 5/min pro IP | Brute-Force-Schutz |
| `/api/v1/auth/register` | 3/min pro IP | Spam-Schutz |
| `/api/v1/code/execute` | 10/min pro User | Ressourcenschonung |
| `/api/v1/database/query` | 20/min pro User | DB-Schutz |
| `/api/v1/email/send` | 5/min pro User | Spam-Schutz |

---

## 🏗️ Architektur

### System-Übersicht

```
                                    ┌─────────────────┐
                                    │   Frontend      │
                                    │   (React 18)    │
                                    └────────┬────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Nginx Reverse Proxy                      │
│                    (HTTPS, Rate Limiting, SSL)                   │
└─────────────────────────────────────────────────────────────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Task Service                              │
│                     (Spring Boot 3.2.1)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Controllers  │  Services  │  Repositories  │  Security  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                         │                    │
                         ▼                    ▼
              ┌──────────────────┐  ┌──────────────────┐
              │   PostgreSQL 15   │  │   Apache Kafka   │
              │    (Datenbank)    │  │  (Event Stream)  │
              └──────────────────┘  └────────┬─────────┘
                                             │
                                             ▼
                                  ┌──────────────────┐
                                  │ Notification Svc │
                                  │ (Kafka Consumer) │
                                  └──────────────────┘
```

### Design Patterns

| Pattern | Anwendung |
|---------|-----------|
| **Repository Pattern** | Datenzugriff abstrahiert |
| **Factory Pattern** | Event-Erstellung |
| **Strategy Pattern** | Node-Executor-Auswahl |
| **Builder Pattern** | DTO-Konstruktion |
| **Observer Pattern** | Kafka Event Handling |
| **Singleton Pattern** | Service-Instanzen (Spring) |

---

## 📊 Metriken & Monitoring

### Health Check Endpoint

```bash
GET /api/v1/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "database": {
      "status": "UP",
      "responseTimeMs": 5,
      "database": "PostgreSQL",
      "version": "15.x"
    },
    "kafka": {
      "status": "UP",
      "brokers": "kafka:29092",
      "nodes": 1
    }
  },
  "version": "1.1.0",
  "system": {
    "uptime": "2d 5h 30m",
    "memory": {
      "used": "256 MB",
      "max": "512 MB"
    },
    "javaVersion": "17"
  }
}
```

---

## 📁 Projektstruktur

```
taskflow-platform/
├── backend/
│   ├── shared/              # Gemeinsame Module (Events, DTOs)
│   ├── task-service/        # Hauptservice
│   │   ├── controller/      # REST APIs
│   │   ├── service/         # Business Logic
│   │   ├── repository/      # Data Access
│   │   ├── domain/          # Entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── config/          # Security, Kafka, etc.
│   │   ├── workflow/        # Workflow Engine
│   │   └── exception/       # Error Handling
│   └── notification-service/ # Kafka Consumer
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── pages/           # Page Components
│   │   ├── store/           # Redux Store
│   │   ├── api/             # Axios Instance
│   │   └── types/           # TypeScript Types
│   └── e2e/                 # Playwright Tests
│
├── infrastructure/
│   ├── docker/              # Docker Compose Files
│   └── nginx/               # Nginx Configurations
│
├── docs/                    # Documentation
└── .github/workflows/       # CI/CD Pipelines
```

---

## 🔗 Live Demo

| Resource | URL |
|----------|-----|
| **Frontend** | https://taskflow.celox.io |
| **Backend API** | https://taskflow.celox.io/api |
| **Swagger UI** | https://taskflow.celox.io/swagger-ui.html |
| **Health Check** | https://taskflow.celox.io/api/v1/health |
| **GitHub Repo** | https://github.com/pepperonas/taskflow-platform |

### Test-Zugangsdaten

- **Admin**: `admin` / `admin123`
- **Demo User**: `demo` / `demo123`

---

## 👤 Autor

**Martin Pfeffer** © 2026

- Website: [celox.io](https://celox.io)
- GitHub: [@pepperonas](https://github.com/pepperonas)

---

## 📄 Lizenz

MIT License - Siehe [LICENSE](../LICENSE)
