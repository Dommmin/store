FROM php:8.2-fpm-alpine as api

WORKDIR /usr/src

RUN apk update && apk add --no-cache \
    autoconf \
    gcc \
    g++ \
    make \
    pcre-dev \
    zlib-dev \
    file \
    bash  \
    linux-headers \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    icu-dev \
    libc6-compat \
    zip \
    unzip \
    supervisor \
    mysql-client \
    imagemagick-dev \
    libtool

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

RUN apk add --no-cache nodejs npm

RUN npm install --save-dev chokidar

RUN pecl install redis
RUN pecl install xdebug
RUN pecl install imagick
RUN pecl install swoole

RUN docker-php-ext-enable imagick

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./deployment/config/php-fpm/php-prod.ini /usr/local/etc/php/conf.d/php.ini
COPY ./deployment/config/php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf

COPY ./api/worker.sh /usr/src/
COPY ./api/reverb.sh /usr/src/
COPY ./api/scheduler.sh /usr/src/
COPY ./api/migration.sh /usr/src/

COPY ./api .

FROM api AS worker
COPY ./deployment/config/supervisor/worker/supervisord.conf /etc/supervisor/conf.d/worker_supervisor.conf
CMD ["/bin/sh", "/usr/src/worker.sh"]

FROM api AS scheduler
CMD ["/bin/sh", "/usr/src/scheduler.sh"]

FROM api AS reverb
COPY ./deployment/config/supervisor/reverb/supervisord.conf /etc/supervisor/conf.d/reverb_supervisor.conf
CMD ["/bin/sh", "/usr/src/reverb.sh"]
