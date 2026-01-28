/**
 * Configuration for the build tooling
 */

import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Base paths
export const SKILLS_DIR = join(__dirname, "../../..", "skills");
export const BUILD_DIR = join(__dirname, "..");

// Skill configurations
export interface SkillConfig {
	name: string;
	title: string;
	description: string;
	skillDir: string;
	rulesDir: string;
	metadataFile: string;
	outputFile: string;
	sectionMap: Record<string, number>;
}

export const SKILLS: Record<string, SkillConfig> = {
	"react-best-practices": {
		name: "react-best-practices",
		title: "React Best Practices",
		description: "React and Next.js codebases",
		skillDir: join(SKILLS_DIR, "react-best-practices"),
		rulesDir: join(SKILLS_DIR, "react-best-practices/rules"),
		metadataFile: join(SKILLS_DIR, "react-best-practices/metadata.json"),
		outputFile: join(SKILLS_DIR, "react-best-practices/AGENTS.md"),
		sectionMap: {
			async: 1,
			bundle: 2,
			server: 3,
			client: 4,
			rerender: 5,
			rendering: 6,
			js: 7,
			advanced: 8,
		},
	},
	"react-native-skills": {
		name: "react-native-skills",
		title: "React Native Skills",
		description: "React Native codebases",
		skillDir: join(SKILLS_DIR, "react-native-skills"),
		rulesDir: join(SKILLS_DIR, "react-native-skills/rules"),
		metadataFile: join(SKILLS_DIR, "react-native-skills/metadata.json"),
		outputFile: join(SKILLS_DIR, "react-native-skills/AGENTS.md"),
		sectionMap: {
			rendering: 1,
			"list-performance": 2,
			animation: 3,
			scroll: 4,
			navigation: 5,
			"react-state": 6,
			state: 7,
			"react-compiler": 8,
			ui: 9,
			"design-system": 10,
			monorepo: 11,
			imports: 12,
			js: 13,
			fonts: 14,
		},
	},
	"composition-patterns": {
		name: "composition-patterns",
		title: "React Composition Patterns",
		description: "React codebases using composition",
		skillDir: join(SKILLS_DIR, "composition-patterns"),
		rulesDir: join(SKILLS_DIR, "composition-patterns/rules"),
		metadataFile: join(SKILLS_DIR, "composition-patterns/metadata.json"),
		outputFile: join(SKILLS_DIR, "composition-patterns/AGENTS.md"),
		sectionMap: {
			architecture: 1,
			state: 2,
			patterns: 3,
			react19: 4,
		},
	},
	"components-build": {
		name: "components-build",
		title: "Components.build Specification",
		description: "UI component libraries",
		skillDir: join(SKILLS_DIR, "components-build"),
		rulesDir: join(SKILLS_DIR, "components-build/rules"),
		metadataFile: join(SKILLS_DIR, "components-build/metadata.json"),
		outputFile: join(SKILLS_DIR, "components-build/AGENTS.md"),
		sectionMap: {
			overview: 1,
			principles: 2,
			definitions: 3,
			composition: 4,
			accessibility: 5,
			state: 6,
			types: 7,
			polymorphism: 8,
			"as-child": 9,
			"data-attributes": 10,
			styling: 11,
			"design-tokens": 12,
			documentation: 13,
			registry: 14,
			npm: 15,
			marketplaces: 16,
		},
	},
};

// Default skill (for backwards compatibility)
export const DEFAULT_SKILL = "components-build";

// Legacy exports for backwards compatibility
export const SKILL_DIR = SKILLS[DEFAULT_SKILL].skillDir;
export const RULES_DIR = SKILLS[DEFAULT_SKILL].rulesDir;
export const METADATA_FILE = SKILLS[DEFAULT_SKILL].metadataFile;
export const OUTPUT_FILE = SKILLS[DEFAULT_SKILL].outputFile;

// Test cases are build artifacts, not part of the skill
export const TEST_CASES_FILE = join(BUILD_DIR, "test-cases.json");
