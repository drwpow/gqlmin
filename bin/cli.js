#!/usr/bin/env node

import fs from 'node:fs';
import chalk from 'chalk';
import gqlmin from '../dist/index.js';
import { fileURLToPath } from 'node:url';

const [, , ...args] = process.argv;

if (args.includes('--help')) {
  console.log(`Usage
  $ gqlmin [input] [options]

Options
  --help                display this
  --output, -o          specify output file
`);
  process.exit(0);
}

let query = args[0] || stdin;

// if input is a file, load it (otherwise assume inline)
if (fs.existsSync(new URL(query, `file://${process.cwd()}/`))) {
  query = fs.readFileSync(new URL(query, `file://${process.cwd()}/`), 'utf8');
}

const min = gqlmin(query);

let output;
for (const outputI of [args.indexOf('--output'), args.indexOf('-o')]) {
  if (outputI === -1 || !args[outputI + 1]) {
    continue;
  }
  output = new URL(args[outputI + 1], `file://${process.cwd()}/`);
}

// write to file if specifying output
if (output) {
  const timeStart = process.hrtime();
  fs.mkdirSync(new URL('.', output), { recursive: true });
  fs.writeFileSync(output, min);

  const timeEnd = process.hrtime(timeStart);
  const time = timeEnd[0] + Math.round(timeEnd[1] / 1e6);
  console.log(
    chalk.green(
      `🚀 ${args[0]} -> ${chalk.bold(fileURLToPath(output))} [${time}ms]`,
    ),
  );
  process.exit(0);
} else {
  process.stdout(min);
}
