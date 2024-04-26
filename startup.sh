#!/bin/bash

cp .env.example ./api/.env

sudo chmod -R 755 .

docker-compose up -d