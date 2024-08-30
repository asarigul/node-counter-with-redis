FROM node:alpine

WORKDIR /usr/node-counter-with-redis

COPY package.json .
RUN npm install

COPY index.js .

CMD ["npm", "start"]



