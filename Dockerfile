# Stage 1: Build the React app
FROM node:20-bookworm-slim AS build
WORKDIR /app

ARG GIT_NPM_AUTH_TOKEN
ARG FONTAWESOME_NPM_AUTH_TOKEN
ARG VITE_UPLOAD_API_URL
ARG VITE_MAPBOX_ACCESS_TOKEN
ARG VITE_HASURA_WSS
ARG VITE_HASURA_HTTPS
ARG VITE_BI_API_URL
ARG VITE_API_URL

ENV GIT_NPM_AUTH_TOKEN=$GIT_NPM_AUTH_TOKEN
ENV FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN
ENV VITE_UPLOAD_API_URL=$VITE_UPLOAD_API_URL
ENV VITE_MAPBOX_ACCESS_TOKEN=$VITE_MAPBOX_ACCESS_TOKEN
ENV VITE_HASURA_WSS=$VITE_HASURA_WSS
ENV VITE_HASURA_HTTPS=$VITE_HASURA_HTTPS
ENV VITE_BI_API_URL=$VITE_BI_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Leverage caching by installing dependencies first
COPY package.json package-lock.json .npmrc ./
RUN npm install --frozen-lockfile

RUN echo "@fluxu-labs:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${GIT_NPM_AUTH_TOKEN}" >> .npmrc && \
    echo "@fortawesome:registry=https://npm.fontawesome.com/" >> .npmrc && \
    echo "//npm.fontawesome.com/:_authToken=${FONTAWESOME_NPM_AUTH_TOKEN}" >> .npmrc

# Copy the rest of the application code and build for production
COPY . ./
RUN npm run build


# Stage 2: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
