---
title: Data Attributes for Styling
impact: LOW
impactDescription: Clean state-based styling patterns
tags: data-attributes, data-state, data-slot, styling, tailwind, css
---

## Data Attributes for Component Styling

Use `data-state` and `data-slot` attributes to create flexible, maintainable component APIs.

### Use data-state for Visual States

**Never expose separate className props for different states.** Use `data-state` attributes:

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLDivAttributes } from 'svelte/elements';

  let { className, ...props }: HTMLDivAttributes = $props();
  let isOpen = $state(false);
</script>

<div
  data-state={isOpen ? 'open' : 'closed'}
  class={cn('transition-all', className)}
  {...props}
/>
```

**Consumer styles from outside:**

```svelte
<Dialog class="data-[state=open]:opacity-100 data-[state=closed]:opacity-0" />
```

### Common State Patterns

```svelte
<!-- Open/closed -->
<Accordion data-state={isOpen ? 'open' : 'closed'} />

<!-- Selected -->
<Tab data-state={isSelected ? 'active' : 'inactive'} />

<!-- Disabled -->
<Button data-disabled={isDisabled} disabled={isDisabled} />

<!-- Loading -->
<Button data-loading={isLoading} />

<!-- Orientation -->
<Slider data-orientation="horizontal" />

<!-- Side/position -->
<Tooltip data-side="top" />
```

### Tailwind Integration

```svelte
<Dialog
  class={cn(
    'rounded-lg border p-4',
    'data-[state=open]:animate-in data-[state=open]:fade-in',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out'
  )}
/>
```

### Use data-slot for Component Identification

Give components stable identifiers for parent targeting:

```svelte
<script lang="ts">
  import type { HTMLDivAttributes, HTMLFieldSetAttributes } from 'svelte/elements';

  let { className, ...props }: HTMLDivAttributes = $props();
</script>

<div
  data-slot="checkbox-group"
  class="flex flex-col gap-2 {className}"
  {...props}
/>

<script lang="ts">
  import type { HTMLFieldSetAttributes } from 'svelte/elements';

  let { className, ...props }: HTMLFieldSetAttributes = $props();
</script>

<fieldset
  data-slot="field-set"
  class="flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 {className}"
  {...props}
/>
```

### Parent-Aware Styling

```svelte
<form class="[&_[data-slot=button]]:w-full">
  <Button>Submit</Button>
</form>
```

### Naming Conventions

**Incorrect:**

```svelte
data-slot="input"           <!-- Too generic -->
data-slot="blueButton"      <!-- Includes styling -->
data-slot="div-wrapper"     <!-- Implementation detail -->
```

**Correct:**

```svelte
data-slot="search-input"
data-slot="navigation-menu"
data-slot="error-message"
data-slot="submit-button"
```

### When to Use Each

| Pattern | Use For |
|---------|---------|
| `data-state` | Visual states (open/closed, active, loading) |
| `data-slot` | Component identification, parent-child targeting |
| `props` | Variants (primary, secondary), sizes, event handlers |

### Combined Example

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';
  import { buttonVariants } from './variants';

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className,
    ...props
  }: {
    variant?: string;
    size?: string;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
  } = $props();
</script>

<button
  data-slot="button"
  data-loading={loading}
  data-disabled={disabled}
  class={cn(buttonVariants({ variant, size }), className)}
  {disabled}
  {...props}
>
  {@render children?.()}
</button>
```

### Rules

1. **Use `data-state` instead of separate className props** for states
2. **Add `data-slot` to reusable components** for targeting
3. **Use kebab-case** for `data-slot` values
4. **Prefer Tailwind arbitrary variants** over custom CSS
5. **Never rely on class names** for parent-child targeting
