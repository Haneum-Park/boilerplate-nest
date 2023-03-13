export PACKAGE_VERSION="$(cat ./package.json | grep -m 1 version | sed 's/[^0-9.]//g')"
export DOCKER_NAME="$(cat ./package.json | grep -m 1 docker_name | sed 's/[^0-9.]//g')"
export DOCKER_USER="$(cat ./package.json | grep -m 1 docker_user | sed 's/[^0-9.]//g')"

docker buildx build --platform linux/arm64 -t "${DOCKER_USER}/${DOCKER_NAME}:${PACKAGE_VERSION}" --push .
docker buildx build --platform linux/arm64 -t "${DOCKER_USER}/${DOCKER_NAME}:latest" --push .
docker buildx build --platform linux/arm64 -t "${DOCKER_USER}/${DOCKER_NAME}:stable" --push .
#docker buildx build --platform linux/arm64 -t "${DOCKER_USER}/${DOCKER_NAME}:rollback" --push .
