import { defineComposerChecks } from "@svelte-compose/core";
import { options } from "./options.js";

export const checks = defineComposerChecks({
    options,
    postInstallation: [],
});
