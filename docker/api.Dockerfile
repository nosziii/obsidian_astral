FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm config set strict-ssl false && npm install

RUN npm run prisma:generate --workspace @obsidian-astral/api

EXPOSE 4000

CMD ["sh", "-c", "node -e \"const net=require('node:net'); const host=process.env.POSTGRES_HOST||'db'; const port=Number(process.env.POSTGRES_INTERNAL_PORT||5432); const tryConnect=()=>{const socket=net.connect(port, host); socket.on('connect',()=>{socket.end(); process.exit(0);}); socket.on('error',()=>setTimeout(tryConnect, 2000));}; tryConnect();\" && npm run prisma:push --workspace @obsidian-astral/api && npm run prisma:seed --workspace @obsidian-astral/api && npm run dev --workspace @obsidian-astral/api"]
