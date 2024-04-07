import { categories, defineComposerConfig, generateComposerInfo } from "@svelte-compose/core";
import pkg from "../package.json";
import { options } from "./options";

export const composer = defineComposerConfig({
    metadata: {
        ...generateComposerInfo(pkg),
        name: "Threlte",
        description: "Rapidly build interactive 3D apps for the web.",
        category: categories.tools,
        environments: { svelte: true, kit: true },
        website: {
            logo: "./tailwindcss.svg",
            keywords: ["threlte", "3d", "3d apps"],
            documentation: "https://threlte.xyz/docs/learn/getting-started/installation",
        },
    },
    options,
    packages: [
        { name: "three", version: "^0.163.0", dev: false },
        { name: "@threlte/core", version: "^7.3.0", dev: false },
    ],
    files: [
        {
            name: ({ typescript }) => `vite.config.${typescript.installed ? "ts" : "js"}`,
            contentType: "script",
            content: ({ ast, array, object, exports, functions }) => {
                const { value: rootExport } = exports.defaultExport(ast, functions.call("defineConfig", []));
                const firstParam = functions.argumentByIndex(rootExport, 0, object.createEmpty());

                const ssr = object.property(firstParam, "ssr", object.createEmpty());
                const noExternalArray = object.property(ssr, "noExternal", array.createEmpty());
                array.push(noExternalArray, "three");
            },
        },
        {
            name: () => `tsconfig.json`,
            contentType: "json",
            condition: ({ typescript }) => typescript.installed,
            content: ({ data }) => {
                if (!data.compilerOptions) data.compilerOptions = {};

                data.moduleResolution = "Bundler";
            },
        },
        {
            name: () => "src/App.svelte",
            contentType: "svelte",
            condition: ({ kit }) => !kit.installed,
            content: ({ js, html }) => {
                js.imports.addNamed(js.ast, "@threlte/core", { Canvas: "Canvas" });
                js.imports.addDefault(js.ast, "./Scene.svelte", "Scene");

                const canvas = html.htmlElement("Canvas");
                html.insertElement(html.ast.childNodes, canvas);
                const scene = html.htmlElement("Scene");
                html.appendElement(canvas.childNodes, scene);
            },
        },
        {
            name: () => "src/Scene.svelte",
            contentType: "svelte",
            content: ({ js, html }) => {
                js.imports.addNamed(js.ast, "@threlte/core", { T: "T" });

                const htmlString = `
<T.Mesh>
  <T.BoxGeometry />
  <T.MeshBasicMaterial />
</T.Mesh>`;
                html.addFromRawHtml(html.ast.childNodes, htmlString);
            },
        },
    ],
});
