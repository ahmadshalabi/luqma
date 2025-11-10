# Luqma Documentation

Welcome to the Luqma project documentation. This directory contains all technical documentation, architectural decisions, and guides for developers.

## Quick Links

### Getting Started
- [Project README](../README.md) - Project overview and setup
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common issues and solutions
- [API Documentation](api/README.md) - Backend API reference

### Architecture
- [Architecture Overview](architecture/README.md) - System architecture and data flow diagrams
- [Backend Domain Models](../backend/docs/domain-models.md) - Domain model documentation
- [Architecture Decision Records](decisions/README.md) - All ADRs (10 decisions)

### Standards & Guidelines
- [Project Context](../.cursor/rules/luqma-project.mdc) - Project overview and tech stack
- [Git Standards](../.cursor/rules/git-standards.mdc) - Commit, branch, and PR conventions
- [Security Standards](../.cursor/rules/security-standards.mdc) - API key protection and security practices
- [Accessibility Standards](../.cursor/rules/accessibility-standards.mdc) - WCAG 2.1 AA compliance
- [Code Review Checklist](../.cursor/rules/code-review-checklist.mdc) - Review guidelines

## Documentation Structure

```
docs/
├── README.md                      # This file
├── TROUBLESHOOTING.md             # Common issues
├── api/                           # API documentation
│   └── README.md
├── architecture/                  # Architecture documentation
│   └── README.md                  # System diagrams and data flows
├── testing/                       # Testing documentation
│   └── README.md                  # Coverage requirements and testing guide
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
    └── 0010-use-proportional-estimation-for-nutrition-calculation.md
```

## Key Documentation

### Architecture Decision Records

We use [MADR 4.0.0](https://adr.github.io/madr/) format for documenting architectural decisions. See [decisions/README.md](decisions/README.md) for all ADRs and their details.

### Testing

Comprehensive testing guide with coverage requirements, testing strategies, and examples. See [testing/README.md](testing/README.md) for full documentation.

## Development Guidelines

All coding standards, workflows, and best practices are documented in `.cursor/rules/`:

- **Git Workflow:** [git-standards.mdc](../.cursor/rules/git-standards.mdc)
- **Security:** [security-standards.mdc](../.cursor/rules/security-standards.mdc)
- **Accessibility:** [accessibility-standards.mdc](../.cursor/rules/accessibility-standards.mdc)
- **ADR Management:** [adr-management.mdc](../.cursor/rules/adr-management.mdc)
- **Frontend Standards:** [frontend/.cursor/rules/frontend-standards.mdc](../frontend/.cursor/rules/frontend-standards.mdc)
- **Backend Standards:** [backend/.cursor/rules/](../backend/.cursor/rules/)

For testing documentation, see [testing/README.md](testing/README.md).

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

MIT License - see [LICENSE](../LICENSE) for details.

