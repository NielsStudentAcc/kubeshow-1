BASEDIR = $(shell pwd)

include ../../../Makefile.properties

app: build deploy

reset: clean.deployment app
	say "app refresh complete"

reset.safe: env creds
	gcloud container builds submit "$(BASEDIR)/../containers/." --tag=$(DOCKERREPO)/game
	-kubectl delete deployment game-deployment
	kubectl run game-deployment --image=$(DOCKERREPO)/game --replicas=4 --port=8080 --labels=app=game 
	say "app refresh complete"	

build: env
	gcloud builds submit "$(BASEDIR)/../containers/." --tag=$(DOCKERREPO)/game

deploy: env creds deployment service

deployment:
	kubectl apply -f "$(BASEDIR)/game-deployment.yaml"

service:
	kubectl expose deployment game-deployment --name=game --target-port=8080  --type=NodePort --labels="app=game"

clean: env creds clean.deployment clean.service 

clean.deployment: 
	-kubectl delete deployment game-deployment
	
clean.service: 
	-kubectl delete service game
  
retry: clean build deploy

config: env
