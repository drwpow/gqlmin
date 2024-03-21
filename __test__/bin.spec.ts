import { execa } from 'execa';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('gqlmin bin', () => {
  it('basic', async () => {
    const cwd = fileURLToPath(new URL('../', import.meta.url));
    await execa(
      'node',
      [
        './bin/cli.js',
        './__test__/example.graphql',
        '-o',
        './__test__/example.min.graphql',
      ],
      { cwd },
    );

    expect(
      fs.readFileSync(
        new URL('./example.min.graphql', import.meta.url),
        'utf8',
      ),
    ).toBe('query allProducts{products{name price tags image{medium large}}}');
  });
});
