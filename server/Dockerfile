FROM node:14

WORKDIR /server

COPY package.json /server

COPY . .

RUN npm install

EXPOSE 5000


CMD ["node", "index.js"]