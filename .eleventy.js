const htmlmin = require("html-minifier");
const format = require("date-fns/format");
const Image = require("@11ty/eleventy-img");
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

  eleventyConfig.addFilter("toHumanReadable", (date) => {
    const utc = zonedTimeToUtc(date);
    return format(utc, "ko MMMM u");
  });

  eleventyConfig.addPlugin(pluginInclusiveLanguage);
  eleventyConfig.addPlugin(pluginEleventySass, {
    rev: true,
  });
  eleventyConfig.addPlugin(pluginRev);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPassthroughCopy("src/img/*");
  eleventyConfig.addPassthroughCopy("src/_headers");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addNunjucksAsyncShortcode(
    "Image",
    async (src, alt, className) => {
      if (!alt) {
        throw new Error(`Missing \`alt\` on myImage from: ${src}`);
      }

      let stats = await Image(src, {
        widths: [25, 320, 640, 960, 1200, 1800, 2400],
        formats: ["jpeg", "png", "webp"],
        urlPath: "/img/",
        outputDir: "./_site/img/",
      });

      let lowestSrc = stats["jpeg"][0];

      const srcset = Object.keys(stats).reduce(
        (acc, format) => ({
          ...acc,
          [format]: stats[format].reduce(
            (_acc, curr) => `${_acc} ${curr.srcset} ,`,
            ""
          ),
        }),
        {}
      );

      const img = `<img
        alt="${alt}"
        class="${className}"
        src="${lowestSrc.url}"
        sizes='(min-width: 1024px) 1024px, 100vw'
        srcset="${srcset["jpeg"]}"
      >`;

      return img;
    }
  );

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
