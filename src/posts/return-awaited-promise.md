---
date: 2020-01-20
slug: returning-awaited-promises
tags:
  - drafts
title: Returning Awaited Promises
eleventyExcludeFromCollections: true
---

Recently I have seen suggestions that you can remove the `await` from before the return value in an async function.

```js
// Before
async function getGithubUser() {
  return await fetch("https://api.github.com/users/danjordan");
}

// After
async function getGithubUser() {
  return fetch("https://api.github.com/users/danjordan");
}
```

This set off my spidey senses as being a bit odd, so I had at look a why you might want to do this.

### Why?

There is an ESLint rule (no-return-await) that specifically detects this issue and warns that `return await` is redundant. There are also numerous articles that back up this claim, including one by Jake Archibald <sup>[1](https://jakearchibald.com/2017/await-vs-return-vs-return-await/)</sup> that says

> Outside of try/catch blocks, return await is redundant. There's even an ESLint rule to detect it, but it allows it in try/catch.

### Is this still true?

Before Node v10 async stack traces were notoriously difficult to debug and Netflix even banned the usage of `async/await` until it was better supported. They did this because the `Error.stack` property in V8 only provided a truncated stack trace up to the most recent `await`.

Node v10 shipped with a `--async-stack-traces` flag that fixed this issue by providing zero-cost async stack traces. In Node v12 this flag is enabled by default.

---

When we use `await` the current function is added to the call stack until the promise has resolved. This addition to the call stack comes at the cost of an extra microtask. On the surface this would seem to have a small performance benefit, but are there any downsides?

Yes, if we don't use `await` the function won't show up in stack traces when an error is thrown.

The trade off is stack trace visibility Vs. performance. Personally the performance gain is very small and unless you have exhausted every other option you should not remove the `await`.

### TODO

- mention that it used to be true
- async stack traces fixed this

## Further Reading

- [Node.js best practices - Returning Promises](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/returningpromises.md)
- [ESLint rule - Disallows unnecessary return await](https://eslint.org/docs/rules/no-return-await#disallows-unnecessary-return-await-no-return-await)
- [Asynchronous Stack Traces](https://blittle.github.io/chrome-dev-tools/sources/async.html)
- [Faster async functions and promises](https://v8.dev/blog/fast-async)
