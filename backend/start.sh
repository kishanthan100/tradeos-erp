#!/bin/bash
set -e

echo "Running migrations..."
alembic upgrade head

echo "Seeding initial user..."
python seed.py 

echo "Starting server..."
exec gunicorn app.main:app \
     --worker-class uvicorn.workers.UvicornWorker \
     --workers 3 \
     --bind 0.0.0.0:8000 \
     --timeout 120 \
     --access-logfile - \
     --error-logfile -