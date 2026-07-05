# Center for Psychology Platform

A modern, full-stack mental wellness and online counseling platform built with Next.js and Django REST Framework.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black)
![Backend](https://img.shields.io/badge/Backend-Django%204.2-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roles & Permissions](#roles--permissions)
- [Dashboard Features](#dashboard-features)
- [Assessment Quizzes](#assessment-quizzes)
- [Email Notifications](#email-notifications)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## Overview

**Center for Psychology** is a production-grade mental health platform where users can:

- Browse and book sessions with verified consultants
- Take standardized mental health assessments (PSS-10, GAD-7, PHQ-9, Burnout)
- Read SEO-optimized mental wellness blog articles
- Manage appointments through role-based dashboards
- Receive email notifications for all booking activities

---

## Features

### Public
- Consultant directory with search and specialization filter
- Individual consultant profile pages with availability schedule
- Mental health blog with categories, tags, and featured posts
- Mental health assessment quizzes with instant scoring

### Client
- Register/login with secure JWT authentication
- Book appointments with date, time slot, and session type selection
- View booking history with status tracking
- Take assessments and view result history
- Manage profile and change password

### Consultant
- View today's appointments and pending requests
- Confirm, cancel, or complete appointments
- Add session notes for completed appointments
- Manage weekly availability schedule
- View patient list and session history

### Admin
- Platform statistics overview
- User management — view all clients and consultants
- Consultant CRUD — create, edit, delete, verify/revoke
- Specialization CRUD — manage all specialization categories
- Appointment overview across all users
- Blog management — create, edit, publish/draft, delete posts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, JSX) |
| UI Library | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| State Management | Zustand |
| HTTP Client | Axios |
| Backend | Django 4.2 + Django REST Framework |
| Authentication | JWT (SimpleJWT) + HTTP-only Cookies |
| Database | PostgreSQL |
| Media Storage | Cloudinary |
| Email Service | Resend |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway / VPS |

---

## Project Structure

### Frontend (`center-for-psychology/`)

```
src/
├── app/
│   ├── (public)/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── consultant/
│   │   ├── page.jsx              # Consultant listing
│   │   └── [slug]/page.jsx       # Consultant profile
│   ├── booking/
│   │   └── [slug]/page.jsx       # 4-step booking flow
│   ├── blog/
│   │   ├── page.jsx              # Blog listing
│   │   └── [slug]/page.jsx       # Blog detail
│   ├── assessment/
│   │   ├── page.jsx              # Quiz listing
│   │   ├── [slug]/page.jsx       # Quiz page
│   │   └── result/[id]/page.jsx  # Result page
│   └── dashboard/
│       ├── layout.jsx            # Sidebar + AuthGuard
│       ├── page.jsx              # Role-based overview
│       ├── bookings/             # Client bookings
│       ├── appointments/         # Consultant appointments
│       ├── availability/         # Consultant schedule
│       ├── patients/             # Consultant patient list
│       ├── assessments/          # Assessment history
│       ├── profile/
│       ├── settings/
│       ├── users/                # Admin
│       ├── consultants/          # Admin
│       ├── specializations/      # Admin
│       ├── blogs/                # Admin
│       └── analytics/            # Admin
│
├── components/
│   ├── shared/
│   │   ├── AuthGuard.jsx
│   │   ├── ConsultantCard.jsx
│   │   └── BlogCard.jsx
│   ├── dashboard/
│   │   ├── ConsultantDashboard.jsx
│   │   └── AdminDashboard.jsx
│   └── ui/                       # shadcn/ui components
│
├── services/
│   ├── consultantService.js
│   ├── appointmentService.js
│   ├── blogService.js
│   └── assessmentService.js
│
├── store/
│   └── authStore.js              # Zustand auth state
│
├── lib/
│   └── api.js                    # Axios instance + interceptors
│
└── hooks/
    └── useDebounce.js
```

### Backend (`psychology-backend/`)

```
config/
├── settings.py
├── urls.py
├── wsgi.py
└── email_utils.py                # Resend email helpers

apps/
├── users/
│   ├── models.py                 # Custom User model
│   ├── serializers.py
│   ├── views.py                  # Auth + profile endpoints
│   ├── urls.py
│   └── authentication.py        # Cookie JWT backend
│
├── consultants/
│   ├── models.py                 # Consultant, Specialization, Availability
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── appointments/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── blogs/
│   ├── models.py                 # Blog, Category, Tag
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
└── assessments/
    ├── models.py                 # Quiz, Question, AnswerOption, ScoreRange, QuizResult
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── management/
        └── commands/
            └── seed_quizzes.py   # Seeds all 4 quizzes
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js >= 18
- Python >= 3.10
- PostgreSQL >= 14
- Git

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/psychology-backend.git
cd psychology-backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate      # Mac/Linux

# 3. Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary cloudinary django-cloudinary-storage python-dotenv pillow django-filter resend

# 4. Create .env file (see Environment Variables section)

# 5. Run migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Seed assessment quizzes
python manage.py seed_quizzes

# 8. Start development server
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`
Django Admin: `http://127.0.0.1:8000/admin`

---

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/center-for-psychology.git
cd center-for-psychology

# 2. Install dependencies
npm install

# 3. Install additional packages
npm install zustand axios framer-motion
npm install -D @tailwindcss/typography

# 4. Initialize shadcn/ui (if not already done)
npx shadcn@latest init

# 5. Add required shadcn components
npx shadcn@latest add button card dialog calendar form tabs sheet dropdown-menu toast table badge skeleton input label avatar textarea

# 6. Create .env.local file (see Environment Variables section)

# 7. Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

### Environment Variables

#### Backend — `.env`

```env
SECRET_KEY=your-super-secret-django-key-change-this
DEBUG=True

# Database
DB_NAME=psychology_db
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
DB_HOST=localhost
DB_PORT=5432

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend
RESEND_API_KEY=your_resend_api_key
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

#### Frontend — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register/` | Register new user | Public |
| POST | `/api/auth/login/` | Login user | Public |
| POST | `/api/auth/logout/` | Logout user | Required |
| POST | `/api/auth/refresh/` | Refresh access token | Public |
| GET | `/api/auth/me/` | Get current user | Required |
| PATCH | `/api/auth/me/update/` | Update profile | Required |
| POST | `/api/auth/change-password/` | Change password | Required |
| GET | `/api/auth/users/` | List all users | Admin |

### Consultants

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/consultants/` | List consultants (search + filter) | Public |
| GET | `/api/consultants/{slug}/` | Consultant profile detail | Public |
| GET | `/api/consultants/specializations/` | List specializations | Public |
| GET | `/api/consultants/availability/` | Get my availability | Consultant |
| POST | `/api/consultants/availability/` | Add availability slot | Consultant |
| DELETE | `/api/consultants/availability/{id}/` | Delete availability slot | Consultant |
| GET | `/api/consultants/admin/list/` | Admin consultant list | Admin |
| POST | `/api/consultants/admin/create/` | Create consultant | Admin |
| PATCH | `/api/consultants/admin/{id}/` | Update consultant | Admin |
| DELETE | `/api/consultants/admin/{id}/` | Delete consultant | Admin |
| PATCH | `/api/consultants/admin/{id}/verify/` | Verify/revoke consultant | Admin |
| GET | `/api/consultants/admin/specializations/` | Admin specialization list | Admin |
| POST | `/api/consultants/admin/specializations/` | Create specialization | Admin |
| PATCH | `/api/consultants/admin/specializations/{id}/` | Update specialization | Admin |
| DELETE | `/api/consultants/admin/specializations/{id}/` | Delete specialization | Admin |

### Appointments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/appointments/` | List my appointments | Required |
| POST | `/api/appointments/create/` | Create appointment | Required |
| GET | `/api/appointments/{id}/` | Appointment detail | Required |
| PATCH | `/api/appointments/{id}/status/` | Update status | Required |
| GET | `/api/appointments/booked-slots/{consultant_id}/` | Get booked slots | Public |
| GET | `/api/appointments/admin/stats/` | Platform statistics | Admin |

### Blogs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/blogs/` | List published blogs | Public |
| GET | `/api/blogs/{slug}/` | Blog detail + increment view | Public |
| GET | `/api/blogs/featured/` | Featured blogs | Public |
| GET | `/api/blogs/categories/` | List categories | Public |
| GET | `/api/blogs/tags/` | List tags | Public |
| GET | `/api/blogs/admin/list/` | Admin blog list | Admin |
| POST | `/api/blogs/admin/list/` | Create blog | Admin |
| PATCH | `/api/blogs/admin/{id}/` | Update blog | Admin |
| DELETE | `/api/blogs/admin/{id}/` | Delete blog | Admin |

### Assessments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/assessments/` | List active quizzes | Public |
| GET | `/api/assessments/{slug}/` | Quiz detail with questions | Public |
| POST | `/api/assessments/submit/` | Submit quiz answers | Required |
| GET | `/api/assessments/results/` | My assessment results | Required |
| GET | `/api/assessments/results/{id}/` | Single result detail | Required |

---

## Roles & Permissions

| Feature | Client | Consultant | Admin |
|---|---|---|---|
| Browse consultants | ✅ | ✅ | ✅ |
| Book appointments | ✅ | ❌ | ❌ |
| Cancel own appointments | ✅ | ❌ | ❌ |
| Confirm/complete appointments | ❌ | ✅ | ❌ |
| Manage availability | ❌ | ✅ | ❌ |
| Take assessments | ✅ | ✅ | ✅ |
| View patient list | ❌ | ✅ | ❌ |
| Manage all users | ❌ | ❌ | ✅ |
| Verify consultants | ❌ | ❌ | ✅ |
| Manage blogs | ❌ | ❌ | ✅ |
| Platform analytics | ❌ | ❌ | ✅ |

---

## Dashboard Features

### Client Dashboard
- Appointment stats — total, upcoming, completed, cancelled
- Upcoming appointments list with quick navigation
- Full booking history with tab filter
- Assessment history with score tracking
- Profile and password settings

### Consultant Dashboard
- Today's appointment schedule
- Pending requests with confirm/cancel actions
- Full appointment list with session notes
- Patient list with visit history
- Weekly availability management

### Admin Dashboard
- Platform statistics — users, consultants, appointments
- Quick action cards — navigate to key areas
- User management with role filter
- Consultant management — full CRUD + verify/revoke
- Specialization management — CRUD
- Blog management — create/edit/publish
- Appointment overview across all users

---

## Assessment Quizzes

Four validated mental health screening tools are included:

| Quiz | Scale | Questions | Time |
|---|---|---|---|
| Stress Assessment | PSS-10 | 10 | ~5 min |
| Anxiety Assessment | GAD-7 | 7 | ~4 min |
| Depression Screening | PHQ-9 | 9 | ~5 min |
| Burnout Assessment | Custom | 10 | ~6 min |

Each quiz includes:
- Animated question-by-question flow with progress bar
- Automatic score calculation
- Severity classification (Minimal / Mild / Moderate / Severe)
- Personalized recommendations
- Full answer review on result page
- Result history in user dashboard

To seed all quizzes:
```bash
python manage.py seed_quizzes
```

---

## Email Notifications

All emails are sent via **Resend** and include:

| Trigger | Recipient |
|---|---|
| New user registration | Client (welcome email) |
| Appointment booked | Client (booking confirmation) |
| Appointment booked | Consultant (new request alert) |
| Appointment confirmed | Client |
| Appointment cancelled | Client |
| Session completed | Client |

---

## Deployment

### Frontend — Vercel

```bash
# 1. Push code to GitHub
git push origin main

# 2. Import repository at vercel.com
# 3. Add environment variables:
#    NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# 4. Deploy
```

### Backend — Railway

```bash
# 1. Push code to GitHub
# 2. Create new project at railway.app
# 3. Add PostgreSQL plugin
# 4. Add environment variables from .env
# 5. Set start command:
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT

# 6. Install gunicorn
pip install gunicorn
```

For production, update `settings.py`:

```python
DEBUG = False
ALLOWED_HOSTS = ['your-backend-url.railway.app']

SIMPLE_JWT = {
    ...
    'AUTH_COOKIE_SECURE': True,   # HTTPS only
}

CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',
]
```

---

## Screenshots

> Add screenshots after deployment.

| Page | Description |
|---|---|
| `/` | Public home page |
| `/consultant` | Consultant directory with filters |
| `/booking/[slug]` | 4-step appointment booking |
| `/assessment` | Mental health quiz listing |
| `/dashboard` | Role-based dashboard overview |

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit changes — `git commit -m 'Add your feature'`
4. Push to branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Developer

Built by **Fahad** — Full-stack Web Developer  
Stack: Next.js · Django REST Framework · PostgreSQL · Tailwind CSS

> This platform was built phase by phase as a production-grade full-stack project.
