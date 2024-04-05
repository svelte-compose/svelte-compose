<script>
    import Box from "./Box.svelte";
    import BoxWrapper from "./BoxWrapper.svelte";
    import ComposerImage from "./ComposerImage.svelte";
    import SupportedEnvironments from "./SupportedEnvironments.svelte";

    /** @type {Map<import("@svelte-compose/core/composer/categories").CategoryInfo, import("$lib/composer.js").ComposerMetadataWithOptions[]>} */
    export let composerCategories = new Map();

    /** @type {import("./composer").ComposerMetadataWithOptions[]}*/
    export let selectedComposers = [];
    export let linkCategories = false;

    /** @type {string[]}*/
    let selectedComposersIds = [];

    /**
     * Selects or deselects a composer given it's id
     * @param {string} composerId
     */
    function selectOrDeselectComposer(composerId) {
        if (selectedComposersIds.includes(composerId)) {
            selectedComposersIds = selectedComposersIds.filter((x) => x != composerId);
        } else {
            selectedComposersIds.push(composerId);
            selectedComposersIds = selectedComposersIds;
        }

        /** @type {import("$lib/composer.js").ComposerMetadataWithOptions[]} */
        const allComposers = [];
        for (const composers of composerCategories.values()) {
            allComposers.push(...composers);
        }

        selectedComposers = allComposers.filter((x) => selectedComposersIds.includes(x.metadata.id));
    }
</script>

{#each [...composerCategories] as [categoryInfo, composers]}
    <div class="category">
        <h2 class="text-xl">
            {#if linkCategories}
                <a href="/categories/{categoryInfo.id}">{categoryInfo.name}</a>
            {:else}
                {categoryInfo.name}
            {/if}
        </h2>
        <div>{categoryInfo.description}</div>
        <BoxWrapper>
            {#each composers as { metadata }}
                <Box>
                    <a href="/composer/{metadata.id}">
                        <ComposerImage id={metadata.id} name={metadata.name} />
                        <div class="test">{metadata.name}</div>
                    </a>

                    <div>
                        {metadata.description}
                    </div>

                    <SupportedEnvironments svelte={metadata.environments.svelte} kit={metadata.environments.kit} />

                    <button class="button is-primary" on:click={() => selectOrDeselectComposer(metadata.id)}>Add / remove</button>
                </Box>
            {/each}
        </BoxWrapper>
    </div>
{/each}

<style>
    .category {
        margin-bottom: 2rem;
    }
</style>
