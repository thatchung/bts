docker-compose build --compress
docker-compose down
docker-compose up -d
docker container prune -f || true
docker image prune -f || true
docker system prune -f || true
