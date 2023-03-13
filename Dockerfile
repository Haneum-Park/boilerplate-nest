FROM node:16-alpine as builder
RUN apk --no-cache add libaio libnsl libc6-compat curl
RUN cd /lib && ln -s /lib64/* /lib && ln -s libnsl.so.2 /usr/lib/libnsl.so.1 && ln -s libc.so /usr/lib/libresolv.so.2

RUN npm install -g --force npm@latest yarn@latest

ENV NODE_ENV build
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
COPY . /app
RUN chown -R node:node /app

USER node
RUN yarn install --frozen-lockfile --production=false \
    && yarn build

# NOTE : Builder Install Dependencies & Building

FROM node:16-alpine

ENV NODE_ENV production

RUN cd /lib && ln -s /lib64/* /lib && ln -s libnsl.so.2 /usr/lib/libnsl.so.1 && ln -s libc.so /usr/lib/libresolv.so.2
RUN sed -i 's/http\:\/\/dl-cdn.alpinelinux.org/https\:\/\/alpine.global.ssl.fastly.net/g' /etc/apk/repositories
RUN apk --no-cache add libaio libnsl libc6-compat curl

USER node
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/package*.json /app/
# COPY --from=builder /app/node_modules/ /app/node_modules/
# NOTE : disable builder's node_moudle ( for production dependency only )
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/bin/ /app/bin/

# RUN mkdir ~/.aws && echo -e "[default]\naws_access_key_id = \naws_secret_access_key = " > ~/.aws/credentials && echo -e "[default]\nregion = ap-northeast-2" ~/.aws/config
# NOTE : AWS Credentials

ENV PATH /app/node_modules/.bin/:$PATH
# NOTE : PATH HACKY FOR NODE

RUN yarn install --frozen-lockfile --production

ENTRYPOINT node dist/main.js
