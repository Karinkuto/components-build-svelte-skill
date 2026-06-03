# Components.build Specification (Svelte 5)

**Version 1.0.0-svelte**
Amen Segni (@karinkuto)
June 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring UI component libraries in Svelte 5. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guidelines for building modern, composable, and accessible Svelte 5 UI components. This specification provides patterns and best practices for creating Svelte components using runes, snippets, and modern Svelte idioms.

---

## Table of Contents


1. [Overview](#1-overview) — **MEDIUM**

2. [Principles](#2-principles) — **HIGH**

3. [Definitions](#3-definitions) — **MEDIUM**

4. [Composition](#4-composition) — **HIGH**

5. [Accessibility](#5-accessibility) — **CRITICAL**

6. [State](#6-state) — **HIGH**

7. [Types](#7-types) — **HIGH**

8. [Polymorphism](#8-polymorphism) — **MEDIUM**

9. [As-Child](#9-as-child) — **MEDIUM**

10. [Data Attributes](#10-data-attributes) — **LOW**

11. [Styling](#11-styling) — **HIGH**

12. [Design Tokens](#12-design-tokens) — **MEDIUM**

13. [Documentation](#13-documentation) — **MEDIUM**

14. [Registry](#14-registry) — **LOW**

15. [NPM](#15-npm) — **LOW**

16. [Marketplaces](#16-marketplaces) — **LOW**


---

## 1. Overview

**Impact: MEDIUM**

Foundation for understanding the specification

The components.build specification is an open-source standard for building modern, composable, and accessible UI components. It provides high-level guidelines, best practices, and common terminology for designing UI components that integrate smoothly into any codebase.

**What This Specification Is:**

This spec is **not**:
- A tutorial or course on Svelte 5
- A promotion for any specific component library or registry
- A replacement for framework documentation

This spec **is**:
- A set of high-level guidelines and best practices
- A common terminology for designing UI components
- A standard for ensuring components meet modern expectations
- A framework for creating components that integrate smoothly across projects

**Who This Is For:**

This specification is written for:
- **Open-source maintainers** building and distributing component libraries
- **Senior front-end engineers** designing component APIs and design systems
- **Developers** familiar with JavaScript/TypeScript and Svelte 5

**Framework Scope:**

While examples use Svelte 5 (with runes) for concreteness, the fundamental concepts apply to other frameworks (React, Vue, Angular). The philosophy is **framework-agnostic**.

**Core Goals:**

The specification aims to help developers create components that are:

1. **Composable** - Components combine and nest to create complex UIs
2. **Accessible** - Usable by everyone, including users with disabilities
3. **Easy to adopt** - Integrate smoothly into any codebase
4. **Consistent** - Follow modern expectations and patterns
5. **Well-documented** - Clear guidelines and terminology

**Key Philosophy:**

- **Composition over configuration** - Build flexible, composable APIs
- **Accessibility by default** - Not an afterthought, but a requirement
- **Developer experience** - Components should be easy to understand, customize, and integrate
- **Transparency** - Source code should be inspectable and modifiable
- **Standards alignment** - Follow web standards and modern best practices

**Example:**

The following examples illustrate the difference between components that don't follow the specification and those that do:

**Incorrect:**

```svelte
<!-- Hard-coded styles, no accessibility, not composable -->
<button style="background-color: #007bff; color: white; padding: 10px">
  Click me
</button>
```

**Correct:**

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';

  let { className, variant = 'default', children, ...props }: {
    className?: string;
    variant?: 'default' | 'outline';
    children?: import('svelte').Snippet;
  } = $props();
</script>

<button
  class={cn(
    'inline-flex items-center justify-center rounded-md px-4 py-2',
    'focus-visible:outline-none focus-visible:ring-2',
    variant === 'default' && 'bg-primary text-primary-foreground',
    variant === 'outline' && 'border border-input bg-background',
    className
  )}
  {...props}
>
  {@render children?.()}
</button>
```

**Specification Authors:**

Co-authored by:
- **Hayden Bleasel** ([@haydenbleasel](https://x.com/haydenbleasel))
- **shadcn** ([@shadcn](https://x.com/shadcn))

Adapted as an AI skill by:
- **Jordan Gilliam** ([@nolansym](https://x.com/nolansym))

Svelte 5 adaptation by:
- **Karinkuto**

Reference: [https://components.build](https://components.build)

---

## 2. Principles

**Impact: HIGH**

Foundation of component architecture decisions

These six principles guide all component design decisions. Apply them consistently when building, refactoring, or evaluating components.

### 1. Composability and Reusability

Favor composition over inheritance. Build components that combine and nest to create complex UIs.

**Incorrect (monolithic, hard to customize):**

```svelte
<Accordion data={data} />
```

**Correct (composable, each layer customizable):**

```svelte
<Accordion.Root bind:open>
  {#each items as item}
    <Accordion.Item>
      <Accordion.Trigger>{item.title}</Accordion.Trigger>
      <Accordion.Content>{item.content}</Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

### 2. Accessible by Default

Components must be usable by all users. Accessibility is not optional—it's a baseline feature.

**Incorrect (generic div with click handler):**

```svelte
<div onclick={handleClick}>Click me</div>
```

**Correct (semantic button element):**

```svelte
<button onclick={handleClick}>Click me</button>
```

Best practices:
- Use semantic HTML (`<button>`, `<ul>/<li>`, `<nav>`, etc.)
- Provide proper ARIA roles, states, and properties
- Support keyboard navigation for all interactive elements
- Ensure focus management in modals, dropdowns, and overlays

### 3. Customizability and Theming

Components should be easy to restyle or adapt to different design requirements.

**Correct (design tokens and className override):**

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';

  let { className, ...props }: { className?: string } = $props();
</script>

<button class={cn('base-button-styles', className)} {...props}>
  {@render children?.()}
</button>
```

Best practices:
- Use CSS variables (design tokens) for colors, spacing, typography
- Always allow `className` prop for style overrides
- Provide sensible default styling
- Avoid hard-coded colors, fonts, or spacing values

### 4. Lightweight and Performant

Components should be lean in terms of assets and dependencies.

**Incorrect (heavy dependency for simple task):**

```typescript
import { entireDateLibrary } from 'heavy-date-lib';
```

**Correct (native APIs or lightweight alternatives):**

```typescript
const formatDate = (date: Date) => date.toLocaleDateString();
```

Best practices:
- Keep bundle size minimal
- Use tree-shaking friendly imports
- Lazy load heavy features when possible
- Optimize for initial render performance

### 5. Transparency and Code Ownership

Components should not be black boxes. Developers should be able to inspect and modify them.

**Correct (clear, readable implementation):**

```svelte
<script lang="ts">
  let { children, onclick, ...props } = $props();
</script>

<button {onclick} {...props}>
  {@render children()}
</button>
```

**Incorrect (obfuscated or overly complex):**

```typescript
const Button = compose(withHOC1, withHOC2, withHOC3)(BaseButton);
```

### 6. Well-documented and DX-Friendly

Components should come with clear documentation and examples.

**Correct (comprehensive JSDoc):**

```typescript
/**
 * Button component for primary actions.
 * 
 * @example
 * <Button variant="primary" onclick={handleClick}>Click me</Button>
 * 
 * @remarks
 * - Supports keyboard navigation (Enter/Space)
 * - Accessible by default with proper ARIA attributes
 */
```

A well-designed component applies all six principles together: **Composes** with other components, **works for everyone** with proper accessibility, **adapts** to different designs via theming, **performs** efficiently, **can be inspected** and modified, and **is easy to learn** through documentation.

---

## 3. Definitions

**Impact: MEDIUM**

Essential for correct component classification

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

---

## 4. Composition

**Impact: HIGH**

Foundation of component architecture

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

---

## 5. Accessibility

**Impact: CRITICAL**

Essential for inclusive component design

Accessibility (a11y) is not optional—it's a fundamental requirement. Every component must be usable by everyone, including people with visual, motor, auditory, or cognitive disabilities.

### Core Principles

#### 1. Semantic HTML First

Always start with the most appropriate HTML element:

**Incorrect (generic div):**

```svelte
<div onclick={handleClick}>Click me</div>
```

**Correct (semantic element):**

```svelte
<button onclick={handleClick}>Click me</button>
```

#### 2. Keyboard Navigation

Every interactive element must be keyboard accessible:

```svelte
<script lang="ts">
  function handleKeydown(e: KeyboardEvent) {
    switch(e.key) {
      case 'ArrowDown': focusNextItem(); break;
      case 'ArrowUp': focusPreviousItem(); break;
      case 'Home': focusFirstItem(); break;
      case 'End': focusLastItem(); break;
      case 'Escape': closeMenu(); break;
    }
  }
</script>

<div role="menu" onkeydown={handleKeydown}>
  <!-- items -->
</div>
```

#### 3. Screen Reader Support

Use ARIA attributes when necessary:

```svelte
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>

<div aria-live="polite" aria-atomic="true">
  {#if isLoading}
    <span>Loading results...</span>
  {/if}
</div>
```

#### 4. Visual Accessibility

Support users with visual impairments:

```css
/* Visible focus indicators */
button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Sufficient color contrast (4.5:1 for normal text) */
.text { color: #333; background: white; }
```

### ARIA Rules

1. **Don't use ARIA if you can use semantic HTML**
2. **Don't change native semantics unless necessary**
3. **All interactive elements must be keyboard accessible**
4. **Don't hide focusable elements** - Never use `aria-hidden="true"` on focusable elements
5. **All interactive elements must have accessible names**

### Component Patterns

#### Modal/Dialog

```svelte
<script lang="ts">
  let { isOpen, onClose, children }: {
    isOpen: boolean;
    onClose: () => void;
    children: import('svelte').Snippet;
  } = $props();
</script>

{#if isOpen}
  <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button onclick={onClose} aria-label="Close dialog">&times;</button>
    {@render children()}
  </div>
{/if}
```

#### Dropdown Menu

```svelte
<button aria-haspopup="true" aria-expanded={isOpen} aria-controls="dropdown-menu">
  Menu
</button>
{#if isOpen}
  <ul id="dropdown-menu" role="menu">
    <li role="menuitem" tabindex="-1">Item 1</li>
  </ul>
{/if}
```

#### Tabs

```svelte
<div role="tablist" aria-label="Tabs">
  <button role="tab" aria-selected={activeTab === 0} aria-controls="panel-0">Tab 1</button>
</div>
<div id="panel-0" role="tabpanel" aria-labelledby="tab-0">
  <!-- content -->
</div>
```

### $props.id() for Unique IDs

Svelte 5 provides `$props.id()` to generate stable unique IDs for ARIA associations:

```svelte
<script lang="ts">
  let { label, describedBy, children }: {
    label: string;
    describedBy?: string;
    children: import('svelte').Snippet;
  } = $props();

  const id = $props.id();
  const labelId = `${id}-label`;
  const descId = `${id}-desc`;
</script>

<div aria-labelledby={labelId} aria-describedby={describedBy ? descId : undefined}>
  <span id={labelId}>{label}</span>
  {#if describedBy}
    <span id={descId} hidden>{describedBy}</span>
  {/if}
  {@render children()}
</div>
```

### Focus Management

```css
/* Show outline only for keyboard focus */
*:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Live Regions

```svelte
<!-- Polite announcement -->
<div role="status" aria-live="polite">
  {#if savedMessage}Saved{/if}
</div>

<!-- Assertive announcement -->
<div role="alert" aria-live="assertive">
  {#if errorMessage}{errorMessage}{/if}
</div>
```

### Common Pitfalls

**Placeholder as labels:**

```svelte
<!-- ❌ Placeholder disappears -->
<input placeholder="Email address" />

<!-- ✅ Persistent label -->
<label>Email address <input type="email" /></label>
```

**Empty buttons:**

```svelte
<!-- ❌ No accessible name -->
<button><TrashIcon /></button>

<!-- ✅ Screen reader text -->
<button aria-label="Delete item"><TrashIcon aria-hidden="true" /></button>
```

**Disabled elements:**

```svelte
<!-- ✅ Use aria-disabled and explain -->
<button
  aria-disabled={!isValid}
  aria-describedby="submit-help"
  onclick={isValid ? handleSubmit : undefined}
>Submit</button>
<span id="submit-help">{#if !isValid}Fill required fields{/if}</span>
```

### Mobile Accessibility

```css
/* Minimum 44x44px touch targets */
.button {
  min-height: 44px;
  min-width: 44px;
}
```

```html
<!-- Allow zooming -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## 6. State

**Impact: HIGH**

Flexible component APIs for all use cases

Build flexible components that work seamlessly in both controlled and uncontrolled modes.

Svelte 5 uses runes (`$state`, `$derived`, `$effect`, `$bindable`) instead of React's `useState`, `useEffect`, and `useControllableState`.

### Uncontrolled State

Component manages its own state internally:

```svelte
<script lang="ts">
  let value = $state(0);
</script>

<div>
  <p>{value}</p>
  <button onclick={() => value++}>Increment</button>
</div>
```

**When to use:** Simple components, default behavior, internal state is sufficient.

### Controlled State

Parent component manages the state:

```svelte
<script lang="ts">
  let { value, onvaluechange }: {
    value: number;
    onvaluechange?: (value: number) => void;
  } = $props();
</script>

<div>
  <p>{value}</p>
  <button onclick={() => onvaluechange?.(value + 1)}>Increment</button>
</div>
```

**When to use:** State coordination, external data sources, form validation, persistence.

### Both Patterns with $bindable

Svelte 5's `$bindable` rune eliminates the need for a separate `useControllableState` hook:

```svelte
<script lang="ts">
  let {
    value = $bindable(0),
    onvaluechange
  }: {
    value?: number;
    onvaluechange?: (value: number) => void;
  } = $props();
</script>

<div>
  <p>{value}</p>
  <button onclick={() => { value++; onvaluechange?.(value); }}>Increment</button>
</div>
```

**Usage:**

```svelte
<!-- Uncontrolled (uses default 0) -->
<Stepper />

<!-- Controlled via bind: -->
<script lang="ts">
  let count = $state(5);
</script>

<Stepper bind:value={count} />
```

### Prop Naming Conventions

| State Type | Bindable Prop | Default Prop | Change Callback |
|------------|---------------|--------------|-----------------|
| Generic | `value` with `$bindable()` | N/A (default in `$bindable()`) | `onvaluechange` |
| Open/Close | `open` with `$bindable()` | N/A (default in `$bindable()`) | `onopenchange` |

> **Note:** Svelte 5 uses lowercase event handler props (`onvaluechange`, `onopenchange`) following HTML convention, unlike React's camelCase (`onValueChange`).

### Complete Example: Toggle

```svelte
<script lang="ts">
  let {
    checked = $bindable(false),
    oncheckedchange,
    disabled = false
  }: {
    checked?: boolean;
    oncheckedchange?: (checked: boolean) => void;
    disabled?: boolean;
  } = $props();
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  {disabled}
  onclick={() => { if (!disabled) { checked = !checked; oncheckedchange?.(checked); } }}
>
  {checked ? 'On' : 'Off'}
</button>
```

### Best Practices

**1. Use `$bindable()` for Optional State:**

```svelte
<script lang="ts">
  let {
    value = $bindable(0),
    onvaluechange
  }: {
    value?: number;
    onvaluechange?: (value: number) => void;
  } = $props();
</script>
```

**2. Provide Sensible Defaults:**

The default in `$bindable(defaultValue)` serves as the uncontrolled initial value:

```svelte
let { value = $bindable(0) } = $props();
```

**3. Fire onChange in Both Modes:**

```svelte
<button onclick={() => { value++; onvaluechange?.(value); }}>
  Increment
</button>
```

**4. Use `$derived` for Computed State:**

```svelte
<script lang="ts">
  let { value = $bindable(0) } = $props();
  let doubled = $derived(value * 2);
</script>

<p>{value} doubled is {doubled}</p>
```

### Key Benefits

1. **Flexibility** - Works in both controlled and uncontrolled modes
2. **Developer Experience** - Simple API for simple cases, `bind:` for powerful
3. **Consistency** - Built into the framework, no external hooks needed
4. **Compile-time Safety** - Runes are compiled, no runtime overhead

---

## 7. Types

**Impact: HIGH**

Type-safe, flexible component interfaces

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

---

## 8. Polymorphism

**Impact: MEDIUM**

Flexible element rendering

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

---

## 9. As-Child

**Impact: MEDIUM**

Svelte snippets eliminate the need for asChild

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

---

## 10. Data Attributes

**Impact: LOW**

Clean state-based styling patterns

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

---

## 11. Styling

**Impact: HIGH**

Predictable, maintainable styling patterns

Use Tailwind CSS with intelligent class merging (`tailwind-merge`), conditional classes (`clsx`), and variant APIs (CVA).

### The `cn` Utility Function

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why:** Without `tailwind-merge`, conflicting classes both apply. The `cn` utility resolves conflicts intelligently.

### Class Merging

**Incorrect:**
```svelte
<!-- Without tailwind-merge, conflicting classes both apply -->
<div class="bg-red-500 bg-blue-500" />  <!-- Both classes apply -->
<div class="px-4 py-2 px-8" />         <!-- Both px-4 and px-8 apply -->
```

**Correct:**
```typescript
twMerge('bg-red-500', 'bg-blue-500'); // "bg-blue-500"
twMerge('px-4 py-2', 'px-8');         // "py-2 px-8"
twMerge('text-sm', 'text-lg');        // "text-lg"
```

### Component Pattern: Order Matters

Apply classes in this order:

1. **Base styles** (always applied)
2. **Variant styles** (based on props)
3. **Conditional styles** (based on state)
4. **User overrides** (className prop)

**Incorrect:**
```svelte
<!-- Wrong order: variant overrides user className -->
<script lang="ts">
  let { className, variant, ...props } = $props();
</script>

<div class={cn(className, variant === 'primary' && 'bg-blue-500')} {...props} />
```

**Correct:**
```svelte
<script lang="ts">
  import { cn } from '$lib/utils';

  let { className, variant, isActive, ...props }: {
    className?: string;
    variant?: 'primary' | 'secondary';
    isActive?: boolean;
  } = $props();
</script>

<div
  class={cn(
    'rounded-lg border bg-white shadow-sm',  // 1. Base
    variant === 'primary' && 'bg-blue-500',  // 2. Variants
    isActive && 'ring-2 ring-blue-500',       // 3. Conditionals
    className                                  // 4. User overrides
  )}
  {...props}
/>
```

### Svelte 5 Class Syntax

Svelte 5 has built-in support for class arrays and objects — you can use these instead of or alongside `cn`:

```svelte
<!-- Array syntax -->
<div class={['base', isActive && 'active', className]} />

<!-- Object syntax -->
<div class={{ 'base': true, 'active': isActive, [className]: !!className }} />

<!-- With cn for tailwind-merge -->
<div class={cn('base', isActive && 'active', className)} />
```

### Conditional Classes with `clsx`

```svelte
<!-- All work in Svelte 5 templates -->
class={cn('base', isActive && 'active')}
class={cn('base', { 'active': isActive, 'disabled': isDisabled })}
class={cn(['base', isLarge ? 'text-lg' : 'text-sm'])}
```

### Class Variance Authority (CVA)

For components with multiple variants:

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';
  import { cva, type VariantProps } from 'class-variance-authority';

  const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all",
    {
      variants: {
        variant: {
          default: "bg-blue-500 text-white hover:bg-blue-600",
          destructive: "bg-red-500 text-white hover:bg-red-600",
          outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
          ghost: "hover:bg-gray-100",
        },
        size: {
          default: "h-9 px-4 py-2",
          sm: "h-8 px-3 text-sm",
          lg: "h-10 px-6",
          icon: "h-9 w-9",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  );

  let {
    className,
    variant,
    size,
    ...props
  }: import('svelte/elements').HTMLButtonAttributes & VariantProps<typeof buttonVariants> = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), className)} {...props}>
  {@render children?.()}
</button>
```

**Key points:**
- Define CVA variants **outside** the component
- Use `VariantProps<typeof variants>` for TypeScript types
- Always merge with `className` prop using `cn`

### Best Practices

**1. Extract Repeated Patterns:**

```typescript
export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
export const disabled = 'disabled:pointer-events-none disabled:opacity-50';
```

**2. Use CSS Variables for Dynamic Values:**

**Incorrect:**
```svelte
<!-- Dynamic class generation (not detected by Tailwind) -->
<div class={`bg-[${dynamicColor}]`} />
```

**Correct:**
```svelte
<!-- CSS variables (inline style or -- style props) -->
<div class="bg-[var(--color)]" style="--color: {dynamicColor}" />
```

**3. Document Variants:**

```typescript
type ButtonProps = {
  /** The visual style @default "default" */
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  /** The size @default "default" */
  size?: 'sm' | 'default' | 'lg' | 'icon';
};
```

### Common Patterns

**State-Based Styling:**

```svelte
<div
  class={cn(
    'transition-all',
    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  )}
/>
```

**CVA with Additional Conditionals:**

```svelte
<div
  class={cn(
    baseVariants({ variant, size }),
    isActive && 'ring-2 ring-blue-500',
    isDisabled && 'opacity-50 cursor-not-allowed',
    className
  )}
/>
```

---

## 12. Design Tokens

**Impact: MEDIUM**

Flexible theming and consistency

Use semantic design tokens instead of hardcoded colors. Design tokens separate what something is from how it looks.

### Variable Architecture

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
}
```

### Token Naming

**Base Tokens:**
- `--background` - Main page background
- `--foreground` - Primary text color
- `--muted` - Subtle backgrounds
- `--muted-foreground` - Text on muted
- `--border` - Border colors
- `--ring` - Focus ring

**Semantic Tokens:**
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--destructive` / `--destructive-foreground`
- `--accent` / `--accent-foreground`

### Usage in Components

**Correct (semantic tokens):**

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</button>
```

**Incorrect (hardcoded colors):**

```tsx
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Click me
</button>
```

### Component Examples

```tsx
// Card
<div className="bg-background border border-border rounded-lg p-6">
  <h2 className="text-foreground font-semibold">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// Button variants
<button className="bg-primary text-primary-foreground">Primary</button>
<button className="bg-secondary text-secondary-foreground">Secondary</button>
<button className="bg-destructive text-destructive-foreground">Delete</button>

// Input
<input className="bg-background border border-border text-foreground placeholder:text-muted-foreground" />
```

### Dark Mode

Override tokens in `.dark` class:

```css
:root { --background: oklch(1 0 0); --foreground: oklch(0.145 0 0); }
.dark { --background: oklch(0.145 0 0); --foreground: oklch(0.985 0 0); }
```

Components automatically adapt because they reference tokens.

### Color Format: OKLCH

Use `oklch()` for better color manipulation:

```css
/* ✅ OKLCH - perceptually uniform */
--primary: oklch(0.5 0.2 250);

/* ⚠️ RGB/HSL - harder to manipulate */
--primary: rgb(100, 150, 200);
```

### Best Practices

1. **Never hardcode colors** - Always use design tokens
2. **Use semantic names** - `--primary`, not `--blue-600`
3. **Keep tokens minimal** - Start with base set, add when needed
4. **Document token purpose** - Add comments
5. **Test theme switching** - Ensure all components work in light/dark
6. **Maintain contrast** - Ensure WCAG contrast ratios

### Theme Variants

```css
:root { --primary: oklch(0.5 0.2 250); }
[data-theme="brand-b"] { --primary: oklch(0.5 0.2 120); }
[data-theme="brand-c"] { --primary: oklch(0.5 0.2 0); }
```

### Migration

```tsx
// Before
<div className="bg-white text-gray-900 border-gray-200">Content</div>

// After
<div className="bg-background text-foreground border-border">Content</div>
```

---

## 13. Documentation

**Impact: MEDIUM**

Adoption and developer experience

Create documentation that makes components accessible and easy to use.

### Essential Sections

#### 1. Overview

Brief introduction explaining what the component does:

```markdown
# Button

A versatile button component with multiple variants and sizes. Use for primary actions, 
secondary actions, or destructive operations.
```

#### 2. Demo and Source Code

Include live demos with code:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button"
</script>

<div class="flex gap-2">
  <Button variant="default">Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
</div>
```

#### 3. Installation

Clear, copy-paste ready instructions:

```bash
# shadcn/ui CLI
npx shadcn@latest add button

# npm
npm install @acme/ui-components
```

#### 4. Features

List key capabilities:

```markdown
## Features

- **Customizable** – Adjust styles, sizes, and behavior
- **Accessible** – Keyboard navigation, ARIA, screen reader support
- **Composable** – Works with other components
- **Type-safe** – Comprehensive TypeScript types
- **Theming** – Integrates with design tokens
```

#### 5. Examples

Show variants, states, and advanced usage:

```svelte
<!-- Variants -->
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>

<!-- States -->
<Button disabled>Disabled</Button>
<Button>Loading...</Button>

<!-- With icon -->
<Button><Icon /> Save</Button>
```

#### 6. Props/API Reference

Document all props:

```markdown
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary" \| "destructive"` | `"default"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |
| `disabled` | `boolean` | `false` | Disabled state |
| `onclick` | `(event: MouseEvent) => void` | - | Click handler |
```

#### 7. Accessibility

Document a11y features:

```markdown
## Accessibility

- **Keyboard** - Enter/Space activation
- **ARIA** - Proper roles and attributes
- **Focus** - Visible `:focus-visible` indicators
- **Contrast** - WCAG AA (4.5:1)
```

#### 8. Changelog

Track versions:

```markdown
## Changelog

### v2.0.0
**Breaking:** `variant` uses `"default"` instead of `"primary"`

### v1.2.0
- Added `isLoading` prop
- Added `icon` prop
```

### Best Practices

**Use Real-World Examples:**

```svelte
<!-- ✅ Real-world -->
<script lang="ts">
  let { user }: { user: { name: string; id: string } } = $props();
</script>

<Card.Root>
  <Card.Header><Card.Title>{user.name}</Card.Title></Card.Header>
  <Card.Content>
    <Button onclick={() => editUser(user.id)}>Edit Profile</Button>
  </Card.Content>
</Card.Root>

<!-- ❌ Too abstract -->
<Button onclick={handleClick}>Button</Button>
```

**Include Troubleshooting:**

```markdown
## Troubleshooting

**Button not responding:**
- Ensure `onclick` handler is provided
- Check if `disabled` is set
- Verify no parent is capturing events
```

**Link Related Components:**

```markdown
## Related

- [`IconButton`](/components/icon-button)
- [`ButtonGroup`](/components/button-group)
```

**Make Examples Runnable:**

```svelte
<!-- ✅ Complete, runnable -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button"

  let count = $state(0);
</script>

<Button onclick={() => count++}>Count: {count}</Button>
```

### Documentation Checklist

- [ ] Clear overview
- [ ] Live demo
- [ ] Installation instructions
- [ ] Feature list
- [ ] Multiple examples
- [ ] Complete API reference
- [ ] Accessibility docs
- [ ] Changelog
- [ ] Troubleshooting
- [ ] Related components
- [ ] All examples runnable

---

## 14. Registry

**Impact: LOW**

Source code distribution

Registries distribute **source code**, not compiled packages. This enables true component ownership and customization.

### Core Concept

**Bad:**
```typescript
// Traditional npm - compiled dependency
import { Button } from 'some-ui-library';
```

**Good:**
```typescript
// Registry-based - source code in your project
import { Button } from '@/components/ui/button';
```

### Registry Metadata Format

**Bad:**
```json
{
  "name": "announcement",
  "type": "registry:component",
  "description": "A compound badge component"
  // Missing dependencies, registryDependencies, files, and category
}
```

**Good:**
```json
{
  "name": "announcement",
  "type": "registry:component",
  "description": "A compound badge component",
  "dependencies": ["class-variance-authority", "lucide-svelte"],
  "registryDependencies": ["badge"],
  "files": [
    {
      "type": "registry:component",
      "path": "announcement.svelte",
      "content": "..."
    }
  ],
  "category": "ui"
}
```

### Quick Publishing

**1. Create structure:**

```
my-component/
├── public/
│   └── metric-card.json
└── vercel.json
```

**2. Configure headers (`vercel.json`):**

**Example:**
```json
{
  "headers": [
    {
      "source": "/(.*).json",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Content-Type", "value": "application/json" }
      ]
    }
  ]
}
```

**3. Deploy:**

**Example:**
```bash
vercel --prod
```

**4. Users install via:**

**Example:**
```bash
npx shadcn@latest add https://your-project.vercel.app/metric-card.json
```

### Component JSON Structure

**Example:**
```json
{
  "name": "metric-card",
  "type": "registry:component",
  "description": "Display metrics with icon and trend",
  "dependencies": ["lucide-svelte"],
  "registryDependencies": ["card"],
  "files": [
    {
      "type": "registry:component",
      "path": "metric-card.svelte",
      "content": "<script>import { Card } from '@/components/ui/card'</script>"
    }
  ],
  "category": "ui"
}
```

### Registry vs npm

| Aspect | Registry | npm |
|--------|----------|-----|
| Distribution | Source code | Compiled |
| Ownership | Full control | Dependency lock |
| Customization | Modify freely | Fork/override |
| Updates | Manual copy | `npm update` |
| Bundle size | Only what you use | Full package |

### Best Practices

**For Authors:**
1. Document dependencies
2. Version components
3. Provide examples
4. Test compatibility
5. Use semantic naming

**For Consumers:**
1. Review source code
2. Check dependencies
3. Customize freely
4. Track updates
5. Test thoroughly

### When to Use

**Use registries when:**
- Sharing with community
- Users need source ownership
- Building for specific frameworks
- Quick distribution needed

**Use npm when:**
- Distributing compiled code
- Need version management
- Framework-agnostic libraries
- Complex build processes

---

## 15. NPM

**Impact: LOW**

Traditional package distribution

Distribute components as npm packages for stable, versioned dependencies with centralized updates.

### When to Use NPM

Choose npm when:
- Users need stable, versioned dependencies
- Centralized control over updates
- Automatic dependency resolution
- Users don't need source code access

### Package Configuration

**Bad:**
```json
{
  "name": "@acme/ui-components",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "svelte": "^5.0.0"
  }
}
```
Missing `exports` field, pointing to source files instead of built dist, and including Svelte in dependencies instead of peerDependencies.

**Correct:**
```json
{
  "name": "@acme/ui-components",
  "version": "1.0.0",
  "description": "Accessible Svelte components",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "svelte-package",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "dependencies": {
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

**Key points:**
- Use `exports` for modern module resolution
- Include ESM (`module`) and CommonJS (`main`)
- Specify `types` for TypeScript
- Use `peerDependencies` for Svelte
- Limit published files with `files` array

### Tailwind Configuration

**Critical:** Document this requirement for Tailwind-based components:

**Example:**
```css
@import "tailwindcss";

/* Users must add this to scan your package */
@source "../node_modules/@acme/ui-components";
```

### Build and Publish

**Example:**
```json
{
  "scripts": {
    "build": "svelte-package src/index.ts --format cjs,esm --dts",
    "prepublishOnly": "npm run build"
  }
}
```

**Steps:**
1. Build (`npm run build`)
2. Verify `dist` contents
3. Update version (`npm version patch|minor|major`)
4. Publish (`npm publish`)

### Trade-offs

**Source Code:**
- Users cannot modify directly
- Bug fixes require package updates
- Customization limited to exposed API

**Bundle Size:**
- All components included
- Tree-shaking helps but imperfect

**Customization:**
- Work within exposed API only
- Forking required for deep changes

### Usage

**Example:**
```bash
npm install @acme/ui-components
```

```svelte
<script lang="ts">
  import { Button } from '@acme/ui-components';
</script>

<!-- Pre-built, versioned code from node_modules -->
<Button>Click me</Button>
```

### Choosing Distribution

**npm when:**
- Stable, versioned dependencies needed
- Centralized updates preferred
- Source access not required

**Registry when:**
- Source code access needed
- Customization beyond props important
- Copy-paste workflow preferred

Consider offering both to let developers choose.

---

## 16. Marketplaces

**Impact: LOW**

Centralized discovery and distribution

Marketplaces like [21st.dev](https://21st.dev) combine registry accessibility with package repository discoverability.

### When to Use

**For Publishing:**
- Share without managing infrastructure
- Reach built-in audience
- Monetize your work
- Get community feedback

**For Consuming:**
- Curated discovery by category
- Quality assurance
- Unified tooling

### Installation Pattern

```bash
npx shadcn@latest add https://21st.dev/r/<author>/<component>
```

Example:
```bash
npx shadcn@latest add https://21st.dev/r/haydenbleasel/dialog-stack
```

### What Marketplaces Provide

1. **Hosting** - No infrastructure management
2. **Unified CLI** - Same installation pattern
3. **Previews** - Live demos and examples
4. **Discovery** - Search, categories, recommendations

### Publishing Requirements

Ensure components have:
- Comprehensive documentation
- Multiple demo variations
- Responsive design
- Cross-browser testing
- Accessibility compliance
- Production-ready code

**Bad:**
```json
{
  "name": "my-component",
  "description": "A component",
  "demos": []
}
```
Incomplete documentation, no demos, minimal description - marketplace users can't evaluate quality.

**Good:**
```json
{
  "name": "dialog-stack",
  "description": "A composable dialog system with stack management, keyboard navigation, and focus trapping",
  "demos": [
    {
      "title": "Basic Dialog",
      "description": "Simple modal dialog with close button",
      "code": "..."
    },
    {
      "title": "Nested Dialogs",
      "description": "Multiple dialogs in a stack",
      "code": "..."
    },
    {
      "title": "Form Dialog",
      "description": "Dialog with form validation",
      "code": "..."
    }
  ],
  "documentation": {
    "props": "...",
    "examples": "...",
    "accessibility": "..."
  }
}
```
Comprehensive documentation, multiple demo variations, clear descriptions - enables proper evaluation.

### Benefits

**For Authors:**
- Distribution without infrastructure
- Built-in audience and discovery
- Monetization opportunities
- Community feedback (ratings, comments)

**For Consumers:**
- Curated discovery by category
- Quality assurance through reviews
- Unified installation tooling

### Challenges

**For Authors:**
- Competition and visibility
- Platform dependency
- Quality pressure

**For Consumers:**
- Variable quality despite reviews
- Lock-in concerns
- Discovery paradox (too much choice)

### Best Practices

**When Publishing:**
1. Only publish production-ready components
2. Document thoroughly
3. Create multiple demos
4. Test extensively
5. Maintain actively
6. Engage with community

**When Consuming:**
1. Evaluate before installing
2. Test in your environment
3. Check maintenance status
4. Review code quality
5. Consider alternatives

### Discovery Categories

```
Browse by category:
├── Marketing (Heroes, Pricing, Testimonials)
├── Application (Dashboards, Forms, Data Display)
└── E-commerce (Product Cards, Cart, Checkout)
```

### Due Diligence

Always check:
- Component age and last update
- Documentation quality
- Author reputation
- Dependencies and compatibility
- Test in your environment

---
