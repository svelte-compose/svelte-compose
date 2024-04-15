import { ComposerWithoutExplicitArgs, Tests } from "@svelte-compose/core/composer/config";
import { ArgValues, Question } from "@svelte-compose/core/composer/options";
import { Page } from "puppeteer";

export async function runTests(page: Page, composer: ComposerWithoutExplicitArgs, options: ArgValues<Record<string, Question>>) {
    const tests: Tests = {
        expectProperty: async (selector, property, expectedValue) => {
            await expectProperty(page, selector, property, expectedValue);
        },
        elementExists: async (selector) => {
            await elementExists(page, selector);
        },
        click: async (selector, waitForNavigation) => {
            await click(page, selector, waitForNavigation);
        },
        expectUrlPath: async (path) => {
            await expectUrlPath(page, path);
        },
    };

    await executeComposerTests(composer, tests, options);
}

async function executeComposerTests(
    composer: ComposerWithoutExplicitArgs,
    testMethods: Tests,
    options: ArgValues<Record<string, Question>>,
) {
    if (!composer.tests || !composer.tests.tests || composer.tests.tests.length == 0)
        throw new Error(`Cannot test composer without tests!`);

    for (const test of composer.tests.tests) {
        if (test.condition && !test.condition(options)) continue;

        await test.run(testMethods);
    }
}

async function elementExists(page: Page, selector: string) {
    const elementToCheck = await page.$(selector);
    if (!elementToCheck) {
        throw new Error("No element found for selector " + selector);
    }

    return elementToCheck;
}

async function click(page: Page, selector: string, waitForNavigation: boolean) {
    await elementExists(page, selector);

    if (!waitForNavigation) {
        await page.click(selector);
    } else {
        // if a click triggers a page reload, this is the correct
        // syntax according to puppeteer documentation
        await Promise.all([page.waitForNavigation(), page.click(selector)]);
    }
}

async function expectUrlPath(page: Page, path: string) {
    const url = new URL(page.url());

    if (url.pathname !== path) {
        throw new Error(`Found path ${url.pathname} but expected ${path}!`);
    }
}

async function expectProperty(page: Page, selector: string, property: string, expectedValue: string) {
    const elementToCheck = await elementExists(page, selector);

    const computedStyle = await page.evaluate(
        // eslint-disable-next-line no-undef
        (element, pV) => window.getComputedStyle(element).getPropertyValue(pV),
        elementToCheck,
        property,
    );

    if (computedStyle !== expectedValue) {
        throw new Error(`Expected '${expectedValue}' but got '${computedStyle}' for selector '${selector}'`);
    }

    return computedStyle;
}
