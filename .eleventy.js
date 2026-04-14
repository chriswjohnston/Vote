module.exports = function (eleventyConfig) {
  
  // Pass through static files
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/news.json": "news.json" });

  return {
    dir: {
      input: "src",           // ← Important: Point to "src", not "src/pages"
      includes: "_includes",  // relative to input
      data: "_data",          // relative to input
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"]
  };
};
