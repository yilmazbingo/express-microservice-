# docker build -t tag/moderation .
# docker push tag/moderation
#  nest step is to create deployment and clusterip service
# clusterip service let them communicate each other
# base image. alpine is the compact and small version of node
FROM node:alpine
# we copy to /app folder inside the docker. not root.
WORKDIR /app
# if we change our source code, we have to rebuild it. in order to prevent docker reinstall npm packages, we copy package.json first. cause docker will look at package.json is same, so it wont reinstall dependencies
COPY package.json ./
RUN npm install
#copy everyhing else from the post directory
COPY ./ ./
CMD ["npm","start"]