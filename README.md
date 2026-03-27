# obsidian_astral

Monorepó alapú webes stratégiai RPG prototípus Vue, Node, Prisma, PostgreSQL, Vite és Docker stackkel.

## Stack

- `apps/web`: Vue 3 + TypeScript + Vite
- `apps/api`: Node.js + Express + TypeScript + Prisma
- `packages/shared`: közös domain típusok és játékkonstansok
- `docker-compose.yml`: web, api és postgres szolgáltatások

## Fejlesztés

1. Másold a `.env.example` fájlt `.env` néven.
2. Telepítés: `npm install`
3. Prisma kliens: `npm run db:generate`
4. Adatbázis séma: `npm run db:push`
5. Seed: `npm run db:seed`
6. Indítás: `npm run dev`

## Docker

- Indítás: `docker compose up --build`

