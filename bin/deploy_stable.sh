#!/bin/bash
export PACKAGE_VERSION="$(cat ./package.json | grep -m 1 version | sed 's/[^0-9.]//g')"
export DOCKER_NAME="$(cat ./package.json | grep -m 1 docker_name | sed 's/[^0-9.]//g')"
export DOCKER_USER="$(cat ./package.json | grep -m 1 docker_user | sed 's/[^0-9.]//g')"

docker pull "${DOCKER_USER}/${DOCKER_NAME}:stable"
docker tag "${DOCKER_USER}/${DOCKER_NAME}:stable" "${DOCKER_USER}/${DOCKER_NAME}:rollback"
docker push "${DOCKER_USER}/${DOCKER_NAME}:rollback"

docker build . -t "${DOCKER_USER}/${DOCKER_NAME}:${PACKAGE_VERSION}" -t "${DOCKER_USER}/${DOCKER_NAME}:stable"

docker push "${DOCKER_USER}/${DOCKER_NAME}:stable"
docker push "${DOCKER_USER}/${DOCKER_NAME}:${PACKAGE_VERSION}"

docker rmi -f $(docker images "${DOCKER_USER}/${DOCKER_NAME}" -q)
