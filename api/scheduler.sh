#!/bin/bash

nice -n 10 sleep 60 && php /usr/src/artisan schedule:run --verbose --no-interaction
