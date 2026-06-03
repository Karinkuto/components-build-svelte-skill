---
title: State Management Patterns
impact: HIGH
impactDescription: Flexible component APIs for all use cases
tags: state, controlled, uncontrolled, bindable, runes, $state, $derived
---

## State Management Patterns

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
