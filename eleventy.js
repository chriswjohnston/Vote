const path = require("path");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/news.json": "news.json" });

  return {
    dir: {
      input:    "src/pages",
      includes: "../../src/_includes",
      data:     "../../src/_data",
      output:   "_site"
    },
    htmlTemplateEngine:     "njk",
    markdownTemplateEngine: "njk",
    templateFormats:        ["njk", "html", "md"]
  };
};
