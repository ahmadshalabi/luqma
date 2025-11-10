# Frontend Architecture

Feature-based React component organization.

## Structure

```
frontend/src/
├── pages/              # Route-level components
│   ├── HomePage/       # Search page
│   └── RecipeDetailPage/  # Recipe details
├── components/         # Shared components (2+ pages)
│   ├── ui/            # Primitives (Button, Card, etc.)
│   ├── layout/        # Layout components
│   └── search/        # Search components
├── hooks/             # Custom reusable hooks
├── context/           # React Context providers
├── services/          # API client
├── utils/             # Utilities
└── constants/         # App constants
```

**See:** [ADR-0007](../decisions/0007-use-feature-based-component-organization.md)

---

## Organization Rules

**Pages:**
- Route-level components
- Page-specific components in same directory
- Keep under 200 lines

**Components:**
- Shared by 2+ pages
- Reusable UI patterns
- Extract when pattern repeats

**Hooks:**
- Stateful logic extraction
- Reusable across components
- Prefix with `use`

**See:** [ADR-0008](../decisions/0008-use-custom-hooks-for-business-logic.md)

---

## State Management

**Local State:** `useState`, `useReducer`

**Global State:** Context API
- Example: `RecipeExclusionContext`
- Wrap in custom hooks
- Memoize values and callbacks

**URL State:** Search query, page number  
**Why:** Shareable links

**See:** [ADR-0004](../decisions/0004-use-context-api-for-state-management.md)

---

## Import Aliasing

**Use `@/` for all imports from src:**
```javascript
import { Button } from '@/components/ui/Button'  // ✅ Good
import { Button } from '../../../components/ui/Button'  // ❌ Bad
```

**Config:** `vite.config.js` maps `@` to `src/`

---

## Key Patterns

**Custom Hooks:**
- `useSearch` - Search state
- `useRecipeDetail` - Fetch recipe
- `useRecipeExclusion` - Exclude ingredients
- `useDebounce` - Debounced values
- `useKeyboardNavigation` - Keyboard handling

**Performance:**
- `React.memo` for expensive components
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- `React.lazy` for code splitting
- Debounce search (300ms)

**Accessibility:**
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Focus management

---

## API Integration

**Service Layer:** `services/apiClient.js`
- Centralized HTTP client
- Error handling
- Request/response interceptors

**Custom Hooks:** Wrap API calls
- Loading states
- Error handling
- Data caching (when needed)

---

## Related

- [System Overview](system-overview.md)
- [Data Flows](data-flows.md)
- [Frontend Standards](../../frontend/.cursor/rules/frontend-standards.mdc)
