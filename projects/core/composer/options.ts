import { OptionValues, program } from "commander";
import { booleanPrompt, endPrompts, startPrompts, textPrompt } from "../utils/prompts.js";
import { addPropertyToWorkspaceOption } from "../utils/workspace.js";
import { ArgType, ComposerConfig, Workspace } from "./config.js";

export function prepareAndParseCliOptions<Args extends ArgType>(config: ComposerConfig<Args>) {
    program.option("--path <string>", "Path to working directory");

    if (config.options) {
        for (const optionKey of Object.keys(config.options)) {
            const option = config.options[optionKey];

            program.option(`--${optionKey} [value]`, option.question);
        }
    }

    program.parse();
    const options = program.opts();
    return options;
}

export async function askQuestionsAndAssignValuesToWorkspace<Args extends ArgType>(
    config: ComposerConfig<Args>,
    workspace: Workspace<Args>,
    cliOptions: OptionValues,
) {
    if (!config.options) return;

    let needsToAskQuestions = false;
    for (const optionKey of Object.keys(config.options)) {
        const cliOption = cliOptions[optionKey];
        if (cliOption === undefined) {
            needsToAskQuestions = true;
        }
    }

    if (needsToAskQuestions) {
        startPrompts(`${config.metadata.package}@${config.metadata.version}`);
    }

    for (const optionKey of Object.keys(config.options)) {
        const cliOption = cliOptions[optionKey];
        if (cliOption !== undefined) {
            addPropertyToWorkspaceOption(workspace, optionKey, cliOption);

            continue;
        }

        const option = config.options[optionKey];
        let optionValue;

        if (option.type == "number" || option.type == "string") {
            optionValue = await textPrompt(option.question, "Not sure", "" + option.default);
        } else if (option.type == "boolean") {
            optionValue = await booleanPrompt(option.question, option.default);
        }

        addPropertyToWorkspaceOption(workspace, optionKey, optionValue);
    }

    if (needsToAskQuestions) {
        endPrompts(`You're all set!`);
    }
}

export function ensureCorrectOptionTypes<Args extends ArgType>(config: ComposerConfig<Args>, workspace: Workspace<Args>) {
    if (!config.options) {
        return;
    }

    let foundInvalidType = false;

    for (const optionKey of Object.keys(config.options)) {
        const option = config.options[optionKey];
        const value = workspace.options[optionKey];

        if (option.type == "boolean" && typeof value == "boolean") {
            continue;
        } else if (option.type == "number" && typeof value == "number") {
            continue;
        } else if (
            option.type == "number" &&
            typeof value == "string" &&
            typeof parseInt(value) == "number" &&
            !isNaN(parseInt(value))
        ) {
            addPropertyToWorkspaceOption(workspace, optionKey, parseInt(value));
            continue;
        } else if (option.type == "string" && typeof value == "string") {
            continue;
        }

        foundInvalidType = true;
        console.log(`Option ${optionKey} needs to be of type ${option.type} but was of type ${typeof value}!`);
    }

    if (foundInvalidType) {
        process.exit(0);
    }
}
