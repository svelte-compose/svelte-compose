# @svelte-compose/cli

> This is the main cli for [svelte-compose](https://svelte-compose.com) and is used to add different tools to your svelte/kit project.

You can find all available composers and their respective options on [this site](https://svelte-compose.com/composer/bootstrap). We will only provide a short breakdown of the cli features here.

Basic usage (fully interactive)

```sh
npx @svelte-compose/cli@latest
```

In case you already have a directory in mind, you can use this:

```sh
npx @svelte-compose/cli@latest --path ./your-project
```

If you want to install multiple composers at once, you can use this command:

```sh
npx @svelte-compose/cli@latest --composer bulma mdsvex
```

You can also directly pass through options for each composer. Please refer to the website [this site](https://svelte-compose.com) to generate such commands. Alternatively you can refer to the individual composer options.
