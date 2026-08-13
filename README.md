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
│   │   └── permissions.py       # IsRoleAdmin guard
│   ├── api/                     # API router + Swagger/OpenAPI
│   │   ├── urls.py              # Aggregates all feature routes
│   │   └── schema.py            # drf-spectacular docs
│   ├── cph_app/                 # Auth & users (JWT + Google One Tap)
│   ├── consultants/             # Consultant / Specialization / Availability
│   ├── appointments/            # Bookings & schedules
│   ├── blogs/                   # Blog / category / tags
│   ├── assessments/             # Quiz engine (Quiz / Question / AnswerOption / ScoreRange / QuizResult)
│   ├── seeders/                 # `seed_all`, `seed_quizzes`, `seed_consultants`
│   ├── tests/                   # Generic pytest setup + smoke tests
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                    # Next.js App Router (no src/ directory)
│   ├── app/
│   │   ├── (auth)/auth/login    # /auth/login
│   │   ├── (dashboard)/dashboard/…  # /dashboard + 12 role pages (protected)
│   │   ├── @modal/              # Parallel/intercepting routes (consultant, join-as-therapist)
│   │   ├── layout.js            # Root layout (Navbar / Footer)
│   │   ├── page.js              # Home
│   │   ├── about-us · services · join-as-therapist · booking/[slug] · consultant/[slug] · blog/[slug] · assessment/[slug] · assessment/result/[id]
│   ├── components/
│   │   ├── Landing/             # Landing page sections
│   │   ├── auth/                # LoginDrawer, RegisterDrawer, GoogleOneTap
│   │   ├── shared/              # AuthGuard, BlogCard, Loaders...
│   │   ├── dashboard/           # AdminDashboard, ConsultantDashboard, ui/* (StatCard, StatusBadge, PageHeader, EmptyState, LoadingState, ConfirmDialog, AppointmentCard, WellnessTip)
│   │   ├── ui/                  # shadcn/ui primitives
│   ├── lib/                     # Axios instance, utils, roles, status, motion, authGate
│   ├── store/                   # Zustand stores (authStore, uiStore)
│   ├── services/                # API service modules (appointment, assessment, blog, consultant)
│   ├── hooks/                   # useDebounce, useHeaderHeight
│   ├── types/                   # Shared JS type references
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
python manage.py seed_all       # seed consultants + specializations + quizzes
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
| `backend/.env` | `SECRET_KEY`, `DEBUG`, `DATABASE_URL` *or* `DB_*`, `GOOGLE_CLIENT_ID`, Cloudinary, CORS/CSRF origins, Resend `RESEND_API_KEY` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_BASE_URL` |

Database resolution order (see `backend/core/db.py`):
1. `DATABASE_URL` (connection string, e.g. Supabase/Railway)
2. `DB_NAME` + `DB_USER` + `DB_PASSWORD` + `DB_HOST` + `DB_PORT`
3. SQLite fallback (dev only — the server never fails to boot)

---

## API Endpoints

| Area | Base path |
|---|---|
| Auth | `/api/auth/` — register, login, logout, refresh, **google**, me, me/update, users, change-password |
| Consultants | `/api/consultants/` — list, detail, specializations, availability, **apply/create**, admin list/create/update/verify |
| Appointments | `/api/appointments/` — create, list, detail, status, booked-slots, **admin stats + analytics** |
| Assessments | `/api/assessments/` — list, detail (`<slug>`), submit, results, result detail |
| Blogs | `/api/blogs/` — list, detail, **featured**, categories, tags, admin CRUD |
| Docs | `/api/schema/`, `/api/docs/`, `/api/redoc/` |

---

## Auth Model

JWT via SimpleJWT stored in **HttpOnly cookies** (`access_token`, `refresh_token`), plus **Google One Tap** (`/api/auth/google/`). Roles: `client`, `consultant`, `admin`.

Session handling on the frontend is now fully client-side — there is **no `middleware.js` / `proxy.js`**:
- `AuthGuard` (`frontend/components/shared/AuthGuard.jsx`) verifies the session against `/api/auth/me/` and blocks by `allowedRoles`. Wraps every `/dashboard` page.
- `(dashboard)/dashboard/layout.jsx` renders a role-aware sidebar (`NAV_SECTIONS`) and gates sections per role.
- `lib/authGate.js` + `store/uiStore` open the **LoginDrawer** in place and store a resume path for post-login redirect.

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
- Frontend build uses **React Compiler** and `output: 'standalone'` (`next.config.mjs`).