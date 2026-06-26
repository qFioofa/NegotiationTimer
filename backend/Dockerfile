FROM elixir:1.18

ENV MIX_ENV=dev \
    PHX_IP=0.0.0.0

WORKDIR /app

RUN mix local.hex --force && mix local.rebar --force

COPY mix.exs mix.lock ./
RUN mix deps.get

COPY config/ config/
RUN mix deps.compile

COPY lib/ lib/
COPY priv/ priv/
RUN mix compile

EXPOSE 4000

CMD ["mix", "phx.server"]
