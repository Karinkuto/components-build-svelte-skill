# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions that extend agent capabilities for building modern UI components.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Available Skills

### components-build

Build modern, composable, and accessible React UI components following the [components.build](https://components.build) specification. Contains 16 rule categories covering everything from core principles to distribution, co-authored by Hayden Bleasel and shadcn.

**Use when:**
- Creating new React components or component libraries
- Designing component APIs and prop interfaces
- Implementing accessibility features
- Building composable component architectures
- Styling components with Tailwind CSS and CVA
- Publishing components to registries or npm

**Categories covered:**
- Overview (specification scope and goals)
- Principles (composition, accessibility, customization, transparency)
- Definitions (primitive, compound, headless terminology)
- Composition (root, item, trigger, content patterns)
- Accessibility (semantic HTML, keyboard, ARIA, focus management)
- State (controlled/uncontrolled patterns)
- Types (extending HTML attributes, exporting prop types)
- Polymorphism (element switching with `as` prop)
- As-Child (Radix Slot composition pattern)
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

## Installation

### Claude Code

```bash
cp -r skills/components-build ~/.claude/skills/
```

### claude.ai

Add the skill to project knowledge or paste SKILL.md contents into the conversation.

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Build me a composable Tabs component
```
```
Review this component for accessibility issues
```
```
Help me implement controlled/uncontrolled state pattern
```
```
Set up component variants with CVA
```

## Skill Structure

Each skill contains:
- `SKILL.md` - Instructions for the agent
- `AGENTS.md` - Full compiled document with all rules expanded
- `rules/` - Individual rule categories

## Authors

Co-authored by:
- **Hayden Bleasel** ([@haydenbleasel](https://x.com/haydenbleasel))
- **shadcn** ([@shadcn](https://x.com/shadcn))

Adapted as an AI skill by:
- **Jordan Gilliam** ([@nolansym](https://x.com/nolansym))

## License

MIT
