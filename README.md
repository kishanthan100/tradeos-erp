# Tradeos ERP

A full-stack ERP and inventory management system built with a modern, production-grade architecture. Tradeos ERP handles sales orders, inventory tracking, customer management, user authentication, and analytics through a clean, scalable design.

## Overview

Tradeos ERP is designed around enterprise patterns for maintainability and scale:

- **Sales Order Management** — create, edit, and track sales with real-time stock validation
- **Inventory & Stock Tracking** — accurate stock levels enforced at the database transaction level
- **Customer Management** — centralized customer records tied to sales history
- **Authentication** — secure, cookie-based JWT authentication with role-based access control
- **Dashboard & Analytics** — aggregated business insights via interactive charts

## Tech Stack

### Backend
- **FastAPI** — async Python web framework
- **SQLAlchemy (async ORM)** — database layer with repository pattern
- **PostgreSQL** — primary datastore (`asyncpg` driver)
- **Alembic** — database migrations
- **Pydantic v2** — request/response validation and settings management
- **Gunicorn + Uvicorn workers** — production ASGI serving
- **uv** — Python dependency management

### Frontend
- **React + TypeScript**
- **Vite** — build tooling
- **TanStack Query** — server state management
- **Tailwind CSS** — styling
- **Recharts** — data visualization
- **React Router** — client-side routing

### Infrastructure & DevOps
- **AWS ECS Fargate** — backend container orchestration
- **AWS ECR** — container image registry
- **AWS S3 + CloudFront** — frontend hosting and CDN
- **AWS RDS** — managed PostgreSQL in production
- **AWS Secrets Manager / SSM** — runtime secrets injection
- **GitHub Actions** — CI/CD pipelines
- **Docker / Podman** — containerization

## Architecture

**Backend** follows a strict three-layer separation of concerns:

```
Route (HTTP, dependency injection)
   ↓
Service (business logic, transactions)
   ↓
Repository (raw database queries)
```

**Frontend** follows a feature-folder structure:

```
features/
  <domain>/
    services/   → API calls (via centralized apiClient)
    hooks/      → React Query hooks
    pages/      → Page-level components
```

All API communication is routed through a single, centralized `apiClient` — components never call the API directly.

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (locally via OrbStack, or any local instance)
- `uv` for Python package management

### Backend Setup

```bash
cd backend
uv sync
cp .env.example .env   # configure DATABASE_URL, JWT secrets, etc.
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Backend expects a `.env` file (excluded from version control and Docker images) containing at minimum:

```
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
```

## Deployment

Tradeos ERP is deployed on AWS:

- **Backend** runs as a containerized service on **ECS Fargate**, behind an **Application Load Balancer**, with images stored in **ECR** and tagged by Git SHA.
- **Frontend** is built as static assets and served via **S3 + CloudFront**, using single-domain path routing (`/*` → S3, `/api/*` → ALB) to preserve cookie-based auth across origins.
- **Secrets** are injected at runtime through ECS task definitions, sourced from Secrets Manager/SSM — never baked into images.
- **CI/CD** is handled via GitHub Actions, with path-filtered workflows per service directory.

## Development Principles

- Business rules (stock deduction, duplicate prevention) are enforced in the **service layer**, inside single database transactions — never trusted from the client.
- Row-level locking with consistent lock ordering is used to prevent race conditions on concurrent stock updates.
- Type boundaries (e.g., UUIDs) are validated at the API layer so malformed input is rejected before it reaches the database.
- Authentication failures are distinguished correctly: `401` for unauthenticated requests, `403` for authenticated-but-unauthorized requests.

## Project Status

Actively in development. Current focus areas include finalizing the ECS Fargate deployment pipeline, migrating the frontend to S3 + CloudFront, and resolving edge cases in sales item stock validation.

## License

Specify your license here (e.g., MIT).