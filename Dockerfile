# DEV STAGE

FROM node:20 AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# BUILD STAGE

FROM development AS builder
RUN npm run build