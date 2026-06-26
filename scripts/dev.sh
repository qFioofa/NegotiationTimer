#!/usr/bin/env bash

cd "$(dirname "$0")/.."

trap 'kill 0' EXIT

(cd backend && mix deps.get && mix phx.server) &
(cd frontend && npm install && npm run dev) &

wait
