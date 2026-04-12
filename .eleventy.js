module.exports = function (eleventyConfig) {

  // Pass static assets through untouched
  eleventyConfig.addPassthroughCopy("src/assets");



  return {
    dir: {
      input: "src/pages",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"]
  };
};