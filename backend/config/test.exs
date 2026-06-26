import Config

config :backend, BackendWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "AulJs4dl2XJDMUtrzBslM7ogQG9a8m/oAevboDajJx3AlqMvw/3PoGZJzKGvrzIA",
  server: false

config :logger, level: :warning

config :phoenix, :plug_init_mode, :runtime

config :phoenix, sort_verified_routes_query_params: true
