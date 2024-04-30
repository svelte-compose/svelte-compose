import { categories, defineComposerConfig, generateComposerInfo } from "@svelte-compose/core";
import pkg from "../package.json";
import { options } from "./options.js";

export const composer = defineComposerConfig({
    metadata: {
        ...generateComposerInfo(pkg),
        name: "Storybook",
        description: "Build UIs without the grunt work",
        category: categories.styling,
        environments: { kit: true, svelte: true },
        website: {
            logo: "./storybook.svg",
            keywords: ["storybook", "styling", "testing", "documentation", "storybook-svelte-csf", "svelte-csf"],
            documentation: "https://storybook.js.org/docs/get-started",
        },
    },
    options,
    type: "external",
    command: "storybook init",
});
