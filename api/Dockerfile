# Stage 1: Build the API image
FROM php:8.2-fpm-alpine as api

# Set working directory
WORKDIR /usr/src

# Install necessary dependencies
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

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Install npm package chokidar
RUN npm install --save-dev chokidar

# Install PHP PECL extensions
RUN pecl install redis xdebug imagick swoole

# Enable imagick PHP extension
RUN docker-php-ext-enable imagick

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy PHP-FPM configuration
COPY ./deployment/config/php-fpm/php-prod.ini /usr/local/etc/php/conf.d/php.ini
COPY ./deployment/config/php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf

# Copy application files
COPY ./api/worker.sh ./api/reverb.sh ./api/scheduler.sh ./api/migration.sh ./
COPY ./api ./

# Install application dependencies
RUN composer install --prefer-dist --no-progress

RUN chown -R www-data:www-data /usr/src && \
    chmod -R 775 ./storage ./bootstrap/cache

# Stage 2: Build the Worker image
FROM api AS worker
COPY ./deployment/config/supervisor/worker/supervisord.conf /etc/supervisor/conf.d/worker_supervisor.conf
CMD ["/bin/sh", "/usr/src/worker.sh"]

# Stage 3: Build the Scheduler image
FROM api AS scheduler
CMD ["/bin/sh", "/usr/src/scheduler.sh"]

# Stage 4: Build the Reverb image
FROM api AS reverb
COPY ./deployment/config/supervisor/reverb/supervisord.conf /etc/supervisor/conf.d/reverb_supervisor.conf
CMD ["/bin/sh", "/usr/src/reverb.sh"]
