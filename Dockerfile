FROM node:16-alpine

ENV TZ=US

RUN mkdir -p /usr/src/aisha
WORKDIR /usr/src/aisha

COPY package*.json /usr/src/aisha
RUN npm install
RUN npm install typescript

COPY . /usr/src/aisha

RUN npm run build
CMD ["node", "./dist/bot.js"]