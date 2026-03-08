import { bench } from 'vitest';
import minify from '../src/index';

bench('basic', () => {
  minify(`
    query LIST_PRODUCTS {
      products( first: $first, after: $after ) {
        label
        displayName
        logo
        plans( first: $firstPlans ) {
          free
        }
      }
    }
  `);
});
