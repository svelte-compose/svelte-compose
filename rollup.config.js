import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import typescript from "@rollup/plugin-typescript";
import * as fs from "fs";
import path from "path";

const composerFolders = fs
    .readdirSync("./projects/composers/", { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
const composerNamesAsString = composerFolders.map((x) => `"${x}"`);

function getConfig(project, isComposer) {
    const inputs = [];
    let outDir = "";

    if (!isComposer) {
        inputs.push(`./projects/${project}/index.ts`);

        if (project == "cli") inputs.push(`./projects/${project}/website.ts`);
        if (project == "core") inputs.push(`./projects/${project}/internal.ts`);

        outDir = `./projects/${project}/build`;
    } else {
        /**
         * Let's keep the composers in JavaScript, in order to preserve compilation speed.
         * In JavaScript each composers takes about 50-100ms. When we change the file types to
         * Typescript without changing anything else, we already get 1000-1500ms. Since
         * we plan to have many composers, it would make it pretty hard to work with this repo.
         * Since the composers are still typed by JSDoc and have access to all types from the
         * other projects, all the intellisense and so on is still working flawlessly.
         */
        inputs.push(`./projects/composers/${project}/index.js`);

        outDir = `./projects/composers/${project}/build`;
    }

    const projectRoot = path.resolve(path.join(outDir, ".."));
    fs.rmSync(outDir, { force: true, recursive: true });

    const config = {
        input: inputs,
        output: {
            dir: outDir,
            format: "esm",
            sourcemap: true,
        },
        external: [/^@svelte-compose.*/, "prettier", "create-svelte", "puppeteer"],
        plugins: [
            preserveShebangs(),
            typescript({ project: "./tsconfig.json", outDir, rootDir: projectRoot, sourceRoot: projectRoot }),
            nodeResolve({ preferBuiltins: true }),
            commonjs(),
            json(),
            dynamicImportVars(),
        ],
    };

    if (project == "cli") {
        config.output.intro = `const COMPOSER_LIST = [${composerNamesAsString}];`;
    }

    return config;
}

const composerConfigs = [];
for (const composer of composerFolders) {
    composerConfigs.push(getConfig(composer, true));
}

export default [
    getConfig("ast-tooling", false),
    getConfig("ast-manipulation", false),
    getConfig("core", false),
    ...composerConfigs,
    getConfig("cli", false),
    getConfig("testing-library", false),
];
