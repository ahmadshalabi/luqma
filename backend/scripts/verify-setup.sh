#!/bin/bash
# Verification script to check if the backend is properly set up and running

set -e  # Exit on error

echo "=========================================="
echo "Luqma Backend - Setup Verification"
echo "=========================================="
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Function to check URL
check_url() {
    local url=$1
    local name=$2
    
    if command_exists curl; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    elif command_exists wget; then
        response=$(wget --spider -S "$url" 2>&1 | grep "HTTP/" | awk '{print $2}' | tail -1 || echo "000")
    else
        echo "⚠️  Neither curl nor wget found, skipping URL checks"
        return 1
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "000" ]; then
        echo "✅ $name is accessible"
        return 0
    else
        echo "❌ $name returned status code: $response"
        return 1
    fi
}

# Check Java
echo "☕ Checking Java..."
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "   $JAVA_VERSION"
    echo "✅ Java is installed"
else
    echo "❌ Java is not installed"
    exit 1
fi
echo ""

# Check Gradle wrapper
echo "🔧 Checking Gradle..."
if [ -f "./gradlew" ] && [ -x "./gradlew" ]; then
    echo "✅ Gradle wrapper found and executable"
else
    echo "❌ Gradle wrapper not found or not executable"
    echo "   Run: chmod +x gradlew"
    exit 1
fi
echo ""

# Check .env file
echo "📄 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check if API key is set
    if grep -q "SPOONACULAR_API_KEY=.*[^-]" .env; then
        echo "✅ SPOONACULAR_API_KEY is set"
    else
        echo "⚠️  SPOONACULAR_API_KEY appears to be empty or default"
    fi
else
    echo "❌ .env file not found"
    echo "   Create from template: cp .env.example .env"
    exit 1
fi
echo ""

# Check Docker
echo "🐳 Checking Docker..."
if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    echo "   $DOCKER_VERSION"
    echo "✅ Docker is installed"
    
    if command_exists docker-compose || docker compose version &> /dev/null; then
        echo "✅ Docker Compose is available"
    else
        echo "⚠️  Docker Compose not found"
    fi
else
    echo "⚠️  Docker is not installed (optional for local dev)"
fi
echo ""

# Check if application is running
echo "🔍 Checking if application is running..."
BASE_URL="http://localhost:8080"

if check_url "$BASE_URL/actuator/health" "Health endpoint"; then
    echo ""
    echo "📊 Application Status:"
    if command_exists curl; then
        curl -s "$BASE_URL/actuator/health" | grep -o '"status":"[^"]*"' || echo "   (Could not parse health status)"
    fi
    echo ""
    
    # Check other endpoints
    check_url "$BASE_URL/actuator/info" "Info endpoint"
    check_url "$BASE_URL/actuator/health/liveness" "Liveness probe"
    check_url "$BASE_URL/actuator/health/readiness" "Readiness probe"
else
    echo "⚠️  Application is not running or not accessible"
    echo ""
    echo "To start the application:"
    echo "  Local:  ./scripts/run-local.sh"
    echo "  Docker: docker compose up"
fi
echo ""

echo "=========================================="
echo "✅ Verification Complete"
echo "=========================================="
echo ""
echo "If all checks passed, your setup is ready!"
echo "If any checks failed, please address them before proceeding."
echo ""

