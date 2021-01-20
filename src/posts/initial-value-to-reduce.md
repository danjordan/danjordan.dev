---
date: 2019-07-27
slug: initial-value-to-reduce
tags:
  - drafts
title: initial value to reduce
eleventyExcludeFromCollections: true
---

```js
const ints = [1, 2, 3];

const odds = ints.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);
```

But...

```js
const ints = [{ value: 1 }, { value: 2 }, { value: 3 }];

const odds = ints.reduce((accumulator, currentValue) => {
  return accumulator + currentValue.value;
});
```

### Further Reading

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
- https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduce
