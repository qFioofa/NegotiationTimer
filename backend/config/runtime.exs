import Config

if System.get_env("PHX_SERVER") do
  config :backend, BackendWeb.Endpoint, server: true
end

http_ip =
  case System.get_env("PHX_IP", "") |> String.split(".", trim: true) do
    [a, b, c, d] ->
      [
        ip:
          {String.to_integer(a), String.to_integer(b), String.to_integer(c), String.to_integer(d)}
      ]

    _ ->
      []
  end

config :backend, BackendWeb.Endpoint,
  http: [port: String.to_integer(System.get_env("PORT", "4000"))] ++ http_ip

if config_env() == :prod do
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host =
    System.get_env("HOST_NAME") || System.get_env("PHX_HOST") ||
      System.get_env("RAILWAY_PUBLIC_DOMAIN") || "example.com"

  check_origin =
    case System.get_env("HOST_NAME") do
      nil -> false
      "" -> false
      name -> ["https://#{name}", "http://#{name}"]
    end

  config :backend, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")

  config :backend, BackendWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    check_origin: check_origin,
    http: [ip: {0, 0, 0, 0, 0, 0, 0, 0}],
    secret_key_base: secret_key_base
end
