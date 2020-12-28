docker stop lo
docker rm lo
docker build -t lo-nginx .
docker run --name lo -d -p 8080:80 lo-nginx