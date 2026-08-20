# DockForge

### Intelligent Containerization & Deployment Verification Engine

DockForge is an automated containerization engine that analyzes application projects, detects their technology stack and runtime requirements, generates Docker artifacts, and verifies the resulting containerized application before deployment.

Instead of manually writing Dockerfiles and Docker Compose configurations for every project, DockForge analyzes the project and builds the required containerization configuration automatically.

---

## 🚀 What is DockForge?

Containerizing an application manually usually involves several steps:

1. Understand the project's technology stack
2. Identify the runtime and version
3. Find the application entry point
4. Determine the build and start commands
5. Identify the application port
6. Detect required infrastructure services
7. Write a Dockerfile
8. Write Docker Compose configuration
9. Build the Docker image
10. Start the container
11. Verify that the application is actually running

DockForge automates this workflow.

Application Source
        │
        ▼
   Project Upload
        │
        ▼
     Extraction
        │
        ▼
   Source Scanning
        │
        ▼
 Technology Analysis
        │
        ▼
  Project Model
        │
        ▼
 Build Specification
        │
        ├───────────────┐
        ▼               ▼
   Dockerfile      Docker Compose
        │               │
        └───────┬───────┘
                ▼
          Configuration
            Validation
                │
                ▼
           Docker Build
                │
                ▼
        Runtime Verification
                │
                ▼
        Deployment Result

# ✨ Features

## 🔍 Intelligent Project Analysis

DockForge analyzes the uploaded project to identify:

* Programming language
* Framework
* Runtime version
* Package manager
* Dependencies
* Application entry point
* Build command
* Start command
* Application port
* Environment variables
* Infrastructure dependencies
* Application services


## 🐳 Automatic Dockerfile Generation

DockForge generates Dockerfiles based on the detected project characteristics.

It supports production-oriented multi-stage builds where applicable.

Example generated structure:

dockerfile

FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --no-audit

COPY . ./

FROM node:20

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app /app

USER node

EXPOSE 3000

CMD ["npm", "start"]


The generated Dockerfile is based on the detected project configuration rather than using a fixed template.

---

# 🔗 Docker Compose Generation

DockForge can generate Docker Compose configurations for applications that require additional services.

For example:

text
Application
     │
     ├── PostgreSQL
     │
     ├── Redis
     │
     └── Other infrastructure


Generated Compose configurations can include:

* Application services
* Database services
* Redis services
* Port mappings
* Environment variables
* Service dependencies
* Health checks
* Volumes
* Networks

---

# 🧪 Automated Verification

Generating a Dockerfile is not enough.

DockForge verifies whether the generated artifacts actually work.

The verification pipeline performs:


Docker Compose Validation
          ↓
Docker Image Build
          ↓
Compose Stack Startup
          ↓
Port Verification
          ↓
Application Health Check
          ↓
Cleanup

The runtime verification performs HTTP health checks with retry logic to account for applications that require startup time.

Example:

[Verify] Docker Compose: PASSED
[Verify] Docker build: PASSED
[Verify] Docker Compose stack started.
[Verify] Container port 3001 mapped to host port 3001
[Verify] Health check attempt 1/10
[Verify] Health check attempt 2/10: HTTP 200
[Verify] Runtime verification: PASSED


If a stage fails, DockForge reports the failure and its diagnostic information.


# 🧩 Supported Technologies

DockForge currently contains detection and generation logic for multiple technology ecosystems.

### Node.js

* Node.js
* Express
* Fastify
* NestJS
* npm
* package-lock.json
* JavaScript
* TypeScript

### Python

* Python
* Flask
* FastAPI
* requirements.txt
* pyproject.toml

### Java

* Java
* Spring Boot
* Maven
* Gradle

The architecture is designed to allow additional languages and frameworks to be added through new detectors and generation rules.

---

# 🏗️ Architecture

DockForge is organized as a pipeline rather than a single Dockerfile generator.

┌──────────────────────┐
│   Project Upload     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Archive Extraction  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Project Scanner    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Technology Detectors │
│                      │
│ Node │ Python │ Java │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Project Model      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Build Spec Engine   │
└──────────┬───────────┘
           │
           ├───────────────┐
           ▼               ▼
┌─────────────────┐ ┌──────────────────┐
│ Dockerfile Gen. │ │ Compose Generator│
└────────┬────────┘ └─────────┬────────┘
         │                    │
         └─────────┬──────────┘
                   ▼
          ┌─────────────────┐
          │ Artifact         │
          │ Validation       │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Docker Build     │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Runtime          │
          │ Verification     │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Deployment Result│
          └─────────────────┘

---

# 🛠️ Technology Stack

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Node.js        | Backend runtime                |
| Express.js     | REST API                       |
| Docker         | Containerization               |
| Docker Compose | Multi-container orchestration  |
| Redis          | Job/state management           |
| JavaScript     | Backend implementation         |
| Docker CLI     | Build and runtime verification |

---

# 📁 Project Structure

DockForge/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── detectors/
│   │   ├── jobs/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── workspaces/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   └── package.json
│
└── README.md

---

# ⚙️ Prerequisites

Before running DockForge, make sure you have:

* Node.js 20+
* npm
* Docker
* Docker Compose
* Redis

Check the installations:

node --version
npm --version
docker --version
docker compose version

Check Redis:

redis-cli ping

Expected:

PONG

---

