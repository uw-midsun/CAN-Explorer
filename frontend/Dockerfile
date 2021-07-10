# pull official base image
FROM node:15.8.0-stretch-slim

# COPY . ./

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

RUN npm config set unsafe-perm true

RUN npm install --force

ENV FAST_REFRESH=false

# add app
COPY . ./

RUN npm install react-scripts@4.0.3

# start app
CMD ["npm", "start"]
