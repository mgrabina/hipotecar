module.exports = {
  siteUrl: 'https://www.micreditohipotecario.com.ar',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.micreditohipotecario.com.ar/server-sitemap.xml',
    ],
  },
};
