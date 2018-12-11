include ../../../Makefile.properties


reset: clean.deployment app
	say "App Reset"

reset.safe: 
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "$(BASEDIR)/../containers/main" "$(BASEDIR)/../containers/main.go" "$(BASEDIR)/../containers/kubernetes.go"
	gcloud container builds submit "$(BASEDIR)/../containers/." --tag=$(DOCKERREPO)/admin
	-kubectl delete deployment admin-deployment
	-kubectl run admin-deployment --image=$(DOCKERREPO)/admin --replicas=1 --port=8080 --labels=app=admin --env="APIIMAGE=$(DOCKERREPO)/api"
	say "app refresh complete"		

main:
	go get github.com/gorilla/mux
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "$(BASEDIR)/../containers/main" "$(BASEDIR)/../containers/main.go" "$(BASEDIR)/../containers/kubernetes.go"	

build: env main
	gcloud builds submit "$(BASEDIR)/../containers/." --tag=$(DOCKERREPO)/admin

deploy: env creds deployment service

deployment:
	kubectl apply -f "$(BASEDIR)/admin-deployment.yaml"
  
service:
	kubectl expose deployment admin-deployment --name=admin --target-port=8080  --type=NodePort --labels="app=admin"

clean: env creds clean.deployment clean.service 

clean.deployment: 
	-kubectl delete deployment admin-deployment
	
clean.service: 
	-kubectl delete service admin
