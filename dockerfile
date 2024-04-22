FROM ghcr.io/puppeteer/puppeteer:22.6.5

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# VOLUME ["./src"] # dev

# VOLUME ["./result"]

CMD ["npm","run", "start"]
