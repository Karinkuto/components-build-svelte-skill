# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions that extend agent capabilities for building modern UI components.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Available Skills

### components-build-svelte

Build modern, composable, and accessible **Svelte 5** UI components following the [components.build](https://components.build) specification. Contains 16 rule categories covering everything from core principles to distribution, co-authored by Hayden Bleasel and shadcn, adapted for Svelte 5 runes.

**Use when:**
- Creating new Svelte 5 components or component libraries
- Designing component APIs and prop interfaces with runes
- Implementing accessibility features
- Building composable component architectures with snippets
- Styling components with Tailwind CSS and CVA
- Publishing components to registries or npm

**Categories covered:**
- Overview (specification scope and goals)
- Principles (composition, accessibility, customization, transparency)
- Definitions (primitive, compound, headless terminology)
- Composition (root, item, trigger, content with snippets)
- Accessibility (semantic HTML, keyboard, ARIA, focus management)
- State (controlled/uncontrolled with $state and $bindable)
- Types (extending HTML attributes from svelte/elements)
- Polymorphism (element switching with `<svelte:element>`)
- As-Child (not needed in Svelte 5 — snippets avoid the wrapper problem)
- Data Attributes (`data-state` and `data-slot`)
- Styling (Tailwind CSS, cn utility, CVA variants)
- Design Tokens (CSS variables and theming)
- Documentation (props and usage examples)
- Registry (component registries)
- NPM (publishing packages)
- Marketplaces (distribution strategies)

**Key principles:**
1. Composition over Configuration
2. Accessibility by Default
3. Single Element Wrapping
4. Extend HTML Attributes
5. Export Types
6. Support Both State Patterns
7. Intelligent Class Merging
8. Snippets over Children

## Installation

### skills.sh

```bash
npx skills add Karinkuto/components-build-svelte-skill --skill components-build-svelte
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Build me a composable Tabs component in Svelte 5
```
```
Review this component for accessibility issues
```
```
Help me implement controlled/uncontrolled state with $bindable
```
```
Set up component variants with CVA
```

## Skill Structure

Each skill contains:
- `SKILL.md` - Instructions for the agent
- `AGENTS.md` - Full compiled document with all rules expanded
- `rules/` - Individual rule categories
- `rules/svelte-migration.md` - React to Svelte 5 migration reference

## Authors

Co-authored by:
- **Hayden Bleasel** ([@haydenbleasel](https://x.com/haydenbleasel))
- **shadcn** ([@shadcn](https://x.com/shadcn))

Adapted as an AI skill by:
- **Jordan Gilliam** ([@nolansym](https://x.com/nolansym))

Svelte 5 adaptation by:
- **Amen Segni** ([@karinkuto](https://x.com/karinkuto))

## License

MIT
