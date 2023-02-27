const sass = require("sass");
const fs = require("node:fs");
const path = require("node:path");
const htmlmin = require("html-minifier");
const format = require("date-fns/format");
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
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/img/1px.png");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",

    // `compile` is called once per .scss file in the input directory
    compile: function (inputContent, inputPath) {
      const parsed = path.parse(inputPath);

      if (parsed.name.startsWith("_")) return;

      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || ".", this.config.dir.includes],
        style: "compressed",
      });

      this.addDependencies(inputPath, result.loadedUrls);

      // This is the render function, `data` is the full data cascade
      return () => {
        return result.css;
      };
    },
  });

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
