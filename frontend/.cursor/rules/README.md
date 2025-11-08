# Frontend Rules

Frontend-specific development standards for React application.

## Rules

### Code Style & Conventions

1. **[JavaScript/React Style Guide](./javascript-react-style-guide.mdc)** - Airbnb conventions (ES6+, JSX, hooks)
2. **[TailwindCSS Style Guide](./tailwindcss-style-guide.mdc)** - Utility class ordering, responsive design

### Development Standards

3. **[Frontend Standards](./frontend-standards.mdc)** - React hooks, Context API, accessibility
4. **[Testing Standards](./testing-standards.mdc)** - React Testing Library, component tests
5. **[Documentation Standards](./documentation-standards.mdc)** - JSDoc, component docs
6. **[Performance Standards](./performance-standards.mdc)** - Frontend performance budgets
7. **[Security Standards](./security-standards.mdc)** - Frontend security practices

## Coverage Requirements

See [Testing Standards](./testing-standards.mdc) for detailed coverage requirements and testing guidelines.

## Quick Reference

**Code Style:** Airbnb JavaScript (const/let, arrow functions, destructuring, template literals)  
**Components:** Functional only, named exports, PascalCase files, destructured props  
**Hooks:** useCallback for functions, useMemo for values, custom hooks with "use" prefix  
**TailwindCSS:** Mobile-first, class ordering (layout → box model → typography → visual)  
**Testing:** React Testing Library with getByRole priority, 70%+ coverage  
**Accessibility:** WCAG 2.1 AA, semantic HTML, ARIA labels, keyboard navigation

## Related

- [Project-wide rules](../../.cursor/rules/) - Security, git conventions, code review
- [Backend rules](../../backend/.cursor/rules/) - API design, backend testing

