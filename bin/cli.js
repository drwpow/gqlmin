#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const chalk = require('chalk');
const meow = require('meow');
const { default: gqlmin } = require('../dist-node');

const cli = meow(
  `
Usage
  $ gqlmin [input] [options]

Options
  --help                display this
  --output, -o          specify output file
`,
  {
    flags: {
      output: {
        type: 'string',
        alias: 'o',
      },
    },
  }
);

let query = cli.input[0];

// if input is a file, load it (otherwise assume inline)
const pathname = path.resolve(process.cwd(), query);
if (fs.existsSync(pathname)) {
  query = fs.readFileSync(pathname, 'UTF-8');
}

const min = gqlmin(query, cli.flags);

// write to file if specifying output
if (cli.flags.output) {
  const timeStart = process.hrtime();
  const outputFile = path.resolve(process.cwd(), cli.flags.output);
  const parent = path.dirname(outputFile);
  fsExtra.mkdirpSync(parent);
  fs.writeFileSync(outputFile, min);

  const timeEnd = process.hrtime(timeStart);
  const time = timeEnd[0] + Math.round(timeEnd[1] / 1e6);
  console.log(chalk.green(`🚀 ${cli.input[0]} -> ${chalk.bold(cli.flags.output)} [${time}ms]`));
  return;
}

// otherwise, return
return min;
