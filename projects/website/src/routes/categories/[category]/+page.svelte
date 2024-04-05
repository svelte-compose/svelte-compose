<script>
    import Box from "$lib/Box.svelte";
    import ComposerCategoryList from "$lib/ComposerCategoryList.svelte";
    import Configurator from "$lib/Configurator.svelte";
    import Seo from "$lib/Seo.svelte";

    export let data;

    /** @type {Map<import("@svelte-compose/core/composer/categories").CategoryInfo, import("$lib/composer.js").ComposerMetadataWithOptions[]>} */
    const composerCategories = data.composerCategories;
    /** @type {import("../../../../../core/composer/categories.js").CategoryInfo} */
    const category = data.category;

    /** @type {import("$lib/composer.js").ComposerMetadataWithOptions[]} */
    let selectedComposers = [];
</script>

<Seo title={category.name} description="Add {category.name} to your svelte project" keywords={data.keywords} />

<ComposerCategoryList {composerCategories} bind:selectedComposers />

<Box>
    <Configurator composers={selectedComposers} />
</Box>
