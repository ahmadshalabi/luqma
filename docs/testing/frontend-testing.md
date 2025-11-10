# Frontend Testing

Testing strategies for React frontend.

## Framework

**Tools:**
- Vitest
- React Testing Library
- @testing-library/user-event
- @testing-library/react-hooks

---

## Test Types

### Component Tests

**Target:** UI components  
**Focus:** User interactions, rendered output

**Query Priority:**
1. `getByRole` (best - accessibility)
2. `getByLabelText` (forms)
3. `getByText` (content)
4. `getByTestId` (last resort)

---

### Hook Tests

**Target:** Custom hooks  
**Priority:** HIGH (80%+ coverage)

**Pattern:**
```javascript
const { result } = renderHook(() => useCustomHook());
expect(result.current.value).toBe(expected);
```

---

## Coverage

**Goals:**
- Hooks: 80%+ (strongly recommended)
- Components: 70%+ (recommended)

**Run:**
```bash
npm run test:coverage
# Report: coverage/index.html
```

---

## Patterns

**Component Testing:**
- Test what user sees
- Test user interactions
- Test loading/error/empty states
- Use `userEvent` over `fireEvent`

**Async Testing:**
- `waitFor()` - wait for condition
- `findBy` queries - built-in waiting
- Mock API calls with `vi.mock()`

**Mocking:**
```javascript
vi.mock('@/services/apiClient', () => ({
  searchRecipes: vi.fn()
}));
```

---

## Best Practices

- Test behavior, not implementation
- User-centric testing (what user experiences)
- Use `getByRole` for accessibility
- Independent tests
- Fast execution
- Clear failure messages

---

## Commands

```bash
# Run tests
npm test                  # Watch mode
npm run test:coverage     # With coverage
npm run test:ui           # UI mode
```

---

## Related

- [Coverage Requirements](coverage-requirements.md)
- [Testing Guide](README.md)
