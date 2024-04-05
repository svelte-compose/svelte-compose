import { defineComposerOptions } from "@svelte-compose/core";

export const options = defineComposerOptions({
    useSass: {
        question: "Do you want to use sass? (css = faster, sass = better customization)",
        type: "boolean",
        default: false,
    },
});
