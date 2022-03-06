const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("style/");
  eleventyConfig.addPassthroughCopy("images/");
  eleventyConfig.addPassthroughCopy("fonts/");
  
  eleventyConfig.addWatchTarget("style/");
  eleventyConfig.addWatchTarget("images/");
  eleventyConfig.addWatchTarget("fonts/");

  eleventyConfig.addCollection(
      "site_tags",
      (collection) => {
          let tag_set = new Set();
          for (item of collection.getAll()) {
            if (item.data.tags) {
              for (tag of item.data.tags) {
                tag_set.add(tag);
              }
            }
          }
          return Array.from(tag_set);
      }
  );
};