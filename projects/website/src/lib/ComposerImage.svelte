<script lang="ts">
    export let id: string;
    export let name: string;
</script>

<div class="composer-logo-wrapper">
    <img class="composer-logo" src="/composer/{id}/logo.svg" alt="{name} logo" />
</div>

<style>
    .composer-logo-wrapper {
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
    }

    .composer-logo {
        max-width: 100%;
        max-height: 2rem;
    }
</style>
