import { ComposerWithoutExplicitArgs } from "@svelte-compose/core/composer/config";
import { generateTestCases, runTestCases } from "./utils/test-cases";
import { rm } from "fs/promises";
import { getTemplatesDirectory } from "./utils/workspace";
import { downloadProjectTemplates } from "./utils/create-project";
import { remoteControl } from "@svelte-compose/core/internal";

export type TestOptions = {
    headless: boolean;
    pauseExecutionAfterBrowser: boolean;
    outputDirectory: string;
};

export async function testComposer(composer: ComposerWithoutExplicitArgs, options: TestOptions) {
    await testComposers([composer], options);
}

export async function testComposers(composers: ComposerWithoutExplicitArgs[], options: TestOptions) {
    await prepareTests(options);

    remoteControl.enable();
    await executeTests(composers, options);
    remoteControl.disable();
}

export async function executeTests(composers: ComposerWithoutExplicitArgs[], options: TestOptions) {
    console.log("generating test cases");
    let testCases = await generateTestCases(composers);

    console.log("start testing");
    await runTestCases(testCases, options);
}

async function prepareTests(options: TestOptions) {
    console.log("deleting old files");
    await rm(options.outputDirectory, { recursive: true, force: true });

    console.log("downloading project templates");
    const templatesOutputDirectory = getTemplatesDirectory(options);
    await downloadProjectTemplates(templatesOutputDirectory);
}
