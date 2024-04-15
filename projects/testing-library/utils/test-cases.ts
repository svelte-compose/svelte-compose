import { getComposerList } from "@svelte-compose/cli/website";
import { ProjectTypesList } from "./create-project";
import { join } from "path";
import { runTests } from "./test";
import { uid } from "uid";
import { mkdir } from "fs/promises";
import { startDevServer, stopDevServer } from "./dev-server";
import { startBrowser, stopBrowser } from "./browser-control";
import { getTemplatesDirectory, installDependencies, prepareWorkspaceWithTemplate, saveOptionsFile } from "./workspace";
import { runComposer } from "./composer";
import { textPrompt } from "@svelte-compose/core/internal";
import * as Throttle from "promise-parallel-throttle";
import { ComposerWithoutExplicitArgs } from "@svelte-compose/core/composer/config";
import { TestOptions } from "..";
import { ArgValues, Question } from "@svelte-compose/core/composer/options";

export type TestCase = {
    template: string;
    composer: ComposerWithoutExplicitArgs;
    options: ArgValues<Record<string, Question>>;
};

export async function generateTestCases(composers: ComposerWithoutExplicitArgs[]) {
    const testCases = new Map<string, TestCase[]>();
    for (const composer of composers) {
        const composerTestCases: TestCase[] = [];
        testCases.set(composer.config.metadata.id, composerTestCases);

        for (const template of ProjectTypesList) {
            const environments = composer.config.metadata.environments;
            if ((!environments.kit && template.includes("kit")) || (!environments.svelte && template.includes("svelte"))) {
                continue;
            }

            const optionsList = composer.tests.optionValues;
            if (optionsList.length > 0) {
                for (const options of optionsList) {
                    composerTestCases.push({ composer, template, options });
                }
            } else {
                // if no explicit test cases are defined this composer
                // presumably does not have any options, so just test the default.
                const options: ArgValues<Record<string, Question>> = {};
                composerTestCases.push({ composer, template, options });
            }
        }
    }
    return testCases;
}

export async function runComposerTests(
    template: string,
    composer: ComposerWithoutExplicitArgs,
    options: ArgValues<Record<string, Question>>,
    testOptions: TestOptions,
) {
    if (!composer.tests)
        throw new Error(
            "The composer is not exporting any tests. Please make sure to properly define your tests while calling `defineComposer`",
        );

    const output = join(testOptions.outputDirectory, composer.config.metadata.id, template, uid());
    await mkdir(output, { recursive: true });

    const workingDirectory = await prepareWorkspaceWithTemplate(output, template, getTemplatesDirectory(testOptions));
    await saveOptionsFile(workingDirectory, options);

    await runComposer(composer, workingDirectory, options);

    await installDependencies(workingDirectory);

    const { url, devServer } = await startDevServer(workingDirectory);
    const { browser, page } = await startBrowser(url, testOptions.headless);

    try {
        const errorOcurred = await page.$("vite-error-overlay");
        if (errorOcurred) throw new Error("Dev server failed to start correctly. Vite errors present");

        if (testOptions.pauseExecutionAfterBrowser) {
            await textPrompt("Browser opened! Press any key to continue!");
        }

        await runTests(page, composer, options);
    } finally {
        await stopBrowser(browser, page);
        await stopDevServer(devServer);
    }
}

export type ComposerError = {
    composer: string;
    template: string;
    message: string;
};

export async function runTestCases(testCases: Map<string, TestCase[]>, testOptions: TestOptions) {
    const tasks = [];
    for (const values of testCases.values()) {
        for (const testCase of values) {
            tasks.push(async () => {
                try {
                    await runComposerTests(testCase.template, testCase.composer, testCase.options, testOptions);
                } catch (error) {
                    const composerError: ComposerError = {
                        composer: testCase.composer.config.metadata.id,
                        template: testCase.template,
                        message: error.message,
                    };
                    throw composerError;
                }
            });
        }
    }

    let totalProgress = 0;
    let overallTasks = tasks.length;
    let parallelTasks = testOptions.pauseExecutionAfterBrowser ? 1 : ProjectTypesList.length;

    const allResults = await Throttle.raw(tasks, {
        failFast: false,
        maxInProgress: parallelTasks,
        progressCallback: (result) => {
            totalProgress++;
            logTestProgress(totalProgress, overallTasks, result.amountResolved, result.amountRejected);
        },
    });

    const rejectedPromisesResult = allResults.rejectedIndexes.map((x) => allResults.taskResults[x]);
    for (const data of rejectedPromisesResult) {
        const error = data as ComposerError;
        console.log(`${error.composer} (${error.template}): ${error.message}`);
    }

    if (rejectedPromisesResult.length > 0) {
        process.exit(1);
    }
}

function logTestProgress(current: number, total: number, success: number, failed: number) {
    console.log(`Total: ${current} / ${total} Success: ${success} Failed: ${failed}`);
}
