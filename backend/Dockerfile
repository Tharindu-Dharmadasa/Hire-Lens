FROM node:20-alpine AS deps

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

FROM node:20-alpine AS builder

WORKDIR /app/backend

COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY generated /app/generated

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app/backend

ENV NODE_ENV=production

COPY package.json /app/package.json
COPY backend/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/generated /app/generated

EXPOSE 3001

CMD ["npm", "start"]