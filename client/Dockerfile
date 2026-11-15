# --- build: production Angular bundle ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Optional Google Analytics 4 measurement ID (G-...); empty disables analytics.
ARG GA_MEASUREMENT_ID=""
RUN npm run build -- --define "GA_MEASUREMENT_ID='${GA_MEASUREMENT_ID}'"

# --- runtime: nginx serving the static bundle ---
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/streams-ranking-app/browser /usr/share/nginx/html
EXPOSE 80
