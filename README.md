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
- 📊 **RESTful API** with OpenAPI documentation
- 🎨 **Modern UI** with Material-UI
- 🐳 **Containerized** with Docker & Docker Compose
- 🧪 **Comprehensive Tests** (Unit, Integration, E2E)
- 🚀 **CI/CD Pipeline** with GitHub Actions

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

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/tasks` - Get all tasks
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

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

- [Architecture Documentation](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Testing Guide](docs/TESTING.md)

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
