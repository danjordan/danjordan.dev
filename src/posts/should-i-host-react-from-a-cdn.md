---
date: 2021-05-23
slug: should-i-host-react-from-a-cdn
tags:
  - tils
title: Should I host React from a CDN?
eleventyExcludeFromCollections: false
---

A long time ago, it was advised to serve common JavaScript libraries or frameworks from a third party CDN (Content Delivery Network) rather than from your own domain.

This looked something like the following...

```html
<script
  src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
  crossorigin="anonymous"
></script>
```

The main benefit of this was caching. A user visiting `example.com` would download `https://code.jquery.com/jquery-3.6.0.min.js` and their browser would cache the file contents against that URL.

**Cache Key:**

`https://code.jquery.com/jquery-3.6.0.min.js`

**File Contents:**

```js
function $(selector) {
  const els = document.querySelectorAll(selector)
  return Array.from(els);
}

const $.ajax = fetch;
```

Within the lifetime of that cache the same user could visit your site and they wouldn't need to download the file because its contents are already in your cache.

This had the potential to increase page load times as users would no longer need to download ~20Kb JavaScript files on their first visit to your site.

There are numerous downsides to serving libraries from a CDN including caching, speed, versioning, reliability, privacy, security and overall download size.

For the sake of this article, we are going to concentrate on privacy and caching.

Imagine you are the owner of `cool-cdn-stats.party` and you wrote a site that requests a bunch of the most common libraries served via CDN and measured the speed it took for the user to download them. Using this data you could predict that users who downloaded the file more quickly already had the file in their cache and you can advise people which CDN to use due to popularity. Sounds pretty harmless.

Now imagine you are the owner of `evil.com` and you do exactly the same thing as `cool-cdn-stats.party` but the scripts you are monitoring are `https://bank.com/loggedin.js` or `https://illegal-in-your-country.com/index.js`. You've now got a list of users that use a specific bank or a list of users that are accessing illegal content. No longer quite so harmless.

An article from 2010 on zoompf.com tries to calculate the probability of a cache hit when using a third party CDN. They take the number of sites in the Alexa top 2000 that serve a specific jQuery version from the Google CDN and calculate the probablity that someone will have that version in their cache after randomly visiting 35 of the top 2000.

This results in a 47% chance of a cache hit, though their maths leaves out a lot of detail and even they mention caveats within their methodology. It is implied that the real probability is likely lower.

Luckily for us, we don't have to worry about any maths from 2010.

Due to the privacy issues with caching resources, Google and other browser vendors have started to implement HTTP Cache partitioning.

This means that your cache stores the file contents next to the file's URL, and the URL of the top level frame where it was requested.

**Cache Key:**

`https://example.com, https://code.jquery.com/jquery-3.6.0.min.js`

**File Contents:**

```js
function $(selector) {
  const els = document.querySelectorAll(selector)
  return Array.from(els);
}

const $.ajax = fetch;
```

If you are serving `https://code.jquery.com/jquery-3.6.0.min.js` from `cool-cdn-stats.party` you won't get a cache hit.

This solves the privacy issues above as users will no longer get a cache hit when requesting external scripts.

There are also fixes for this built into the `fetch` API.

The following code is only possible with `mode: 'same-origin'`. Otherwise you will get an error.

```js
fetch(url, {
  cache: "only-if-cached",
});
```

So, should I host React from a CDN?

Almost certainly no.

Proof of concept or hobby projects are probably safe. Large scale production sites will see much bigger benefits by bundling their JS and hosting it themselves.

## Further Reading

- [Please stop using CDNs for external Javascript libraries](https://shkspr.mobi/blog/2020/10/please-stop-using-cdns-for-external-javascript-libraries/)
- [Should You Use JavaScript Library CDNs?](https://zoompf.com/blog/2010/01/should-you-use-javascript-library-cdns/)
- [Gaining security and privacy by partitioning the cache](https://developers.google.com/web/updates/2020/10/http-cache-partitioning)
- [whatwg/fetch: Only-if-cached issue](https://github.com/whatwg/fetch/issues/159)
