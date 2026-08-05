# syntax=docker/dockerfile:1


# Stage 1: Builder
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Virtualenv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt



# Stage 2: Final Production Image

FROM python:3.12-slim AS runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    DJANGO_SETTINGS_MODULE=config.settings.prod

WORKDIR /app

# Non-root 
RUN addgroup --system django && \
    adduser --system --ingroup django django && \
    mkdir -p /app/staticfiles /app/media && \
    chown -R django:django /app

# Builder 
COPY --from=builder /opt/venv /opt/venv


COPY --chown=django:django . .


USER django

#  staticfiles 
# RUN python manage.py collectstatic --noinput

EXPOSE 8000

# CMD- gunicorn entrypoint.sh 
CMD ["sh", "-c", "python manage.py migrate --noinput && \
                   python manage.py collectstatic --noinput && \
                   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120"]