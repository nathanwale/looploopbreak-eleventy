module.exports = (eleventyConfig) => {

  eleventyConfig.addPassthroughCopy("style");
  
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