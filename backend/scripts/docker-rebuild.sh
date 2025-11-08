#!/bin/bash
# Script to rebuild Docker image from scratch
# Use this when you've made changes to dependencies or configuration

set -e  # Exit on error

echo "=========================================="
echo "Luqma Backend - Docker Rebuild"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Please create a .env file from .env.example:"
    echo "  cp .env.example .env"
    echo ""
    exit 1
fi

echo "🛑 Stopping and removing existing containers..."
docker compose down
echo "✅ Containers stopped and removed"
echo ""

echo "🗑️  Removing old images..."
docker compose down --rmi local 2>/dev/null || true
echo "✅ Old images removed"
echo ""

echo "🏗️  Building fresh Docker image (no cache)..."
docker compose build --no-cache
echo "✅ Docker image built successfully"
echo ""

echo "🚀 Starting containers..."
docker compose up -d
echo "✅ Containers started"
echo ""

echo "⏳ Waiting for application to start (30 seconds)..."
sleep 30

echo "🔍 Checking application health..."
if command -v curl &> /dev/null; then
    HEALTH_STATUS=$(curl -s http://localhost:8080/actuator/health | grep -o '"status":"[^"]*"' || echo "unknown")
    echo "   Health status: $HEALTH_STATUS"
    
    if [[ $HEALTH_STATUS == *"UP"* ]]; then
        echo "✅ Application is healthy!"
    else
        echo "⚠️  Application may not be healthy yet"
        echo "   Check logs with: docker compose logs -f"
    fi
else
    echo "⚠️  curl not found, skipping health check"
    echo "   Manual check: docker compose ps"
fi
echo ""

echo "=========================================="
echo "✅ Docker Rebuild Complete!"
echo "=========================================="
echo ""
echo "Application is available at:"
echo "  http://localhost:8080"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose logs -f"
echo "  Stop:         docker compose down"
echo "  Restart:      docker compose restart"
echo "  Status:       docker compose ps"
echo ""

