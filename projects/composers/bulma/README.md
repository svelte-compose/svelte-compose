
<p align="center">
    <img src="https://svelte-compose.com/composer/bulma/logo.svg" height="50" />
</p>

# Bulma

> This is a composer for [svelte-compose](https://svelte-compose.com) and is used to add Bulma to your svelte/kit project.

You can find all options for this composer on [this site](https://svelte-compose.com/composer/bulma). We will only provide a short breakdown of the composer features here.

Basic usage
```sh
npx @svelte-compose/bulma@latest
```

In case you already have a directory in mind, you can use this:
```sh
npx @svelte-compose/bulma@latest --path ./your-project
```


## Available options

    
- `useSass` (default: false) - Do you want to use sass? (css = faster, sass = better customization)


Option syntax
```sh
npx @svelte-compose/bulma@latest --key value
```

Specific example
```sh
npx @svelte-compose/bulma@latest --useSass false
```

You can combine as many options as you want. The usage of options is optional. If you don't specify an option value via the command line, the CLI will ask you the questions interactively.

