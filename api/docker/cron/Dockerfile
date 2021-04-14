FROM node:14.16.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g swagger

COPY . .

CMD [ "npm", "run" , "cron"]
