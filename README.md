# Luqma (لقمة)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Recipe search application with nutritional tracking. Built with React and Spring Boot.

## Features

- Search recipes with filters (cuisine, diet, ingredients)
- View nutritional information and calorie counts
- Exclude ingredients and recalculate calories dynamically
- Responsive, accessible design (WCAG-compliant)

**Status:** Backend foundation ready, API integration in progress, frontend not yet scaffolded.

## Tech Stack

- **Backend:** Spring Boot 3.5.7, Java 25
- **Frontend:** React 19 (planned)
- **API:** Spoonacular

## Quick Start

```bash
# Clone repository
git clone https://github.com/ahmadshalabi/luqma.git
cd luqma/backend

# Setup (automated - handles env, dependencies, build)
./scripts/setup-local.sh

# Run locally
./scripts/run-local.sh

# Or run with Docker
docker compose up

# Stop server
./scripts/shutdown.sh
```

**Health check:** `http://localhost:8080/actuator/health`  
**Detailed setup:** See [backend/README.md](backend/README.md)

## Documentation

- [Backend Setup & Development](backend/README.md)
- [Architecture Decisions](docs/decisions/)

## License

MIT License - see [LICENSE](LICENSE) for details.
