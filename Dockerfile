FROM node:20

WORKDIR /app

COPY package*.json ./
COPY svelte.config.js ./
COPY tsconfig.json ./
COPY vite.config.ts ./

RUN npm ci

COPY src/ src/
COPY static/ static/

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]