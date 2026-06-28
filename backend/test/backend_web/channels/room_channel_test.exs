defmodule BackendWeb.RoomChannelTest do
  use BackendWeb.ChannelCase, async: true

  alias BackendWeb.{Presence, RoomChannel, UserSocket}

  defp join_room(room, client_id, nick \\ "") do
    {:ok, _, socket} =
      socket(UserSocket, nil, %{})
      |> subscribe_and_join(BackendWeb.RoomChannel, "room:#{room}", %{
        "client_id" => client_id,
        "nick" => nick
      })

    :sys.get_state(socket.channel_pid)
    socket
  end

  defp flush(socket), do: :sys.get_state(socket.channel_pid)

  test "join requires a client_id" do
    assert {:error, %{reason: "client_id required"}} =
             socket(UserSocket, nil, %{})
             |> subscribe_and_join(BackendWeb.RoomChannel, "room:ABC", %{})
  end

  test "tracks unique users by client_id (incl. host)" do
    join_room("ROOM1", "host")
    join_room("ROOM1", "guest")
    join_room("ROOM1", "guest")
    _ = :sys.get_state(Presence)

    assert map_size(Presence.list("room:ROOM1")) == 2
  end

  test "resolve_nick keeps a free nick" do
    assert RoomChannel.resolve_nick("Аня", []) == "Аня"
  end

  test "resolve_nick dedupes collisions" do
    assert RoomChannel.resolve_nick("Аня", ["Аня"]) == "Аня (2)"
    assert RoomChannel.resolve_nick("Аня", ["Аня", "Аня (2)"]) == "Аня (3)"
  end

  test "resolve_nick defaults blank to Игрок" do
    assert RoomChannel.resolve_nick("   ", []) == "Игрок"
    assert RoomChannel.resolve_nick("", ["Игрок"]) == "Игрок (2)"
  end

  test "host may sync any key" do
    host = join_room("AUTH1", "h", "хост")
    join_room("AUTH1", "g")
    push(host, "sync", %{"key" => "style", "value" => %{"x" => 1}})
    assert_broadcast "sync", %{"key" => "style", "value" => %{"x" => 1}}
  end

  test "guest cannot sync host-only keys" do
    join_room("AUTH2", "h", "хост")
    guest = join_room("AUTH2", "g")
    push(guest, "sync", %{"key" => "style", "value" => %{}})
    refute_broadcast "sync", %{"key" => "style"}
    assert Backend.RoomState.get("room:AUTH2", "style") == nil
  end

  test "guest cannot grant itself a role" do
    guest = join_room("AUTH3", "g")
    push(guest, "sync", %{"key" => "member:g", "value" => %{"role" => "host"}})
    flush(guest)
    assert Backend.RoomState.get("room:AUTH3", "member:g") == nil
  end

  test "guest with canEditTimer may sync timer keys but not names" do
    host = join_room("AUTH4", "h", "хост")
    guest = join_room("AUTH4", "g")
    push(host, "sync", %{"key" => "member:g", "value" => %{"canEditTimer" => true}})
    flush(host)

    push(guest, "sync", %{"key" => "timer", "value" => %{"t" => 1}})
    assert_broadcast "sync", %{"key" => "timer"}

    push(guest, "sync", %{"key" => "name:a", "value" => "X"})
    refute_broadcast "sync", %{"key" => "name:a"}
  end

  test "banned reactions are dropped" do
    host = join_room("AUTH5", "h", "хост")
    guest = join_room("AUTH5", "g")
    push(host, "sync", %{"key" => "member:g", "value" => %{"bannedReactions" => true}})
    flush(host)

    push(guest, "reaction", %{"emoji" => "🔥", "side" => "left"})
    refute_broadcast "reaction", %{}
  end

  test "non-host kick is ignored" do
    guest = join_room("AUTH6", "g")
    push(guest, "kick", %{"client_id" => "victim"})
    refute_broadcast "kick", %{}
  end

  test "creator establishes host on join" do
    join_room("MIG1", "creator", "хост")
    assert Backend.RoomState.get("room:MIG1", "member:creator")["role"] == "host"
  end

  test "joining as хост does not steal an existing host" do
    join_room("MIG2", "creator", "хост")
    join_room("MIG2", "intruder", "хост")
    assert Backend.RoomState.get("room:MIG2", "member:intruder") == nil
  end

  test "claim_host migrates when host is absent" do
    guest = join_room("MIG3", "guest_id")
    _ = :sys.get_state(Presence)
    Backend.RoomState.put("room:MIG3", "member:ghost", %{"role" => "host"})

    push(guest, "claim_host", %{})
    flush(guest)

    assert Backend.RoomState.get("room:MIG3", "member:guest_id")["role"] == "host"
    assert Backend.RoomState.get("room:MIG3", "member:ghost")["role"] == "guest"
  end

  test "claim_host is rejected while a host is online" do
    join_room("MIG4", "host_id", "хост")
    guest = join_room("MIG4", "guest_id")
    _ = :sys.get_state(Presence)

    push(guest, "claim_host", %{})
    flush(guest)

    assert Backend.RoomState.get("room:MIG4", "member:guest_id") == nil
    assert Backend.RoomState.get("room:MIG4", "member:host_id")["role"] == "host"
  end
end
