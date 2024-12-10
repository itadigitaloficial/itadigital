import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOMetadata } from '../types/seo';

interface SEOProps extends SEOMetadata {
  children?: React.ReactNode;
}

export function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  children
}: SEOProps) {
  // Configurações padrão
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://seu-site.com';
  const siteTitle = 'Seu Blog Incrível';
  const siteDescription = 'Um blog incrível sobre tecnologia e inovação';
  const siteImage = `${siteUrl}/logo.png`;

  // Mescla metadados padrão com metadados específicos
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;
  const pageUrl = url || siteUrl;
  const pageImage = image || siteImage;

  return (
    <Helmet>
      {/* Metadados básicos */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />

      {/* Palavras-chave */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Metadados do autor */}
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Informações adicionais para artigos */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Renderiza children adicionais (útil para scripts personalizados) */}
      {children}
    </Helmet>
  );
}
