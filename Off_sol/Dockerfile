# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

ARG VITE_API_URL
ARG VITE_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FILE_SERVICE_URL

COPY . .
# Vite build produces 'dist' folder
RUN pnpm build

# Serve Stage
FROM nginx:alpine
# Copy build artifacts from 'dist' to Nginx default directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
