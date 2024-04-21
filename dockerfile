FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

VOLUME ["./src"] # dev

VOLUME ["./result"]

CMD ["npm","run", "start:dev"]
