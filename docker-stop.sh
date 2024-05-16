#!/bin/bash

BOLD="$(tput bold)"
RED="$(tput setaf 1)"
GREEN="$(tput setaf 2)"
YELLOW="$(tput setaf 3)"
RESET="$(tput sgr0)"

docker-compose ps
docker-compose stop
docker-compose ps

echo ""
echo -e "${BOLD}${RED}---------${RESET}"
echo -e "Docker zatrzymany${RESET}"
echo -e "${BOLD}${RED}---------${RESET}"
echo ""
read -n 1 -s -r -p "Press enter to continue..."