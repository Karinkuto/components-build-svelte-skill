---
title: Component Types
impact: HIGH
impactDescription: Type-safe, flexible component interfaces
tags: types, typescript, props, html-attributes, svelte-elements, export, single-element
---

## Component Types

Proper typing is essential for creating flexible, customizable, and type-safe component interfaces.

### Single Element Wrapping

Each exported component should wrap a single HTML element:

**Incorrect (hard to customize):**

```svelte
<script lang="ts">
  let { title, description, footer, ...props }: {
    title: string;
    description: string;
    footer: string;
  } = $props();
</script>

<div {...props}>
  <div class="card-header">
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
  <div class="card-footer">{footer}</div>
</div>
```

**Correct (composable, each layer customizable):**

```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
```

### Extending HTML Attributes

Every component should extend native HTML attributes. Use types from `svelte/elements`:

```svelte
<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  let { variant = 'default', ...props }: HTMLDivAttributes & {
    variant?: 'default' | 'outlined';
  } = $props();
</script>

<div {...props} />
```

**Common HTML Attribute Types:**

```typescript
import type {
  HTMLDivAttributes,
  HTMLButtonAttributes,
  HTMLInputAttributes,
  HTMLFormAttributes,
  HTMLAnchorAttributes
} from 'svelte/elements';
```

### Exporting Types

Always export prop types for consumers:

```svelte
<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  export type CardRootProps = HTMLDivAttributes & {
    variant?: 'default' | 'outlined';
  };

  let { variant = 'default', ...props }: CardRootProps = $props();
</script>
```

**Naming convention:** Export types as `<ComponentName>Props`.

```svelte
<!-- Consumer can extract or extend -->
<script lang="ts">
  import type { CardRootProps } from '$lib/components/ui/card/CardRoot.svelte';

  // Enables type extraction
  type Variant = CardRootProps['variant'];

  // Enables extending
  type ExtendedCardProps = CardRootProps & { isLoading?: boolean };
</script>
```

### Best Practices

**1. Always Spread Props Last:**

```svelte
<!-- ✅ User props override defaults -->
<div class="default-class" {...props} />

<!-- ❌ Defaults override user props -->
<div {...props} class="default-class" />
```

**2. Avoid Prop Name Conflicts:**

```svelte
<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  // ❌ Conflicts with HTML title attribute
  let { title, ...props }: HTMLDivAttributes & { title: string } = $props();

  // ✅ Use a different name
  let { heading, ...props }: HTMLDivAttributes & { heading: string } = $props();
</script>
```

**3. Document Custom Props:**

```svelte
<script lang="ts">
  import type { HTMLDivAttributes } from 'svelte/elements';

  export type DialogProps = HTMLDivAttributes & {
    /** Whether the dialog is currently open */
    open: boolean;
    /** Callback when the dialog requests to be closed */
    onclose?: () => void;
    /** Whether to render the dialog in a portal */
    modal?: boolean;
  };

  let { open, onclose, modal = true, ...props }: DialogProps = $props();
</script>
```

### Quick Reference

| Pattern | Usage | Example |
|---------|-------|---------|
| Basic extension | Extend single HTML element | `HTMLDivAttributes & { ... }` |
| Custom props | Add component-specific props | `HTMLButtonAttributes & { variant?: string }` |
| Polymorphic | Render as different elements | `<svelte:element this={...}>` |
| Type extraction | Get specific prop type | `CardRootProps['variant']` |
| Type extension | Extend existing component props | `CardRootProps & { isLoading?: boolean }` |
