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

# # pull official base image
# FROM node:15.8.0-stretch-slim

# # add app
# COPY . ./

# # set working directory
# WORKDIR /frontend

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /frontend/node_modules/.bin:$PATH

# # install app dependencies
# RUN npm config set unsafe-perm true

# RUN npm install --force

# ENV FAST_REFRESH=false

# # start app
# CMD ["npm", "start"]