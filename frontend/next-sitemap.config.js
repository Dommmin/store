/** @type {import('next-sitemap').IConfig} */
module.exports = {
   siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost',
   generateRobotsTxt: true,
   robotsTxtOptions: {
      policies: [
         { userAgent: '*', allow: '/' },
         { userAgent: '*', disallow: '/api/' },
         { userAgent: '*', disallow: '/admin/' },
      ],
   },
};
