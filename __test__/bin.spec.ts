import fs from 'fs';
import path from 'path';

describe('gqlmin bin', () => {
  it('basic', () => {
    const min = fs.readFileSync(path.resolve(__dirname, 'example.min.graphql'), 'utf8');

    expect(min).toBe('query allProducts{products{name price tags image{medium large}}}');
  });
});
