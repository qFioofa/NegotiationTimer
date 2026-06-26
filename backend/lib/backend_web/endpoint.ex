defmodule BackendWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :backend

  socket "/socket", BackendWeb.UserSocket, websocket: true, longpoll: false

  plug Plug.Static,
    at: "/",
    from: :backend,
    gzip: not code_reloading?,
    only: BackendWeb.static_paths(),
    raise_on_missing_only: code_reloading?

  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.Head
  plug BackendWeb.Router
end
