FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY . .

RUN npm config set strict-ssl false && npm install

WORKDIR /app/apps/web

EXPOSE 4173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4173"]
