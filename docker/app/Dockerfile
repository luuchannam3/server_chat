FROM node:12.19-alpine

WORKDIR /app

ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache openssl \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Installing bash.
RUN apk add --no-cache bash bash-doc bash-completion

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    && npm install \
    && apk del .gyp

COPY . .

RUN yarn


EXPOSE 5000

CMD ["yarn", "start"]