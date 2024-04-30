import { defineComposerTests } from "@svelte-compose/core";
import { options } from "./options.js";

export const tests = defineComposerTests({
    options,
    optionValues: [
        { useSass: false, addJavaScript: true },
        { useSass: true, addJavaScript: true },
    ],
    files: [],
    tests: [],
});
