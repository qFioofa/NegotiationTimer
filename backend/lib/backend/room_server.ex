defmodule Backend.RoomServer do
  use GenServer, restart: :transient

  alias BackendWeb.{Endpoint, Presence}

  # ponytail: 15s grace tolerates a host reload/reconnect; раздуть, если хост
  # часто теряет роль на медленном соединении
  @host_grace_ms 15 * 1000
  @empty_grace_ms 10 * 60 * 1000

  def ensure(topic) do
    case DynamicSupervisor.start_child(Backend.RoomSupervisor, {__MODULE__, topic}) do
      {:ok, _} -> :ok
      {:error, {:already_started, _}} -> :ok
      {:error, reason} -> {:error, reason}
    end
  end

  def start_link(topic), do: GenServer.start_link(__MODULE__, topic, name: via(topic))

  defp via(topic), do: {:via, Registry, {Backend.RoomRegistry, topic}}

  @impl true
  def init(topic) do
    Phoenix.PubSub.subscribe(Backend.PubSub, topic)
    {:ok, evaluate(%{topic: topic, migrate_ref: nil, cleanup_ref: nil})}
  end

  @impl true
  def handle_info(%Phoenix.Socket.Broadcast{event: "presence_diff"}, state) do
    {:noreply, evaluate(state)}
  end

  def handle_info(:migrate, state) do
    state = %{state | migrate_ref: nil}
    present = present_ids(state.topic)
    hosts = host_ids(state.topic)

    cond do
      present == [] ->
        {:noreply, schedule_cleanup(state)}

      Enum.any?(hosts, &(&1 in present)) ->
        {:noreply, state}

      true ->
        promote(state.topic, Enum.min(present), hosts)
        {:noreply, state}
    end
  end

  def handle_info(:cleanup, state) do
    if present_ids(state.topic) == [] do
      Backend.RoomState.clear(state.topic)
      {:stop, :normal, state}
    else
      {:noreply, evaluate(%{state | cleanup_ref: nil})}
    end
  end

  def handle_info(_msg, state), do: {:noreply, state}

  defp evaluate(state) do
    present = present_ids(state.topic)

    cond do
      present == [] ->
        state |> cancel(:migrate_ref) |> schedule_cleanup()

      Enum.any?(host_ids(state.topic), &(&1 in present)) ->
        state |> cancel(:migrate_ref) |> cancel(:cleanup_ref)

      true ->
        state |> cancel(:cleanup_ref) |> schedule_migrate()
    end
  end

  defp schedule_migrate(%{migrate_ref: nil} = state),
    do: %{state | migrate_ref: Process.send_after(self(), :migrate, @host_grace_ms)}

  defp schedule_migrate(state), do: state

  defp schedule_cleanup(%{cleanup_ref: nil} = state),
    do: %{state | cleanup_ref: Process.send_after(self(), :cleanup, @empty_grace_ms)}

  defp schedule_cleanup(state), do: state

  defp cancel(state, key) do
    if ref = Map.get(state, key), do: Process.cancel_timer(ref)
    Map.put(state, key, nil)
  end

  defp present_ids(topic), do: Presence.list(topic) |> Map.keys()

  defp host_ids(topic) do
    Backend.RoomState.all(topic)
    |> Enum.filter(fn {key, value} ->
      String.starts_with?(key, "member:") and is_map(value) and Map.get(value, "role") == "host"
    end)
    |> Enum.map(fn {"member:" <> id, _} -> id end)
  end

  defp promote(topic, new_host, hosts) do
    for id <- hosts, id != new_host do
      put_member(topic, id, Map.put(member_flags(topic, id), "role", "guest"))
    end

    put_member(topic, new_host, Map.put(member_flags(topic, new_host), "role", "host"))
    Endpoint.broadcast(topic, "host_changed", %{client_id: new_host})
  end

  defp member_flags(topic, id) do
    case Backend.RoomState.get(topic, "member:#{id}") do
      flags when is_map(flags) -> flags
      _ -> %{}
    end
  end

  defp put_member(topic, id, flags) do
    Backend.RoomState.put(topic, "member:#{id}", flags)
    Endpoint.broadcast(topic, "sync", %{"key" => "member:#{id}", "value" => flags})
  end
end
