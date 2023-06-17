FROM node:18.12-alpine

RUN apk update
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

# setup nginx
COPY ./nginx/nginx.conf /etc/nginx/http.d/default.conf 
RUN apk add nginx

ENV PORT 3000
ENV NODE_ENV production
# nginx listens on standard http ports
EXPOSE 443
EXPOSE 80

CMD nginx && yarn start
