#!/usr/bin/env node

import {
    PromptOption,
    endPrompts,
    multiSelectPrompt,
    startPrompts,
    detectOrCreateProject,
    determineWorkingDirectory,
    executeComposer,
    remoteControl,
} from "@svelte-compose/core/internal";
import { getComposerList, groupBy } from "./website";
import { program } from "commander";
import { categories } from "@svelte-compose/core";
import { RemoteControlOptions } from "@svelte-compose/core/composer/remoteControl";
import { ComposerWithoutExplicitArgs } from "@svelte-compose/core/composer/config";
import pkg from "./package.json";

executeCli();

async function executeCli() {
    console.log(`${pkg.name}@${pkg.version}`);

    remoteControl.enable();

    const composersList = await getComposerList();
    const composers = [];

    for (const composerName of composersList) {
        composers.push(await getComposerConfig(composerName));
    }

    const options = prepareCli(composers);
    let composersToApply = options.composer as string[];
    if (!composersToApply || composersToApply.length == 0) {
        composersToApply = await askForComposersToApply(composers);
    }
    const filteredComposers = composers.filter((x) => composersToApply.includes(x.config.metadata.id));

    let workingDirectory = determineWorkingDirectory(options);
    workingDirectory = await detectOrCreateProject(workingDirectory);

    for (const composer of filteredComposers) {
        const composerId = composer.config.metadata.id;
        const composerOptions = {};
        for (const [key, value] of Object.entries(options)) {
            if (!key || !key.startsWith(composerId)) continue;

            const optionKey = lowercaseFirstLetter(key.replace(composerId, ""));

            let optionValue = value;
            if (optionValue === "true") optionValue = true;
            else if (optionValue === "false") optionValue = false;

            composerOptions[optionKey] = optionValue;
        }

        const remoteControlledOptions: RemoteControlOptions = {
            workingDirectory,
            optionValues: composerOptions,
        };

        await executeComposer(composer.config, composer.checks, remoteControlledOptions);
    }

    remoteControl.disable();
}

function lowercaseFirstLetter(string: string) {
    return string.charAt(0).toLocaleLowerCase() + string.slice(1);
}

async function getComposerConfig(name: string) {
    const composer = await import(`../composers/${name}/build/index.js`);

    return composer.default as ComposerWithoutExplicitArgs;
}

function prepareCli(composers: ComposerWithoutExplicitArgs[]) {
    program.option("--path <string>", "Path to working directory");
    program.option("--composer <string...>", "List of composers to install");

    for (const composer of composers) {
        const composerId = composer.config.metadata.id;
        for (const [key, value] of Object.entries(composer.config.options)) {
            program.option(`--${composerId}-${key} <string>`, value.question);
        }
    }

    program.parse();
    const options = program.opts();

    return options;
}

async function askForComposersToApply(composers: ComposerWithoutExplicitArgs[]): Promise<string[]> {
    startPrompts("Please select the tools you want to add");

    const groupedByCategory = groupBy(composers, (x) => x.config.metadata.category.id);
    const selectedComposers: string[] = [];
    const totalCategories = Object.keys(categories).length;
    let currentCategory = 0;

    for (const [categoryId, composers] of groupedByCategory) {
        currentCategory++;
        const categoryDetails = categories[categoryId];

        const promptOptions: PromptOption[] = [];
        for (const composer of composers) {
            const composerMetadata = composer.config.metadata;
            promptOptions.push({
                label: composerMetadata.name,
                value: composerMetadata.id,
                hint: composerMetadata.description,
            });
        }

        const promptDescription = `${categoryDetails.name} (${currentCategory} / ${totalCategories})`;
        const selectedValues = await multiSelectPrompt(promptDescription, promptOptions);
        selectedComposers.push(...selectedValues);
    }

    endPrompts("Thanks!");

    return selectedComposers;
}
