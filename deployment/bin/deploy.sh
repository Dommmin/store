#!/bin/bash

set -e

cd /root

sudo docker compose -f docker-compose.prod.yml down
sudo docker compose -f docker-compose.prod.yml up -d --remove-orphans

sudo docker compose -f docker-compose.prod.yml exec -T api chmod -R 755 /usr/src/storage/logs
sudo docker compose -f docker-compose.prod.yml exec -T api chown -R www-data:www-data /usr/src/storage/logs

# Wykonanie komend cacheowania
sudo docker compose -f docker-compose.prod.yml exec -T api php artisan config:cache
sudo docker compose -f docker-compose.prod.yml exec -T api php artisan route:cache
sudo docker compose -f docker-compose.prod.yml exec -T api php artisan view:cache
