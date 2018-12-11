BASEDIR = $(shell pwd)

include Makefile.properties

deploy: env creds
	kubectl apply -f fabric8-rbac.yaml
	cd "$(BASEDIR)/a/api/kubernetes/" && $(MAKE) deploy
	cd "$(BASEDIR)/a/game/kubernetes/" && $(MAKE) deploy
	cd "$(BASEDIR)/a/admin/kubernetes/" && $(MAKE) deploy
	cd "$(BASEDIR)/a/ingress/" && $(MAKE) deploy

reset: env creds
	cd "$(BASEDIR)/a/api/kubernetes/" && $(MAKE) reset
	cd "$(BASEDIR)/a/game/kubernetes/" && $(MAKE) reset
	cd "$(BASEDIR)/a/admin/kubernetes/" && $(MAKE) reset
	
reset.safe: env creds
	cd "$(BASEDIR)/a/api/kubernetes/" && $(MAKE) reset.safe
	cd "$(BASEDIR)/a/game/kubernetes/" && $(MAKE) reset.safe
	cd "$(BASEDIR)/a/admin/kubernetes/" && $(MAKE) reset.safe


clean: env creds
	cd "$(BASEDIR)/a/api/kubernetes/" && $(MAKE) clean
	cd "$(BASEDIR)/a/game/kubernetes/" && $(MAKE) clean
	cd "$(BASEDIR)/a/admin/kubernetes/" && $(MAKE) clean	
	cd "$(BASEDIR)/a/ingress/" && $(MAKE) clean

build: env creds
	
	cd "$(BASEDIR)/a/api/kubernetes/" && $(MAKE) build
	cd "$(BASEDIR)/a/game/kubernetes/" && $(MAKE) build
	cd "$(BASEDIR)/a/admin/kubernetes/" && $(MAKE) build

config: env creds
	@cd "$(BASEDIR)/a/ingress/" && $(MAKE) config
