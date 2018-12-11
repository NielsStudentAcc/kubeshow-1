BASEDIR = $(shell pwd)

include ../../Makefile.properties

deploy: env creds
	kubectl apply -f "$(BASEDIR)/ingress.yaml"

deploy.minikube:
	kubectl apply -f "$(BASEDIR)/ingress.minikube.yaml"

deploy.generic:
	kubectl apply -f "$(BASEDIR)/ingress.generic.yaml"	

config: env
	@echo Creating INGRESS Yaml files based on samples and setting in your Makefile.properties
	@cp "$(BASEDIR)/ingress.sample.yaml" "$(BASEDIR)/ingress.yaml"
	$(call rewritefile,"$(BASEDIR)/ingress.yaml",%INGRESSNAME%,$(INGRESSNAME))

clean: env creds
	-kubectl delete -f "$(BASEDIR)/ingress.yaml"

clean.minikube:
	-kubectl delete -f "$(BASEDIR)/ingress.minikube.yaml"

clean.generic:
	-kubectl delete -f "$(BASEDIR)/ingress.generic.yaml"

define rewritefile
	@sed s/$(2)/$(3)/g <""$(1)"" >"$(BASEDIR)/.temp"
	@cp "$(BASEDIR)/.temp" $(1)
	@rm "$(BASEDIR)/.temp" 
endef
