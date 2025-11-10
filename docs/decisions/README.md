# Architecture Decision Records

ADRs for Luqma using [MADR 4.0.0](https://adr.github.io/madr/) format.

## Status Legend

- ✅ **Accepted** - Currently active decision
- 🔄 **Superseded** - Replaced by newer approach
- ❌ **Rejected** - Not chosen
- 📝 **Proposed** - Under consideration

## Records

| # | Title | Status | Date |
|---|-------|--------|------|
| [ADR-0001](0001-use-markdown-architectural-decision-records.md) | Use Markdown Architectural Decision Records | ✅ Accepted | 2025-11-06 |
| [ADR-0002](0002-use-monorepo-structure.md) | Use Monorepo Structure | ✅ Accepted | 2025-11-06 |
| [ADR-0003](0003-standardize-development-workflow-and-environment-management.md) | Standardize Development Workflow and Environment Management | ✅ Accepted | 2025-11-06 |
| [ADR-0004](0004-use-context-api-for-state-management.md) | Use Context API for Cross-Component State | ✅ Accepted | 2025-11-06 |
| [ADR-0005](0005-implement-live-search-on-homepage.md) | Implement Live Search with Debounce on Homepage | ✅ Accepted | 2025-11-07 |
| [ADR-0006](0006-use-mock-data-for-offline-development.md) | Use Mock Data for Offline Development | 🔄 Superseded | 2025-11-10 |
| [ADR-0007](0007-use-feature-based-component-organization.md) | Use Feature-Based Component Organization | ✅ Accepted | 2025-11-07 |
| [ADR-0008](0008-use-custom-hooks-for-business-logic.md) | Use Custom Hooks for Business Logic | ✅ Accepted | 2025-11-07 |
| [ADR-0009](0009-implement-layered-architecture-in-backend.md) | Use Layered Architecture in Backend | ✅ Accepted | 2025-11-08 |
| [ADR-0010](0010-use-proportional-estimation-for-nutrition-calculation.md) | Use Proportional Estimation for Nutrition Calculation with Ingredient Exclusion | ✅ Accepted | 2025-11-10 |

## Superseded Decisions

**ADR-0006** (Use Mock Data for Offline Development)
- **Superseded by:** Live Spoonacular API integration with Spring Cache
- **Date:** 2025-11-10
- **Reason:** Application evolved from offline development to production-ready live API integration
- **Current implementation:** See [Backend README - Spoonacular Integration](../../backend/README.md#spoonacular-api-integration)

## Creating New ADRs

1. Copy [`adr-template.md`](adr-template.md)
2. Name it `NNNN-title-with-dashes.md` (use next sequential number)
3. Fill in all required sections
4. Set status: `"accepted"` (or `"proposed"` if seeking feedback)
5. Update the table above with new entry

Or ask Cursor AI: "Create an ADR for..."

## Related Documentation

- [ADR Management Standards](../../.cursor/rules/adr-management.mdc) - How to create and manage ADRs
- [Architecture Overview](../architecture/README.md) - Visual architecture documentation
- [Documentation Index](../README.md) - All project documentation
