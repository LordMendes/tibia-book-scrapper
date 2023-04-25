FROM node:18-alpine3.15
WORKDIR /app

COPY package.json yarn.lock /app/
RUN rm -rf node_modules
RUN yarn install --silent

COPY . /app/
COPY .env /app/

EXPOSE 3000
EXPOSE 5432
EXPOSE 27017
