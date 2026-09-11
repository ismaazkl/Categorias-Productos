#!/bin/sh

set -e

cd /var/www/html

php artisan storage:link --force >/dev/null 2>&1 || true

php artisan migrate --force --no-interaction >/dev/null 2>&1 || true

php-fpm

exec nginx -g 'daemon off;'