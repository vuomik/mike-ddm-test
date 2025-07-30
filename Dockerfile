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

# PROD STAGE

FROM node:20-slim AS production
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm install --production
EXPOSE 3000
CMD ["npm", "run", "start"]