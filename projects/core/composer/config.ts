import { CssAstEditor, HtmlAstEditor, JsAstEditor, SvelteAstEditor } from "@svelte-compose/ast-manipulation";
import { executeComposer } from "./execute.js";
import * as remoteControl from "./remoteControl.js";
import { CategoryInfo } from "./categories.js";
import { ArgType, ArgValues, Question } from "./options.js";
import { FileTypes } from "../files/processors.js";

export { CssAstEditor, HtmlAstEditor, JsAstEditor, SvelteAstEditor };

export type PrettierData = {
    installed: boolean;
    config: unknown;
};

export type TypescriptData = {
    installed: boolean;
    config: unknown;
};

export type SvelteKitData = {
    installed: boolean;
    libDirectory: string;
    routesDirectory: string;
};

export type Workspace<Args extends ArgType> = {
    options: ArgValues<Args>;
    cwd: string;
    prettier: PrettierData;
    typescript: TypescriptData;
    kit: SvelteKitData;
};

export type ConditionDefinition<Args extends ArgType> = (Workspace: Workspace<Args>) => boolean;

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

export type PackageDefinition<Args extends ArgType> = {
    name: string;
    version: string;
    dev: boolean;
    condition?: ConditionDefinition<Args>;
};

export type ComposerConfig<Args extends ArgType> = {
    metadata: ComposerConfigMetadata;
    options: Args;
    packages: PackageDefinition<Args>[];
    files: FileTypes<Args>[];
    installHook?: (workspace: Workspace<Args>) => Promise<void>;
    uninstallHook?: (workspace: Workspace<Args>) => Promise<void>;
};

export function defineComposerConfig<Args extends ArgType>(config: ComposerConfig<Args>) {
    return config;
}

export type Composer<Args extends ArgType> = {
    config: ComposerConfig<Args>;
    checks: ComposerCheckConfig<Args>;
    tests?: ComposerTestConfig<Args>;
};

export type ComposerWithoutExplicitArgs = Composer<Record<string, Question>>;

export function defineComposer<Args extends ArgType>(
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

export type TestDefinition<Args extends ArgType> = {
    name: string;
    run: (tests: Tests) => Promise<void>;
    condition?: (options: ArgValues<Args>) => boolean;
};

export type ComposerTestConfig<Args extends ArgType> = {
    files: FileTypes<Args>[];
    tests: TestDefinition<Args>[];
    options: Args;
    optionValues: ArgValues<Args>[];
};

export function defineComposerTests<Args extends ArgType>(tests: ComposerTestConfig<Args>) {
    return tests;
}

export function defineComposerOptions<Args extends ArgType>(options: Args) {
    return options;
}

export type PreInstallationCheck = {
    name: string;
    run: (workingDirectory: string) => boolean;
};

export type PostInstallationCheck<Args extends ArgType> = {
    name: string;
    run: (workingDirectory: string) => boolean;
};

export type ComposerCheckConfig<Args extends ArgType> = {
    preInstallation?: PreInstallationCheck[];
    postInstallation: PostInstallationCheck<Args>[];
    options: Args;
};

export function defineComposerChecks<Args extends ArgType>(checks: ComposerCheckConfig<Args>) {
    return checks;
}
