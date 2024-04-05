import { categories, defineComposerConfig, generateComposerInfo } from "@svelte-compose/core";
import pkg from "../package.json";
import { options } from "./options.js";

export const composer = defineComposerConfig({
    metadata: {
        ...generateComposerInfo(pkg),
        name: "Bulma",
        description: "The modern CSS framework that just works.",
        category: categories.styling,
        environments: { kit: true, svelte: true },
        website: {
            logo: "./bulma.svg",
            keywords: ["bulma", "css", "sass", "scss"],
            documentation: "https://bulma.io/documentation/",
        },
    },
    options,
    packages: [
        { name: "bulma", version: "^1.0.0", dev: true },
        { name: "sass", version: "^1.71.1", dev: true, condition: ({ options }) => options.useSass },
    ],
    files: [
        {
            name: () => "src/app.scss",
            contentType: "css",
            condition: ({ options }) => options.useSass,
            content: ({ ast, addAtRule, addComment }) => {
                addComment(ast, "Override global Sass variables from the /utilities folder");
                addAtRule(ast, "use", `"bulma/sass/utilities" with (\n$link: $pink,\n);`, true);
                addAtRule(ast, "use", `"bulma/sass/base" with (\n$body-overflow-y: auto\n)`, true);

                addComment(ast, "Import the components you need");
                const imports = ["elements", "form", "components", "grid", "helpers", "layout", "themes"];

                for (const importName of imports) {
                    addAtRule(ast, "use", `"bulma/sass/${importName}"`, true);
                }
            },
        },
        {
            name: () => "src/variables.scss",
            contentType: "css",
            condition: ({ options }) => options.useSass,
            content: ({ ast, addDeclaration, addComment }) => {
                addComment(ast, "Set your brand colors");
                addDeclaration(ast, "$pink", "pink");
            },
        },
        {
            name: () => "src/App.svelte",
            contentType: "svelte",
            condition: ({ kit }) => !kit.installed,
            content: ({ js, options }) => {
                if (options.useSass) {
                    js.imports.addEmpty(js.ast, "./app.scss");
                } else {
                    js.imports.addEmpty(js.ast, "bulma/css/bulma.css");
                }
            },
        },
        {
            name: ({ kit }) => `${kit.routesDirectory}/+layout.js`,
            contentType: "script",
            condition: ({ kit }) => kit.installed,
            content: ({ ast, imports, options }) => {
                if (options.useSass) {
                    imports.addEmpty(ast, "../app.scss");
                } else {
                    imports.addEmpty(ast, "bulma/css/bulma.css");
                }
            },
        },
        {
            name: ({ typescript }) => `vite.config.${typescript.installed ? "ts" : "js"}`,
            contentType: "script",
            condition: ({ options }) => options.useSass,
            content: ({ ast, object, common, functions, exports }) => {
                const { value: rootObject } = exports.defaultExport(ast, functions.call("defineConfig", []));
                const param1 = functions.argumentByIndex(rootObject, 0, object.createEmpty());

                const css = object.property(param1, "css", object.createEmpty());
                const preprocessorOptions = object.property(css, "preprocessorOptions", object.createEmpty());
                const scss = object.property(preprocessorOptions, "scss", object.createEmpty());
                const additionalData = object.property(scss, "additionalData", common.createLiteral());
                additionalData.value = `@use "src/variables.scss" as *;`;
            },
        },
    ],
});
