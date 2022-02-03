FROM node:10.13-alpine as dev
WORKDIR /root/
CMD echo "getting latest npm modules" \
    && npm install \
    && echo "installation complete, starting" \
    && npm start
FROM node:10.13-alpine as build
WORKDIR /root
RUN apk add g++ make python
COPY ./package.json ./package.json
RUN npm install
COPY . .
RUN npm run build -o app
