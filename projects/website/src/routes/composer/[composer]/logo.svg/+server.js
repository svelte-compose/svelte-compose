import { readFile } from "fs/promises";
import { getComposerConfig } from "@svelte-compose/cli/website";
import path from "path";

export const prerender = true;

export const GET = async ({ params }) => {
    const config = await getComposerConfig(params.composer);
    const data = await readFile(path.join(`../composers/${config.metadata.id}`, config.metadata.website?.logo));

    return new Response(data, {
        headers: {
            "content-type": "image/svg+xml",
        },
    });
};
