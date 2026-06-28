FROM elixir:1.18

RUN apt-get update \
	&& apt-get install -y --no-install-recommends curl nginx gettext-base \
	&& curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
	&& apt-get install -y --no-install-recommends nodejs \
	&& rm -rf /var/lib/apt/lists/*

RUN mix local.hex --force && mix local.rebar --force

# backend
WORKDIR /app/backend
ENV MIX_ENV=prod
COPY backend/mix.exs backend/mix.lock ./
RUN mix deps.get --only prod
COPY backend/config/ config/
RUN mix deps.compile
COPY backend/lib/ lib/
COPY backend/priv/ priv/
RUN mix compile

# frontend
WORKDIR /app/frontend
ENV VITE_WS_URL=/socket
COPY frontend/package*.json frontend/svelte.config.js frontend/tsconfig.json frontend/vite.config.ts ./
RUN npm ci
COPY frontend/src/ src/
COPY frontend/static/ static/
RUN npm run build

# runtime
WORKDIR /app
COPY nginx.conf.template entrypoint.sh ./
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]
