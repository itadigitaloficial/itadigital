export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

export interface OpenGraphMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article';
}

export interface TwitterCardMetadata {
  card: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image: string;
}
