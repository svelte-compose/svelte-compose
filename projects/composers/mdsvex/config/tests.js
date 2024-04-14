import { defineComposerTests } from "@svelte-compose/core";
import { options } from "./options";

export const tests = defineComposerTests({
    files: [
        {
            name: ({ kit }) => `${kit.routesDirectory}/+page.svelte`,
            contentType: "svelte",
            content: useMarkdownFile,
            condition: ({ kit }) => kit.installed,
        },
        {
            name: () => `src/App.svelte`,
            contentType: "svelte",
            content: useMarkdownFile,
            condition: ({ kit }) => !kit.installed,
        },
        {
            name: ({ kit }) => `${kit.routesDirectory}/Demo.svx`,
            contentType: "text",
            content: addMarkdownFile,
            condition: ({ kit }) => kit.installed,
        },
        {
            name: () => `src/Demo.svx`,
            contentType: "text",
            content: addMarkdownFile,
            condition: ({ kit }) => !kit.installed,
        },
    ],
    options,
    optionValues: [],
    tests: [
        {
            name: "elements exist",
            run: async ({ elementExists }) => {
                await elementExists(".mdsvex h1");
                await elementExists(".mdsvex h2");
                await elementExists(".mdsvex p");
            },
        },
    ],
});

/**
 * @template {import("@svelte-compose/core/composer/config.js").ArgType} Args
 * @param {import("@svelte-compose/core/composer/config.js").TextFileEditorArgs<Args>} editor
 */
function addMarkdownFile(editor) {
    // example taken from website: https://mdsvex.pngwn.io
    return (
        editor.content +
        `
---
title: Svex up your markdown
---

# { title }

## Good stuff in your markdown

Markdown is pretty good but sometimes you just need more.
`
    );
}

/**
 * @template {import("@svelte-compose/core/composer/config.js").ArgType} Args
 * @param {import("@svelte-compose/core/composer/config.js").SvelteFileEditorArgs<Args>} editor
 */
function useMarkdownFile({ js, html }) {
    js.imports.addDefault(js.ast, "./Demo.svx", "Demo");

    const div = html.div({ class: "mdsvex" });
    html.appendElement(html.ast.childNodes, div);
    const mdsvexNode = html.element("Demo");
    html.appendElement(div.childNodes, mdsvexNode);
}
