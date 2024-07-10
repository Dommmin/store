# Base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /usr/src

# Install dependencies
COPY ./frontend/package.* ./
RUN npm install

# Copy frontend files
COPY ./frontend .

# Development image
FROM base AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build image
FROM base AS build
RUN npm run build

# Production image
FROM node:20-alpine AS prod
COPY --from=build /usr/src /usr/src
WORKDIR /usr/src
EXPOSE 3000
CMD ["npm", "run", "start"]
