defmodule BackendWeb.Presence do
  @moduledoc false
  use Phoenix.Presence,
    otp_app: :backend,
    pubsub_server: Backend.PubSub
end
