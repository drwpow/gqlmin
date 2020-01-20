# 🗜 gqlmin

4 kB (gzip) GraphQL query minifier.

This library removes all insignificant whitespace within a GraphQL query, as well as comments.

The actual library itself is `843 bytes`; the `4 kB` includes [Moo][moo], the lexer it uses.

###

## Usage

### ES Modules

```bash
npm install gqlmin
```

```js
import gqlmin from 'gqlmin';

const query = `
  query allProducts {
    products {
      name
      price
      image {
        medium
        large
      }
    }
  }
`;

const minified = gqlmin(query);
console.log(minified);
// query allProducts{products{name price …
```

### CLI

```
npx gqlmin ./query.graphql -o ./query.min.graphql
```

## FAQ

### Why do I need this?

If you don’t know if you need this, you probably don’t. In many apps, the whitespace within graphql
queries isn’t significant. However, there are 2 scenarios where this can have big benefits:

- **You have a LOT of GraphQL** such that stripping out whitespace actually does result in
  significant size reduction of your app
- **You are using `GET` requests and need better caching.** An underused feature of many GraphQL
  servers is the ability to send `GET` rather than `POST` requests for queries (mutations don’t
  support this). Minifying your GraphQL queries here can have some big benefits in reducing
  unnecessary URL length, as well as deduplicating caches where queries differ by whitespace only.

This library is useful because it can run at runtime (ES Modules) or as a build step (CLI).

### Are there any drawbacks?

Because the goals of this library are **small file size** and **performance**, it’s important to
note **this doesn’t validate GraphQL queries**. This library assumes you have already done that.

This means that if you minify a malformed GraphQL query, it won’t err; it will just silently output
the wrong thing. It’s assumed if you have a bad GraphQL query, your problems are probably bigger
than minification. Either way, validation won’t be a part of this project because it would add
weight.

[moo]: https://github.com/no-context/moo
