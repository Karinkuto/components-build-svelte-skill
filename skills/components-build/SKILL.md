---
name: components-build
description: Open-source specification for building modern, composable, and accessible UI components. Use when creating React components, designing component APIs, building component libraries, implementing accessibility, setting up styling systems with design tokens, or publishing components via registries or npm. Applies to tasks involving primitives, styled components, blocks, templates, and patterns.
---

# Components.build Specification

Standard for building modern, composable UI components. Co-authored by Hayden Bleasel and shadcn.

## Core Principles

1. **Composability** - Build components that combine and nest to create complex UIs. Expose clear APIs via props/slots.
2. **Accessible by Default** - Use semantic HTML, WAI-ARIA attributes, keyboard navigation, and focus management.
3. **Customizable** - Avoid hard-coded styles. Provide CSS variables, class names, and style props.
4. **Lightweight** - Minimize dependencies and unnecessary re-renders.
5. **Transparent** - Components should not be black boxes. Source code should be inspectable and modifiable.
6. **Well-documented** - Clear documentation with examples, props, and accessibility notes.

## Artifact Taxonomy

| Type | Description | Styled? | Reusable? |
|------|-------------|---------|-----------|
| **Primitive** | Behavior + a11y, no styling (Radix UI, React Aria) | No | Yes |
| **Component** | Styled UI unit wrapping primitives | Yes | Yes |
| **Pattern** | Documented solution for UI/UX problems | N/A | Reference only |
| **Block** | Production-ready composition for specific use case | Yes | Copy-paste |
| **Page** | Complete single-route view composed of blocks | Yes | No |
| **Template** | Multi-page scaffold with routing and providers | Yes | Fork |
| **Utility** | Non-visual helper (hooks, class utilities) | N/A | Yes |

**Classification flow:**
1. Single behavior/a11y, no styling? → Primitive
2. Styled, reusable UI element? → Component
3. Concrete product use case with opinionated composition? → Block
4. Multi-page scaffold with routing? → Template
5. Recurring solution documentation? → Pattern
6. Non-visual logic? → Utility

## Component Composition Pattern

Break monolithic components into focused sub-components:

```tsx
// ❌ Monolithic - hard to customize
<Accordion data={data} />

// ✅ Composable - each layer customizable
<Accordion.Root open={open} setOpen={setOpen}>
  {data.map((item) => (
    <Accordion.Item key={item.title}>
      <Accordion.Trigger>{item.title}</Accordion.Trigger>
      <Accordion.Content>{item.content}</Accordion.Content>
    </Accordion.Item>
  ))}
</Accordion.Root>
```

**Naming conventions:**
- `Root` - Main container, manages state/context
- `Trigger` - Element that initiates action
- `Content` - Main content area
- `Header/Body/Footer` - Structural sections
- `Title/Description` - Informational components

## Type Patterns

Always extend native HTML attributes:

```tsx
export type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = ({ variant = 'primary', size = 'md', ...props }: ButtonProps) => (
  <button {...props} />
);
```

**Rules:**
- Each component wraps a single HTML/JSX element
- Always spread props last: `<div className="default" {...props} />`
- Export prop types as `ComponentNameProps`
- Document custom props with JSDoc comments

## Styling with `cn` Utility

```tsx
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage - order matters: base → variants → conditionals → overrides
<div className={cn(
  'base-styles',
  variant && variantStyles,
  isActive && 'active',
  className
)} />
```

## State Management

Support both controlled and uncontrolled usage:

```tsx
import { useControllableState } from '@radix-ui/react-use-controllable-state';

type StepperProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

const Stepper = ({ value: controlledValue, defaultValue, onValueChange }: StepperProps) => {
  const [value, setValue] = useControllableState({
    prop: controlledValue,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  // ...
};
```

## Data Attributes

Use `data-state` for styling and `data-slot` for component identification:

```tsx
// data-state for visual states
<div data-state={isOpen ? 'open' : 'closed'} />

// Style with Tailwind
<Dialog className="data-[state=open]:animate-in data-[state=closed]:animate-out" />

// data-slot for parent targeting
<button data-slot="submit-button" />

// Parent can target children
<form className="[&_[data-slot=submit-button]]:w-full" />
```

## Quick Reference

| Topic | When to use | Reference |
|-------|-------------|-----------|
| Composition patterns | Breaking down complex components | See `references/build-patterns.md` |
| Accessibility | Keyboard nav, ARIA, focus management | See `references/build-patterns.md` |
| Polymorphism (`as`/`asChild`) | Changing rendered element type | See `references/build-patterns.md` |
| Design tokens | Setting up theming system | See `references/build-patterns.md` |
| CVA variants | Complex variant styling | See `references/build-patterns.md` |
| Registry publishing | Distributing via shadcn CLI | See `references/publish-patterns.md` |
| NPM publishing | Traditional package distribution | See `references/publish-patterns.md` |
| Documentation | Writing component docs | See `references/publish-patterns.md` |
