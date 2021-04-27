const fs = require("fs");
const path = require("path");
const moment = require("moment");
const pluginSass = require("eleventy-plugin-sass");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");

moment.locale("en");

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("toIsoString", (date) => {
    return moment(date).toISOString();
  });

  eleventyConfig.addFilter("toLocale", (date) => {
    return moment(date).format("LL");
  });

  eleventyConfig.addFilter("toIsoStringShort", (date) => {
    return moment(date).utc().format("YYYY-MM-DD");
  });

  eleventyConfig.addFilter("toHumanReadable", (dateObj) => {
    return moment(dateObj).utc().format("Mo MMMM YYYY");
  });

  eleventyConfig.addPlugin(inclusiveLangPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginSass, {
    watch: ["src/**/*.{scss,sass}", "!node_modules/**"],
  });

  eleventyConfig.addPassthroughCopy("src/js/index.js");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: (err, browserSync) => {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    dir: {
      includes: "_includes",
      input: "src",
      layouts: "_layouts",
    },
  };
};
