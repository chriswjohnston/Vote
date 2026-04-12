module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/news.json": "news.json" });

  return {
    dir: {
      input:    "src/pages",
      includes: "../_includes",
      data:     "../_data",
      output:   "_site"
    },
    htmlTemplateEngine:     "njk",
    markdownTemplateEngine: "njk",
    templateFormats:        ["njk", "html", "md"]
  };
};
