---
title: Component Composition
impact: HIGH
impactDescription: Foundation of component architecture
tags: composition, patterns, sub-components, snippets, createContext, root, trigger, content
---

## Component Composition

Composition is the foundation of building modern UI components. Instead of cramming all functionality into a single component with dozens of props, break components down into smaller, focused sub-components that work together.

Svelte 5 uses **snippets** (`{#snippet}` / `{@render}`) and **`createContext<T>()`** instead of React's JSX children + Context API.

**Incorrect (monolithic, hard to customize):**

```svelte
<!-- A single component with all the logic, no user control over layout -->
<script lang="ts">
  let { data }: { data: { title: string; content: string }[] } = $props();
</script>

{#each data as item}
  <div class="accordion-item">
    <h3>{item.title}</h3>
    <p>{item.content}</p>
  </div>
{/each}
```

**Correct (composable, each layer customizable):**

```svelte
<Accordion.Root>
  {#each items as item}
    <Accordion.Item>
      <Accordion.Trigger>{item.title}</Accordion.Trigger>
      <Accordion.Content>{item.content}</Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

### Building Composable Components in Svelte 5

#### 1. Create a Context Module

Svelte 5's `createContext<T>()` provides type-safe shared state without prop drilling:

```typescript
// accordion-context.ts
import { createContext } from 'svelte';

interface AccordionContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const setAccordionContext = createContext<AccordionContextValue>();
export const getAccordionContext = () => setAccordionContext();
```

#### 2. Root Component

The main container that holds sub-components and manages shared state:

```svelte
<!-- Accordion/Root.svelte -->
<script lang="ts">
  import { setAccordionContext } from './accordion-context.svelte';

  let {
    children,
    open = $state(false),
    onOpenChange
  }: {
    children: import('svelte').Snippet;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  } = $props();

  function setOpen(value: boolean) {
    open = value;
    onOpenChange?.(value);
  }

  setAccordionContext({ get open() { return open; }, setOpen });
</script>

<div {...props}>
  {@render children()}
</div>
```

#### 3. Item Component

A simple wrapper for each item:

```svelte
<!-- Accordion/Item.svelte -->
<script lang="ts">
  let { children, ...props }: {
    children: import('svelte').Snippet;
  } = $props();
</script>

<div {...props}>
  {@render children()}
</div>
```

#### 4. Trigger Component

Handles user interaction, reads context:

```svelte
<!-- Accordion/Trigger.svelte -->
<script lang="ts">
  import { getAccordionContext } from './accordion-context.svelte';

  let { children }: { children: import('svelte').Snippet } = $props();
  const ctx = getAccordionContext();
</script>

<button onclick={() => ctx.setOpen(!ctx.open)} aria-expanded={ctx.open}>
  {@render children()}
</button>
```

#### 5. Content Component

Displays the main content, reads context:

```svelte
<!-- Accordion/Content.svelte -->
<script lang="ts">
  import { getAccordionContext } from './accordion-context.svelte';

  let { children }: { children: import('svelte').Snippet } = $props();
  const ctx = getAccordionContext();
</script>

{#if ctx.open}
  <div>
    {@render children()}
  </div>
{/if}
```

#### 6. Export Pattern

Export components as a namespace using a barrel file:

```typescript
// accordion/index.ts
export { default as Root } from './Root.svelte';
export { default as Item } from './Item.svelte';
export { default as Trigger } from './Trigger.svelte';
export { default as Content } from './Content.svelte';
```

```svelte
<!-- Usage -->
<script lang="ts">
  import * as Accordion from '$lib/components/accordion';
</script>

<Accordion.Root>
  <Accordion.Item>
    <Accordion.Trigger>Title</Accordion.Trigger>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Naming Conventions

- **Root** - Main container component
- **Trigger** - Element that initiates an action
- **Content** - Element containing the main content
- **Header/Body/Footer** - Structured content areas
- **Title/Description** - Informational components

### Best Practices

1. **Single Responsibility** - Each sub-component should have one clear purpose
2. **createContext for State** - Use `createContext<T>()` (not `setContext`/`getContext` with string keys) to share state between sub-components
3. **Extend HTML Attributes** - Always extend native HTML element props via `svelte/elements`
4. **Consistent Naming** - Follow established conventions
5. **Namespace Exports** - Export components as a namespace for clean API
6. **Snippets over Children** - Use `{#snippet}` and `{@render}` instead of the `children` prop for render delegate patterns
7. **Composition Over Configuration** - Prefer multiple components over many props

### When to Use Composition

**Use composition when:**
- A component has multiple responsibilities
- Customization requires CSS overrides
- You need flexible layouts or structures
- Building a component library
- Components need to work together but remain independent

**Avoid composition for:**
- Simple, single-purpose components
- Components that don't need customization
- Over-engineering simple UI elements
