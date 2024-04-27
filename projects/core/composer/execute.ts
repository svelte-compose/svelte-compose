import path from "path";
import { commonFilePaths, format, writeFile } from "../files/utils.js";
import { detectOrCreateProject } from "../utils/create-project.js";
import { createOrUpdateFiles } from "../files/processors.js";
import { getPackageJson } from "../utils/common.js";
import { Workspace, WorkspaceWithoutExplicitArgs, createEmptyWorkspace, populateWorkspaceDetails } from "../utils/workspace.js";
import {
    OptionDefinition,
    askQuestionsAndAssignValuesToWorkspace,
    ensureCorrectOptionTypes,
    prepareAndParseCliOptions,
} from "./options.js";
import {
    ComposerCheckConfig,
    ComposerConfig,
    InlineComposerConfig,
    PostInstallationCheck,
    PreInstallationCheck,
} from "./config.js";
import { OptionValues } from "commander";
import { RemoteControlOptions } from "./remoteControl.js";
import { suggestInstallingDependencies } from "../utils/dependencies.js";
import { spawnSync } from "child_process";

export async function executeComposer<Args extends OptionDefinition>(
    config: ComposerConfig<Args>,
    checks: ComposerCheckConfig<Args>,
    remoteControlOptions: RemoteControlOptions = undefined,
) {
    if (checks.preInstallation) {
        await runPreInstallationChecks(checks.preInstallation);
    }

    const remoteControlled = remoteControlOptions !== undefined;

    let cliOptions = {};
    let workingDirectory = "";
    if (!remoteControlled) {
        cliOptions = prepareAndParseCliOptions(config);
        workingDirectory = determineWorkingDirectory(cliOptions);
        workingDirectory = await detectOrCreateProject(workingDirectory);
    } else {
        cliOptions = remoteControlOptions.optionValues;
        workingDirectory = remoteControlOptions.workingDirectory;
    }

    const workspace = createEmptyWorkspace();
    await populateWorkspaceDetails(workspace, workingDirectory);

    await askQuestionsAndAssignValuesToWorkspace(config, workspace, cliOptions);
    ensureCorrectOptionTypes(config, workspace);

    const isInstall = true;

    if (config.type == "inline") {
        await installPackages(config, workspace);
        await createOrUpdateFiles(config.files, workspace);
        await runHooks(config, workspace, isInstall);
        if (!remoteControlled) await suggestInstallingDependencies(workingDirectory);
    } else {
        console.log("Executing external command");
        spawnSync("npx", config.command.split(" "), { stdio: "inherit", shell: true, cwd: workingDirectory });
    }

    await runPostInstallationChecks(checks.postInstallation);
}

export function determineWorkingDirectory(options: OptionValues) {
    let cwd = options.path ?? process.cwd();
    if (!path.isAbsolute(cwd)) {
        cwd = path.join(process.cwd(), cwd);
    }

    return cwd;
}

export async function installPackages(config: InlineComposerConfig<OptionDefinition>, workspace: WorkspaceWithoutExplicitArgs) {
    const content = await getPackageJson(workspace);

    for (const dependency of config.packages) {
        if (dependency.condition && !dependency.condition(workspace)) {
            continue;
        }

        if (dependency.dev) {
            if (!content.devDependencies) {
                content.devDependencies = {};
            }

            content.devDependencies[dependency.name] = dependency.version;
        } else {
            if (!content.dependencies) {
                content.dependencies = {};
            }

            content.dependencies[dependency.name] = dependency.version;
        }
    }

    const packageText = await format(workspace, commonFilePaths.packageJsonFilePath, JSON.stringify(content));
    await writeFile(workspace, commonFilePaths.packageJsonFilePath, packageText);
}

function runHooks<Args extends OptionDefinition>(
    config: InlineComposerConfig<Args>,
    workspace: Workspace<Args>,
    isInstall: boolean,
) {
    if (isInstall && config.installHook) config.installHook(workspace);
    else if (!isInstall && config.uninstallHook) config.uninstallHook(workspace);
}

export function generateComposerInfo(pkg: any): { id: string; package: string; version: string } {
    const name = pkg.name;
    const id = name.replace("@svelte-compose/", "");

    return {
        id,
        package: name,
        version: pkg.version,
    };
}

export async function runPreInstallationChecks(checks: PreInstallationCheck[]) {
    // console.log(checks);
}

export async function runPostInstallationChecks(checks: PostInstallationCheck[]) {
    // console.log(checks);
}
