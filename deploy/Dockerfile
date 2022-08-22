FROM node:14.19.2-alpine3.15

ARG PROFILES
ENV SET_PROFILE="$PROFILES"

RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . /app/

RUN npm install yarn serve
RUN yarn install
RUN yarn build:$SET_PROFILE

EXPOSE 3000

CMD ["npx", "serve",  "-s",  "build"]