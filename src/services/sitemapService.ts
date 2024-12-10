import { BlogService } from './blogService';

export class SitemapService {
  private static instance: SitemapService;
  private blogService = BlogService.getInstance();

  private constructor() {}

  static getInstance(): SitemapService {
    if (!SitemapService.instance) {
      SitemapService.instance = new SitemapService();
    }
    return SitemapService.instance;
  }

  async generateSitemap(): Promise<string> {
    const baseUrl = import.meta.env.VITE_SITE_URL || 'https://seu-site.com';
    const posts = await this.blogService.getPosts('published');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

    return sitemapXml;
  }

  async saveSitemap() {
    const sitemapXml = await this.generateSitemap();
    
    // Em um ambiente de produção, você salvaria isso no diretório público
    // Aqui, vamos simular salvando no console
    console.log('Sitemap gerado:', sitemapXml);

    // Em um ambiente real:
    // const fs = await import('fs');
    // fs.writeFileSync('public/sitemap.xml', sitemapXml);
  }

  // Método para gerar robots.txt
  generateRobotsTxt(): string {
    const baseUrl = import.meta.env.VITE_SITE_URL || 'https://seu-site.com';
    
    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
  }
}
