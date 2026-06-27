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

    # Отдаём новому участнику актуальное состояние комнаты (настройки/таймер/имена).
    for {key, value} <- Backend.RoomState.all(socket.topic) do
      push(socket, "sync", %{"key" => key, "value" => value})
    end

    {:noreply, socket}
  end

  @impl true
  def handle_in("reaction", %{"emoji" => emoji, "side" => side}, socket)
      when is_binary(emoji) and side in ["left", "right"] do
    broadcast(socket, "reaction", %{emoji: emoji, side: side})
    {:noreply, socket}
  end

  # Общий канал синхронизации: любая настройка/таймер/текст. Сохраняем последнее
  # значение (для поздних участников) и рассылаем остальным, кроме отправителя.
  def handle_in("sync", %{"key" => key, "value" => value}, socket) when is_binary(key) do
    Backend.RoomState.put(socket.topic, key, value)
    broadcast_from(socket, "sync", %{"key" => key, "value" => value})
    {:noreply, socket}
  end
end
