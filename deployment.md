- rather than creating standalone pod, we create deployment which manages sets of pods. if any pod crashed, deployment automatically creates a new one for us. it also update the versions of pods if needed. behind the scene deployment will create some number of new pods, running new version of our application. after these pods are up, deplyment will use those and delete the old ones.

- if we delete a pod after we create a deployment, deployment will recreate that pod. thats why we dont create pods manually. if they crash, there is nothing to back up.

## Update Deployment

- we would avoid making change on config file. if we change the version, we should find a way not to toouch the config file because we might make false configs. we will tell k8s, use the latest version of the given image

1- make sure that deployment is using the "latest" tag in the pod spec section.

```
spec:
      containers:
        - name: posts
          image: yilmaz/posts:latest        if you omit the "latest" docker will assume it is latest

```

`k apply -f posts-depl.yaml `
`k apply -f .` this will create all pods in one go
`k get pods`

2- make a change inside the blogs index.js and rebuild the image. Dockerfile is inside the blogs

`docker build -t yilmaz/docker . `

3- push the image dockerhub

`docker push yilmaz/docker` make sure your tagname is the same as your docker username

4- tell our deployment to use the latest version

` k rollout restart deployment posts-depl` deployment is restarted

- `kubectl get pods`
  will return the pod that running inside the deployment. inside of this pod a container is running. inside of that container, post application is running.

## TESTING

currently we have only post NodePort. so we send post request to this. then `k get pods` and check logs `k logs `
