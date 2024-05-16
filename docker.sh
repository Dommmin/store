#!/bin/bash

set -e

USER=dominik
USER_ID=1000

BOLD="$(tput bold)"
RED="$(tput setaf 1)"
GREEN="$(tput setaf 2)"
YELLOW="$(tput setaf 3)"
RESET="$(tput sgr0)"

BASEDIR=$(dirname "$0")
ENV_FILE="$BASEDIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "${BOLD}${RED}$ENV_FILE does not exist.${RESET}"
    exit 1
fi

eval "$(grep ^DOCKER_PREFIX= $ENV_FILE)"
eval "$(grep ^DBNAME= $ENV_FILE)"
eval "$(grep ^DOCKER_IP= $ENV_FILE)"
eval "$(grep ^DOCKER_PORT= $ENV_FILE)"

# Uruchomienie kontenerów dla projektu
echo "${YELLOW}Uruchomienie kontenerów dla projektu ${BOLD}${DOCKER_PREFIX}${RESET}"
docker-compose up -d

# Dodanie użytkownika, jeśli nie istnieje
if ! docker exec -it -u root "${DOCKER_PREFIX}_api" id -u $USER > /dev/null 2>&1; then
    echo -e "${BOLD}${YELLOW}Dodanie użytkownika ${USER}${RESET}\n"
    docker exec -it -u root "${DOCKER_PREFIX}_api" addgroup -g $USER_ID $USER
    docker exec -it -u root "${DOCKER_PREFIX}_api" adduser -u $USER_ID -G $USER -h /home/$USER -D $USER
else
    echo "${BOLD}${RED}Użytkownik ${USER} już istnieje${RESET}"
fi

# Zmiana uprawnien
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}Zmiana uprawnien${RESET}\n"
docker exec -it -u root "${DOCKER_PREFIX}_api" chown -R $USER:$USER storage

# Utworzenie katalogu dla Composera i zmiana właściciela
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}Utworzenie katalogu dla Composera i zmiana właściciela${RESET}\n"
docker exec -it -u root "${DOCKER_PREFIX}_api" mkdir -p /home/$USER/.composer
docker exec -it -u root "${DOCKER_PREFIX}_api" chown -R $USER:$USER /home/$USER

# Instalacja Composera
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}Instalacja Composera${RESET}\n"
docker exec -it -u $USER "${DOCKER_PREFIX}_api" composer install --no-scripts

# Uruchomienie migracji
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}Uruchomienie migracji${RESET}\n"
docker exec -u www-data "$DOCKER_PREFIX"_api bash migration.sh

# Instalacja zależności npm
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}Instalacja zależności npm${RESET}\n"
docker exec -it "${DOCKER_PREFIX}_frontend" npm install

# CS Fixer
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}CS Fixer${RESET}\n"
docker exec -it "$DOCKER_PREFIX"_api composer pint

# Insights
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}Insights${RESET}\n"
docker exec -it "$DOCKER_PREFIX"_api php artisan insights --fix

# Lint
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo -e "${BOLD}${YELLOW}ESLINT${RESET}\n"
docker exec -it "$DOCKER_PREFIX"_frontend npm run lint:fix

# Panel
echo "${BOLD}${RED}--------------------------------------------------------------------------------${RESET}"
echo "${YELLOW}API jest dostępne pod adresem: ${BOLD}${GREEN}http://localhost:8000/api${RESET}"
echo "${YELLOW}Strona jest dostępna pod adresem: ${BOLD}${GREEN}http://localhost:3000${RESET}"
