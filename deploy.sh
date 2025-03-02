#!/bin/bash

# Function to get active frontend
get_active_frontend() {
    if docker ps --format "{{.Names}}" | grep -q "react-frontend-blue"; then
        echo "blue"
    else
        echo "green"
    fi
}

ACTIVE_FRONTEND=$(get_active_frontend)

if [ "$ACTIVE_FRONTEND" == "blue" ]; then
    echo "Deploying Frontend to Green..."
    docker-compose up -d frontend-green
    sleep 5  # Allow time for startup

    # Update Nginx to use Green frontend
    sudo sed -i 's/react-frontend-blue/react-frontend-green/' /etc/nginx/conf.d/photoguests.conf
    sudo systemctl restart nginx

    # Stop Blue Frontend
    docker-compose stop frontend-blue
else
    echo "Deploying Frontend to Blue..."
    docker-compose up -d frontend-blue
    sleep 5  # Allow time for startup

    # Update Nginx to use Blue frontend
    sudo sed -i 's/react-frontend-green/react-frontend-blue/' /etc/nginx/conf.d/photoguests.conf
    sudo systemctl restart nginx

    # Stop Green Frontend
    docker-compose stop frontend-green
fi
