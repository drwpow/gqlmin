import minify from '../src/index';

describe('minify function', () => {
  describe('minification', () => {
    it('basic', () => {
      const query = `
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
      `;
      const minified = `query LIST_PRODUCTS{products(first:$first,after:$after){label displayName logo plans(first:$firstPlans){free}}}`;
      expect(minify(query)).toBe(minified);
    });

    it('string', () => {
      const query = `
        query GET_PRODUCT {
          product (displayName: "Two  Spaces") {
            label
            displayName
            logo
          }
        }
      `;
      const minified = `query GET_PRODUCT{product(displayName:"Two  Spaces"){label displayName logo}}`;
      expect(minify(query)).toBe(minified);
    });

    it('removes comments', () => {
      const query = `
        query GET_PRODUCT {
          # TODO: fix this
          product(displayName: "Timber Logging") {
            label # Also rename this
            displayName
            logo
          }
        }
      `;
      const minified = `query GET_PRODUCT{product(displayName:"Timber Logging"){label displayName logo}}`;
      expect(minify(query)).toBe(minified);
    });

    it('removes descriptions', () => {
      const query = `
        query GET_PRODUCT {
          """single line description"""
          product(displayName: "Timber Logging") {
            label
            """
            multi
            line
            description
            """
            displayName
            logo
          }
        }
      `;
      const minified = `query GET_PRODUCT{product(displayName:"Timber Logging"){label displayName logo}}`;
      expect(minify(query)).toBe(minified);
    });

    it('preserves multiline queries', () => {
      const query = `
        query GET_PRODUCT {
          product(valueHTML: """
          multi
          line
          query""") {
            label
            displayName
            logo
          }
        }
      `;
      const minified = `query GET_PRODUCT{product(valueHTML:"""
          multi
          line
          query"""){label displayName logo}}`;
      expect(minify(query)).toBe(minified);
    });
  });
});
