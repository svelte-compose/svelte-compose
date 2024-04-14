#!/usr/bin/env node

import { generateComposerReadmes } from "./utils/generate-readme.js";
import { updateComposerPackages } from "./utils/update-packages.js";

const command = process.argv[2];

switch (command) {
    case "readmes":
        // There is no real need to call this command manually. This script is called by ci during versioning.
        await generateComposerReadmes();
        break;
    case "packages":
        // There is no real need to call this command manually. This script is called by ci during versioning.
        await updateComposerPackages();
        break;

    default:
        throw new Error(`Command '${command}' not found`);
}
