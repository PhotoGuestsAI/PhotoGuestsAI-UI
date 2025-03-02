#!/bin/bash

echo "Building backend and frontend images..."
docker-compose build --no-cache backend-blue backend-green frontend-blue frontend-green

# Determine which version is currently active
ACTIVE_BACKEND=$(docker ps --format "{{.Names}}" | grep fastapi-backend-blue || true)

if [ "$ACTIVE_BACKEND" == "fastapi-backend-blue" ]; then
    # Deploy to Green
    echo "Deploying to Green..."
    docker-compose up -d backend-green frontend-green
    sleep 5  # Allow time for startup

    # Switch Nginx to Green
    sudo sed -i 's/server 127.0.0.1:8000/server 127.0.0.1:8001/' /etc/nginx/conf.d/photoguests.conf
    sudo sed -i 's/server 127.0.0.1:3000/server 127.0.0.1:3001/' /etc/nginx/conf.d/photoguests.conf
    sudo systemctl restart nginx

    # Stop Blue
    docker-compose stop backend-blue frontend-blue
else
    # Deploy to Blue
    echo "Deploying to Blue..."
    docker-compose up -d backend-blue frontend-blue
    sleep 5

    # Switch Nginx to Blue
    sudo sed -i 's/server 127.0.0.1:8001/server 127.0.0.1:8000/' /etc/nginx/conf.d/photoguests.conf
    sudo sed -i 's/server 127.0.0.1:3001/server 127.0.0.1:3000/' /etc/nginx/conf.d/photoguests.conf
    sudo systemctl restart nginx

    # Stop Green
    docker-compose stop backend-green frontend-green
fi


# ✅ Ensure Nginx is running at the end
echo "Ensuring Nginx is running..."
sudo systemctl enable nginx
sudo systemctl restart nginx
echo "Nginx is running!"