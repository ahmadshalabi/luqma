#!/bin/bash
# Run the Luqma backend locally with proper environment setup

set -e  # Exit on error

echo "=========================================="
echo "Luqma Backend - Local Development"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Please run the setup script first:"
    echo "  ./scripts/setup-local.sh"
    echo ""
    exit 1
fi

# Load environment variables securely
echo "📦 Loading environment variables from .env..."
set -a
source .env
set +a
echo "✅ Environment variables loaded"
echo ""

# Set Spring profile to dev
export SPRING_PROFILES_ACTIVE=dev

echo "🚀 Starting application with profile: $SPRING_PROFILES_ACTIVE"
echo ""
echo "Application will be available at:"
echo "  http://localhost:8080"
echo ""
echo "Health check:"
echo "  curl http://localhost:8080/actuator/health"
echo ""
echo "Press Ctrl+C to stop the application"
echo "=========================================="
echo ""

# Run the application
./gradlew bootRun

