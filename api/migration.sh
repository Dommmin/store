#!/bin/sh

php artisan down
php artisan key:generate
php artisan migrate --force
php artisan migrate --env=testing.local --force
php artisan up
php artisan storage:link
