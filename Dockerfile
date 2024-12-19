FROM node:20-slim

ARG PORT

ENV PORT=$PORT

WORKDIR /app

USER root

RUN apt-get update -y && apt-get install -y openssl

COPY prisma ./
COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

EXPOSE $PORT

ENV NODE_ENV=production

ENTRYPOINT ["sh", "entrypoint.sh"]
