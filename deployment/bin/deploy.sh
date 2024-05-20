#!/bin/bash

set -e

cd /root

sudo docker compose -f docker-compose.prod.yml down
sudo docker compose -f docker-compose.prod.yml up -d --remove-orphans

sudo docker exec -it -u root "$DOCKER_PREFIX"_api chown -R www-data:www-data storage

sudo docker compose -f docker-compose.prod.yml exec -T api php artisan config:cache
sudo docker compose -f docker-compose.prod.yml exec -T api php artisan route:cache
sudo docker compose -f docker-compose.prod.yml exec -T api php artisan view:cache
