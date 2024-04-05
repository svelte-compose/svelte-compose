import { defineComposerTests } from "@svelte-compose/core";
import { options } from "./options";

export const tests = defineComposerTests({
    files: [],
    options,
    optionValues: [],
    tests: [
        {
            name: "check page switch",
            run: async ({ elementExists, click, expectUrlPath }) => {
                await elementExists(".routify-demo");
                await expectUrlPath("/");

                await click(".routify-demo .demo", true);
                await expectUrlPath("/demo");

                await click(".routify-demo .index", true);
                await expectUrlPath("/");
            },
        },
    ],
});
