#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

ip="$(ip -4 route show default | grep -oP 'src \K\S+' | head -1)"
[ -z "$ip" ] && ip="$(hostname -I | awk '{print $1}')"

url="http://${ip}:4173"

docker compose up -d --build

echo
echo "Подключение с других устройств в этой сети:"
echo "  $url"
echo

if command -v qrencode >/dev/null 2>&1; then
	qrencode -t ANSIUTF8 "$url"
elif command -v npx >/dev/null 2>&1; then
	echo "$url" | npx -y qrcode-terminal
else
	echo "(QR: установи qrencode — 'nix-shell -p qrencode')"
fi
