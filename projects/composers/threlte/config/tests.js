import { defineComposerTests } from "@svelte-compose/core";
import { options } from "./options.js";

export const tests = defineComposerTests({
    files: [],
    options,
    optionValues: [{ addDemo: true }],
    tests: [
        {
            name: "canvas exists",
            run: async ({ elementExists, expectProperty }) => {
                await elementExists("canvas");
                await expectProperty("canvas", "height", "150px");
            },
        },
    ],
});
