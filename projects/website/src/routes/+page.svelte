<script>
    import Box from "$lib/Box.svelte";
    import ComposerCategoryList from "$lib/ComposerCategoryList.svelte";
    import Configurator from "$lib/Configurator.svelte";
    import Seo from "$lib/Seo.svelte";

    export let data;

    /** @type {Map<import("@svelte-compose/core/composer/categories").CategoryInfo, import("$lib/composer.js").ComposerMetadataWithOptions[]>} */
    const composerCategories = data.composerCategories;

    /** @type {import("$lib/composer.js").ComposerMetadataWithOptions[]} */
    let selectedComposers = [];
</script>

<Seo title="Home" description="Add tools to your project" keywords={data.keywords} />

<ComposerCategoryList {composerCategories} linkCategories={true} bind:selectedComposers />

<Box>
    <Configurator bind:composers={selectedComposers} />
</Box>
