FROM php:8.2-fpm as api

WORKDIR /usr/src

ARG user
ARG uid

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libc6 \
    zip \
    unzip \
    supervisor \
    default-mysql-client \
    libmagickwand-dev

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

RUN apt-get update && apt-get install -y nodejs npm

RUN npm install --save-dev chokidar

RUN pecl install redis swoole xdebug imagick

RUN docker-php-ext-enable imagick

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -G www-data,root -u $uid -d /home/$user $user

RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

COPY ./api/composer*.json /usr/src/
COPY ./api/package*.json /usr/src/
COPY ./deployment/config/php-fpm/php-prod.ini /usr/local/etc/php/conf.d/php.ini
COPY ./deployment/config/php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN composer install --no-scripts

COPY ./api .

COPY --chown=$user:$user ./api .

USER $user

FROM api AS worker
COPY ./deployment/config/supervisor/worker/supervisord.conf /etc/supervisor/conf.d/worker_supervisor.conf
CMD ["/bin/sh", "/usr/src/worker.sh"]

FROM api AS scheduler
CMD ["/bin/sh", "/usr/src/scheduler.sh"]

FROM api AS reverb
COPY ./deployment/config/supervisor/reverb/supervisord.conf /etc/supervisor/conf.d/reverb_supervisor.conf
CMD ["/bin/sh", "/usr/src/reverb.sh"]
