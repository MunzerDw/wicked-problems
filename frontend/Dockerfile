# pull official base image
FROM node:16.3.0-alpine

# port
EXPOSE 3000

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# env
ENV NODE_ENV=production
ENV REACT_APP_BACKEND_URL=/api
ENV REACT_APP_SOCKET_URL=https://wickedproblems.io
# removed firebase ENVs

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --network-timeout 1000000
RUN yarn add react-scripts@4.0.3 -g

# add app
COPY . ./

# build app
RUN yarn build

# start app
CMD ["yarn", "serve", "-s", "build", "-l", "3000"]