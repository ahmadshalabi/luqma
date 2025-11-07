# Luqma Backend

Spring Boot backend service for Luqma - a recipe search and calorie tracking application. Acts as secure middleware between the frontend and Spoonacular API.

## 📋 Prerequisites

- **Java 25** ([Download from Eclipse Adoptium](https://adoptium.net/))
- **[Spoonacular API Key](https://spoonacular.com/food-api)** (required)
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Git** (for version control)

## 🚀 Quick Start

**Recommended approach** (follows ADR-0003 standardized workflow):

```bash
cd backend

# 1. Setup (automated - validates config, downloads dependencies, builds)
./scripts/setup-local.sh

# 2. Run
./scripts/run-local.sh    # Local development with hot-reload
# OR
docker compose up          # Production-like environment
```

The application will be available at: **http://localhost:8080**

<details>
<summary><b>Alternative: Manual Setup</b> (not recommended)</summary>

```bash
cd backend
cp env.example .env        # Edit .env and add SPOONACULAR_API_KEY
chmod +x gradlew
source .env
./gradlew app:bootRun
```
</details>

**To stop the server:**
```bash
./scripts/shutdown.sh         # Gracefully stops local or Docker instance
```

## ✅ Verify Installation

```bash
./scripts/verify-setup.sh              # Automated verification
curl http://localhost:8080/actuator/health  # Or check manually
```

Expected: `{"status":"UP"}`

## 📁 Project Structure

```
backend/
├── app/                           # Main application module
│   ├── src/main/java/            # Java source code
│   │   └── app/luqma/backend/   # Base package
│   ├── src/main/resources/       # Application resources
│   │   ├── application.yaml      # Base configuration
│   │   ├── application-dev.yaml  # Dev profile config
│   │   └── application-prod.yaml # Prod profile config
│   └── build.gradle.kts          # Gradle build script
├── scripts/                       # Helper scripts
│   ├── setup-local.sh            # Setup script
│   ├── run-local.sh              # Run locally
│   ├── shutdown.sh               # Graceful shutdown
│   ├── verify-setup.sh           # Verify setup
│   └── docker-rebuild.sh         # Docker rebuild
├── Dockerfile                     # Docker build config
├── compose.yaml                   # Docker Compose config
├── env.example                    # Environment template
└── README.md                      # This file
```

## ⚙️ Configuration

### Spring Profiles

The application supports multiple profiles for different environments:

| Profile | Description | Use Case |
|---------|-------------|----------|
| `dev` (default) | Development profile with verbose logging | Local development with `./gradlew bootRun` |
| `prod` | Production profile with optimized settings | Docker deployment or production |

**Set profile:**
```bash
# For local development (default)
export SPRING_PROFILES_ACTIVE=dev
./gradlew app:bootRun

# For production
export SPRING_PROFILES_ACTIVE=prod
./gradlew app:bootRun
```

Docker Compose automatically uses the `prod` profile.

### Environment Variables

Configure via `.env` file (see `env.example` for template):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPOONACULAR_API_KEY` | ✅ Yes | - | Your Spoonacular API key |
| `SPRING_PROFILES_ACTIVE` | No | `dev` | Active Spring profile |
| `SERVER_PORT` | No | `8080` | Server port |
| `SPOONACULAR_API_URL` | No | `https://api.spoonacular.com` | Spoonacular API base URL |
| `SPOONACULAR_CONNECTION_TIMEOUT` | No | `10000` | Connection timeout (ms) |
| `SPOONACULAR_READ_TIMEOUT` | No | `30000` | Read timeout (ms) |

## 🛠️ Development

### Build Commands

```bash
# Build the application
./gradlew app:build

# Build without tests
./gradlew app:build -x test

# Build JAR file
./gradlew app:bootJar

# Clean build
./gradlew clean app:build

# Refresh dependencies
./gradlew app:build --refresh-dependencies
```

### Running Tests

```bash
# Run all tests
./gradlew app:test

# Run specific test class
./gradlew app:test --tests "ClassName"

# Run specific test method
./gradlew app:test --tests "ClassName.methodName"
```

### Useful Gradle Commands

```bash
# List all available tasks
./gradlew tasks

# View dependency tree
./gradlew app:dependencies

# Check for dependency updates
./gradlew dependencyUpdates

# Show project info
./gradlew projects
```

### Development Workflow

1. Make changes → 2. Test (`./gradlew app:test`) → 3. Verify (health check) → 4. Commit ([conventional commits](https://www.conventionalcommits.org/))

**Note:** DevTools auto-reloads code changes when running locally.

## 🐳 Docker

### Docker Commands

```bash
docker compose up              # Start
docker compose up -d           # Start in background
docker compose logs -f         # View logs
docker compose down            # Stop
./scripts/shutdown.sh          # Graceful shutdown (auto-detects Docker)
./scripts/docker-rebuild.sh    # Clean rebuild
```

Health checks are automatic (liveness probe every 30s). Check with `docker ps` (look for "healthy" status).

## 🔍 Monitoring & Debugging

**Actuator endpoints:** `/actuator/health`, `/actuator/info`, `/actuator/metrics`

**Logs:**
- Local: Console output from `./scripts/run-local.sh`
- Docker: `docker compose logs -f`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port in use** | `./scripts/shutdown.sh` or `lsof -i :8080` then `kill -9 <PID>` |
| **Build fails** | `./gradlew clean app:build --refresh-dependencies` |
| **Docker issues** | `./scripts/docker-rebuild.sh` |
| **API key invalid** | Verify with `grep SPOONACULAR_API_KEY .env` |
| **Won't start** | Run `./scripts/verify-setup.sh` to diagnose |
| **Health check fails** | Check logs: `docker compose logs -f` or console output |

## 📚 Additional Resources

- **Project Documentation**: `../docs/README.md`
- **Architecture Decisions**: `../docs/decisions/`
- **Spring Boot Docs**: https://docs.spring.io/spring-boot/
- **Spoonacular API**: https://spoonacular.com/food-api/docs
- **Gradle**: https://docs.gradle.org/

## 🤝 Contributing

1. Follow the [project architecture guidelines](../docs/README.md)
2. Write tests for new features
3. Use conventional commit messages
4. Update documentation as needed
5. Ensure all checks pass before committing

## 📝 Notes

- **Security**: Never commit API keys or sensitive data
- **Profiles**: Use `dev` for local development, `prod` for Docker
- **Scripts**: All helper scripts are in `scripts/` directory
- **Health Checks**: Enabled for production reliability
- **DevTools**: Automatic restart in development mode

---

**Need Help?** Check the [troubleshooting section](#-troubleshooting) or review the [project documentation](../docs/README.md).
