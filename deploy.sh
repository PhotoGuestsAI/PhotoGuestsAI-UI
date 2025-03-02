#!/bin/bash

# Ensure script runs from the correct directory
cd ~/PhotoGuestsAI-UI

# Function to determine the active frontend/backend
get_active_backend() {
    if docker ps --format "{{.Names}}" | grep -q "fastapi-backend-blue"; then
        echo "blue"
    else
        echo "green"
    fi
}

ACTIVE_BACKEND=$(get_active_backend)

if [ "$ACTIVE_BACKEND" == "blue" ]; then
    echo "Deploying to Green..."
    docker-compose up -d backend-green frontend-green
    sleep 5  # Allow time for startup

    # Update Nginx to use Green servers
    sudo sed -i 's/fastapi-backend-blue/fastapi-backend-green/' /etc/nginx/conf.d/photoguests.conf
    sudo sed -i 's/react-frontend-blue/react-frontend-green/' /etc/nginx/conf.d/photoguests.conf
    sudo systemctl restart nginx

    # Stop Blue
    docker-compose stop backend-blue frontend-blue
else
    echo "Deploying to Blue..."
    docker-compose up -d backend-blue frontend-blue
    sleep 5  # Allow time for startup

    # Update Nginx to use Blue servers
    sudo sed -i 's/fastapi-backend-green/fastapi-backend-blue/' /etc/nginx/conf.d/photoguests.conf
    sudo sed -i 's/react-frontend-green/react-frontend-blue/' /etc/nginx/conf.d/photoguests.conf
    sudo systemctl restart nginx

    # Stop Green
    docker-compose stop backend-green frontend-green
fi
