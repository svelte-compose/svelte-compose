#!/usr/bin/env node

import { defineComposer } from "@svelte-compose/core";
import { composer } from "./config/composer.js";
import { checks } from "./config/checks.js";
import { tests } from "./config/tests.js";

export default defineComposer(composer, checks, tests);
