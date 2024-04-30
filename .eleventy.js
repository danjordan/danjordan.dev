const format = require("date-fns/format");
const pluginRev = require("eleventy-plugin-rev");
const pluginEleventySass = require("eleventy-sass");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
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

  eleventyConfig.addFilter("toHumanReadable", (date) => {
    const utc = zonedTimeToUtc(date);
    return format(utc, "ko MMMM u");
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginInclusiveLanguage);
  eleventyConfig.addPlugin(pluginEleventySass, {
    rev: true,
  });
  eleventyConfig.addPlugin(pluginRev);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginWebc);

  eleventyConfig.addPassthroughCopy("src/img/*");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  return {
    dir: {
      includes: "_includes",
      input: "src",
      layouts: "_layouts",
    },
    htmlTemplateEngine: "njk",
  };
};
