#!/bin/bash
# Local Development Setup Script
# This script sets up the local development environment for the Luqma backend

set -e  # Exit on error

echo "=========================================="
echo "Luqma Backend - Local Setup"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo ""
    echo "Please create a .env file from .env.example:"
    echo "  cp .env.example .env"
    echo ""
    echo "Then edit .env and add your Spoonacular API key:"
    echo "  SPOONACULAR_API_KEY=your-actual-api-key-here"
    echo ""
    exit 1
fi

# Check if SPOONACULAR_API_KEY is set in .env
if ! grep -q "SPOONACULAR_API_KEY=.*[^-]" .env; then
    echo "⚠️  Warning: SPOONACULAR_API_KEY appears to be empty or default in .env"
    echo ""
    echo "Please edit .env and set your actual Spoonacular API key:"
    echo "  SPOONACULAR_API_KEY=your-actual-api-key-here"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Environment file (.env) found"
echo ""

# Load environment variables securely
echo "📦 Loading environment variables from .env..."
set -a
source .env
set +a
echo "✅ Environment variables loaded"
echo ""

# Check Java version
echo "☕ Checking Java version..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    echo "   Found Java version: $JAVA_VERSION"
    # Ensure JAVA_VERSION is numeric before comparison
    if [[ "$JAVA_VERSION" =~ ^[0-9]+$ ]] && [ "$JAVA_VERSION" -lt 25 ]; then
        echo "⚠️  Warning: Java 25 is required (found $JAVA_VERSION)"
        echo "   Download Java 25 from: https://adoptium.net/"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ Java version is compatible"
    fi
else
    echo "❌ Error: Java not found!"
    echo "   Please install Java 25 from: https://adoptium.net/"
    exit 1
fi
echo ""

# Make gradlew executable
echo "🔧 Setting up Gradle wrapper..."
chmod +x gradlew
echo "✅ Gradle wrapper is executable"
echo ""

# Clean build
echo "🧹 Cleaning previous build artifacts..."
./gradlew clean --no-daemon --quiet
echo "✅ Build artifacts cleaned"
echo ""

# Download dependencies
echo "📥 Downloading dependencies (this may take a while)..."
./gradlew dependencies --no-daemon --quiet > /dev/null 2>&1 || true
echo "✅ Dependencies downloaded"
echo ""

# Build application
echo "🏗️  Building application..."
./gradlew build --no-daemon --quiet
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "You can now run the application using:"
echo "  ./gradlew bootRun"
echo ""
echo "Or use the convenience script:"
echo "  ./scripts/run-local.sh"
echo ""
echo "The application will be available at:"
echo "  http://localhost:8080"
echo ""
echo "Health check:"
echo "  curl http://localhost:8080/actuator/health"
echo ""

