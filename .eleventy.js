const htmlmin = require("html-minifier");
const format = require("date-fns/format");
const pluginRev = require("eleventy-plugin-rev");
const pluginEleventySass = require("eleventy-sass");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const zonedTimeToUtc = require("date-fns-tz/zonedTimeToUtc");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginInclusiveLanguage = require("@11ty/eleventy-plugin-inclusive-language");

module.exports = (eleventyConfig) => {
  eleventyConfig.addCollection("pages", (collectionApi) => {
    return collectionApi.getAllSorted().filter((item) => {
      // Remove css files that get added by addExtension
      const isCss = item.data.page.outputFileExtension === "css";
      return !isCss;
    });
  });

  eleventyConfig.addFilter("take", (arr = [], num) => {
    return arr.slice(0, num);
  });

  eleventyConfig.addFilter("toIsoStringShort", (date) => {
    const utc = zonedTimeToUtc(date);
    return format(utc, "yyyy-MM-dd");
  });

  eleventyConfig.addPlugin(pluginInclusiveLanguage);
  eleventyConfig.addPlugin(pluginEleventySass, {
    rev: true,
  });
  eleventyConfig.addPlugin(pluginRev);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/img/1px.png");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }

    return content;
  });

  return {
    dir: {
      includes: "_includes",
      input: "src",
      layouts: "_layouts",
    },
    htmlTemplateEngine: "njk",
  };
};
