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

```js
function URLSearchParams(str) {
  const sequences = str.split("&");
  let output = {};

  for (let sequence of sequences) {
    const [name, value] = sequence.split("=");

    output[name.replace("+", " ")] = value.replace("+", " ");
  }

  this.output = output;
}
```

### Further Reading

- https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
- https://url.spec.whatwg.org/#concept-urlencoded-parser
