import format from "date-fns/format";
import pluginSass from "./_11ty/sassPlugin.js";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import { fromZonedTime } from "date-fns-tz";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginInclusiveLanguage from "@11ty/eleventy-plugin-inclusive-language";

export default async function (eleventyConfig) {
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
    const utc = fromZonedTime(date);
    return format(utc, "yyyy-MM-dd");
  });

  eleventyConfig.addFilter("toHumanReadable", (date) => {
    const utc = fromZonedTime(date);
    return format(utc, "ko MMMM u");
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginInclusiveLanguage);
  eleventyConfig.addPlugin(pluginSass);
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
}
