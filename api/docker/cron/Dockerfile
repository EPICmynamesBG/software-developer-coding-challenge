FROM node:14.16.1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
COPY ./package-lock.json /usr/src/app/

RUN npm install

CMD [ "npm", "run" , "cron"]
