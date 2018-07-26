FROM ubuntu:16.04

RUN apt-get update && apt-get -y install sudo vim git

WORKDIR /
RUN mkdir /code
WORKDIR /code

RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN npm install npm --global

COPY . .

EXPOSE 9000
