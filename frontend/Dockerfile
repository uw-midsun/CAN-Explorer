# pull official base image
FROM node:15.8.0-alpine3.12

# set working directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./
RUN npm install
# RUN npm install react-scripts@4.0.2 -g

# add app
COPY . ./

# start app
CMD ["npm", "start"]
