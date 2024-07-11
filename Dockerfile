FROM node:20

WORKDIR /app

COPY package*.json ./


RUN npm install

MAINTAINER Gate6

COPY  . .

EXPOSE 3000

CMD  ["npm", "start"]