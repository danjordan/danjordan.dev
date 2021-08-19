const fs = require("fs");
const htmlmin = require("html-minifier");
const format = require("date-fns/format");
const pluginSass = require("eleventy-plugin-sass");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const zonedTimeToUtc = require("date-fns-tz/zonedTimeToUtc");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginInclusiveLanguage = require("@11ty/eleventy-plugin-inclusive-language");

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("take", (arr = [], num) => {
    return arr.slice(0, num);
  });

  eleventyConfig.addFilter("toIsoStringShort", (date) => {
    const utc = zonedTimeToUtc(date);
    return format(utc, "yyyy-MM-dd");
  });

  eleventyConfig.addPlugin(pluginInclusiveLanguage);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSass, {
    watch: ["src/**/*.{scss,sass}", "!node_modules/**"],
  });
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/js/index.js");
  eleventyConfig.addPassthroughCopy("src/img/1px.png");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

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
