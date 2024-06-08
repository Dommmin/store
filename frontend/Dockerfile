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
FROM nginx:alpine AS prod
# Copy the built files from the build stage
COPY --from=build /usr/src/.next /usr/share/nginx/html
# Copy the nginx configuration
COPY ./deployment/config/nginx-frontend.conf /etc/nginx/nginx.conf
# Set permissions (if necessary)
RUN chmod -R 755 /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Run nginx
CMD ["nginx", "-g", "daemon off;"]
