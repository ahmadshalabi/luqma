# Luqma Documentation

Welcome to the Luqma project documentation. This directory contains all technical documentation, architectural decisions, and guides for developers.

## Quick Links

### Getting Started
- [Project README](../README.md) - Project overview and setup
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common issues and solutions
- [API Documentation](api/README.md) - Backend API reference

### Architecture
- [Architecture Decision Records](decisions/README.md) - All ADRs (13 decisions)

### Standards & Guidelines
- [Project Context](.cursor/rules/luqma-project.mdc) - Project overview and tech stack
- [Git Standards](.cursor/rules/git-standards.mdc) - Commit, branch, and PR conventions
- [Security Standards](.cursor/rules/security-standards.mdc) - API key protection and security practices
- [Accessibility Standards](.cursor/rules/accessibility-standards.mdc) - WCAG 2.1 AA compliance
- [Code Review Checklist](.cursor/rules/code-review-checklist.mdc) - Review guidelines

## Documentation Structure

```
docs/
├── README.md                      # This file
├── TROUBLESHOOTING.md             # Common issues
├── api/                           # API documentation
│   └── README.md
└── decisions/                     # Architecture Decision Records
    ├── README.md                  # ADR index
    ├── adr-template.md            # MADR template
    ├── 0001-use-markdown-architectural-decision-records.md
    ├── 0002-use-monorepo-structure.md
    ├── 0003-standardize-development-workflow-and-environment-management.md
    ├── 0004-use-context-api-for-state-management.md
    ├── 0005-implement-live-search-on-homepage.md
    ├── 0006-use-mock-data-for-offline-development.md
    ├── 0007-use-feature-based-component-organization.md
    ├── 0008-use-custom-hooks-for-business-logic.md
    ├── 0009-implement-layered-architecture-in-backend.md
```

## Key Documentation

### Architecture Decision Records

We use [MADR 4.0.0](https://adr.github.io/madr/) format for documenting architectural decisions. Currently we have 13 ADRs covering:

1. **ADR-0001**: Markdown Architectural Decision Records
2. **ADR-0002**: Monorepo Structure
3. **ADR-0003**: Development Workflow and Environment Management
4. **ADR-0004**: Context API for State Management
5. **ADR-0005**: Live Search with Debounce
6. **ADR-0006**: Mock Data for Offline Development
7. **ADR-0007**: Feature-Based Component Organization
8. **ADR-0008**: Custom Hooks for Business Logic
9. **ADR-0009**: Layered Architecture in Backend

See [decisions/README.md](decisions/README.md) for the complete list.

## Development Guidelines

### Code Standards

We follow strict coding standards documented in `.cursor/rules/`:

**Root Standards:**
- Git conventions (Conventional Commits, branch naming, PR rules)
- Security standards (API key protection, dependency scanning)
- Accessibility standards (WCAG 2.1 AA)
- ADR management (MADR format)

**Frontend Standards** (`.cursor/rules/frontend-standards.mdc`):
- Component architecture (under 200 lines, extract to hooks)
- Import standards (use `@/` alias)
- React 19 features
- Context API patterns
- Performance optimization
- TailwindCSS usage

**Backend Standards** (`.cursor/rules/backend-standards.mdc`):
- Layered architecture
- Spring Boot conventions
- Error handling
- Testing requirements

### Git Workflow

We use Conventional Commits and a strict branching model:

**Commit Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Branch Naming:**
```
<type>/<short-description>
```

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore

See [git-standards.mdc](.cursor/rules/git-standards.mdc) for complete guidelines.

### Creating ADRs

When making architectural decisions:

1. Copy `docs/decisions/adr-template.md`
2. Name it `NNNN-title-with-dashes.md`
3. Fill in all sections (Context, Drivers, Options, Decision, Consequences)
4. Update `docs/decisions/README.md` with new ADR
5. Create PR for review

Or ask Cursor AI: "Create an ADR for..."

### Component Development

When creating new components:

1. Choose appropriate location:
   - `components/ui/` for generic primitives
   - `components/{domain}/` for shared domain components
   - `pages/{page}/features/{feature}/` for page-specific components

2. Follow component standards:
   - Under 200 lines
   - Extract logic to hooks
   - Use `@/` import alias
   - Add JSDoc documentation
   - Include accessibility features

3. Write tests:
   - Use `@testing-library/react`
   - Test behavior, not implementation
   - Achieve 70%+ coverage

4. Update documentation:
   - Add to COMPONENTS.md if significant
   - Update relevant ADRs if architectural impact

## Testing

### Frontend Tests

```bash
cd frontend
npm test                  # Run all tests
npm test -- --coverage    # With coverage
npm test -- --watch       # Watch mode
```

### Backend Tests

```bash
cd backend
./gradlew test           # Run all tests
./gradlew test --tests ClassName  # Run specific test
./gradlew jacocoTestReport        # Generate coverage report
```

## Contributing

1. Read relevant documentation in `.cursor/rules/`
2. Check ADRs for architectural patterns
3. Follow code standards and conventions
4. Write tests for new code
5. Update documentation as needed
6. Create PR following git standards
7. Address review feedback

## Resources

### External Documentation

- [React 19 Documentation](https://react.dev/)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MADR Template](https://adr.github.io/madr/)

## Questions?

If you have questions or need clarification:

1. Check this documentation
2. Review relevant ADRs
3. Search existing issues
4. Ask in team discussion
5. Create new issue if needed

## License

[Add license information here]

