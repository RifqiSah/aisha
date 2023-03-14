# 1
FROM node:lts AS build-deps

RUN apt-get update && \
    apt-get -y install tree

COPY package*.json /build/
COPY src/modules /build/modules
RUN find /build/modules \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

RUN tree /build/

WORKDIR /build
RUN npm install

# 2
FROM node:lts AS compile-env
RUN mkdir /compile

COPY --from=build-deps /build /compile
WORKDIR /compile

COPY . .
RUN npm run build

# 3
FROM node:lts AS runtime-deps

COPY package*.json /build/
COPY src/modules /build/modules
RUN find /build/modules \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

WORKDIR /build
RUN npm install --production

# final
FROM node:lts-alpine AS runtime-env
WORKDIR /app

ARG BOT_VERSION

ENV BOT_VERSION=$BOT_VERSION \
    NODE_ENV=production \
    TZ=Asia/Jakarta

RUN apk add tzdata \
    && rm -rf /var/cache/apk/*

COPY --from=compile-env --chown=node:node /compile/dist /app
COPY --from=runtime-deps --chown=node:node /build /app

CMD ["node", "bot.js"]