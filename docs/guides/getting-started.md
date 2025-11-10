# Getting Started

Quick setup guide for Luqma.

## Prerequisites

**Required:**
- Java 25+ ([Download](https://adoptium.net/))
- Node.js 24+ ([Download](https://nodejs.org/))
- Spoonacular API Key ([Get key](https://spoonacular.com/food-api/console#Dashboard))

**Verify:**
```bash
java -version  # 25+
node -v        # 24+
```

---

## Installation

```bash
# Clone and install
git clone https://github.com/ahmadshalabi/luqma.git
cd luqma
npm install

# Setup both services
npm run setup
```

---

## Configuration

```bash
# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env and add:
SPOONACULAR_API_KEY=your_key_here
```

See [Configuration Guide](configuration.md) for details.

---

## Run

```bash
# Start both services
npm run dev

# Backend: http://localhost:8080
# Frontend: http://localhost:3000
# Swagger: http://localhost:8080/swagger-ui.html
```

---

## Verify

**Backend:**
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

**Frontend:**
- Open http://localhost:3000
- Search for "pasta"
- Should see recipe results

---

## Troubleshooting

**Port already in use:**
```bash
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

**Build fails:**
- Check Java/Node versions
- Verify Spoonacular API key
- Run `npm run setup` again

**More help:** See [Troubleshooting Guide](../TROUBLESHOOTING.md)

---

## Next Steps

- [Configuration Guide](configuration.md) - Customize settings
- [Development Workflow](development-workflow.md) - Local development
- [API Documentation](../api/README.md) - REST API reference
