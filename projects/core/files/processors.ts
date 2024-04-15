import {
    CssAstEditor,
    HtmlAstEditor,
    JsAstEditor,
    SvelteAstEditor,
    getCssAstEditor,
    getHtmlAstEditor,
    getJsAstEditor,
} from "@svelte-compose/ast-manipulation";
import {
    parseHtml,
    parseJson,
    parsePostcss,
    parseScript,
    parseSvelteFile,
    serializeHtml,
    serializeJson,
    serializePostcss,
    serializeScript,
    serializeSvelteFile,
} from "@svelte-compose/ast-tooling";
import { fileExistsWorkspace, format, readFile, writeFile } from "./utils.js";
import { ConditionDefinition, Workspace } from "../composer/config.js";
import { ArgType } from "../composer/options.js";

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

export type FileTypes<Args extends ArgType> =
    | ScriptFile<Args>
    | TextFile<Args>
    | SvelteFile<Args>
    | JsonFile<Args>
    | HtmlFile<Args>
    | CssFile<Args>;

export async function createOrUpdateFiles<Args extends ArgType>(files: FileTypes<Args>[], workspace: Workspace<Args>) {
    for (const fileDetails of files) {
        if (fileDetails.condition && !fileDetails.condition(workspace)) {
            continue;
        }

        const exists = await fileExistsWorkspace(workspace, fileDetails.name(workspace));

        let content = "";
        if (!exists) {
            content = "";
        } else {
            content = await readFile(workspace, fileDetails.name(workspace));
        }

        if (fileDetails.contentType == "script") {
            content = handleScriptFile(content, fileDetails, workspace);
        } else if (fileDetails.contentType == "text") {
            content = handleTextFile(content, fileDetails, workspace);
        } else if (fileDetails.contentType == "svelte") {
            content = handleSvelteFile(content, fileDetails, workspace);
        } else if (fileDetails.contentType == "json") {
            content = handleJsonFile(content, fileDetails, workspace);
        } else if (fileDetails.contentType == "css") {
            content = handleCssFile(content, fileDetails, workspace);
        } else if (fileDetails.contentType == "html") {
            content = handleHtmlFile(content, fileDetails, workspace);
        }

        content = await format(workspace, fileDetails.name(workspace), content);
        await writeFile(workspace, fileDetails.name(workspace), content);
    }
}

function handleHtmlFile<Args extends ArgType>(content: string, fileDetails: HtmlFileType<Args>, workspace: Workspace<Args>) {
    const ast = parseHtml(content);
    fileDetails.content({ ...getHtmlAstEditor(ast), ...workspace });
    content = serializeHtml(ast);
    return content;
}

function handleCssFile<Args extends ArgType>(content: string, fileDetails: CssFileType<Args>, workspace: Workspace<Args>) {
    const ast = parsePostcss(content);
    fileDetails.content({ ...getCssAstEditor(ast), ...workspace });
    content = serializePostcss(ast);
    return content;
}

function handleJsonFile<Args extends ArgType>(content: string, fileDetails: JsonFileType<Args>, workspace: Workspace<Args>) {
    const data = parseJson(content);
    fileDetails.content({ data, ...workspace });
    content = serializeJson(content, data);
    return content;
}

function handleSvelteFile<Args extends ArgType>(content: string, fileDetails: SvelteFileType<Args>, workspace: Workspace<Args>) {
    const { jsAst, htmlAst, cssAst } = parseSvelteFile(content);

    fileDetails.content({
        js: getJsAstEditor(jsAst),
        html: getHtmlAstEditor(htmlAst),
        css: getCssAstEditor(cssAst),
        ...workspace,
    });

    return serializeSvelteFile({ jsAst, htmlAst, cssAst });
}

function handleTextFile<Args extends ArgType>(content: string, fileDetails: TextFileType<Args>, workspace: Workspace<Args>) {
    content = fileDetails.content({ content, ...workspace });
    return content;
}

function handleScriptFile<Args extends ArgType>(content: string, fileDetails: ScriptFileType<Args>, workspace: Workspace<Args>) {
    const ast = parseScript(content);

    fileDetails.content({
        ...getJsAstEditor(ast),
        ...workspace,
    });
    content = serializeScript(ast);
    return content;
}
