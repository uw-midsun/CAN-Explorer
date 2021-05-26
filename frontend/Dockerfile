# pull official base image
FROM node:15.8.0-alpine3.12

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./
RUN npm config set unsafe-perm true

RUN npm install --force
# RUN npm install react-scripts -g

ENV FAST_REFRESH=false

# add app
COPY . ./

# start app
CMD ["npm", "start"]
