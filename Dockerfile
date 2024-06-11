# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY ./src ./src

RUN npm run build

# ---- Release ----
FROM node:20-alpine AS release
WORKDIR /usr/src/app

COPY --from=base /usr/src/app/package*.json ./
COPY --from=base /usr/src/app/package-lock.json ./

RUN npm ci --only=production

COPY --from=base /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]