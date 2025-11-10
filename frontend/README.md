# Luqma Frontend

React frontend for Luqma - a recipe search application with nutritional information.

See the [main README](../README.md) for tech stack, prerequisites, and project overview.

## Quick Start

```bash
cd frontend

# Install dependencies
npm install --ignore-scripts

# IMPORTANT: Configure URLs in root .env file first
# See Configuration section below

# Run the application
npm run dev
```

The application will be available at http://localhost:3000 (default port)

## Development Commands

```bash
# Development
npm run dev                # Start dev server
npm run build              # Production build
npm run preview            # Preview production build

# Testing
npm test                   # Run tests (watch mode)
npm run test:ui            # Tests with UI
npm run test:coverage      # Generate coverage report

# Linting
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix issues
```

**Test Coverage:**
- Components: 70%+ (recommended)
- Custom hooks: 80%+ (recommended)
- Reports: `coverage/index.html`

For comprehensive testing documentation, see [Testing Guide](../docs/testing/README.md).

## Project Structure

Feature-based component architecture with path aliasing (`@/`). 

**For detailed architecture documentation:**
- [Architecture Overview](../docs/architecture/README.md) - System architecture and component hierarchy
- [Project Context](../.cursor/rules/luqma-project.mdc) - Detailed project structure

For features and capabilities, see the [main README](../README.md#features).

## Configuration

The frontend requires a `.env` file in the `frontend/` directory for API configuration:

```bash
cd frontend
cp .env.example .env
# Edit frontend/.env to configure backend API URL if needed
```

### Configuration Variables

Set these variables in `frontend/.env`:

- **`LUQMA_API_URL`**: Backend API endpoint (default: `http://localhost:8080/api/v1`)

### Custom Configuration

If your backend runs on a different port, update `LUQMA_API_URL` in `frontend/.env`:

```bash
# frontend/.env
LUQMA_API_URL=http://localhost:9090/api/v1
```

To change the frontend port, edit the `port` value in the `server` object in `frontend/vite.config.js`.

## Documentation

- [Documentation Index](../docs/README.md) - All project documentation
- [Architecture Overview](../docs/architecture/README.md) - System architecture and component hierarchy
- [Testing Guide](../docs/testing/README.md) - Testing strategies and coverage requirements
- [API Documentation](../docs/api/README.md) - Backend API reference
