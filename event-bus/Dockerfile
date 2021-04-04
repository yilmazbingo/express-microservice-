# base image
FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
#copy everyhing else from the post directory
COPY ./ ./
CMD ["npm","start"]