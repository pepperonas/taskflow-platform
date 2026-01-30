# TaskFlow Platform

<div align="center">

<img src="https://raw.githubusercontent.com/pepperonas/taskflow-platform/main/frontend/public/taskflow-logo.png" alt="TaskFlow Platform" width="600"/>

**Modern Event-Driven Task Management System**

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-7.5-black)](https://kafka.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

### 🌐 [Live Demo](https://taskflow.celox.io)

**Try it now**: [https://taskflow.celox.io](https://taskflow.celox.io)
**Login**: `admin` / `admin123` or `demo` / `demo123`

</div>

## 🚀 Features

- ✅ **Event-Driven Architecture** with Apache Kafka
- 🔄 **Real-time Updates** via WebSocket
- 🔐 **JWT Authentication** with Spring Security
- 🛡️ **SQL Injection Protection** with comprehensive security measures
- 📊 **RESTful API** with OpenAPI documentation
- 🎨 **Modern UI** with Material-UI
- 🐳 **Containerized** with Docker & Docker Compose
- 🧪 **Comprehensive Tests** (Unit, Integration, E2E)
- 🚀 **CI/CD Pipeline** with GitHub Actions
- 📧 **Email Integration** with SMTP support
- 🗄️ **Database Integration** with secure query execution
- 💻 **JavaScript Code Execution** with GraalVM sandboxing
- 📊 **Interactive Dashboard** with charts and analytics
- 🎨 **Showcase Page** with project overview and technologies

## 📋 Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.1**
- **Apache Kafka** for Event Streaming
- **PostgreSQL 15** as Database
- **Spring Data JPA** for Data Access
- **Spring Security** with JWT
- **Liquibase** for Database Migrations
- **OpenAPI 3.0** for API Documentation

### Frontend
- **React 18** with **TypeScript**
- **Redux Toolkit** for State Management
- **Material-UI (MUI)** as UI Framework
- **React Flow** for Workflow Visualization
- **Recharts** for Data Visualization
- **Axios** for HTTP Client
- **React Hook Form** for Form Handling
- **React Router** for Navigation

### DevOps & Infrastructure
- **Docker** & **Docker Compose**
- **GitHub Actions** for CI/CD
- **Nginx** as Reverse Proxy
- **Maven** for Build Management

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Frontend  │─────▶│ Task Service │─────▶│   PostgreSQL    │
│  (React)    │      │ (Spring Boot)│      │                 │
└─────────────┘      └──────┬───────┘      └─────────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │Apache Kafka │
                     └──────┬──────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Notification Service  │
                │   (Kafka Consumer)    │
                └───────────────────────┘
```

## 🛠️ Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.9+

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/pepperonas/taskflow-platform.git
cd taskflow-platform
```

### 2. Start with Docker Compose

```bash
cd infrastructure/docker
docker-compose up -d
```

### 3. Access the Application

**Production (Live Demo)**:
- **Frontend**: https://taskflow.celox.io
- **Dashboard**: https://taskflow.celox.io/dashboard
- **Showcase**: https://taskflow.celox.io/showcase
- **Backend API**: https://taskflow.celox.io/api
- **Swagger UI**: https://taskflow.celox.io/swagger-ui.html

**Local Development**:
- **Frontend**: http://localhost:8090
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### Default Credentials

- **Admin**: `admin` / `admin123`
- **Demo User**: `demo` / `demo123`

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests with Testcontainers

```bash
cd backend
mvn verify
```

## 📚 API Documentation

**Live Demo**: [https://taskflow.celox.io/swagger-ui.html](https://taskflow.celox.io/swagger-ui.html)

**Local Development**: http://localhost:8080/swagger-ui.html

### Main Endpoints

**Authentication**:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

**Tasks**:
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

**Workflows**:
- `GET /api/v1/workflows` - Get all workflows
- `POST /api/v1/workflows` - Create workflow
- `PUT /api/v1/workflows/{id}` - Update workflow
- `DELETE /api/v1/workflows/{id}` - Delete workflow

**Database Integration**:
- `POST /api/v1/database/query` - Execute SQL query (SELECT only, with security validation)

**Code Execution**:
- `POST /api/v1/code/execute` - Execute JavaScript code in sandboxed GraalVM environment

**Credentials**:
- `GET /api/v1/credentials` - Get user credentials
- `POST /api/v1/credentials` - Create credential
- `DELETE /api/v1/credentials/{id}` - Delete credential

## 🌍 Production Deployment

The application is deployed and running at **[https://taskflow.celox.io](https://taskflow.celox.io)**

**Infrastructure**:
- ✅ HTTPS with Let's Encrypt SSL
- ✅ Nginx Reverse Proxy
- ✅ Docker Compose Orchestration
- ✅ PostgreSQL 15 Database
- ✅ Apache Kafka Event Streaming
- ✅ Automated Certificate Renewal

## 🐳 Docker Deployment

### Build Docker Images

```bash
# Backend
cd backend/task-service
docker build -t taskflow/task-service:latest .

cd ../notification-service
docker build -t taskflow/notification-service:latest .

# Frontend
cd ../../frontend
docker build -t taskflow/frontend:latest .
```

### Run with Docker Compose

```bash
cd infrastructure/docker
docker-compose up -d
```

## 📖 Documentation

- [Workflow Editor Guide](docs/WORKFLOW_EDITOR_GUIDE.md)
- [Workflow Editor Technical](docs/WORKFLOW_EDITOR_TECHNICAL.md)
- [Testing Guide](docs/TESTING.md)
- [Security Documentation](docs/SECURITY.md)
- [Database Integration Guide](docs/DATABASE_INTEGRATION.md)
- [Code Execution Guide](docs/CODE_EXECUTION.md)

## 🔧 Development

### Backend Development

```bash
cd backend
mvn spring-boot:run -pl task-service
```

### Frontend Development

```bash
cd frontend
npm start
```

## 🌟 Key Features Explained

### Event-Driven Architecture

Tasks emit events (created, updated, completed, deleted) to Kafka topics. The Notification Service consumes these events and sends notifications.

### Kafka Topics

- `task.created` - New task events
- `task.updated` - Task update events
- `task.completed` - Task completion events
- `task.deleted` - Task deletion events

### Design Patterns

- **Repository Pattern** - Data Access Layer
- **Factory Pattern** - Event Creation
- **Strategy Pattern** - Notification Types
- **Observer Pattern** - Event Handling
- **Builder Pattern** - DTOs & Entities

## 🔒 Security

The TaskFlow Platform includes comprehensive security measures:

- **SQL Injection Protection**: Multi-layer validation, keyword blocking, and pattern detection
- **JWT Authentication**: Secure token-based authentication
- **Query Restrictions**: Only SELECT and WITH queries allowed in Database Integration
- **Security Alert Logging**: All suspicious activity is logged and monitored

For detailed security documentation, see [docs/SECURITY.md](docs/SECURITY.md).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Copyright © 2026 Martin Pfeffer

## 👤 Author

**Martin Pfeffer** © 2026

- Website: [celox.io](https://celox.io)
- GitHub: [@pepperonas](https://github.com/pepperonas)
- Repository: [https://github.com/pepperonas/taskflow-platform](https://github.com/pepperonas/taskflow-platform)

## 🙏 Acknowledgments

- Spring Boot Team
- Apache Kafka Community
- React Team
- Material-UI Team

---

<div align="center">
Made with ❤️ by Martin Pfeffer | © 2026 celox.io
</div>
