<script>
    import Box from "$lib/Box.svelte";
    import BoxWrapper from "$lib/BoxWrapper.svelte";
    import ComposerImage from "$lib/ComposerImage.svelte";
    import Configurator from "$lib/Configurator.svelte";
    import CopyCommand from "$lib/CopyCommand.svelte";
    import Seo from "$lib/Seo.svelte";
    import SupportedEnvironments from "$lib/SupportedEnvironments.svelte";

    export let data;

    /** @type {import("$lib/composer.js").ComposerMetadataWithOptions} */
    const composer = data.composer;

    const { metadata, options } = composer;
</script>

<Seo title={metadata.name} description="Add {metadata.name} to your svelte project" keywords={metadata.website?.keywords} />

<BoxWrapper>
    <Box>
        <h1>{metadata.name}</h1>
        <h2>{metadata.description}</h2>

        <SupportedEnvironments svelte={metadata.environments.svelte} kit={metadata.environments.kit} />
    </Box>

    <Box>
        <ComposerImage id={metadata.id} name={metadata.name} />

        <CopyCommand command="npx {metadata.package}@{metadata.version}" />

        <div><a target="_blank" href={metadata.website?.documentation}>Documentation</a></div>
        <div>{metadata.website?.keywords}</div>
    </Box>
</BoxWrapper>

<Configurator composers={[composer]}></Configurator>
