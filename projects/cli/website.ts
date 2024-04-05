import { ComposerConfig, Question } from "@svelte-compose/core/composer/config";

export function getComposerList(): string[] {
    // @ts-expect-error The list is assembled during build and injected by rollup.
    // If you don't see all required composers, please restart your dev server.
    // eslint-disable-next-line no-undef
    return COMPOSER_LIST;
}

export async function getComposerConfig(name: string) {
    const config = await executeComposer(name);

    return config;
}

export async function executeComposer(name: string): Promise<ComposerConfig<Record<string, Question>>> {
    // Either vite / rollup or esbuild are not able to process the shebangs
    // present on the `index.js` file. That's why we directly import the configuration
    // for the website here, as this is the only important part.
    const composer = await import(`../composers/${name}/config/composer.js`);
    const { composer: composerConfig } = await composer;

    return composerConfig;
}

export function groupBy<Key, Value>(list: Value[], keyGetter: (input: Value) => Key) {
    const map = new Map<Key, Value[]>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}
