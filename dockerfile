# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]