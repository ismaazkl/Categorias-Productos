# syntax=docker/dockerfile:1

####################### BUILD #######################
FROM php:8.3-cli-alpine AS build

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

RUN apk add --no-cache git unzip nodejs npm \
    && install-php-extensions mbstring intl bcmath pcntl pdo_mysql pdo_sqlite gd zip curl exif @composer-2

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-scripts --no-interaction --optimize-autoloader

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

ENV APP_ENV=production \
    APP_DEBUG=false \
    APP_KEY=base64:QmFzZTY0RW5jcnlwdGlvbktleUZvckJ1aWxkVGltZU9ubHk=

RUN php artisan package:discover --ansi \
    && npm run build \
    && rm -rf node_modules

####################### RUNTIME #######################
FROM php:8.3-fpm-alpine AS runtime

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

RUN install-php-extensions mbstring intl bcmath pcntl pdo_mysql pdo_sqlite gd zip curl exif \
    && apk add --no-cache nginx

RUN mkdir -p /var/www/html && chown -R www-data:www-data /var/www/html
WORKDIR /var/www/html

COPY --from=build --chown=www-data:www-data /app /var/www/html
COPY --chown=www-data:www-data docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=www-data:www-data docker/start.sh /usr/local/bin/start.sh

RUN rm -rf /var/www/html/storage/framework/{cache,sessions,views} \
    && mkdir -p /var/www/html/storage/framework/{cache/data,sessions,views} \
    && chown -R www-data:www-data /var/www/html/storage \
    && touch /var/www/html/storage/logs/laravel.log \
    && chmod +x /usr/local/bin/start.sh

EXPOSE 8080

CMD ["start.sh"]