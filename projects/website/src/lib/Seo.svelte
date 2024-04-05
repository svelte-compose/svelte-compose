<script>
    export /** @type {string} */ let title;
    export /** @type {string} */ let description;
    export /** @type {string[] | undefined} */ let keywords = undefined;
</script>

<svelte:head>
    <title>{title} - svelte compose</title>
    <meta name="description" content={description} />

    {#if keywords}
        <meta name="keywords" content={keywords.join(",")} />
    {/if}
</svelte:head>
