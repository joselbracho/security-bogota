#!/bin/sh

# Simple wait for DB
echo "Waiting for database..."
while ! python -c "import psycopg2; psycopg2.connect(dbname='bogota_security', user='postgres', password='postgres', host='db')" > /dev/null 2>&1; do
  sleep 1
done

echo "Running migrations..."
python manage.py makemigrations cameras_api
python manage.py migrate

echo "Seeding database..."
python seed.py

echo "Starting server..."
gunicorn core.wsgi:application --bind 0.0.0.0:8000
