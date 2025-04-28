#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Build Docker images
echo "📦 Building Docker images..."
docker-compose build

# Start services
echo "🌟 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Apply Kubernetes configurations
echo "⚙️ Applying Kubernetes configurations..."
kubectl apply -f k8s/zookeeper-deployment.yaml
kubectl apply -f k8s/kafka.yml
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/user-deployment.yaml
kubectl apply -f k8s/restaurant-deployment.yaml
kubectl apply -f k8s/order-deployment.yaml
kubectl apply -f k8s/order-status-consumer.yaml

# Wait for pods to be ready
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=zookeeper --timeout=120s
kubectl wait --for=condition=ready pod -l app=kafka --timeout=120s
kubectl wait --for=condition=ready pod -l app=mongo-db --timeout=120s
kubectl wait --for=condition=ready pod -l app=user-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=restaurant-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=order-service --timeout=120s
kubectl wait --for=condition=ready pod -l app=order-status-consumer --timeout=120s

echo "✅ Deployment completed successfully!"
echo "📊 Checking service status..."
kubectl get pods
kubectl get services 