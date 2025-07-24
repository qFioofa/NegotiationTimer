FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --omit=dev

EXPOSE 4173

CMD ["npm", "run", "preview"]
