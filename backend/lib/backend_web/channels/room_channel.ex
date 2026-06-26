defmodule BackendWeb.RoomChannel do
  use BackendWeb, :channel

  alias BackendWeb.Presence

  @impl true
  def join("room:" <> _room_id, %{"client_id" => client_id}, socket)
      when is_binary(client_id) and client_id != "" do
    send(self(), :after_join)
    {:ok, assign(socket, :client_id, client_id)}
  end

  def join("room:" <> _room_id, _params, _socket) do
    {:error, %{reason: "client_id required"}}
  end

  @impl true
  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, socket.assigns.client_id, %{
        online_at: System.system_time(:second)
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
