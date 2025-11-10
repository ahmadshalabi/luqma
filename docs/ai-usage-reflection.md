# AI Usage and Collaboration Reflection

## Introduction

Luqma (لقمة) is a full-stack recipe search application that provides detailed nutritional information and dynamic ingredient exclusion capabilities. Throughout this project, I leveraged AI tools—specifically **ChatGPT** and **Cursor AI**—to accelerate development while maintaining full control over architectural decisions and code quality.

My philosophy was clear from the start: **use AI for boilerplate and repetitive tasks, challenge AI for optimized solutions, and validate all outputs through rigorous testing and review**. I wasn't looking for AI to make decisions for me, but rather to act as a knowledgeable pair programmer who could draft code quickly while I focused on architecture, business logic, and ensuring everything met production standards.

A critical enabler of this collaboration was the **comprehensive cursor rules** I created across three levels. Rather than re-explaining project conventions in every prompt, I built a knowledge base that acts as persistent context for AI agents:

- **Root-level rules** (`.cursor/rules/`): Project-wide standards including git conventions, security requirements, accessibility compliance (WCAG 2.1 AA), ADR management, and the Luqma project context
- **Backend rules** (`backend/.cursor/rules/`): Java/Spring Boot specific standards covering API design, backend architecture patterns, Gradle conventions, performance standards, security practices, and testing requirements
- **Frontend rules** (`frontend/.cursor/rules/`): React/JavaScript specific standards including component patterns, TailwindCSS conventions, performance optimization, security practices, and testing approaches

This three-tier structure means AI agents receive context appropriate to the layer they're working on. When generating backend code, they follow Java and Spring Boot conventions. When working on frontend components, they adhere to React and accessibility patterns. The investment in creating these 25 rule files paid massive dividends—AI suggestions became consistently aligned with project standards, and I spent significantly less time correcting style issues or re-explaining architectural decisions.

## Focus Areas: Where I Relied on AI

### Backend Development (Spring Boot)

AI was instrumental in scaffolding the backend's layered architecture. I used it extensively for:

**Spring Boot Setup**: Controllers, services, repository, and DTOs formed the backbone of the backend. AI generated the initial structure for `RecipeController`, `RecipeSearchService`, `RecipeDetailService`, `RecipeRepository`, and the entire `model/dto/` package. However, I refined the error handling patterns significantly—AI's initial approach used generic exceptions, which I challenged and evolved into a comprehensive exception hierarchy (more on this below).

**API Integration**: The `SpoonacularClient` was a collaborative effort. AI drafted the basic HTTP client with RestClient, but I pushed it to add robust error handling and integration with Spring's caching abstraction. The result is a resilient client that gracefully handles API failures and respects rate limits.

**Configuration Classes**: AI excelled at creating Spring configuration beans like `CorsProperties`, `RateLimitFilter`, and `SecurityConfig`. These are boilerplate-heavy but critical for production readiness. I validated each configuration against Spring Boot documentation and security best practices.

**Testing Infrastructure**: AI generated comprehensive JUnit 5 tests with Mockito. The backend has 14 test classes covering services, controllers, clients, configuration, and utilities. I set an 80%+ coverage requirement for services (enforced by JaCoCo), and AI helped achieve this by suggesting test cases I hadn't considered. However, I reviewed every test to ensure it validated business logic, not just code paths.

### Frontend Development (React)

The frontend presented different challenges, and AI's role evolved as I refined the architecture:

**React Components**: AI generated the initial component hierarchy in `components/` and `pages/`. Early on, it suggested a flat structure, but I challenged this: "How should we organize components for scalability? Show me feature-based vs flat structure tradeoffs." This led to ADR-0007, establishing a feature-based organization where page-specific components live in `pages/{page}/` and shared components in `components/`. AI then helped implement this structure consistently across 60+ components.

**Custom Hooks**: One of my best decisions was extracting business logic into custom hooks. AI initially inlined complex logic in components, making them hard to test and reuse. I refactored this into hooks like `useRecipeDetail`, `useSearch`, `useRecipeExclusion`, and `useKeyboardNavigation`. AI assisted with the extraction, but I drove the decision about what logic belonged in hooks vs. components.

**Accessibility (WCAG 2.1 AA)**: AI provided basic accessibility—alt text, semantic HTML—but I needed much more. I challenged it: "Make this WCAG 2.1 AA compliant with full keyboard navigation and screen reader support." The result includes live regions for dynamic content, comprehensive ARIA attributes, focus management, and keyboard shortcuts. Every component was manually tested with keyboard-only navigation and a screen reader.

