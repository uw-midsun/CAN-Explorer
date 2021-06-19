# pull official base image
FROM node:15.8.0-stretch-slim

# add app
COPY . ./

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
RUN npm config set unsafe-perm true

RUN npm install --force

# RUN npm install -g react-scripts@4.0.3

ENV FAST_REFRESH=false

# start app
CMD ["npm", "start"]
