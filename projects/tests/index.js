#!/usr/bin/env node

import { testComposers } from "@svelte-compose/testing-library";
import { getComposerList } from "@svelte-compose/cli/website";
import { remoteControl } from "@svelte-compose/core/internal";
import path from "path";

/** @type {import("../testing-library/index.js").TestOptions} */
const testOptions = {
    headless: true,
    pauseExecutionAfterBrowser: false,
    outputDirectory: path.join(process.cwd(), "projects", "tests", ".outputs"),
};

test();

async function test() {
    const composersToTest = process.argv.slice(2);
    if (composersToTest && composersToTest.length > 0) console.log("Only testing the following composers", composersToTest);

    await executeTests(composersToTest);
}

/**
 * Executes the tests
 * @param {string[]} composersToTest
 */
async function executeTests(composersToTest) {
    const filterComposers = composersToTest && composersToTest.length > 0;
    const composerNames = await getComposerList();

    /** @type {import("@svelte-compose/core/composer/config.js").ComposerWithoutExplicitArgs[]} */
    const composers = [];

    for (const composerName of composerNames) {
        if (filterComposers && !composersToTest.includes(composerName)) continue;

        composers.push(await getComposer(composerName));
    }

    await testComposers(composers, testOptions);
}

/**
 * Fetches the composer and all it's details
 * @param {string} composerName
 * @returns
 */
async function getComposer(composerName) {
    remoteControl.enable();

    const composerModule = await import(`../composers/${composerName}/build/index.js`);
    /** @type {import("@svelte-compose/core/composer/config.js").ComposerWithoutExplicitArgs} */
    const composer = composerModule.default;

    remoteControl.disable();

    return composer;
}
