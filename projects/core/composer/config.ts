import { CssAstEditor, HtmlAstEditor, JsAstEditor, SvelteAstEditor } from "@svelte-compose/ast-manipulation";
import { executeComposer } from "./execute.js";
import * as remoteControl from "./remoteControl.js";

export { CssAstEditor, HtmlAstEditor, JsAstEditor, SvelteAstEditor };

export type CategoryInfo = {
    id: string;
    name: string;
    description: string;
};

export type CategoryDetails = {
    [K in "styling" | "tools" | string]: CategoryInfo;
};

export type BooleanDefaultValue = {
    type: "boolean";
    default: boolean;
};

export type StringDefaultValue = {
    type: "string";
    default: string;
};

export type NumberDefaultValue = {
    type: "number";
    default: number;
};

export type BaseQuestion = {
    question: string;
};

export type BooleanQuestion = BaseQuestion & BooleanDefaultValue;
export type StringQuestion = BaseQuestion & StringDefaultValue;
export type NumberQuestion = BaseQuestion & NumberDefaultValue;
export type Question = BooleanQuestion | StringQuestion | NumberQuestion;

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

export type ArgType = Record<string, Question>;
export type ArgValues<Args extends ArgType> = {
    [K in keyof Args]: Args[K]["type"] extends "string"
        ? string
        : Args[K]["type"] extends "boolean"
          ? boolean
          : Args[K]["type"] extends "number"
            ? number
            : never;
};

export type Workspace<Args extends ArgType> = {
    options: ArgValues<Args>;
    cwd: string;
    prettier: PrettierData;
    typescript: TypescriptData;
    kit: SvelteKitData;
};

export type ConditionDefinition<Args extends ArgType> = (Workspace: Workspace<Args>) => boolean;

export type BaseFile<Args extends ArgType> = {
    name: (options: Workspace<Args>) => string;
    condition?: ConditionDefinition<Args>;
};

export type ScriptFileEditorArgs<Args extends ArgType> = JsAstEditor & Workspace<Args>;
export type ScriptFileType<Args extends ArgType> = {
    contentType: "script";
    content: (editor: ScriptFileEditorArgs<Args>) => void;
};
export type ScriptFile<Args extends ArgType> = ScriptFileType<Args> & BaseFile<Args>;

export type TextFileEditorArgs<Args extends ArgType> = { content: string } & Workspace<Args>;
export type TextFileType<Args extends ArgType> = {
    contentType: "text";
    content: (editor: TextFileEditorArgs<Args>) => string;
};
export type TextFile<Args extends ArgType> = TextFileType<Args> & BaseFile<Args>;

export type SvelteFileEditorArgs<Args extends ArgType> = SvelteAstEditor & Workspace<Args>;
export type SvelteFileType<Args extends ArgType> = {
    contentType: "svelte";
    content: (editor: SvelteFileEditorArgs<Args>) => void;
};
export type SvelteFile<Args extends ArgType> = SvelteFileType<Args> & BaseFile<Args>;

export type JsonFileEditorArgs<Args extends ArgType> = { data: any } & Workspace<Args>;
export type JsonFileType<Args extends ArgType> = {
    contentType: "json";
    content: (editor: JsonFileEditorArgs<Args>) => void;
};
export type JsonFile<Args extends ArgType> = JsonFileType<Args> & BaseFile<Args>;

export type HtmlFileEditorArgs<Args extends ArgType> = HtmlAstEditor & Workspace<Args>;
export type HtmlFileType<Args extends ArgType> = {
    contentType: "html";
    content: (editor: HtmlFileEditorArgs<Args>) => void;
};
export type HtmlFile<Args extends ArgType> = HtmlFileType<Args> & BaseFile<Args>;

export type CssFileEditorArgs<Args extends ArgType> = CssAstEditor & Workspace<Args>;
export type CssFileType<Args extends ArgType> = {
    contentType: "css";
    content: (editor: CssFileEditorArgs<Args>) => void;
};
export type CssFile<Args extends ArgType> = CssFileType<Args> & BaseFile<Args>;

export type PackageDefinition<Args extends ArgType> = {
    name: string;
    version: string;
    dev: boolean;
    condition?: ConditionDefinition<Args>;
};

export type FileTypes<Args extends ArgType> =
    | ScriptFile<Args>
    | TextFile<Args>
    | SvelteFile<Args>
    | JsonFile<Args>
    | HtmlFile<Args>
    | CssFile<Args>;

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
