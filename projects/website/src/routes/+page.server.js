import { getComposerInfos } from "$lib/composer";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const infos = await getComposerInfos();

    /** @type {string[]} */
    const keywords = [];
    for (const composers of infos.values()) {
        for (const composer of composers) {
            keywords.push(...composer.metadata.website.keywords);
        }
    }

    return {
        composerCategories: infos,
        keywords,
    };
}
