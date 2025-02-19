# Docker registry
REGISTRY ?= index.docker.io
#Image namespace
NAMESPACE ?= ismaamesaa
# image name
APPNAME ?= do-orders-api
#image default tag
IMAGETAG ?= latest

IMAGENAME = ${REGISTRY}/${NAMESPACE}/${APPNAME}:${IMAGETAG}

build:
	docker build -t ${IMAGENAME} generated-server

push:
	docker push ${IMAGENAME}

clean_iamge:
	docker rmi ${IMAGENAME}

compose_deploy:
	docker compose -f generated-server/docker-compose.yml up -d

compose_clean:
	docker compose -f generated-server/docker-compose.yml down
