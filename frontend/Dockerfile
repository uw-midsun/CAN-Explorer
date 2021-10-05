# pull official base image
FROM node:15.8.0-stretch-slim

# add app
COPY . ./

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
RUN npm config set unsafe-perm true

RUN npm install --force

ENV FAST_REFRESH=false

# start app
CMD ["npm", "start"]

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