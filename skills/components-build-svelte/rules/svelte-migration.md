---
title: React to Svelte 5 Migration Reference
impact: MEDIUM
impactDescription: Quick reference for React developers migrating to Svelte 5
tags: migration, react, svelte5, reference
---

## React → Svelte 5 Migration Reference

Quick mapping for developers familiar with the React version of components.build.

### Pattern Replacements

| React Pattern | Svelte 5 Replacement | File |
|---------------|---------------------|------|
| `children` prop | `children: import('svelte').Snippet` + `{@render children()}` | composition |
| `React.ComponentProps<'div'>` | `HTMLDivAttributes` from `svelte/elements` | types |
| `createContext` + `useContext` | `createContext<T>()` (one function, no provider) | composition |
| `as` prop | `<svelte:element this={...}>` | polymorphism |
| `asChild` + `Slot` | Not needed — snippets avoid wrapper problem | as-child |
| `useState` | `$state()` | state |
| `useEffect` | `$effect()` | state |
| `useMemo` | `$derived` | state |
| `useControllableState` | `$bindable()` | state |
| `onClick` | `onclick` (lowercase) | accessibility |
| `className` | `class` or `className` (both work) | styling |
| `{...props}` spread | `{...props}` spread (same) | types |
| `clsx()` / `cn()` | Same API — works identically | styling |
| `cva()` | Same API — works identically | styling |
| JSX conditional render | `{#if}` / `{#each}` blocks | composition |
| `React.memo` | Svelte compiles to fine-grained updates automatically | principles |
| `React.forwardRef` | `$props()` includes directives — `ref` is a prop | types |

### Component Structure Comparison

**React (Component Pattern):**
```tsx
import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext(null);

export function Root({ children, value, onValueChange }) {
  return (
    <AccordionContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}
```

**Svelte 5 (Equivalent Pattern):**
```svelte
<script lang="ts">
  import { createContext } from 'svelte';

  const ctx = createContext<{ value: number; onValueChange?: (v: number) => void }>();

  let { children, value = $bindable(0), onValueChange }: {
    children: import('svelte').Snippet;
    value?: number;
    onValueChange?: (v: number) => void;
  } = $props();

  ctx.set({ get value() { return value; }, onValueChange });
</script>

<div>
  {@render children()}
</div>

<!-- Consumer reads: -->
<script lang="ts">
  const accordion = ctx.get();
</script>
```

### Key API Changes

| Concept | React | Svelte 5 |
|---------|-------|----------|
| Props declaration | `function Comp({ prop })` | `let { prop } = $props()` |
| Default props | Destructuring defaults | Default in destructuring |
| Event handlers | `onClick={fn}` (camelCase) | `onclick={fn}` (lowercase) |
| Two-way binding | Manual `value` + `onChange` | `bind:value` |
| Unique IDs | `useId()` | `$props.id()` |
| Ref forwarding | `forwardRef` | `ref` as regular prop |
| Context | `createContext` / `useContext` (separate) | `createContext<T>()` (returns `{set, get}`) |
| Dynamic element | `as` prop | `<svelte:element this={...}>` |
| Style scoping | CSS-in-JS / modules | Built-in scoped styles per `.svelte` file |

### What Stays the Same

- `cn()` utility (clsx + tailwind-merge)
- `cva()` from `class-variance-authority`
- TypeScript interfaces and types
- `data-state` / `data-slot` attribute patterns
- Design tokens via CSS variables
- Tailwind CSS (still just utility classes)
- Registry and npm publishing patterns

### What's Simplified

| Area | Before (React) | After (Svelte 5) |
|------|---------------|------------------|
| Controlled/uncontrolled | `useControllableState` from external lib | Built-in `$bindable()` |
| Element polymorphism | Custom `as` prop + TypeScript gymnastics | `<svelte:element this={...}>` |
| Wrapper avoidance | `asChild` + `Slot` from Radix | Snippets have no wrapper |
| Fine-grained rendering | `React.memo`, `useMemo` | Automatic (compiler) |
| Unique IDs | `useId()` or external lib | `$props.id()` |
