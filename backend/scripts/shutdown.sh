#!/bin/bash
# Shutdown script for Luqma Backend
# Gracefully stops the running application (local or Docker)

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Luqma Backend - Shutdown Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker container is running
if docker ps --format '{{.Names}}' | grep -q "luqma-backend"; then
    echo -e "${YELLOW}📦 Docker container detected${NC}"
    echo ""
    echo "Stopping Docker container..."
    
    if docker compose down; then
        echo ""
        echo -e "${GREEN}✓ Docker container stopped successfully${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}✗ Failed to stop Docker container${NC}"
        exit 1
    fi
fi

# Check if local process is running
SPRING_PID=$(pgrep -f "spring-boot.*luqma-backend" || true)

if [ -z "$SPRING_PID" ]; then
    # Try alternative pattern
    SPRING_PID=$(pgrep -f "bootRun.*luqma" || true)
fi

if [ -n "$SPRING_PID" ]; then
    echo -e "${YELLOW}🖥️  Local process detected (PID: $SPRING_PID)${NC}"
    echo ""
    echo "Sending graceful shutdown signal (SIGTERM)..."
    
    # Send SIGTERM for graceful shutdown
    kill -TERM "$SPRING_PID" 2>/dev/null || true
    
    # Wait up to 30 seconds for graceful shutdown
    echo "Waiting for graceful shutdown (max 30 seconds)..."
    COUNTER=0
    while [ $COUNTER -lt 30 ]; do
        if ! ps -p "$SPRING_PID" > /dev/null 2>&1; then
            echo ""
            echo -e "${GREEN}✓ Application stopped gracefully${NC}"
            exit 0
        fi
        sleep 1
        COUNTER=$((COUNTER + 1))
        echo -n "."
    done
    
    echo ""
    echo -e "${YELLOW}⚠ Graceful shutdown timeout, forcing shutdown...${NC}"
    
    # Force kill if graceful shutdown failed
    kill -9 "$SPRING_PID" 2>/dev/null || true
    
    sleep 1
    
    if ! ps -p "$SPRING_PID" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Application forcefully stopped${NC}"
        exit 0
    else
        echo -e "${RED}✗ Failed to stop application${NC}"
        exit 1
    fi
fi

# Check if port 8080 is in use
PORT_PID=$(lsof -ti:8080 || true)

if [ -n "$PORT_PID" ]; then
    echo -e "${YELLOW}⚠ Process found on port 8080 (PID: $PORT_PID)${NC}"
    echo ""
    
    # Show process info
    echo "Process information:"
    ps -p "$PORT_PID" -o pid,comm,args || true
    echo ""
    
    read -p "Stop this process? [y/N]: " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping process..."
        kill -TERM "$PORT_PID" 2>/dev/null || true
        sleep 2
        
        if ! ps -p "$PORT_PID" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Process stopped${NC}"
            exit 0
        else
            echo "Force stopping..."
            kill -9 "$PORT_PID" 2>/dev/null || true
            echo -e "${GREEN}✓ Process forcefully stopped${NC}"
            exit 0
        fi
    else
        echo "Cancelled."
        exit 1
    fi
fi

# Nothing running
echo -e "${BLUE}ℹ No running Luqma Backend instance found${NC}"
echo ""
echo "Checked:"
echo "  • Docker container (luqma-backend)"
echo "  • Local Spring Boot process"
echo "  • Port 8080 usage"
echo ""
echo -e "${GREEN}Nothing to shutdown.${NC}"
exit 0

