module.exports = function (eleventyConfig) {

  // ── Passthrough ────────────────────────────────────────
  // Copy assets to _site untouched — no processing
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copy news.json to _site root so the ticker can fetch it
  eleventyConfig.addPassthroughCopy({ "src/news.json": "news.json" });

  // ── Ignore ─────────────────────────────────────────────
  // Components and layouts are includes — never output as pages
  eleventyConfig.ignores.add("src/_includes/**");

  // ── Config ─────────────────────────────────────────────
  return {
    dir: {
      input:    "src/pages",      // Eleventy reads pages from here
      includes: "../_includes",   // Components and layouts (relative to input)
      data:     "../_data",       // nav.js and any other data files
      output:   "_site"           // Built site output (git-ignored)
    },
    htmlTemplateEngine:     "njk",
    markdownTemplateEngine: "njk",
    templateFormats:        ["njk", "html", "md"]
  };
};
