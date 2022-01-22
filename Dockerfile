# 1
FROM node:17 AS build-deps
COPY package*.json /build/
WORKDIR /build
RUN npm install --ws

# 2
FROM node:17 AS compile-env
RUN mkdir /compile

COPY --from=build-deps /build /compile
WORKDIR /compile

COPY . .
RUN npm run build

# 3
FROM node:17 AS runtime-deps
COPY package*.json /build/
WORKDIR /build
RUN npm install --production --ws

# final
FROM node:17-alpine AS runtime-env
WORKDIR /app

ENV NODE_ENV=production \
    TZ=Asia/Jakarta

RUN apk add tzdata \
    && rm -rf /var/cache/apk/*

COPY --from=compile-env --chown=node:node /compile/dist /app
COPY --from=runtime-deps --chown=node:node /build /app

CMD ["node", "bot.js"]