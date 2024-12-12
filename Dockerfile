FROM node:20-slim

WORKDIR /app

USER root

RUN apt-get update -y && apt-get install -y openssl

COPY prisma ./
COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]