**Context API State Management**: The `RecipeExclusionContext` manages ingredient exclusion state across components. AI suggested Redux initially, but I challenged whether that complexity was justified. After discussing tradeoffs, we implemented Context API (ADR-0004), which proved lightweight and sufficient.

### Documentation & Architecture

AI was highly effective for documentation, but with human oversight:

**Architecture Decision Records (ADRs)**: I created 10 ADRs using the MADR 4.0.0 format. AI drafted the structure, but the decisions and reasoning were mine. Even when AI suggested an approach, documenting it as an ADR forced me to articulate tradeoffs explicitly.

**API Documentation**: AI generated endpoint documentation in `docs/api/`, which I cross-checked against the actual implementation. Discrepancies prompted code refactoring to match the clearer documentation.

**README Files**: AI excelled at setup guides and configuration documentation, saving hours of writing. I added the "why" and context that only a human developer would know.

## Challenges Posed to AI: Pushing Beyond Initial Outputs

### Challenge 1: Nutrition Calculation Logic

**Initial AI Output**: A simple proportional calculation—if you exclude ingredients, reduce nutrition by the same proportion.

**My Challenge**: "How can we handle missing ingredient weights? What about when nutrition is only available at the recipe level?"

**Result**: This led to a hybrid calculation strategy (documented in ADR-0010). The system now attempts ingredient-level calculation when data is available, falls back to proportional estimation when it's not, and clearly indicates uncertainty. The `NutritionCalculationService` implements this with extensive unit tests covering edge cases.

**Impact**: This conversation elevated the feature from simplistic to production-ready, handling real-world data inconsistencies in the Spoonacular API.

### Challenge 2: Error Handling Architecture

**Initial AI Output**: Generic exception throwing with minimal context—`throw new RuntimeException("Error occurred")`.

**My Challenge**: "Design a consistent error response structure with appropriate HTTP status codes and user-friendly error messages."

**Result**: A complete error handling system emerged. The `exception/` package now contains 4 custom exception types extending from a base `LuqmaException` (`ExternalApiException`, `ResourceNotFoundException`, `InvalidPaginationException`, `ResourceLoadException`), a `GlobalExceptionHandler` that maps exceptions to HTTP responses, and an `ErrorResponse` builder that includes timestamps, status codes, error types, and user-friendly messages. This architecture makes debugging production issues significantly easier.

**Impact**: Transformed ad-hoc error handling into a maintainable, professional system.

### Challenge 3: Component Organization

**Initial AI Output**: All components in a flat `components/` directory.

**My Challenge**: "How should we organize components for scalability? Show me feature-based vs flat structure tradeoffs."

**Result**: AI presented both approaches with pros/cons. I chose feature-based organization (ADR-0007), where `pages/recipe/detail/`, `pages/recipe/ingredients/`, and `pages/recipe/nutrition/` contain page-specific components, while `components/ui/`, `components/layout/`, and `components/search/` house shared components. This makes the codebase navigable even as it grows.

**Impact**: The frontend now has 60+ components organized logically, and new developers can find code intuitively.

### Challenge 4: Caching Strategy

**Initial AI Output**: Cache everything for maximum performance.

**My Challenge**: "What should we cache vs compute fresh? Consider API limits, data freshness requirements, and memory constraints."

**Result**: A nuanced caching strategy (documented in `docs/architecture/caching-strategy.md`): recipe details are cached for 1 hour (they rarely change), search results are always fresh (user expectations), and nutrition with exclusions is computed on-demand (user-specific, not cacheable). This is implemented using Spring Cache with Caffeine, with a 500-recipe maximum to prevent memory issues.

**Impact**: Reduced Spoonacular API calls by ~80% while maintaining data freshness where it matters.

### Challenge 5: Accessibility Patterns

**Initial AI Output**: Basic alt text on images—`alt="recipe"`.

**My Challenge**: "Make this WCAG 2.1 AA compliant with full keyboard navigation and screen reader support. Provide specific examples."

**Result**: Comprehensive accessibility including descriptive alt text (`alt="Spaghetti Carbonara with crispy bacon and parmesan"`), live regions announcing search results and errors, roving tabindex for keyboard navigation in recipe grids, focus management on page transitions, and visible focus indicators. The `LiveRegion` component and `useKeyboardNavigation` hook emerged from this challenge.

