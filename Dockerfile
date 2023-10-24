FROM node:16-alpine

WORKDIR /compaira

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run build && npm run start