---
title: Component Artifact Definitions
impact: MEDIUM
impactDescription: Essential for correct component classification
tags: definitions, primitive, component, block, template, pattern, utility, terminology
---

## Component Artifact Definitions

Precise terminology for classifying and naming UI artifacts.

### Primitive (Unstyled Component)

The **lowest-level building block** providing behavior and accessibility without styling. Completely headless.

```svelte
<!-- Primitive - behavior only, no styling -->
<script lang="ts">
  let { open, setOpen, children }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: import('svelte').Snippet;
  } = $props();
</script>

<div>
  {@render children()}
</div>
```

**Examples:** Bits UI, Melt UI, Ariakit

### Component

A **styled, reusable UI unit** that adds visual design to primitives or composes multiple elements.

```svelte
<!-- Component - styled and reusable -->
<script lang="ts">
  import { cn } from '$lib/utils';

  let { variant = 'primary', size = 'md', children, ...props }: {
    variant?: string;
    size?: string;
    children: import('svelte').Snippet;
  } = $props();
</script>

<button class={cn('base-button-styles', className)} {...props}>
  {@render children()}
</button>
```

**Examples:** shadcn/ui components, Material UI, Ant Design

### Pattern

A **specific composition** solving a UI/UX problem. Documentation-focused, not a reusable component.

**Examples:** Form validation with inline errors, confirming destructive actions, typeahead search

### Block

An **opinionated, production-ready composition** solving a concrete interface use case.

```svelte
<!-- Block - complete, opinionated composition -->
<script lang="ts">
  let { plans, onSelectPlan }: {
    plans: { id: string; name: string; price: number }[];
    onSelectPlan: (id: string) => void;
  } = $props();
</script>

<div class="pricing-table">
  {#each plans as plan}
    <Card.Root>
      <Card.Header><Card.Title>{plan.name}</Card.Title></Card.Header>
      <Card.Content><div class="price">{plan.price}</div></Card.Content>
      <Card.Footer><button onclick={() => onSelectPlan(plan.id)}>Select Plan</button></Card.Footer>
    </Card.Root>
  {/each}
</div>
```

**Examples:** Pricing table, auth screens, onboarding stepper, AI chat panel

### Page

A **complete, single-route view** composed of multiple blocks.

```svelte
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import HeroBlock from './HeroBlock.svelte';
  import FeaturesBlock from './FeaturesBlock.svelte';
  import PricingBlock from './PricingBlock.svelte';
  import FooterBlock from './FooterBlock.svelte';
</script>

<Layout>
  <HeroBlock />
  <FeaturesBlock />
  <PricingBlock />
  <FooterBlock />
</Layout>
```

### Template

A **multi-page collection** or full-site scaffold bundling pages, routing, layouts, and providers.

**Examples:** SaaS starter, e-commerce template, dashboard starter

### Utility (Non-visual)

A **helper** for developer ergonomics or composition; not rendered UI.

```typescript
function createControllableState<T>(value: T, onChange?: (v: T) => void) {
  let current = $state(value);
  return {
    get value() { return current; },
    set value(v: T) { current = v; onChange?.(v); }
  };
}
```

**Examples:** Svelte actions, stores, class utilities, keybinding helpers, focus scopes

### Classification Decision Flow

1. **Behavior/a11y only, no styling?** → **Primitive**
2. **Styled, reusable UI element?** → **Component**
3. **Concrete product use case with opinionated composition?** → **Block**
4. **Multi-page scaffold with routing/providers?** → **Template**
5. **Documentation of recurring solution?** → **Pattern**
6. **Non-visual logic?** → **Utility**

### Common Classification Mistakes

**Incorrect (mislabeling a styled component as a primitive):**

```svelte
<!-- Wrong: This is styled, so it's a Component, not a Primitive -->
<script lang="ts">
  let { open, setOpen, children } = $props();
</script>

<div class="rounded-lg border bg-white p-6 shadow-lg">
  {@render children()}
</div>
```

**Correct (proper classification based on styling presence):**

```svelte
<!-- Primitive - behavior only, no styling -->
<script lang="ts">
  let { open, setOpen, children } = $props();
</script>

<div>
  {@render children()}
</div>

<!-- Component - styled wrapper around primitive -->
<script lang="ts">
  import { cn } from '$lib/utils';
  let { open, setOpen, children } = $props();
</script>

<div class={cn("rounded-lg border bg-white p-6 shadow-lg")}>
  {@render children()}
</div>
```

### Key Vocabulary

- **Props API** - Public configuration surface, typed and documented
- **Snippets** - Caller-provided template chunks rendered via `{@render}`
- **Controlled** - Value driven by props (parent is source of truth)
- **Uncontrolled** - Internal state with optional `$bindable()` default
- **createContext** - Supplies shared state to subtree (Svelte 5)
- **Portal** - Rendering outside DOM hierarchy for layering
- **Headless** - Behavior without styling
- **Styled** - Ships with default visual design
- **Variants** - Style/behavior permutations via props
- **Design Tokens** - Named values for theming
