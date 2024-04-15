import { defineComposerTests } from "@svelte-compose/core";
import { options } from "./options.js";

const boxId = "myBox";

export const tests = defineComposerTests({
    options,
    optionValues: [{ useSass: false }, { useSass: true }],
    files: [
        {
            name: ({ kit }) => `${kit.routesDirectory}/+page.svelte`,
            contentType: "svelte",
            content: prepareTests,
            condition: ({ kit }) => kit.installed,
        },
        {
            name: () => `src/App.svelte`,
            contentType: "svelte",
            content: prepareTests,
            condition: ({ kit }) => !kit.installed,
        },
    ],
    tests: [
        {
            name: "box properties",
            run: async ({ expectProperty }) => {
                const selector = "#" + boxId;
                await expectProperty(selector, "background-color", "rgb(255, 255, 255)");
                await expectProperty(selector, "border-radius", "12px");
                await expectProperty(selector, "color", "rgb(64, 70, 84)");
                await expectProperty(selector, "display", "block");
                await expectProperty(selector, "padding", "20px");
            },
        },
        {
            name: "form properties",
            run: async ({ expectProperty }) => {
                await expectProperty(".field .label", "color", "rgb(46, 51, 61)");
                await expectProperty(".field .label", "display", "block");
                await expectProperty(".field .label", "font-size", "16px");

                await expectProperty(".field .input", "border-radius", "6px");
            },
        },
    ],
});

/**
 * @template {import("@svelte-compose/core/composer/options.js").ArgType} Args
 * @param {import("@svelte-compose/core/files/processors.js").SvelteFileEditorArgs<Args>} editor
 */
function prepareBoxTest({ html }) {
    const div = html.div({ class: "box", id: boxId });
    html.appendElement(html.ast.childNodes, div);
}

/**
 * @template {import("@svelte-compose/core/composer/options.js").ArgType} Args
 * @param {import("@svelte-compose/core/files/processors.js").SvelteFileEditorArgs<Args>} editor
 */
function prepareFormTest({ html }) {
    const rawHtmlTest = `<div class="field">
    <label class="label">Name</label>
    <div class="control">
        <input class="input" type="text" placeholder="Text input">
    </div>
</div>`;
    html.addFromRawHtml(html.ast.childNodes, rawHtmlTest);
}

/**
 * @template {import("@svelte-compose/core/composer/options.js").ArgType} Args
 * @param {import("@svelte-compose/core/files/processors.js").SvelteFileEditorArgs<Args>} editor
 */
function prepareTests(editor) {
    prepareBoxTest(editor);
    prepareFormTest(editor);
}
