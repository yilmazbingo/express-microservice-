# docker build -t tag/moderation .
# docker push tag/moderation
#  nest step is to create deployment and clusterip service
# clusterip service let them communicate each other
# base image
# FROM node:alpine

# WORKDIR /app
# COPY package.json ./
# RUN npm install
# #copy everyhing else from the post directory
# COPY ./ ./
# CMD ["npm","start"]

FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
#copy everyhing else from the post directory
COPY ./ ./
CMD ["npm","start"]