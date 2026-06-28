# ─────────────────────────────────────────
# Stage 1 — Install dependencies with uv
# ─────────────────────────────────────────
FROM python:3.13-slim AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy dependency files first (layer caching)
COPY pyproject.toml uv.lock* ./

# Install dependencies into /app/.venv
RUN uv sync --frozen --no-dev
RUN ls -la /app/.venv/bin/ | grep gunicorn || echo "GUNICORN NOT FOUND!"


# ─────────────────────────────────────────
# Stage 2 — Production image
# ─────────────────────────────────────────
FROM python:3.13-slim

WORKDIR /app

# Copy the venv from builder (no uv needed at runtime)
COPY --from=builder /app/.venv /app/.venv

# Copy application source
COPY . .
COPY start.sh .                    
RUN chmod +x start.sh 

# Make venv binaries available
ENV PATH="/app/.venv/bin:$PATH"

# Don't buffer Python logs (see them in docker logs immediately)
ENV PYTHONUNBUFFERED=1

# Don't write .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

EXPOSE 8000
CMD ["./start.sh"]