**Impact**: The application is genuinely usable with keyboard-only and screen readers, not just technically compliant.

## Validation and Understanding: How I Ensured Code Quality

### Code Review Process

I read and understood every line of AI-generated code before accepting it. When code was unclear or used non-idiomatic patterns, I refactored it or asked AI to explain its reasoning. I cross-referenced implementations with official documentation (Spring Boot, React, Spring Cache) to ensure best practices.

### Testing as Validation

Tests were my primary validation tool. If I couldn't understand AI-generated business logic well enough to write tests for it, I rejected the code and asked for clarification. The backend has 80%+ service coverage, and the frontend has 70%+ hook/component coverage. These tests document expected behavior and caught numerous edge cases during development.

### Architecture Decision Records

Every significant architectural choice—even AI-suggested ones—was documented as an ADR. This forced me to articulate why a decision was made, what alternatives existed, and what tradeoffs were accepted. If I couldn't explain it clearly, I didn't understand it well enough to commit it.

### Manual Testing

Automated tests don't catch everything. I manually tested every feature end-to-end, deliberately triggering error scenarios: API timeouts, rate limiting, invalid input, empty states, and network failures. AI-generated code often missed edge cases that only emerge during real usage.

### Documentation Cross-Check

I used AI-generated code to inform documentation, but also used documentation to validate code. If I couldn't clearly document how something worked, the code was too complex or poorly structured. Documentation acted as a "can I explain this clearly?" checkpoint.

## Key Learnings: What Worked and What Didn't

### What Worked Well

**Boilerplate Acceleration**: AI saved hours on DTOs, configuration classes, test structure, and repetitive REST endpoint patterns. I estimate 40-50% of the codebase by line count came from AI, freeing me to focus on architecture and business logic.

**Pattern Consistency**: Once I established patterns (through examples and cursor rules), AI maintained them consistently. This created a more cohesive codebase than manual coding might have achieved.

**Documentation Drafts**: AI excelled at structured documentation—API endpoint specs, setup guides, and technical explanations. I added context and refined wording, but the scaffolding was excellent.

**Test Case Generation**: AI suggested test cases I hadn't considered, particularly boundary conditions and null-handling scenarios.

### Where Human Judgment Was Critical

**Architectural Decisions**: AI can suggest approaches, but humans must weigh tradeoffs against business requirements, team skills, and long-term maintenance. All 10 ADRs represent human decisions informed by AI suggestions.

**Error Handling Strategy**: Understanding failure modes requires domain knowledge—how does Spoonacular fail? What error messages help users? AI provided mechanics; I provided strategy.

**Accessibility Depth**: AI knows WCAG guidelines but doesn't understand user experience. Real accessibility required manual testing and empathy for users with disabilities.

**Performance Tradeoffs**: Deciding what to cache required understanding the Spoonacular API rate limits, typical user behavior, and memory constraints—context AI didn't have.

### AI Limitations Encountered

**Context Loss**: Large refactors required breaking into smaller, focused tasks. AI struggles with "refactor the entire exception handling system across all layers" but excels at "extract this ingredient validation logic into a utility function."

**Outdated Patterns**: AI occasionally suggested deprecated approaches (e.g., `componentWillMount` in React). Staying current with documentation was essential.

**Over-Engineering**: AI sometimes added unnecessary complexity—abstract base classes for single implementations, overly generic interfaces. Simplicity required human judgment.

**Edge Case Blindness**: AI often missed error scenarios like null responses, empty arrays, or API timeouts unless explicitly prompted.

## Conclusion

This project demonstrated that effective AI collaboration is a skill requiring clear communication, critical evaluation, and technical judgment. AI accelerated development significantly—I estimate this project would have taken 50-70% longer without AI assistance—but the quality came from rigorous human oversight.

The cursor rules I created were force multipliers, embedding project standards into every AI interaction. This reduced repetitive corrections and allowed AI to provide more valuable suggestions aligned with project goals.

Ultimately, AI handled boilerplate and repetitive tasks exceptionally well, allowing me to focus on architecture, business logic, accessibility, and user experience—the areas where human judgment is irreplaceable. The result is a production-ready application with comprehensive documentation, 80%+ test coverage, WCAG 2.1 AA accessibility, and a maintainable architecture.

AI is a powerful tool, but like any tool, its value depends entirely on how skillfully it's wielded. The key is maintaining a clear division: **AI suggests, human decides. AI drafts, human validates. AI accelerates, human ensures quality.**

