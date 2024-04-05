import { getComposerDetails } from "$lib/composer.js";

export async function load({ params }) {
    const config = await getComposerDetails(params.composer);

    return {
        composer: config,
    };
}
