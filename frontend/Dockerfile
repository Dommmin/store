FROM node:20.11 AS base

WORKDIR /usr/src

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend .

FROM base AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /usr/src/dist /usr/share/nginx/html
COPY ./deployment/config/nginx-frontend.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
