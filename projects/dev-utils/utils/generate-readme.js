import { getComposerConfig, getComposerList } from "@svelte-compose/cli/website";
import { writeFile } from "fs/promises";

const domain = "https://svelte-compose.com";
const codeTagStart = "```sh";
const codeTagEnd = "```";

export async function generateComposerReadmes() {
    const composerList = await getComposerList();

    for (const composerName of composerList) {
        const composerConfig = await getComposerConfig(composerName);

        const readmeContent = generateReadme(composerConfig);
        await writeFile(`./projects/composers/${composerConfig.metadata.id}/README.md`, readmeContent);
    }
}

/**
 * Generates the contents of the readme for a given composer
 * @param {import("@svelte-compose/core/composer/config").ComposerConfig<Record<string, import("@svelte-compose/core/composer/config").Question>>} composer
 */
export function generateReadme(composer) {
    const metadata = composer.metadata;
    const composerNpx = `npx ${metadata.package}@latest`;

    return `
<p style="text-align: center;">
    <img src="${domain}/composer/${metadata.id}/logo.svg" height="50" />
</p>

# ${metadata.name}

> This is a composer for [svelte-compose](${domain}) and is used to add ${metadata.name} to your svelte/kit project.

You can find all options for this composer on [this site](${domain}/composer/${metadata.id}). We will only provide a short breakdown of the composer features here.

Basic usage
${codeTagStart}
${composerNpx}
${codeTagEnd}

In case you already have a directory in mind, you can use this:
${codeTagStart}
${composerNpx} --path ./your-project
${codeTagEnd}

${generateOptions(composer, composerNpx)}
`;
}

/**
 * @param {import("@svelte-compose/core/composer/config").ComposerConfig<Record<string, import("@svelte-compose/core/composer/config").Question>>} composer
 * @param {string} composerNpx
 */
function generateOptions(composer, composerNpx) {
    if (!composer.options) return;
    const optionKeys = Object.keys(composer.options);
    if (optionKeys.length == 0) return;

    let markdown = `
## Available options

    `;

    const options = Object.entries(composer.options);
    for (const [key, value] of options) {
        markdown += `\n- \`${key}\` (default: ${value.default}) - ${value.question}`;
    }

    const [firstOptionKey, firstOptionValue] = options[0];

    markdown += `\n\n
Option syntax
${codeTagStart}
${composerNpx} --key value
${codeTagEnd}

Specific example
${codeTagStart}
${composerNpx} --${firstOptionKey} ${firstOptionValue.default}
${codeTagEnd}

You can combine as many options as you want. The usage of options is optional. If you don't specify an option value via the command line, the CLI will ask you the questions interactively.
`;

    return markdown;
}
