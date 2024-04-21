import { categories, defineComposerConfig, generateComposerInfo } from "@svelte-compose/core";
import pkg from "../package.json";
import { options } from "./options.js";

export const composer = defineComposerConfig({
    metadata: {
        ...generateComposerInfo(pkg),
        name: "Storybook",
        description: "Build UIs without the grunt work",
        category: categories.styling,
        environments: { kit: true, svelte: true },
        website: {
            logo: "./storybook.svg",
            keywords: ["storybook", "styling", "testing", "documentation", "storybook-svelte-csf", "svelte-csf"],
            documentation: "https://storybook.js.org/docs/get-started",
        },
    },
    options,
    packages: [
        { name: "@chromatic-com/storybook", version: "^1.3.3", dev: true },
        { name: "@storybook/addon-essentials", version: "^8.0.8", dev: true },
        { name: "@storybook/addon-interactions", version: "^8.0.8", dev: true },
        { name: "@storybook/addon-links", version: "^8.0.8", dev: true },
        { name: "@storybook/blocks", version: "^8.0.8", dev: true },
        { name: "@storybook/svelte", version: "^8.0.8", dev: true },
        { name: "@storybook/sveltekit", version: "^8.0.8", dev: true },
        { name: "@storybook/test", version: "^8.0.8", dev: true },
        { name: "storybook", version: "^8.0.8", dev: true },
        { name: "@storybook/addon-svelte-csf", version: "^4.1.2", dev: true },
    ],
    files: [
        {
            name: () => ".storybook/main.js",
            contentType: "script",
            content: ({ ast, common }) => {
                common.addFromString(
                    ast,
                    `/** @type { import('@storybook/sveltekit').StorybookConfig } */
                const config = {
                  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|svelte)"],
                  addons: [
                    "@storybook/addon-links",
                    "@storybook/addon-essentials",
                    "@chromatic-com/storybook",
                    "@storybook/addon-interactions",
                    "@storybook/addon-svelte-csf"
                  ],
                  framework: {
                    name: "@storybook/sveltekit",
                    options: {},
                  },
                  docs: {
                    autodocs: "tag",
                  },
                };
                export default config;`,
                );
            },
        },
        {
            name: () => ".storybook/preview.js",
            contentType: "script",
            content: ({ ast, common }) => {
                common.addFromString(
                    ast,
                    `/** @type { import('@storybook/svelte').Preview } */
                    const preview = {
                      parameters: {
                        controls: {
                          matchers: {
                            color: /(background|color)$/i,
                            date: /Date$/i,
                          },
                        },
                      },
                    };
                    
                    export default preview;`,
                );
            },
        },
        {
            name: () => "package.json",
            contentType: "json",
            content: ({ data }) => {
                if (!data.scripts) data.scripts = {};

                data.scripts["storybook"] = "storybook dev -p 6006";
                data.scripts["build-storybook"] = "storybook build";
            },
        },
        {
            name: ({ kit }) => `${kit.libDirectory}/stories/Button.svelte`,
            contentType: "text",
            content: ({ content }) => {
                return (
                    content +
                    `<script>
                import { createEventDispatcher, afterUpdate } from 'svelte';
                export let text = '';
                export let rounded = true;
              
                const dispatch = createEventDispatcher();
              
                function onClick(event) {
                  dispatch('click', event);
                }
              
                afterUpdate(() => {
                  dispatch('afterUpdate');
                });
              </script>
              
              <style>
                .rounded {
                  border-radius: 35px;
                }
              
                .button {
                  border: 3px solid;
                  padding: 10px 20px;
                  background-color: white;
                  outline: none;
                }
              </style>
              
              <button class="button" class:rounded on:click={onClick}>
                <strong>{rounded ? 'Round' : 'Square'} corners</strong>
                <br />
                {text}
                <slot />
              </button>`
                );
            },
        },
        {
            name: ({ kit }) => `${kit.libDirectory}/stories/button.stories.svelte`,
            contentType: "text",
            content: ({ content }) => {
                return (
                    content +
                    `<script>
                        import { Meta, Story, Template } from '@storybook/addon-svelte-csf;
                      
                        import Button from './Button.svelte';
                      
                        let count = 0;
                        function handleClick() {
                          count += 1;
                        }
                      </script>
                      
                      <!-- Stories about a Button -->
                      <Meta component={Button} autodocs/>
                      
                      <Template let:args>
                        <Button {...args} on:click={handleClick} on:click>
                          You clicked: {count}
                        </Button>
                      </Template>
                      
                      <Story name="Default"/>
                      
                      <Story name="Rounded" args={{rounded: true}}/>
                      
                      <Story name="Square" source args={{rounded: false}}/>
                      
                      <!-- Dynamic snippet should be disabled for this story -->
                      <Story name="Button No Args">
                        <Button>Label</Button>
                      </Story>`
                );
            },
        },
    ],
});
