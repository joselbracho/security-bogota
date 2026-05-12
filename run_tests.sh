#!/bin/bash

echo "Running backend tests..."
docker-compose exec -T backend python manage.py test cameras_api
