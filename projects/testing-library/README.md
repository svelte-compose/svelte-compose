# @svelte-compose/testing-library

This package provides core tools for testing your composer for different environments and options. Currently we execute tests against 5 project templates:

-   svelte-js
-   svelte-ts
-   kit-js
-   kit-js-comments
-   kit-ts

Additionally we will test your composer for each option combination that you specify.

Here is a sample usage example:

```js
// test.js

import { remoteControl } from "@svelte-compose/core/internal";
import { testComposer } from "@svelte-compose/testing-library";

remoteControl.enable();
/** @type {import('@svelte-compose/core/composer/config').ComposerWithoutExplicitArgs} */
const composer = /** @type {any} */ (await import("./index.js")).default;
remoteControl.disable();

testComposer(composer, {
    outputDirectory: "./.outputs",
    headless: true,
    pauseExecutionAfterBrowser: false,
});
```
