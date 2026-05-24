FROM php:8.3-apache

# Install Moodle required system packages and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    libxml2-dev \
    libxslt-dev \
    git \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        intl \
        zip \
        mysqli \
        opcache \
        soap \
        xml \
        exif \
        fileinfo

# Configure Apache DocumentRoot to point to /public for Moodle 5.1 security
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set recommended PHP settings for Moodle
RUN echo 'max_input_vars = 5000' >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo 'opcache.enable = 1' >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo 'opcache.memory_consumption = 128' >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo 'opcache.max_accelerated_files = 10000' >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo 'upload_max_filesize = 100M' >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo 'post_max_size = 100M' >> /usr/local/etc/php/conf.d/moodle.ini

WORKDIR /var/www/html