import moo from 'moo';

export default function minify(query: string) {
  const lexer = moo.states({
    main: {
      comment: /#.*$/,
      blockString: { match: /:\s*"""/, push: 'blockString' }, // treat these differently from descriptions
      description: { match: '"""', push: 'description' },
      string: /"(?:\\"|[^"])*"/,
      variable: /\$[A-z\d]+/,
      id: /[A-z\d]+/,
      ws: { match: /[\s\t]+/, lineBreaks: true }, // whitespace to be removed
      any: /./,
    },
    description: {
      descriptionEnd: { match: '"""', pop: 1 }, // exit description
      ws: { match: /[\s\t]+/, lineBreaks: true },
      description: /./,
    },
    blockString: {
      esc: { match: '"""', pop: 1 }, // exit block string
      stringSpace: { match: /[\s\t]+/, lineBreaks: true },
      any: /./,
    },
  });
  lexer.reset(query);

  // filter out comments & descriptions to make ws removal easier
  let withoutComments = '';
  for (const { type, value } of lexer) {
    if (type !== 'comment' && type !== 'description' && type !== 'descriptionEnd') {
      withoutComments += value;
    }
  }
  lexer.reset(withoutComments);

  // conditionally strip out ws where possible
  const tokens = Array.from(lexer);
  return tokens
    .map(({ type, value }, i) => {
      if (type === 'blockString') {
        // trim whitespace within multi-line arguments
        return value.replace(/\s*/g, '');
      }
      // handle whitespace surrounding IDs
      if (type === 'ws') {
        return tokens[i - 1] &&
          tokens[i - 1].type === 'id' &&
          tokens[i + 1] &&
          tokens[i + 1].type === 'id'
          ? ' ' // if ws is between two IDs, reduce to single space
          : ''; // otherwise remove
      }
      return value;
    })
    .join('')
    .trim();
}
