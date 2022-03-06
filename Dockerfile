FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY start.sh ./
COPY . .

EXPOSE 3000

CMD ./start.sh
