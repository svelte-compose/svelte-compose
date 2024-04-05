#!/usr/bin/env node

import { defineComposer } from "@svelte-compose/core";
import { composer } from "./config/composer.js";
import { tests } from "./config/tests.js";
import { checks } from "./config/checks.js";

export default defineComposer(composer, checks, tests);
