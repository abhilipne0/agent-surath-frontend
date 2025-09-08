# Step 1: Build the app
FROM node:20-alpine AS build

WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=2048

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy all source files including .env
COPY . .

# Build the app (reads latest .env values here)
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
