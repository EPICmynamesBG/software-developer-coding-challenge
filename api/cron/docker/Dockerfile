FROM node:14.16.1 as builder

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/

RUN npm install


FROM builder as build2

RUN apt-get update && apt-get -y install cron

COPY ./crontab /etc/cron.d/app-cron

RUN chmod 0644 /etc/cron.d/app-cron

RUN crontab /etc/cron.d/app-cron

CMD ["cron", "-f", "-d", "8"]
