#!/usr/bin/env node
import { run } from './cli.js';

try {
  process.exitCode = await run(process.argv.slice(2));
} catch (error) {
  console.error(`linxira-skills: ${error.message}`);
  process.exitCode = 1;
}
