---
date: 2021-06-12
slug: styling-the-tab-bar-in-safari-15
tags:
  - posts
title: Styling the Tab Bar in Safari 15
---

Safari 15 has brought with it a redesign of the tab bar. In macOS and iPadOS the tab bar and URL bar are all on the same line in a much more condensed design; in iOS the tab bar has moved to the bottom of the screen allowing users to switch between tabs with a swipe of their thumb.

The new tab bar will change colour depending on your design. Safari will try to match the background colour or the header colour of your site.

To choose the colour yourself, you can add a meta tag to the `<head>` of your site.

```html
<meta name="theme-color" content="#2e3037" />
```

<!-- `theme-color` will also work in Chrome on Android. -->

Safari allows you to choose different colours depending on a media attribute so you can have different a colour for users with dark mode enabled.

```html
<meta
  name="theme-color"
  content="#ebe5ce"
  media="(prefers-color-scheme: light)"
/>

<meta
  name="theme-color"
  content="#ecd96f"
  media="(prefers-color-scheme: dark)"
/>
```

#### Caveats

- Whilst in dark mode, if you provide a colour that is too bright Safari will darken the colour.
- Safari will not allow you to use colours that could cause accessibility issues with the Safari UI i.e. the same red as the close app icon.

### iOS tab bar

The new tab bar in iOS is at the bottom of the screen hovering over the webpage and is likely to cover the UI of many web pages with static navigation. Developers can work around this by using `env()` in CSS.

`env()` is a way for the browser to provide you with values related to the current environment.

You'll need to tell the browser to use all available space with a viewport meta tag.

```html
<meta name="viewport" content="viewport-fit=cover" />
```

Then you can use `safe-area-inset-bottom` to push your UI above the tab bar.

```css
body {
  padding-bottom: calc(env(safe-area-inset-bottom) + 10px));
}
```

There are four different `safe-area-inset-x` values and `env()` provides a second parameter for a fallback if the environment variable is not set.

```css
body {
  padding:
    env(safe-area-inset-top)
    env(safe-area-inset-right, 20px)
    env(safe-area-inset-bottom)
    env(safe-area-inset-left, 20px);
}
```

## Further Reading

- [Design for Safari 15 - Apple](https://developer.apple.com/videos/play/wwdc2021/10029/)
- [theme-color - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color)
- [theme-color - HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics.html#meta-theme-color)
- [env() - MDN](<https://developer.mozilla.org/en-US/docs/Web/CSS/env()>)
- [CSS Environment Variables Module Level 1](https://drafts.csswg.org/css-env-1/#env-function)
