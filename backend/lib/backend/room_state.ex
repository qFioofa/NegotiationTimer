defmodule Backend.RoomState do
  @moduledoc """
  Последнее состояние каждой комнаты (настройки, таймер, имена) в публичной
  ETS-таблице. Нужно, чтобы поздно зашедший участник получил актуальную картину.

  Ключ строки — {topic, key}, поэтому записи разных ключей не гонятся между собой
  (ETS :set атомарен на строку). ponytail: last-writer-wins на ключ; если понадобится
  порядок/версии — добавить векторные часы.
  """
  use GenServer

  @table :room_state

  def start_link(_opts), do: GenServer.start_link(__MODULE__, nil, name: __MODULE__)

  @doc "Сохранить значение ключа для комнаты."
  def put(topic, key, value), do: :ets.insert(@table, {{topic, key}, value})

  @doc "Все {key, value} комнаты — для отправки новому участнику."
  def all(topic) do
    :ets.match_object(@table, {{topic, :_}, :_})
    |> Enum.map(fn {{_topic, key}, value} -> {key, value} end)
  end

  @impl true
  def init(_) do
    :ets.new(@table, [:named_table, :public, :set, read_concurrency: true, write_concurrency: true])
    {:ok, nil}
  end
end
