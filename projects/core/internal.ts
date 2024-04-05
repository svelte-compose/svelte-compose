import * as remoteControl from "./composer/remoteControl.js";
import { executeComposer, determineWorkingDirectory } from "./composer/execute.js";
import { createOrUpdateFiles } from "./files/processors.js";
import { createEmptyWorkspace, populateWorkspaceDetails } from "./utils/workspace.js";
import { detectOrCreateProject } from "./utils/create-project.js";
import { PromptOption, endPrompts, multiSelectPrompt, textPrompt, startPrompts } from "./utils/prompts.js";

export {
    remoteControl,
    createOrUpdateFiles,
    createEmptyWorkspace,
    executeComposer,
    populateWorkspaceDetails,
    determineWorkingDirectory,
    detectOrCreateProject,
    PromptOption,
    endPrompts,
    multiSelectPrompt,
    textPrompt,
    startPrompts,
};
