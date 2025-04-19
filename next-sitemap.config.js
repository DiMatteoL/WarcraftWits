/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.warcraftwits.com',
  generateRobotsTxt: true,
  exclude: ['/protected', '/protected/*'],
  changefreq: 'daily',
  priority: 1.0,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/static/', '/protected/'],
      },
    ],
  },
  // This function will be called during build time
  async additionalPaths(config) {
    const { createClient } = require('@supabase/supabase-js');

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    try {
      // Fetch only active expansions
      const { data: expansions } = await supabase
        .from('expansion')
        .select('slug')
        .eq('is_active', true);

      // Fetch instances only for active expansions
      const { data: instances } = await supabase
        .from('instance')
        .select(`
          slug,
          expansion:expansion_id(
            slug,
            is_active
          )
        `)
        .eq('expansion.is_active', true);

      // Generate paths for active expansions
      const expansionPaths = (expansions || []).map((expansion) => ({
        loc: `/expansion/${expansion.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      }));

      // Generate paths for instances of active expansions
      const instancePaths = (instances || []).map((instance) => ({
        loc: `/expansion/${instance.expansion.slug}/${instance.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
      }));

      // Add the main match page
      const matchPaths = [{
        loc: '/match',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      }];

      // Generate paths for match pages of active expansions
      const matchExpansionPaths = (expansions || []).map((expansion) => ({
        loc: `/match/${expansion.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8,
      }));

      return [...expansionPaths, ...instancePaths, ...matchPaths, ...matchExpansionPaths];
    } catch (error) {
      console.error('Error generating sitemap paths:', error);
      return [];
    }
  },
};
