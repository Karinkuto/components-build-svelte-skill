---
title: Polymorphism Patterns
impact: MEDIUM
impactDescription: Flexible element rendering
tags: polymorphism, svelte-element, element-type, typescript, semantic-html
---

## Polymorphism Patterns

Build flexible components that can render as different HTML elements while maintaining consistent styling and behavior.

### Core Pattern: `<svelte:element>`

Svelte 5 provides the `<svelte:element this={...}>` built-in, which replaces the `as` prop pattern from React:

```svelte
<script lang="ts">
  let { as = 'span', ...props }: { as?: string } = $props();
</script>

<svelte:element this={as} {...props}>
  {@render children?.()}
</svelte:element>
```

### Typed Polymorphic Component

Use generics for type-safe polymorphic components:

```svelte
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    as = 'div',
    ...props
  }: {
    as?: keyof HTMLElementTagNameMap;
  } & HTMLAttributes<HTMLElement> = $props();
</script>

<svelte:element this={as} {...props}>
  {@render children?.()}
</svelte:element>
```

### Common Use Cases

**Typography Components:**

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    as = 'span',
    variant = 'body',
    className,
    ...props
  }: {
    as?: keyof HTMLElementTagNameMap;
    variant?: 'heading' | 'body';
    className?: string;
  } = $props();
</script>

<svelte:element
  this={as}
  class={cn(
    'text-base',
    variant === 'heading' && 'text-2xl font-bold',
    variant === 'body' && 'text-base',
    className
  )}
  {...props}
>
  {@render children?.()}
</svelte:element>
```

```svelte
<Text as="h1" variant="heading">Title</Text>
<Text as="p" variant="body">Paragraph</Text>
```

**Layout Components:**

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';

  let {
    as = 'div',
    className,
    ...props
  }: {
    as?: keyof HTMLElementTagNameMap;
    className?: string;
  } = $props();
</script>

<svelte:element
  this={as}
  class={cn('flex', className)}
  {...props}
>
  {@render children?.()}
</svelte:element>
```

```svelte
<Flex as="header">Header content</Flex>
<Flex as="main">Main content</Flex>
```

### Best Practices

**1. Default to Semantic Elements:**

**Incorrect (too generic):**

```svelte
<svelte:element this={as || 'div'}>
  {@render children?.()}
</svelte:element>
```

**Correct (semantic defaults):**

```svelte
<script lang="ts">
  let { as = 'article' } = $props();
</script>
<svelte:element this={as}>...</svelte:element>

<script lang="ts">
  let { as = 'nav' } = $props();
</script>
<svelte:element this={as}>...</svelte:element>

<script lang="ts">
  let { as = 'h2' } = $props();
</script>
<svelte:element this={as}>...</svelte:element>
```

**2. Document Valid Elements:**

```svelte
<script lang="ts">
  export interface BoxProps {
    /**
     * The HTML element to render as
     * @default 'div'
     */
    as?: 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer';
  }
</script>
```

**Invalid HTML Nesting:**

```svelte
<!-- ❌ Invalid: button inside button -->
<svelte:element this="button">
  <svelte:element this="button">Nested</svelte:element>
</svelte:element>

<!-- ❌ Invalid: div inside p -->
<svelte:element this="p">
  <svelte:element this="div">Invalid</svelte:element>
</svelte:element>

<!-- ✅ Valid nesting -->
<svelte:element this="div">
  <svelte:element this="div">Valid</svelte:element>
</svelte:element>
```

**Missing Accessibility:**

```svelte
<!-- ❌ Missing label -->
<svelte:element this="nav">
  <ul><li>Item</li></ul>
</svelte:element>

<!-- ✅ Proper ARIA label -->
<svelte:element this="nav" aria-label="Main navigation">
  <ul><li>Item</li></ul>
</svelte:element>
```

### Key Benefits

1. **Semantic HTML Flexibility** - Use the most appropriate element
2. **Component Reusability** - One component serves multiple purposes
3. **Accessibility** - Choose elements for best accessibility
4. **Style System Integration** - Maintain styling while changing elements
5. **No Props Overhead** - `as` prop is built into the framework, no custom logic needed
