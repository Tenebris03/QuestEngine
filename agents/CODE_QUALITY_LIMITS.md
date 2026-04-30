# Code Quality & Complexity Limits

## 1. File & Class Length
- **Component Limit**: No single React component file should exceed **100 lines** of code. 
- **Class Limit**: NestJS services or controllers must not exceed **250 lines**.
- **Refactor Trigger**: If a file exceeds these limits, the agent must split logic into custom hooks (`useFeature.ts`) or sub-components (`FeaturePart.tsx`).

## 2. Cyclomatic Complexity
- **Nesting Limit**: Maximum of **3 levels** of nesting (e.g., loops inside an `if` inside a `map`).
- **Early Returns**: Use guard clauses to return early and reduce indentation.
- **Example**: 
  ```typescript
  // ❌ Bad: 3+ Nesting
  if (user) {
    if (user.isActive) {
      items.map(item => {
        if (item.valid) { ... }
      });
    }
  }

  // ✅ Good: Early Returns
  if (!user || !user.isActive) return null;
  const validItems = items.filter(item => item.valid);



## 3. Component Responsibility (SRP)
One Job: A component should either fetch data, layout other components, or render UI, but never all three.  

Sub-component Extraction: If a map() function generates a complex block of JSX (more than 5 lines), that block MUST be moved into its own dedicated component file.  

Pure Functions: Move any logic that doesn't depend on React state/props into a utils/ file.

## 4. Function Scoping
Line Limit: Individual functions and methods should not exceed 20 lines.

Parameter Limit: Maximum of 3 parameters per function. Use an object interface for anything more.

## 5. Commenting & Documentation
Self-Documenting Code: Variable names must describe intent (e.g., isQuestCompletionPending instead of loading).

The "Why", not the "What": Comments should only be used to explain why a complex decision was made, not what the code is doing.

