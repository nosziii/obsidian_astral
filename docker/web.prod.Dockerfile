FROM node:22-bookworm-slim AS builder

WORKDIR /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY . .

RUN npm config set strict-ssl false && npm install
RUN npm run build

FROM nginx:1.29-alpine AS runner

COPY docker/nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
