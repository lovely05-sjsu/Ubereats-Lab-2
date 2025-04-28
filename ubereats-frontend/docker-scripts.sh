#!/bin/bash

# Function to display help
show_help() {
  echo "UberEats Frontend Docker Helper Script"
  echo ""
  echo "Usage: ./docker-scripts.sh [command]"
  echo ""
  echo "Commands:"
  echo "  build-dev       Build development Docker image"
  echo "  build-prod      Build production Docker image"
  echo "  run-dev         Run development container"
  echo "  run-prod        Run production container"
  echo "  stop            Stop all containers"
  echo "  clean           Remove all containers and images"
  echo "  logs            Show logs from running container"
  echo "  help            Show this help message"
  echo ""
}

# Build development Docker image
build_dev() {
  echo "Building development Docker image..."
  docker-compose -f docker-compose.dev.yml build
}

# Build production Docker image
build_prod() {
  echo "Building production Docker image..."
  docker-compose build
}

# Run development container
run_dev() {
  echo "Starting development container..."
  docker-compose -f docker-compose.dev.yml up
}

# Run production container
run_prod() {
  echo "Starting production container..."
  docker-compose up -d
}

# Stop all containers
stop() {
  echo "Stopping all containers..."
  docker-compose down
  docker-compose -f docker-compose.dev.yml down
}

# Clean up containers and images
clean() {
  echo "Cleaning up containers and images..."
  docker-compose down --rmi all
  docker-compose -f docker-compose.dev.yml down --rmi all
}

# Show logs
logs() {
  echo "Showing logs..."
  docker-compose logs -f
}

# Main script
case "$1" in
  build-dev)
    build_dev
    ;;
  build-prod)
    build_prod
    ;;
  run-dev)
    run_dev
    ;;
  run-prod)
    run_prod
    ;;
  stop)
    stop
    ;;
  clean)
    clean
    ;;
  logs)
    logs
    ;;
  help|*)
    show_help
    ;;
esac 