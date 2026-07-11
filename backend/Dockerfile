FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY seedAdmin.js ./seedAdmin.js

RUN mkdir -p /app/uploads && chown -R node:node /app
USER node

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && node seedAdmin.js && exec node src/index.js"]
