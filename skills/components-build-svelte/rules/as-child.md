---
title: asChild Pattern (Not Needed in Svelte 5)
impact: MEDIUM
impactDescription: Svelte snippets eliminate the need for asChild
tags: as-child, slot, composition, snippets, svelte-5
---

## asChild Pattern — Not Needed in Svelte 5

In React, `asChild` (via Radix UI's `Slot`) is needed to merge props and behaviors onto a custom child element without wrapping it. Svelte 5 eliminates this need entirely through two built-in features:

1. **Snippets (`{#snippet}` / `{@render}`)** — The consumer provides rendered content, not elements to clone. No wrapper problem exists.
2. **`<svelte:element>`** — The component can switch its root element without consumer workarounds.

### Why Svelte 5 Doesn't Need asChild

**React problem (no asChild):**

```tsx
<Dialog.Trigger>
  <button>Open</button>
</Dialog.Trigger>
// Renders: <button><button>Open</button></button>
//           ^^^^^^  ^^^^^^  — nested buttons, broken DOM
```

**React solution (asChild):**

```tsx
<Dialog.Trigger asChild>
  <button>Open</button>
</Dialog.Trigger>
// Renders: <button data-state="closed">Open</button>
//           ^^^^^^  — props merged onto child, no wrapper
```

**Svelte 5 approach — no issue exists:**

Svelte components don't wrap their children in extra DOM. A `Trigger` component simply renders a button. If the consumer wants a different element, they use `<svelte:element>`:

```svelte
<!-- Trigger.svelte -->
<script lang="ts">
  let { children, ...props }: { children: import('svelte').Snippet } = $props();
</script>

<button {...props}>
  {@render children()}
</button>
```

There is **no wrapper element** around the snippet content. The consumer's content renders inside the button, not as a sibling. No `asChild` needed.

### How to Handle Each asChild Use Case

#### 1. Custom Trigger Elements

**React:**

```tsx
<AlertDialog.Trigger asChild>
  <a href="/delete">Delete Account</a>
</AlertDialog.Trigger>
```

**Svelte 5 — use `<svelte:element>` on the Trigger:**

```svelte
<!-- AlertDialog/Trigger.svelte -->
<script lang="ts">
  let {
    as = 'button',
    children,
    ...props
  }: {
    as?: string;
    children: import('svelte').Snippet;
  } = $props();
</script>

<svelte:element this={as} {...props}>
  {@render children()}
</svelte:element>
```

```svelte
<AlertDialog.Trigger as="a" href="/delete">
  Delete Account
</AlertDialog.Trigger>
```

#### 2. Semantic HTML Switching

**React:**

```tsx
<NavigationMenu.Link asChild>
  <a href="/products">Products</a>
</NavigationMenu.Link>
```

**Svelte 5:**

```svelte
<!-- NavigationMenu/Link.svelte -->
<script lang="ts">
  let {
    as = 'button',
    children,
    ...props
  }: {
    as?: string;
    children: import('svelte').Snippet;
  } = $props();
</script>

<svelte:element this={as} {...props}>
  {@render children()}
</svelte:element>
```

```svelte
<NavigationMenu.Link as="a" href="/products">Products</NavigationMenu.Link>
```

#### 3. Component Composition Chains

**React (nested asChild):**

```tsx
<Dialog.Trigger asChild>
  <Tooltip.Trigger asChild>
    <button>Open dialog (with tooltip)</button>
  </Tooltip.Trigger>
</Dialog.Trigger>
```

**Svelte 5 — no nesting needed:**

```svelte
<script lang="ts">
  import Dialog from '$lib/components/dialog';
  import Tooltip from '$lib/components/tooltip';
</script>

<!-- Each component controls its own element, no wrapper conflicts -->
<Dialog.Trigger as="button">
  <Tooltip.Trigger as="span">
    Open dialog (with tooltip)
  </Tooltip.Trigger>
</Dialog.Trigger>
```

### Best Practices

**1. Prefer Snippets over Children Props:**

```svelte
<!-- ✅ Snippet — no wrapper element -->
<script lang="ts">
  let { children }: { children: import('svelte').Snippet } = $props();
</script>

<button>
  {@render children()}
</button>
```

**2. Use `<svelte:element>` for Element Switching:**

```svelte
<script lang="ts">
  let { as = 'button', children, ...props } = $props();
</script>

<svelte:element this={as} {...props}>
  {@render children()}
</svelte:element>
```

**3. Always Spread Props:**

```svelte
<!-- ✅ Properly forwards all attributes and events -->
<svelte:element this={as} {...props}>
  {@render children()}
</svelte:element>
```

### When You Might Still Want a Slot Utility

If you need to merge **event handlers** from parent + child (rare in Svelte), use an action:

```svelte
<script lang="ts">
  function mergeHandlers(node: HTMLElement) {
    // Forward or merge events as needed
    return { destroy() {} };
  }
</script>

<svelte:element this={as} use:mergeHandlers {...props}>
  {@render children()}
</svelte:element>
```

### Summary

| Concern | React approach | Svelte 5 approach |
|---------|---------------|-------------------|
| Switch rendered element | `asChild` + `Slot` | `<svelte:element this={...}>` |
| Prevent wrapper nesting | `Slot` merges props | No wrapper by default (snippets) |
| Compose trigger elements | Nested `asChild` chains | Single `as` prop per component |
| Forward HTML attributes | `{...props}` on Slot | `{...props}` directly |
