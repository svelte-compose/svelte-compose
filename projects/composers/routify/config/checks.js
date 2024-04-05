import { defineComposerChecks } from "@svelte-compose/core";
import { options } from "./options";

export const checks = defineComposerChecks({
    options,
    postInstallation: [],
});
