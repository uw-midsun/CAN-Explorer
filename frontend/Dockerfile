# pull official base image
FROM node:15.8.0-stretch-slim

RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

COPY package.json .
RUN npm install

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV NODE_PATH=/usr/src/app/node_modules/.bin

COPY . .