# 1
FROM node:16 AS build-deps
COPY package*.json /build/
WORKDIR /build
RUN npm install

# 2
FROM node:16 AS compile-env
RUN mkdir /compile
COPY --from=build-deps /build /compile
WORKDIR /compile
COPY . .
RUN npm run build

# 3
FROM node:16 AS runtime-deps
COPY package*.json /build/
WORKDIR /build
RUN npm install --production

# final
FROM node:16-alpine AS runtime-env
WORKDIR /app

COPY --from=compile-env --chown=node:node /compile/dist /app
COPY --from=runtime-deps --chown=node:node /build /app

CMD ["node", "./dist/bot.js"]