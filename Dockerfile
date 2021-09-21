FROM node:16-alpine

LABEL maintainer="Brandon Flick - https://bflick.dev"

RUN apk add --update --no-cache ca-certificates bash
RUN mkdir -p /app
RUN mkdir -p /config

WORKDIR /app

COPY package.json .

RUN npm install -g ts-node
RUN npm install

COPY . .

VOLUME [ "/config" ]

CMD ["/bin/bash", "/app/entrypoint.sh"]
