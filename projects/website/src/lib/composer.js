import { getComposerConfig, getComposerList, groupBy } from "@svelte-compose/cli/website";

/**
 * @typedef ComposerMetadataWithOptions
 * @property {import("@svelte-compose/core/composer/config").ComposerConfigMetadata} metadata
 * @property {Record<string, import("@svelte-compose/core/composer/options").Question> | null} options
 */

/**
 *
 * @param {string | undefined} [category]
 * @returns
 */
export async function getComposerInfos(category) {
    const composersNames = getComposerList();

    /** @type {ComposerMetadataWithOptions[]} */
    const composers = [];
    for (const composerName of composersNames) {
        const config = await getComposerDetails(composerName);

        if (category && config.metadata.category.id !== category) {
            continue;
        }

        composers.push(config);
    }

    const groupedByCategory = groupComposersByCategory(composers);

    return groupedByCategory;
}

/**
 *
 * @param {string} name
 * @returns {Promise<ComposerMetadataWithOptions>}
 */
export async function getComposerDetails(name) {
    const config = await getComposerConfig(name);

    return {
        metadata: config.metadata,
        options: config.options,
    };
}

/**
 * @param {ComposerMetadataWithOptions[]} composers
 * @returns {Map<import("@svelte-compose/core/composer/categories").CategoryInfo, ComposerMetadataWithOptions[]>}
 */
function groupComposersByCategory(composers) {
    return groupBy(composers, (composer) => composer.metadata.category);
}
