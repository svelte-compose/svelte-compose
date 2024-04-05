<script>
    import CopyCommand from "./CopyCommand.svelte";

    /** @type {import("./composer").ComposerMetadataWithOptions[]} */
    export let composers = [];

    /** @type {any} */
    const selectedOptions = {};
    let command = "";

    $: generateCommandArgs(selectedOptions);
    $: prepareDefaultValues(composers);

    /**
     *
     * @param {any} args
     */
    function generateCommandArgs(args) {
        const argumentEntries = Object.entries(args);
        const multipleComposers = argumentEntries.length > 1;
        const firstComposerId = Object.keys(args)[0];

        command = "npx @svelte-compose/";
        if (!firstComposerId) {
            command += "cli@latest";
            return;
        }

        if (!multipleComposers) command += firstComposerId + "@latest";
        else {
            const composerIds = Object.keys(args).join(" ");
            command += `cli@latest --composer ${composerIds}`;
        }

        for (const [composerId, options] of argumentEntries) {
            for (const [key, optionValue] of Object.entries(options)) {
                if (multipleComposers) {
                    command += ` --${composerId}-${key} ${optionValue}`;
                } else {
                    command += ` --${key} ${optionValue}`;
                }
            }
        }
    }

    /**
     * Prepares the default values for each composer and deletes values
     * for composers that are not present anymore
     * @param {import("./composer").ComposerMetadataWithOptions[]} composers
     */
    function prepareDefaultValues(composers) {
        // Once a composers has been added and an option values that differs
        // from the default value has been chosen we are not allowed to
        // update the composers anymore, as this would destroy the users choice.
        // That's why we need to determine the newly added and old removed values
        // and only update the appropriate properties

        const presentComposerIds = Object.keys(selectedOptions);
        const updatedComposerIds = composers.map((x) => x.metadata.id);
        const newValues = updatedComposerIds.filter((x) => !presentComposerIds.includes(x));
        const oldValues = presentComposerIds.filter((x) => !updatedComposerIds.includes(x));
        const newComposers = composers.filter((x) => newValues.includes(x.metadata.id));

        // delete option values for composers that are not present anymore
        for (const oldValue of oldValues) {
            delete selectedOptions[oldValue];
        }

        // Set default property values of new composers
        for (const { metadata, options } of newComposers) {
            if (!selectedOptions[metadata.id]) selectedOptions[metadata.id] = {};

            if (!options) continue;

            for (const [key, value] of Object.entries(options)) {
                selectedOptions[metadata.id][key] = value.default;
            }
        }

        generateCommandArgs(selectedOptions);
    }
</script>

<hr />
{#each composers as { metadata, options }}
    <div>{metadata.name}</div>
    {#if options}
        {#each Object.entries(options) as [key, value]}
            <div>
                <div>{key}</div>
                <div>{value.question}</div>
                <div>{value.default}</div>

                {#if value.type == "boolean"}
                    <label>
                        <input type="radio" value={true} bind:group={selectedOptions[metadata.id][key]} />
                        Yes
                    </label>
                    <label>
                        <input type="radio" value={false} bind:group={selectedOptions[metadata.id][key]} />
                        No
                    </label>
                {:else if value.type == "number"}
                    <input type="number" bind:value={selectedOptions[metadata.id][key]} />
                {:else if value.type == "string"}
                    <input type="text" bind:value={selectedOptions[metadata.id][key]} />
                {/if}
            </div>
            <hr />
        {/each}
    {/if}
{/each}

<CopyCommand {command} />