# 📥 Installation

Clone the repository:

git clone https://github.com/Hemanth1372/DockForge.git

Enter the project:

cd DockForge

---

# 🔧 Backend Setup

Move into the backend:

cd backend

Install dependencies:

npm install

Create the environment file:

cp .env.example .env

Configure the required environment variables in `.env`.

Start the backend:

npm run dev


The backend should start on:

http://localhost:5000

---

# 🎨 Frontend Setup

Open another terminal:

cd DockForge/frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

Vite will display the local frontend URL, typically:

http://localhost:5173

---

# ▶️ Using DockForge

## Step 1 — Start DockForge

Start Redis:

redis-server

Start the backend:

cd backend
npm run dev

Start the frontend:


cd frontend
npm run dev

---

## Step 2 — Open the Dashboard

Open the frontend URL shown by Vite.

You should see the DockForge dashboard.

---

## Step 3 — Upload a Project

Upload your application as a `.zip` archive.

For example:

my-node-app.zip

DockForge extracts the project into an isolated workspace.

---

## Step 4 — Analysis

DockForge scans the project and detects information such as:

Language: Node.js
Framework: Express.js
Runtime: Node 20
Package Manager: npm
Entry Point: src/index.js
Start Command: npm start
Port: 3000

---

## Step 5 — Artifact Generation

DockForge generates:

Dockerfile
docker-compose.yml

based on the detected project configuration.

---

## Step 6 — Verification

DockForge automatically:

1. Validates Docker Compose
2. Builds the Docker image
3. Starts the Compose stack
4. Determines the mapped application port
5. Performs HTTP health checks
6. Reports the verification result
7. Removes the temporary verification stack

---

# 📊 Verification Result

A successful deployment produces results similar to:

Compose valid: true
Build valid: true
Runtime valid: true

A failed deployment provides diagnostic information such as:

Compose valid: false
Build valid: false
Runtime valid: false

along with the relevant error.

---

# 🔄 Pipeline States

DockForge maintains structured pipeline stages:

UPLOADED
    ↓
EXTRACTING
    ↓
SCANNING
    ↓
ANALYZING
    ↓
GENERATING
    ↓
VALIDATING
    ↓
BUILDING
    ↓
VERIFYING
    ↓
COMPLETED

Failures are captured at the stage where they occur.

---

# 🧠 Design Principles

DockForge follows several important design principles.

### Detection before generation

The system does not blindly generate a generic Dockerfile.

Instead:

Detect → Model → Generate

### Generate before execution

Generated artifacts are validated before runtime execution.

Generate
   ↓
Validate
   ↓
Build
   ↓
Run
   ↓
Verify

### Runtime verification

A successful Docker build does not necessarily mean the application works.

DockForge therefore verifies the running application through HTTP health checks.

### Technology-specific generation

Different ecosystems require different containerization strategies.

DockForge therefore uses technology-specific detectors and generation logic rather than a single universal template.

---

# 📈 Benchmarking

DockForge is being evaluated across a heterogeneous collection of application repositories.

The benchmark measures:

* Technology detection accuracy
* Dockerfile generation success
* Docker Compose validation success
* Docker build success
* Runtime verification success
* End-to-end deployment success
* Pipeline latency

The benchmark is intended to measure the reliability of automated containerization across different technology stacks.

---

# 🚧 Current Limitations

DockForge is an active development project.

Current limitations include:

* Some uncommon project structures may not be detected correctly.
* Complex monorepos may require additional analysis rules.
* Projects with highly customized build systems may require manual configuration.
* Runtime verification currently relies primarily on HTTP health checks.
* Infrastructure detection is limited to supported service patterns.
* Generated configurations may require customization for production-specific requirements.

---

# 🔮 Future Improvements

Planned improvements include:

* Broader language and framework support
* Improved monorepo detection
* More robust source-code analysis
* Automatic dependency graph generation
* Improved infrastructure detection
* Kubernetes manifest generation
* Cloud deployment integration
* Better failure recovery
* Deployment caching
* Comprehensive benchmark suite
* CI/CD integration

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

git checkout -b feature/my-feature

3. Make your changes
4. Commit your changes

git commit -m "Add my feature"

5. Push the branch

git push origin feature/my-feature

6. Open a Pull Request

---

# 📄 License

This project is currently maintained as a personal/academic project.

See the repository for licensing information.

---

# 👨‍💻 Author

**Hemanth Guntuku**

GitHub:

[https://github.com/Hemanth1372](https://github.com/Hemanth1372)

Project:

[https://github.com/Hemanth1372/DockForge](https://github.com/Hemanth1372/DockForge)


### One thing I'd change before you push this

I **intentionally did not put the `85% / 88% / 90s` numbers into the README**. We haven't actually completed the 30-project benchmark yet, so putting those numbers there would make the README claim measurements we haven't established.

Once we finish the benchmark, add a section like:

```markdown
## 📊 Benchmark Results

DockForge was evaluated across 30 heterogeneous projects:

| Metric | Result |
|---|---:|
| Technology Detection Accuracy | XX% |
| Docker Build Success | XX% |
| Compose Validation Success | XX% |
| Runtime Verification Success | XX% |
| End-to-End Deployment Success | XX% |
| P95 Pipeline Latency | XXs |
````

That will make the GitHub project much stronger because the README will show **measured engineering results**, not just a list of features.
