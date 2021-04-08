FROM node:14.16.1

WORKDIR /usr/src/app/ui

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]