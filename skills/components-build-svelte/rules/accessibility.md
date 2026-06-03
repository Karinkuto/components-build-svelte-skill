---
title: Accessibility Guidelines
impact: CRITICAL
impactDescription: Essential for inclusive component design
tags: accessibility, a11y, aria, keyboard, screen-reader, focus, wcag
---

## Accessibility Guidelines

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
