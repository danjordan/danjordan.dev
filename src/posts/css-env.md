---
date: 2021-06-12
slug: css-env
tags:
  - posts
title: CSS env()
---

```html
<meta name="viewport" content="viewport-fit=cover" />
```

```css
body {
  padding: env(safe-area-inset-top, 20px) env(safe-area-inset-right, 20px) env(
      safe-area-inset-bottom,
      20px
    ) env(safe-area-inset-left, 20px);
}
```

## What is it

`env()` is a way for the browser to provide you with values related to the current environment

## Screenshot examples

## Further Reading

- [env() - MDN](<https://developer.mozilla.org/en-US/docs/Web/CSS/env()>)
- [CSS Environment Variables Module Level 1](https://drafts.csswg.org/css-env-1/#env-function)
- [Understanding the WebView Viewport in iOS 11](https://ayogo.com/blog/ios11-viewport/)
