import { AstTypes, parseScript } from "@svelte-compose/ast-tooling";
import { getPackageJson } from "./common.js";
import { commonFilePaths, readFile } from "../files/utils.js";
import { getJsAstEditor } from "@svelte-compose/ast-manipulation";
import { OptionDefinition, OptionValues, Question } from "../composer/options.js";

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

export type Workspace<Args extends OptionDefinition> = {
    options: OptionValues<Args>;
    cwd: string;
    prettier: PrettierData;
    typescript: TypescriptData;
    kit: SvelteKitData;
};

export type WorkspaceWithoutExplicitArgs = Workspace<Record<string, Question>>;

export function createEmptyWorkspace(): WorkspaceWithoutExplicitArgs {
    return {
        options: {},
        cwd: "",
        prettier: {
            installed: false,
            config: "",
        },
        typescript: {
            installed: false,
            config: "",
        },
        kit: {
            installed: false,
            routesDirectory: "src/routes",
            libDirectory: "src/lib",
        },
    };
}

export function addPropertyToWorkspaceOption(workspace: WorkspaceWithoutExplicitArgs, optionKey: string, value: unknown) {
    if (value === "true") {
        value = true;
    }

    if (value === "false") {
        value = false;
    }

    Object.defineProperty(workspace.options, optionKey, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

export async function populateWorkspaceDetails(workspace: WorkspaceWithoutExplicitArgs, workingDirectory: string) {
    workspace.cwd = workingDirectory;

    const packageJson = await getPackageJson(workspace);
    workspace.typescript.installed = "tslib" in packageJson.devDependencies;
    workspace.prettier.installed = "prettier" in packageJson.devDependencies;
    workspace.kit.installed = "@sveltejs/kit" in packageJson.devDependencies;

    await parseSvelteConfigIntoWorkspace(workspace);
}

export async function parseSvelteConfigIntoWorkspace(workspace: WorkspaceWithoutExplicitArgs) {
    if (!workspace.kit.installed) return;
    const configText = await readFile(workspace, commonFilePaths.svelteConfigFilePath);
    const ast = parseScript(configText);
    const editor = await getJsAstEditor(ast);
    const variableDeclaration = ast.body.find((x) => x.type == "VariableDeclaration") as AstTypes.VariableDeclaration;
    const variableDeclarator = variableDeclaration.declarations[0] as AstTypes.VariableDeclarator;
    const objectExpression = variableDeclarator.init as AstTypes.ObjectExpression;

    const kit = editor.object.property(objectExpression, "kit", editor.object.createEmpty());
    const files = editor.object.property(kit, "files", editor.object.createEmpty());
    const routes = editor.object.property(files, "routes", editor.common.createLiteral());
    const lib = editor.object.property(files, "lib", editor.common.createLiteral());

    if (routes.value) {
        workspace.kit.routesDirectory = routes.value as string;
    }
    if (lib.value) {
        workspace.kit.libDirectory = lib.value as string;
    }
}
