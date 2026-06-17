# ─────────────────────────────────────────
# Stage 1 — Build React app
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching — only re-runs npm ci if these change)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
# Output lives in /app/dist


# ─────────────────────────────────────────
# Stage 2 — Serve with Nginx
# ─────────────────────────────────────────
FROM nginx:alpine

# Copy built files from stage 1 — node_modules never enters this image
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]