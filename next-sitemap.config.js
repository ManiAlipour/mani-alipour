const mongoose = require("mongoose");

module.exports = {
  siteUrl: "https://manialipour.ir",
  generateRobotsTxt: true,
  sitemapSize: 5000,

  exclude: [
    "/admin",
    "/admin/*",
    "/dashboard",
    "/dashboard/*",
    "/auth/signin",
    "/auth/signup",
    "/auth/verify",
    "/api/*",
  ],

  transform: async (config, path) => ({
    loc: path,
    changefreq: path === "/" ? "daily" : "weekly",
    priority:
      path === "/" ? 1 : path === "/blogs" || path === "/projects" ? 0.9 : 0.7,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async (config) => {
    const result = [];

    const staticPages = ["/blogs", "/projects", "/about"];

    for (const path of staticPages) {
      result.push(await config.transform(config, path));
    }

    const res = await fetch("https://manialipour.ir/api/blogs/sitemap");
    const blogs = await res.json();

    const blogPaths = blogs.map((blog) => ({
      loc: `/blogs/${blog.slug}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: blog.updatedAt,
    }));

    return [...result, ...blogPaths];
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/api",
          "/api/*",
          "/auth/signin",
          "/auth/signup",
          "/auth/verify",
        ],
      },
    ],
  },
};
