import { ComposerWithoutExplicitArgs } from "@svelte-compose/core/composer/config";
import { ArgValues, Question } from "@svelte-compose/core/composer/options";
import { RemoteControlOptions } from "@svelte-compose/core/composer/remoteControl";
import {
    createEmptyWorkspace,
    createOrUpdateFiles,
    executeComposer,
    populateWorkspaceDetails,
} from "@svelte-compose/core/internal";

export async function runComposer(
    composer: ComposerWithoutExplicitArgs,
    workingDirectory: string,
    optionValues: ArgValues<Record<string, Question>>,
) {
    const remoteControlledOptions: RemoteControlOptions = { workingDirectory, optionValues };

    await executeComposer(composer.config, composer.checks, remoteControlledOptions);

    const workspace = createEmptyWorkspace();
    workspace.cwd = workingDirectory;
    workspace.options = optionValues;

    await populateWorkspaceDetails(workspace, workingDirectory);
    await createOrUpdateFiles(composer.tests.files, workspace);
}
