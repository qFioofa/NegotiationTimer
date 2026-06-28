defmodule BackendWeb.RoomChannel do
  use BackendWeb, :channel

  alias BackendWeb.Presence

  @host_nick "хост"
  @timer_keys ["timer", "paused", "blackout"]

  @impl true
  def join("room:" <> _room_id, %{"client_id" => client_id} = params, socket)
      when is_binary(client_id) and client_id != "" do
    send(self(), :after_join)
    {:ok, assign(socket, client_id: client_id, nick: Map.get(params, "nick", ""))}
  end

  def join("room:" <> _room_id, _params, _socket) do
    {:error, %{reason: "client_id required"}}
  end

  @impl true
  def handle_info(:after_join, socket) do
    nick = resolve_nick(socket.assigns.nick, taken_nicks(socket))

    {:ok, _} =
      Presence.track(socket, socket.assigns.client_id, %{
        online_at: System.system_time(:second),
        nick: nick
      })

    push(socket, "nick", %{nick: nick})
    push(socket, "presence_state", Presence.list(socket))

    maybe_initial_host(socket)
    Backend.RoomServer.ensure(socket.topic)

    for {key, value} <- Backend.RoomState.all(socket.topic) do
      push(socket, "sync", %{"key" => key, "value" => value})
    end

    push(socket, "synced", %{})

    {:noreply, socket}
  end

  defp maybe_initial_host(socket) do
    if socket.assigns.nick == @host_nick and host_member_ids(socket) == [] do
      put_member(socket, socket.assigns.client_id, %{"role" => "host"})
    end
  end

  def resolve_nick(requested, taken) do
    base =
      case String.trim(to_string(requested)) do
        "" -> "Игрок"
        trimmed -> trimmed
      end

    if base in taken, do: dedupe(base, taken, 2), else: base
  end

  defp taken_nicks(socket) do
    Presence.list(socket)
    |> Enum.flat_map(fn {_id, %{metas: metas}} -> Enum.map(metas, &Map.get(&1, :nick)) end)
    |> Enum.reject(&is_nil/1)
  end

  defp dedupe(base, taken, n) do
    candidate = "#{base} (#{n})"
    if candidate in taken, do: dedupe(base, taken, n + 1), else: candidate
  end

  @impl true
  def handle_in("reaction", %{"emoji" => emoji, "side" => side}, socket)
      when is_binary(emoji) and side in ["left", "right"] do
    unless banned_reactions?(socket) do
      broadcast(socket, "reaction", %{emoji: emoji, side: side})
    end

    {:noreply, socket}
  end

  def handle_in("sync", %{"key" => key, "value" => value}, socket) when is_binary(key) do
    if authorized_sync?(socket, key) do
      Backend.RoomState.put(socket.topic, key, value)
      broadcast_from(socket, "sync", %{"key" => key, "value" => value})
    end

    {:noreply, socket}
  end

  def handle_in("set_nick", %{"nick" => nick}, socket) when is_binary(nick) do
    taken = taken_nicks(socket) -- [current_nick(socket)]
    resolved = resolve_nick(nick, taken)
    Presence.update(socket, socket.assigns.client_id, &Map.put(&1, :nick, resolved))
    push(socket, "nick", %{nick: resolved})
    {:noreply, socket}
  end

  def handle_in("kick", %{"client_id" => id}, socket) when is_binary(id) do
    if host?(socket), do: broadcast(socket, "kick", %{client_id: id})
    {:noreply, socket}
  end

  def handle_in("rename", %{"client_id" => id, "nick" => nick}, socket)
      when is_binary(id) and is_binary(nick) do
    if host?(socket), do: broadcast(socket, "rename", %{client_id: id, nick: nick})
    {:noreply, socket}
  end

  defp authorized_sync?(socket, key) do
    flags = sender_flags(socket)

    case sender_role(socket, flags) do
      "host" -> true
      "rights" -> key in ["name:a", "name:b"] or key in @timer_keys
      _ -> can_edit_timer?(flags) and key in @timer_keys
    end
  end

  defp host?(socket), do: sender_role(socket, sender_flags(socket)) == "host"

  defp banned_reactions?(socket), do: Map.get(sender_flags(socket), "bannedReactions") == true

  defp can_edit_timer?(flags), do: Map.get(flags, "canEditTimer") == true

  defp sender_flags(socket), do: member_flags_of(socket, socket.assigns.client_id)

  defp member_flags_of(socket, id) do
    case Backend.RoomState.get(socket.topic, "member:#{id}") do
      flags when is_map(flags) -> flags
      _ -> %{}
    end
  end

  defp host_member_ids(socket) do
    Backend.RoomState.all(socket.topic)
    |> Enum.filter(fn {key, value} ->
      String.starts_with?(key, "member:") and is_map(value) and Map.get(value, "role") == "host"
    end)
    |> Enum.map(fn {"member:" <> id, _} -> id end)
  end

  defp put_member(socket, id, flags) do
    Backend.RoomState.put(socket.topic, "member:#{id}", flags)
    broadcast(socket, "sync", %{"key" => "member:#{id}", "value" => flags})
  end

  defp sender_role(socket, flags) do
    case Map.get(flags, "role") do
      role when role in ["host", "rights", "guest"] -> role
      _ -> if current_nick(socket) == @host_nick, do: "host", else: "guest"
    end
  end

  defp current_nick(socket) do
    case Presence.get_by_key(socket, socket.assigns.client_id) do
      %{metas: [%{nick: nick} | _]} -> nick
      _ -> nil
    end
  end
end
