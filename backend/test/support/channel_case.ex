defmodule BackendWeb.ChannelCase do
  @moduledoc false
  use ExUnit.CaseTemplate

  using do
    quote do
      @endpoint BackendWeb.Endpoint

      import Phoenix.ChannelTest
      import BackendWeb.ChannelCase
    end
  end

  setup _tags do
    :ok
  end
end
