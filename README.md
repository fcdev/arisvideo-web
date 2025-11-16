# ArisVideo Web

Next.js 14 dashboard for generating, tracking, and reviewing ArisVideo renders. It lives in the same repo as the FastAPI generator (`../arisvideo-python`) and proxies every browser request through local API routes before hitting the Python service.

## Prerequisites

- Node.js 18+
- Running instance of `arisvideo-python` (follow its README, ensure the same `PYTHON_API_KEY`)
- SQLite/Postgres connection string for Prisma (`DATABASE_URL`)

## Setup

```bash
cd arisvideo-web
npm install
npx prisma generate
```

Create `.env.local`:

```bash
PYTHON_SERVICE_URL=http://localhost:8000
PYTHON_API_KEY=super-secret-matches-python
DATABASE_URL="file:./dev.db"     # or postgres://...
JWT_SECRET="change-me"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Only set `NGROK_URL`, `VIDEO_GENERATION_ENDPOINT`, or `VIDEO_STATUS_ENDPOINT` if you need to override the defaults in `config/api.ts`; otherwise the app will infer URLs from `PYTHON_SERVICE_URL`.

## Available Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start the Next.js dev server on `http://localhost:3000` |
| `npm run lint` | TypeScript/ESLint checks (run before every commit) |
| `npm run build && npm start` | Production build and start |
| `npx prisma db push` | Apply Prisma schema to the configured database |

Smoke test each change by logging in, uploading context files, kicking off a generation, and refreshing the dashboard to confirm status polling works (per `AGENTS.md`).

## Backend Integration

The API routes under `app/api/` forward requests to `arisvideo-python`:

- `/api/upload` → `POST /upload`
- `/api/videos/generate` → `POST /generate`
- `/api/videos/status/[id]` → `GET /video`
- `/api/videos/file/[id]` → `GET /media/videos/:id`

Each route attaches `X-API-Key: process.env.PYTHON_API_KEY`, so keep the shared secret synchronized with the backend’s `PYTHON_API_KEY`. When developing locally, run both servers and keep `.env` + `.env.local` aligned.

## Troubleshooting Checklist

- `401 Missing X-API-Key`: ensure both apps export `PYTHON_API_KEY`.
- `FetchError connecting to FastAPI`: confirm `PYTHON_SERVICE_URL` is reachable from the Next.js server (especially when tunneling via ngrok).
- Prisma migration errors: verify `DATABASE_URL`, rerun `npx prisma generate`.

## References

- `../CLAUDE.md` for architecture diagrams.
- `../MIGRATION_GUIDE.md` for deployment sequencing.
- `HEADER_REDESIGN.md` & `UI_IMPROVEMENTS.md` for current UX plans.
