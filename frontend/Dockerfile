FROM node:20-alpine AS base

WORKDIR /usr/src

COPY ./frontend .

FROM base AS dev
EXPOSE 80
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm install
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=builder /usr/src/.next /usr/share/nginx/html
COPY --from=builder /usr/src/public /usr/share/nginx/html
COPY --from=builder /usr/src/next.config.js /usr/share/nginx/html
COPY ./deployment/config/nginx-frontend.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
