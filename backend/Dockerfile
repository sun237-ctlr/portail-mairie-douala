FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org && \
    npm config set fetch-retries 10 && \
    npm config set fetch-retry-factor 2 && \
    npm config set fetch-retry-mintimeout 2000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-timeout 600000 && \
    npm install --no-audit
COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma
EXPOSE 5001
CMD ["node", "src/index.js"]
