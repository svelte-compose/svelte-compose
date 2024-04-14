import { defineComposerOptions } from "@svelte-compose/core";

export const options = defineComposerOptions({
    addDemo: {
        question: "Should we add a minimalistic demo?",
        type: "boolean",
        default: false,
    },
});
