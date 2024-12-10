import { SEOMetadata } from '../types/seo';
import { BlogPost } from '../types/blog';

export class SEOService {
  private static instance: SEOService;

  private constructor() {}

  static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService();
    }
    return SEOService.instance;
  }

  generatePostSEO(post: BlogPost): SEOMetadata {
    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      image: post.coverImage,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      author: post.author?.name
    };
  }

  generateDefaultSEO(): SEOMetadata {
    return {
      title: 'Blog de Tecnologia e Inovação',
      description: 'Descubra as últimas tendências em tecnologia, desenvolvimento e inovação',
      keywords: ['tecnologia', 'inovação', 'desenvolvimento', 'programação'],
      type: 'website'
    };
  }

  generateBlogListSEO(): SEOMetadata {
    return {
      title: 'Todos os Posts',
      description: 'Explore nossa biblioteca de artigos sobre tecnologia e inovação',
      keywords: ['blog', 'artigos', 'tecnologia', 'inovação'],
      type: 'website'
    };
  }
}
