---
title: URLSearchParams
date: 2019-07-29
tags:
  - drafts
eleventyExcludeFromCollections: true
---

```js
const params = new URLSearchParams("?name=dan+jordan");
const name = params.get("name");
// "dan jordan"
```

### Further Reading

- https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
- https://url.spec.whatwg.org/#concept-urlencoded-parser
