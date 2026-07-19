import fs from 'fs';
import { tools } from './src/tools/toolsConfig.js';
import { blogPosts } from './src/data/blogs.js';

const DOMAIN = 'https://kwiktoolbox.app';

const urls = [
  { loc: `${DOMAIN}/`, changefreq: 'daily', priority: '1.0' },
];

// Add Tools
tools.forEach(tool => {
  urls.push({
    loc: `${DOMAIN}/tools/${tool.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  });
});

// Add Blogs
blogPosts.forEach(blog => {
  urls.push({
    loc: `${DOMAIN}/blog/${blog.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
  });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log('Sitemap generated!');
