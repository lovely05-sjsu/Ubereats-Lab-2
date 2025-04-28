#!/bin/bash

# Create a temporary directory
mkdir -p temp-configmap

# Copy the necessary files
cp -r services temp-configmap/
cp -r models temp-configmap/
cp package.json temp-configmap/
cp package-lock.json temp-configmap/

# Create the ConfigMap
kubectl create configmap order-status-consumer-code --from-file=temp-configmap/

# Clean up
rm -rf temp-configmap 