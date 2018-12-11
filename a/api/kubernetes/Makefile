BASEDIR = $(shell pwd)

include ../../../Makefile.properties

app: build deploy

reset: clean.deployment app
	say "app refresh complete"

reset.safe: env creds
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "$(BASEDIR)/../containers/main" "$(BASEDIR)/../containers/main.go"
	gcloud container builds submit "$(BASEDIR)/../containers/." --tag=$(DOCKERREPO)/api
	-kubectl delete deployment api-deployment
	-kubectl run api-deployment --image=$(DOCKERREPO)/api --replicas=12 --port=8080 --labels=app=api 
	say "app refresh complete"		

main:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o "$(BASEDIR)/../containers/main" "$(BASEDIR)/../containers/main.go"

build: env main
	gcloud builds submit "$(BASEDIR)/../containers/." --tag=$(DOCKERREPO)/api

deploy: env creds deployment service

deployment:
	kubectl apply -f "$(BASEDIR)/api-deployment.yaml"

service:
	kubectl expose deployment api-deployment --name=api --target-port=8080  --type=NodePort --labels="app=api"

clean: env creds clean.deployment clean.service 

clean.deployment: 
	-kubectl delete deployment api-deployment
	
clean.service: 
	-kubectl delete service api

config: env 
	@echo Creating API Yaml files based on samples and setting in your Makefile.properties
	@cp "$(BASEDIR)/api-deployment.sample.yaml" "$(BASEDIR)/api-deployment.yaml"
	$(call rewritefile,"$(BASEDIR)/api-deployment.yaml",%PROJECT%,$(PROJECT))

define rewritefile
	@sed s/$(2)/$(3)/g <""$(1)"" >"$(BASEDIR)/.temp"
	@cp "$(BASEDIR)/.temp" $(1)
	@rm "$(BASEDIR)/.temp" 
