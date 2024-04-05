import { getComposerInfos } from "$lib/composer.js";
import { categories } from "@svelte-compose/core";

export async function load({ params }) {
    const infos = await getComposerInfos(params.category);

    /** @type {string[]} */
    const keywords = [];
    for (const composers of infos.values()) {
        for (const composer of composers) {
            keywords.push(...composer.metadata.website.keywords);
        }
    }

    return {
        composerCategories: infos,
        category: categories[params.category],
        keywords: keywords,
    };
}
