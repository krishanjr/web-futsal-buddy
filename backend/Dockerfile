FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PORT=8089

EXPOSE 8089

CMD ["npx", "tsx", "index.ts"]