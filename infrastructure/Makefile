BASEDIR = $(shell pwd)

include ../Makefile.properties
NODEDISKSIZE="200"
NODECOUNT="2"
NODETYPE="n1-standard-4"
SCOPES="https://www.googleapis.com/auth/cloud-platform"

# Builds the entire infrastructure you need to run this set of demos. 
build: env build.cluster ip

# Requests a GKE cluster
build.cluster: 
	-gcloud container clusters create $(CLUSTER) --num-nodes $(NODECOUNT) \
	--disk-size=$(NODEDISKSIZE) --machine-type=$(NODETYPE) --zone=$(ZONE) \
	--scopes=$(SCOPES)
  
ip:
	gcloud compute --project $(PROJECT) addresses create $(INGRESSNAME) --global

# Runs all the clean commands. 
clean: env clean.cluster clean.repo clean.ip

# deletes the cluster. 
clean.cluster:
	gcloud container clusters delete $(CLUSTER) -q

# Gets rid of all of the images in GKR
clean.repo:
	-gsutil -m rm -r gs://artifacts.$(PROJECT).appspot.com

clean.ip:
	gcloud compute --project $(PROJECT) addresses delete $(INGRESSNAME) 
