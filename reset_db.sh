#!/bin/bash

echo "Cleaning database..."
docker-compose exec -T backend python manage.py flush --no-input

echo "Seeding database..."
docker-compose exec -T backend python seed.py

echo "Database reset complete!"
