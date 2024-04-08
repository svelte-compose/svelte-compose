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
    let selectedComposerIds = [];

    /**
     * Selects or deselects a composer given it's id
     * @param {string} composerId
     */
    function selectOrDeselectComposer(composerId) {
        if (selectedComposerIds.includes(composerId)) {
            selectedComposerIds = selectedComposerIds.filter((x) => x != composerId);
        } else {
            selectedComposerIds.push(composerId);
            selectedComposerIds = selectedComposerIds;
        }

        /** @type {import("$lib/composer.js").ComposerMetadataWithOptions[]} */
        const allComposers = [];
        for (const composers of composerCategories.values()) {
            allComposers.push(...composers);
        }

        selectedComposers = allComposers.filter((x) => selectedComposerIds.includes(x.metadata.id));
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
                    <div class="composer-item">
                        <a href="/composer/{metadata.id}">
                            <ComposerImage id={metadata.id} name={metadata.name} />
                            <div class="test">{metadata.name}</div>
                        </a>

                        <div>
                            {metadata.description}
                        </div>

                        <SupportedEnvironments svelte={metadata.environments.svelte} kit={metadata.environments.kit} />

                        <div class="button-wrapper">
                            <button class="button is-primary" on:click={() => selectOrDeselectComposer(metadata.id)}>
                                {#if !selectedComposerIds.includes(metadata.id)}
                                    +
                                {:else}
                                    -
                                {/if}
                            </button>
                        </div>
                    </div>
                </Box>
            {/each}
        </BoxWrapper>
    </div>
{/each}

<style>
    .category {
        margin-bottom: 2rem;
    }

    .composer-item {
        position: relative;
    }

    .button-wrapper {
        position: absolute;
        top: -1.5rem;
        right: -1.5rem;
        text-align: center;
    }

    .button-wrapper button {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 100%;
        padding-left: 0;
        padding-right: 0;
    }
</style>
