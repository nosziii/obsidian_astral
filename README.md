# obsidian_astral

Monorepó alapú webes stratégiai RPG prototípus Vue, Node, Prisma, PostgreSQL, Vite és Docker stackkel.

## Stack

- `apps/web`: Vue 3 + TypeScript + Vite
- `apps/api`: Node.js + Express + TypeScript + Prisma
- `packages/shared`: közös domain típusok és játékkonstansok
- `docker-compose.yml`: fejlesztői web, api és postgres szolgáltatások
- `docker-compose.prod.yml`: buildelt production stack

## Fejlesztés

1. Másold a `.env.example` fájlt `.env` néven.
2. Telepítés: `npm install`
3. Prisma kliens: `npm run db:generate`
4. Adatbázis séma: `npm run db:push`
5. Seed: `npm run db:seed`
6. Indítás: `docker compose up --build`

## Fejlesztői `.env`

A jelenlegi lokális dockeres fejlesztéshez ez a minta működik:

```env
NODE_ENV=development
POSTGRES_DB=obsidian_astral
POSTGRES_USER=obsidian
POSTGRES_PASSWORD=obsidian
POSTGRES_PORT=5432
DATABASE_URL=postgresql://obsidian:obsidian@db:5432/obsidian_astral?schema=public
DATABASE_URL_LOCAL=postgresql://obsidian:obsidian@localhost:5432/obsidian_astral?schema=public
API_PORT=4000
WEB_PORT=4173
WEB_HOST=0.0.0.0
POSTGRES_HOST=db
POSTGRES_INTERNAL_PORT=5432

VITE_API_BASE_URL=
VITE_PROXY_API_TARGET=http://api:4000
VITE_ALLOWED_HOSTS=localhost,127.0.0.1
VITE_DEV_SERVER_PORT=4173
VITE_HMR_ENABLED=true
VITE_HMR_PROTOCOL=ws
VITE_HMR_HOST=localhost
VITE_HMR_PORT=4173
VITE_HMR_CLIENT_PORT=4173
VITE_HMR_PATH=

CORS_ORIGIN=http://localhost:4173
DEFAULT_PLAYER_NAME=Parancsnok
DEFAULT_ADMIN_EMAIL=admin@obsidianastral.local
DEFAULT_ADMIN_PASSWORD=Admin1234
DEFAULT_PLAYER_EMAIL=player@obsidianastral.local
DEFAULT_PLAYER_PASSWORD=Player1234
```

## Production stack

1. Másold a `.env.production.example` fájlt `.env.production` néven.
2. Állítsd be a production jelszavakat és hostokat.
3. Indítás:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

Ebben a stackben:

- az API buildelt Node folyamattal fut
- a frontend buildelt statikus csomagként nginx alatt fut
- az nginx ugyanazon a hoston proxyzza az `/api` és `/health` útvonalakat az API konténer felé
- nincs Vite dev server és nincs HMR websocket

Production példa:

```env
NODE_ENV=production
POSTGRES_DB=obsidian_astral
POSTGRES_USER=obsidian
POSTGRES_PASSWORD=change_me
POSTGRES_HOST=db
POSTGRES_INTERNAL_PORT=5432
DATABASE_URL=postgresql://obsidian:change_me@db:5432/obsidian_astral?schema=public
API_PORT=4000
WEB_PORT=8080

VITE_API_BASE_URL=
CORS_ORIGIN=https://kalandjatek.eu

DEFAULT_PLAYER_NAME=Parancsnok
DEFAULT_ADMIN_EMAIL=admin@obsidianastral.local
DEFAULT_ADMIN_PASSWORD=Admin1234
DEFAULT_PLAYER_EMAIL=player@obsidianastral.local
DEFAULT_PLAYER_PASSWORD=Player1234
```

## Fontos változók

- `VITE_API_BASE_URL`: böngészőből elérhető API cím; ha üres, a kliens ugyanazon a hoston próbálja elérni az API-t
- `VITE_PROXY_API_TARGET`: a Vite dev szerver által proxyzott API cél, például `http://api:4000`
- `VITE_ALLOWED_HOSTS`: vesszővel elválasztott engedélyezett host lista a Vite `allowedHosts` beállításához
- `VITE_HMR_ENABLED`: `false` esetén a távoli HMR teljesen kikapcsolható
- `CORS_ORIGIN`: vesszővel elválasztott engedélyezett frontend origin lista az API-hoz

## Docker fájlok

- fejlesztői API: [docker/api.Dockerfile](C:/Users/meszaros.zsolt/dev/obsidian_astral/docker/api.Dockerfile)
- fejlesztői web: [docker/web.Dockerfile](C:/Users/meszaros.zsolt/dev/obsidian_astral/docker/web.Dockerfile)
- production API: [docker/api.prod.Dockerfile](C:/Users/meszaros.zsolt/dev/obsidian_astral/docker/api.prod.Dockerfile)
- production web: [docker/web.prod.Dockerfile](C:/Users/meszaros.zsolt/dev/obsidian_astral/docker/web.prod.Dockerfile)
- production nginx proxy: [docker/nginx.prod.conf](C:/Users/meszaros.zsolt/dev/obsidian_astral/docker/nginx.prod.conf)
