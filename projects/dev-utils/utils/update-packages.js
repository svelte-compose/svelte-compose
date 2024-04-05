import { getComposerConfig, getComposerList } from "@svelte-compose/cli/website";
import { readFile, writeFile } from "fs/promises";

const repoUrl = "https://github.com/svelte-compose/svelte-compose";

export async function updateComposerPackages() {
    const composerList = await getComposerList();

    for (const composerName of composerList) {
        const composerConfig = await getComposerConfig(composerName);

        const filePath = `./projects/composers/${composerConfig.metadata.id}/package.json`;
        const content = await readFile(filePath);
        const data = JSON.parse(content.toString());
        updateComposerPackage(data, composerConfig);
        await writeFile(filePath, JSON.stringify(data, null, 2));
    }
}

/**
 * @param {any} data
 * @param {import("@svelte-compose/core/composer/config").ComposerConfig<Record<string, import("@svelte-compose/core/composer/config").Question>>} composer
 */
function updateComposerPackage(data, composer) {
    data.bugs = `${repoUrl}/issues`;
    data.repository = {};
    data.repository.type = "git";
    data.repository.url = `${repoUrl}/tree/main/projects/composers/${composer.metadata.id}`;
    data.keywords = composer.metadata.website.keywords;
    data.keywords.push("svelte");
    data.keywords.push("kit");
    data.keywords.push("svelte-kit");
}
