#!/usr/bin/env bash

: "${PORT:=8080}"
export PHX_SERVER=1 PHX_IP=0.0.0.0

(cd /app/backend && MIX_ENV=prod PORT=4000 mix phx.server) &

(cd /app/frontend && PORT=3000 HOST=0.0.0.0 PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build) &

envsubst '${PORT}' </app/nginx.conf.template >/app/nginx.conf
exec nginx -c /app/nginx.conf -g 'daemon off;'
