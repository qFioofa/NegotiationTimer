import Config

config :backend, BackendWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "U4MN5dDnIZrjUxLlYWkaFFExNMPjpqAcziCrHt1LUvI30g1iHB9qLjB5c8haGUkp",
  watchers: []

config :logger, :default_formatter, format: "[$level] $message\n"

config :phoenix, :stacktrace_depth, 20

config :phoenix, :plug_init_mode, :runtime
