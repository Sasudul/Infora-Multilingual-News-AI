# Infora — Spring Boot Backend (REST API)

> Spring Boot 3.2 REST API for **Infora** — the core backend serving news retrieval, government service guidance, and chat orchestration, using **Firebase (Firestore)** as the database.

## Tech Stack

| Technology            | Purpose                                      |
|-----------------------|----------------------------------------------|
| **Java 17+**          | Language runtime                             |
| **Spring Boot 3.2**   | REST API framework                           |
| **Firebase Admin SDK**| Firestore, Auth, Storage access              |
| **Spring Security**   | Firebase token verification (planned)        |
| **SpringDoc OpenAPI** | Swagger UI for API documentation             |
| **Lombok**            | Boilerplate reduction                        |
| **Maven**             | Build & dependency management                |
| **IntelliJ IDEA**     | Recommended IDE                              |

## Folder Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/infora/backend/
│   │   │   ├── InforaBackendApplication.java    # Entry point
│   │   │   ├── config/                          # Firebase, CORS, Security configs
│   │   │   ├── controller/                      # REST controllers
│   │   │   ├── service/                         # Business logic
│   │   │   ├── repository/                      # Firestore data access
│   │   │   ├── model/                           # Domain models / entities
│   │   │   ├── dto/                             # Request/Response DTOs
│   │   │   └── exception/                       # Custom exceptions & handlers
│   │   └── resources/
│   │       ├── application.properties           # Main config
│   │       ├── application-dev.properties       # Dev profile overrides
│   │       └── firebase-service-account.json    # 🔒 (git-ignored!)
│   └── test/
│       └── java/com/infora/backend/             # Unit & integration tests
├── pom.xml                                      # Maven config & dependencies
└── README.md                                    # ← You are here
```

## Getting Started

### Prerequisites

- **Java 17+** (JDK) — [Download](https://adoptium.net/)
- **Maven 3.8+** — usually bundled with IntelliJ IDEA
- **IntelliJ IDEA** — [Download](https://www.jetbrains.com/idea/)
- **Firebase project** with a service account key

### Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com) → **Project Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Save the downloaded JSON file to:
   ```
   backend/src/main/resources/firebase-service-account.json
   ```
4. ⚠️ **This file is git-ignored. NEVER commit it.**

### Running the Backend

#### From IntelliJ IDEA

1. Open the `backend/` folder (or the root mono-repo) in IntelliJ IDEA
2. IntelliJ will auto-detect the Maven project and import dependencies
3. Run `InforaBackendApplication.java` → right-click → **Run**
4. The API starts at: **http://localhost:8080**

#### From Terminal (Maven)

```bash
cd backend
mvn spring-boot:run
```

Or with the dev profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Verify It's Running

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "Infora Backend API",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### API Documentation (Swagger)

Once the backend is running, open:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

## API Endpoints (planned)

| Method | Endpoint                       | Description                         |
|--------|--------------------------------|-------------------------------------|
| GET    | `/api/health`                  | Health check                        |
| GET    | `/api/v1/news`                 | Fetch cached news articles          |
| GET    | `/api/v1/news/{id}`            | Get a specific news article         |
| GET    | `/api/v1/services`             | List government services            |
| GET    | `/api/v1/services/{id}/steps`  | Get steps for a government service  |
| POST   | `/api/v1/chat`                 | Send a chat message                 |
| GET    | `/api/v1/chat/{sessionId}`     | Get chat session history            |
| POST   | `/api/v1/auth/verify`          | Verify Firebase ID token            |

## Dependencies Summary

| Dependency             | Version  | Purpose                            |
|------------------------|----------|------------------------------------|
| Spring Boot            | 3.2.5    | Application framework              |
| Firebase Admin SDK     | 9.3.0    | Firestore, Auth, Storage           |
| SpringDoc OpenAPI      | 2.5.0    | Swagger / API docs                 |
| Lombok                 | managed  | @Data, @Builder, @Slf4j           |
| Spring Security        | managed  | Authentication & authorization     |

---

_This module is part of the [Infora mono-repo](../README.md)._
