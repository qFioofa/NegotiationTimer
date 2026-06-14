docker image prune -a -f
docker-compose down --volumes --remove-orphans
docker-compose up -d --build