# Components Build Skill (Svelte 5)

An agent skill for building modern, composable, and accessible **Svelte 5** UI components following the [components.build](https://components.build) specification. Co-authored by Hayden Bleasel and shadcn, adapted for Svelte 5 runes and snippets.

## Overview

This skill provides comprehensive guidelines across 16 categories covering everything from core principles to component distribution. It teaches agents how to build Svelte 5 components that are:

- **Composable** - Break complex components into sub-components with snippets
- **Accessible** - Keyboard navigation, screen readers, ARIA
- **Customizable** - Extend HTML attributes, support theming
- **Type-safe** - TypeScript patterns with `svelte/elements`

## Structure

```
components-build-svelte/
├── SKILL.md              # Skill definition (loaded by agents)
├── AGENTS.md             # Compiled rules (generated)
├── metadata.json         # Version, organization, references
├── README.md             # This file
└── rules/                # Individual rule files
    ├── _sections.md      # Section metadata and ordering
    ├── _template.md      # Template for new rules
    ├── overview.md       # Specification overview
    ├── principles.md     # Core design philosophy
    ├── definitions.md    # Common terminology
    ├── composition.md    # Snippets, createContext, compound components
    ├── accessibility.md  # Keyboard, screen readers, ARIA
    ├── state.md          # $state, $derived, $bindable patterns
    ├── types.md          # svelte/elements HTMLAttributes
    ├── polymorphism.md   # <svelte:element> for element switching
    ├── as-child.md       # Why Svelte 5 doesn't need asChild
    ├── data-attributes.md # data-state and data-slot
    ├── styling.md        # Tailwind CSS, cn, CVA
    ├── design-tokens.md  # CSS variables and theming
    ├── documentation.md  # JSDoc and usage examples
    ├── registry.md       # Component registry structure
    ├── npm.md            # Publishing to npm
    ├── marketplaces.md   # Distribution strategies
    └── svelte-migration.md # React → Svelte 5 reference
```

## Rule Categories

| # | Category | Impact | Description |
|---|----------|--------|-------------|
| 1 | Overview | MEDIUM | Specification scope, goals, and philosophy |
| 2 | Principles | HIGH | Core design philosophy (composability, accessibility, etc.) |
| 3 | Definitions | MEDIUM | Common terminology (primitive, compound, headless) |
| 4 | Composition | HIGH | Snippets, createContext, compound components |
| 5 | Accessibility | CRITICAL | Keyboard, screen readers, ARIA, focus management |
| 6 | State | HIGH | $state, $derived, $bindable patterns |
| 7 | Types | HIGH | TypeScript with svelte/elements |
| 8 | Polymorphism | MEDIUM | `<svelte:element>` for element switching |
| 9 | As-Child | MEDIUM | Why Svelte 5 doesn't need asChild |
| 10 | Data Attributes | LOW | `data-state` and `data-slot` patterns |
| 11 | Styling | HIGH | Tailwind CSS, cn, CVA |
| 12 | Design Tokens | MEDIUM | CSS variables and theming |
| 13 | Documentation | MEDIUM | JSDoc and usage examples |
| 14 | Registry | LOW | Component registry structure |
| 15 | NPM | LOW | Publishing to npm |
| 16 | Marketplaces | LOW | Distribution strategies |

## Installation

### Claude Code

```bash
cp -r skills/components-build-svelte ~/.claude/skills/
```

### Cursor

```bash
cp -r skills/components-build-svelte ~/.cursor/skills/
```

### skills.sh

```bash
npx skills add Karinkuto/components-build-svelte-skill --skill components-build-svelte
```

### claude.ai

Add `SKILL.md` to your project knowledge, or paste its contents into a conversation.

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/{category}.md`
2. Use the appropriate category prefix from `_sections.md`
3. Fill in the frontmatter:

```yaml
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: tag1, tag2
---
```

4. Include clear Incorrect/Correct code examples in Svelte 5 syntax
5. Add explanatory text and references

## Svelte 5 Key Differences from React Version

| Concept | React | Svelte 5 |
|---------|-------|----------|
| Props | `function Comp({ prop })` | `let { prop } = $props()` |
| State | `useState` | `$state()` |
| Controlled | `useControllableState` | `$bindable()` |
| Context | `createContext` + `useContext` | `createContext<T>()` (one function) |
| Dynamic element | `as` prop | `<svelte:element this={...}>` |
| Children | `children: ReactNode` | `children: Snippet` + `{@render children()}` |
| Events | `onClick` (camelCase) | `onclick` (lowercase) |
| Class merging | `cn()` utility | `cn()` utility (same) or built-in arrays |
| Unique IDs | `useId()` | `$props.id()` |

## Impact Levels

- **CRITICAL** - Must implement, major accessibility or UX impact
- **HIGH** - Significant benefits, strongly recommended
- **MEDIUM** - Moderate improvements, recommended
- **LOW** - Nice to have, incremental improvements

## Key Principles (Svelte 5)

1. **Composition over Configuration** - Break components into composable sub-components with snippets
2. **Accessibility by Default** - Not an afterthought, but a requirement
3. **Single Element Wrapping** - Each component wraps one HTML element
4. **Extend HTML Attributes** - Always extend native element props using `svelte/elements`
5. **Export Types** - Make prop types available to consumers
6. **Support Both State Patterns** - Controlled and uncontrolled with `$bindable`
7. **Intelligent Class Merging** - Use `cn()` utility with tailwind-merge
8. **Snippets over Children** - Use `{#snippet}` and `{@render}` instead of children

## References

- [components.build](https://components.build) - Original specification
- [Svelte 5 Docs](https://svelte.dev/docs/svelte-components) - Svelte 5 documentation
- [Bits UI](https://bits-ui.com) - Headless Svelte component library
- [shadcn/svelte](https://shadcn-svelte.com) - shadcn/ui for Svelte

## Authors

- **Hayden Bleasel** ([@haydenbleasel](https://x.com/haydenbleasel))
- **shadcn** ([@shadcn](https://x.com/shadcn))

Adapted as an AI skill by:
- **Jordan Gilliam** ([@nolansym](https://x.com/nolansym))

Svelte 5 adaptation by:
- **Karinkuto**

## License

MIT
