import { defineComposerOptions } from "@svelte-compose/core";

export const options = defineComposerOptions({
    typography: {
        question: "Do you want to use typography plugin?",
        default: false,
        type: "boolean",
    },
});
