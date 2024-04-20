import { CssAstEditor, HtmlAstEditor, JsAstEditor, SvelteAstEditor } from "@svelte-compose/ast-manipulation";
import { executeComposer } from "./execute.js";
import * as remoteControl from "./remoteControl.js";
import { CategoryInfo } from "./categories.js";
import { OptionDefinition, OptionValues, Question } from "./options.js";
import { FileTypes } from "../files/processors.js";
import { Workspace } from "../utils/workspace.js";

export { CssAstEditor, HtmlAstEditor, JsAstEditor, SvelteAstEditor };

export type ConditionDefinition<Args extends OptionDefinition> = (Workspace: Workspace<Args>) => boolean;
export type ConditionDefinitionWithoutExplicitArgs = ConditionDefinition<Record<string, Question>>;

export type WebsiteMetadata = {
    logo: string;
    keywords: string[];
    documentation: string;
};

export type ComposerConfigEnvironments = {
    svelte: boolean;
    kit: boolean;
};

export type ComposerConfigMetadata = {
    id: string;
    package: string;
    version: string;
    name: string;
    description: string;
    category: CategoryInfo;
    environments: ComposerConfigEnvironments;
    website?: WebsiteMetadata;
};

export type PackageDefinition<Args extends OptionDefinition> = {
    name: string;
    version: string;
    dev: boolean;
    condition?: ConditionDefinition<Args>;
};

export type ComposerConfig<Args extends OptionDefinition> = {
    metadata: ComposerConfigMetadata;
    options: Args;
    packages: PackageDefinition<Args>[];
    files: FileTypes<Args>[];
    installHook?: (workspace: Workspace<Args>) => Promise<void>;
    uninstallHook?: (workspace: Workspace<Args>) => Promise<void>;
};

export function defineComposerConfig<Args extends OptionDefinition>(config: ComposerConfig<Args>) {
    return config;
}

export type Composer<Args extends OptionDefinition> = {
    config: ComposerConfig<Args>;
    checks: ComposerCheckConfig<Args>;
    tests?: ComposerTestConfig<Args>;
};

export type ComposerWithoutExplicitArgs = Composer<Record<string, Question>>;
export type ComposerConfigWithoutExplicitArgs = ComposerConfig<Record<string, Question>>;

export function defineComposer<Args extends OptionDefinition>(
    config: ComposerConfig<Args>,
    checks: ComposerCheckConfig<Args>,
    tests?: ComposerTestConfig<Args>,
) {
    const remoteControlled = remoteControl.isRemoteControlled();
    if (!remoteControlled) {
        executeComposer(config, checks);
    }

    const composer: Composer<Args> = { config, checks, tests };
    return composer;
}

export type Tests = {
    expectProperty: (selector: string, property: string, expectedValue: string) => Promise<void>;
    elementExists: (selector: string) => Promise<void>;
    click: (selector: string, waitForNavigation: boolean) => Promise<void>;
    expectUrlPath: (path: string) => Promise<void>;
};

export type TestDefinition<Args extends OptionDefinition> = {
    name: string;
    run: (tests: Tests) => Promise<void>;
    condition?: (options: OptionValues<Args>) => boolean;
};

export type ComposerTestConfig<Args extends OptionDefinition> = {
    files: FileTypes<Args>[];
    tests: TestDefinition<Args>[];
    options: Args;
    optionValues: OptionValues<Args>[];
};

export function defineComposerTests<Args extends OptionDefinition>(tests: ComposerTestConfig<Args>) {
    return tests;
}

export function defineComposerOptions<Args extends OptionDefinition>(options: Args) {
    return options;
}

export type PreInstallationCheck = {
    name: string;
    run: (workingDirectory: string) => boolean;
};

export type PostInstallationCheck = {
    name: string;
    run: (workingDirectory: string) => boolean;
};

export type ComposerCheckConfig<Args extends OptionDefinition> = {
    preInstallation?: PreInstallationCheck[];
    postInstallation: PostInstallationCheck[];
    options: Args;
};

export function defineComposerChecks<Args extends OptionDefinition>(checks: ComposerCheckConfig<Args>) {
    return checks;
}
