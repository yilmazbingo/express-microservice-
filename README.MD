## START THE APP

- install nodemon as development dependency not as a global module because docker containers are isolated environments. each service will be use it when building the image so we need to tell image that we locally used nodemon

`npm run start`

# Structure of App

Microservices is used to increase the reliability of systems. We make each service independent if some part of our app goes down vast majority of our app will be still running

- Posts and Comments service will emit the events(data) to Event Bus. Event bus automatically route those event to Query service. Query service is like database, it stores posts and their comments.
- Posts and Comments service will still store the data that they emit
- Event bus in this app will act like NATS. It will post all the incoming events to other services.
- Query service stores the full listing of all the different posts and their associated comments. Client service will make request here to render the data. Query service is all about presentation logic. It organizes posts and associated comments.
- Moderation service will look into comments and if there is bad word, it will flag it. This service will tell client service about `comment.status`="approved" | "rejected" | "pending". When first comment is emitted, its status will be pending, so we can show the user. your comment is taken and being under watch.
- comments might have different business logic. We indicate this with the "type" property. Comment service is in charge of what a comment is and knows all the very precise business roles. After "moderation service" moderates the comment, it will emit new event to event bus, event bus will emit it to comments service. Comments service will emit "commentUpdated" event to event bus and event bus will emit it to query service and query service will find the related comment and will update its properties.
- Query service is our database, in case it goes down, event bus will store all the events and when query service is back, query service will make a GET request to event bus for syncing.

## SET UP DOCKER

**INSTALL DOCKER in debian**

```
kali@kali:~$ sudo apt update
kali@kali:~$ sudo apt install -y docker.io
kali@kali:~$ sudo systemctl enable docker --now
kali@kali:~$ docker
```

** INSTALL DOCKER-COMPOSE in KALI **

```
kali@kali:~$ sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
kali@kali:~$ sudo chmod +x /usr/local/bin/docker-compose
```

## Dockerizing the Post Service

- create a Dockerfile inside post service
- create .dockerfile and add "node_modules"
- inside post directory

`docker build .`

## SET UP KUBERNETES

1- install minikube

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```

2- start

`minikube start`

gives this error : No possible driver was detected.

3- set the driver

`sudo minikube start --driver=docker`

4- Add your user to the 'docker' group:

`sudo usermod -aG docker $USER && newgrp docker`

6- Install kubectl

```
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"

```

-Make the kubectl binary executable.

`chmod +x ./kubectl`

- Move the binary in to your PATH.

`sudo mv ./kubectl /usr/local/bin/kubectl`

- check the verison
  `kubectl version`

## create a config file

- kubernetes config files are stored in infra/k8s. inside here

  ```
  minikube start
  kubectl apply -f posts.yaml
  ```

  `kubectl get pods`

- In config file we give instructions for "Deployment" and "Service".

## create aliases in linux

```
code ~/.bashrc
alias k="kubectl"
alias dps="docker ps" // show all containers
```

## install ingress-nginx

`minikube addons enable ingress`

## change the urls to service names

`kubectl get services`

- For example urls that event-bus communicate with:
  ```js
  await axios.post("http://posts-clusterip-srv:4000/events", event);
  await axios.post("http://comments-srv:4001/events", event);
  await axios.post("http://query-srv:4002/events", event);
  await axios.post("http://moderation-srv:4003/events", event);
  ```
- To communicate with the cluster from postman: `minikube ip`
  This will issue the ip for the Node Port service. BUt we dont use Node Port service for react app, we set up Load Balancer.

## set up ingress-nginx

- Since I use minikube

  `minikube addons enable ingress`
  `minikube addons list`

- test the installation
  `kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx`
- Write a config file in /k8
  `k apply -f ingress-srv.yaml`

## Configure the host file for ingress-nginx in linux

`code /etc/hosts`

- get the ip from minikube
  `minikube ip`
- add this ip to hosts file

  172.17.0.3 posts.com

- Now in react application we are going to make request to "http://posts.com"

## Skaffold

- it is used in development environment. makes it easy to update the code.
  ```
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
  sudo install skaffold /usr/local/bin/
  ```

```
- in root directory, create skaffold.yaml. skafofld runs outside of our cluster
     `skaffold dev`
-if we start another projects we need to stop this scaffold process with `ctrl c`
```
