defmodule BackendWeb.RoomChannelTest do
  use BackendWeb.ChannelCase, async: true

  alias BackendWeb.{Presence, UserSocket}

  defp join_room(room, client_id) do
    {:ok, _, socket} =
      socket(UserSocket, nil, %{})
      |> subscribe_and_join(BackendWeb.RoomChannel, "room:#{room}", %{"client_id" => client_id})

    socket
  end

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
end
