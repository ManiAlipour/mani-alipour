/** @type {import('next-sitemap').IConfig} */

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

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority:
        path === "/"
          ? 1
          : path === "/blogs" || path === "/projects"
            ? 0.9
            : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async (config) => {
    const paths = ["/blogs", "/projects", "/about"];

    return Promise.all(paths.map((path) => config.transform(config, path)));
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
