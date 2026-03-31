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

## Környezeti változók

- `DATABASE_URL`: dockeres PostgreSQL kapcsolat
- `DATABASE_URL_LOCAL`: helyi Prisma parancsokhoz használt kapcsolat
- `API_PORT`: API port
- `WEB_PORT`: web kliens port
- `WEB_HOST`: Vite bind host
- `VITE_DEV_SERVER_PORT`: fejlesztői Vite port
- `VITE_API_BASE_URL`: böngészőből elérhető API cím; ha üres, a kliens ugyanazon a hoston próbálja elérni az API-t
- `VITE_PROXY_API_TARGET`: a Vite dev szerver által proxyzott API cél, például `http://api:4000`
- `VITE_ALLOWED_HOSTS`: vesszővel elválasztott engedélyezett host lista a Vite `allowedHosts` beállításához
- `VITE_HMR_ENABLED`: `false` esetén a távoli HMR teljesen kikapcsolható
- `VITE_HMR_PROTOCOL`: Vite HMR websocket protokoll, például `ws` vagy `wss`
- `VITE_HMR_HOST`: Vite HMR websocket host
- `VITE_HMR_PORT`: a Vite szerver websocket portja
- `VITE_HMR_CLIENT_PORT`: a böngésző felől használt websocket port
- `VITE_HMR_PATH`: opcionális websocket path reverse proxy mögött
- `CORS_ORIGIN`: vesszővel elválasztott engedélyezett frontend origin lista az API-hoz
- `POSTGRES_HOST`: dockeres adatbázis host
- `POSTGRES_INTERNAL_PORT`: dockeres adatbázis belső port

## Deploy példa

Ha a kliens `https://kalandjatek.eu` alatt fut, az API pedig a docker hálózaton belül az `api` service néven érhető el, és a domain a web konténerre mutat:

```env
VITE_API_BASE_URL=
VITE_PROXY_API_TARGET=http://api:4000
VITE_ALLOWED_HOSTS=kalandjatek.eu,localhost,127.0.0.1
VITE_HMR_ENABLED=false
CORS_ORIGIN=https://kalandjatek.eu,http://localhost:4173
```

Ez a felállás azt jelenti:

- a böngésző `https://kalandjatek.eu/api/...` címet hív
- a Vite dev szerver ezt továbbproxyzza az `api` konténer felé
- a HMR ki van kapcsolva, így nem lesz websocket hiba, ha a reverse proxy nem kezeli az upgrade-et

Ha mégis szükséged van távoli HMR-re, akkor a reverse proxy oldalán a websocket upgrade-et is engedni kell, és ezekre a változókra lesz szükség:

```env
VITE_HMR_ENABLED=true
VITE_HMR_PROTOCOL=wss
VITE_HMR_HOST=kalandjatek.eu
VITE_HMR_PORT=443
VITE_HMR_CLIENT_PORT=443
VITE_HMR_PATH=
```

Ha nincs szükséged élő Vite HMR-re, akkor érdemesebb production buildet kiszolgálni, nem a dev servert.

## Docker

- Indítás: `docker compose up --build`
