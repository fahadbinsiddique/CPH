# Center for Psychology Health — Django + Next.js Template

A clean, modular monorepo: **Django 6 + DRF** API backend and a **Next.js (App Router)** storefront. Auth is JWT (SimpleJWT) in HttpOnly cookies with role-based client / consultant / admin dashboards.

![Backend](https://img.shields.io/badge/Backend-Django%206-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2016-black)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

---

## Repository Structure

```
CPH/
├── backend/                     # Django REST Framework API
│   ├── config/                  # Project package
│   │   ├── settings/
│   │   │   ├── base.py          # Shared settings (env-agnostic)
│   │   │   ├── dev.py           # Local / docker-compose
│   │   │   ├── prod.py          # Production hardened
│   │   │   └── test.py          # In-memory SQLite for tests
│   │   ├── urls.py              # Routes -> api package
│   │   ├── wsgi.py / asgi.py
│   ├── core/                    # Shared utilities
│   │   ├── db.py                # Fallback-safe database resolver
│   │   ├── exceptions.py        # DRF exception handler
│   │   ├── models.py            # Base/timestamped models
│   │   └── permissions.py
│   ├── api/                     # API router + Swagger/OpenAPI
│   │   ├── urls.py              # Aggregates all feature routes
│   │   └── schema.py            # drf-spectacular docs
│   ├── cph_app/                 # Auth & users (JWT)
│   ├── consultants/             # Consultant / Specialization / Availability
│   ├── appointments/            # Bookings & schedules
│   ├── blogs/                   # Blog / category / tags
│   ├── assessments/             # (stub — not wired yet)
│   ├── seeders/                 # `seed_all`, `seed_consultants`
│   ├── tests/                   # Generic pytest setup + smoke tests
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                    # Next.js App Router (no src/ directory)
│   ├── app/
│   │   ├── (auth)/auth/login    # /auth/login
│   │   ├── (dashboard)/dashboard…  # /dashboard + role pages (protected)
│   │   ├── layout.js            # Root layout (Navbar / Footer)
│   │   ├── page.js              # Home
│   │   ├── about-us · services · booking · consultant · blog
│   ├── components/              # Reusable UI (Landing, layout, shared, ui)
│   ├── lib/                     # Axios instance, utils
│   ├── store/                   # Zustand auth store
│   ├── services/                # API service modules
│   ├── middleware.js            # Route guard (cookie check on /dashboard)
│   ├── hooks/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml           # postgres + backend + frontend
├── .gitignore
└── README.md
```

> **Path aliasing:** `frontend/jsconfig.json` maps `@/*` → `./*` (project root), so imports work without a `src/` wrapper.

---

## Getting Started (local)

### Prerequisites
- Python ≥ 3.11, Node ≥ 18, PostgreSQL ≥ 14 (optional — SQLite fallback in dev).

### 1. Backend

```bash
cd backend
python -m venv env
env\Scripts\activate            # Windows   (source env/bin/activate on Mac/Linux)
pip install -r requirements.txt

# create backend/.env from the template
Copy-Item .env.example .env     # Windows
# cp .env.example .env           # Mac/Linux

python manage.py migrate
python manage.py seed_all       # seed consultants + specializations
python manage.py createsuperuser
python manage.py runserver       # http://127.0.0.1:8000
```

- Admin: `http://127.0.0.1:8000/admin`
- Swagger UI: `http://127.0.0.1:8000/api/docs/`
- OpenAPI schema: `http://127.0.0.1:8000/api/schema/`

### 2. Frontend

```bash
cd frontend
npm install

# create frontend/.env.local
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

npm run dev                      # http://localhost:3000
```

---

## Docker (full local stack)

```bash
docker compose up -d --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Postgres: `localhost:5432` (`cph`/`cph`/`cph`)

---

## Environment Variables

| File | Purpose |
|---|---|
| `backend/.env` | `SECRET_KEY`, `DEBUG`, `DATABASE_URL` *or* `DB_*`, Cloudinary, CORS/CSRF origins |
| `frontend/.env.local` | `NEXT_PUBLIC_API_BASE_URL` |

Database resolution order (see `backend/core/db.py`):
1. `DATABASE_URL` (connection string, e.g. Supabase/Railway)
2. `DB_NAME` + `DB_USER` + `DB_PASSWORD` + `DB_HOST` + `DB_PORT`
3. SQLite fallback (dev only — the server never fails to boot)

---

## API Endpoints

| Area | Base path |
|---|---|
| Auth | `/api/auth/` — register, login, logout, refresh, me, change-password, users |
| Consultants | `/api/consultants/` — list, detail, specializations, availability, admin CRUD |
| Appointments | `/api/appointments/` — create, list, status, booked-slots, admin stats |
| Blogs | `/api/blogs/` — list, detail, featured, categories, tags, admin CRUD |
| Docs | `/api/schema/`, `/api/docs/`, `/api/redoc/` |

---

## Auth Model

JWT via SimpleJWT stored in **HttpOnly cookies** (`access_token`, `refresh_token`):
- Middleware (`frontend/middleware.js`) guards `/dashboard` by checking for cookies.
- `AuthGuard` (`frontend/components/shared/AuthGuard.jsx`) verifies the session against `/api/auth/me/` before rendering protected pages.
- Roles: `client`, `consultant`, `admin` (role-based dashboards).

> Next.js 16 deprecates the `middleware.js` filename in favour of `proxy.js`.
> The current `middleware.js` works and matches the requested layout; rename to
> `proxy.js` to remove the deprecation warning.

---

## Tests

```bash
cd backend
python -m pytest                # uses config.settings.test (in-memory SQLite)
```

---

## Production Notes

- Set `DJANGO_SETTINGS_MODULE=config.settings.prod` and `DEBUG=False`.
- Provide `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, and a `DATABASE_URL` with `DB_SSL_REQUIRE=True`.
- `prod.py` enables secure cookies (HTTPS) and `SECURE_PROXY_SSL_HEADER`.
- Backend deploy command: `gunicorn config.wsgi:application --bind 0.0.0.0:8000`.