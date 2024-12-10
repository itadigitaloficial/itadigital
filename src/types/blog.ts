export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  authorId: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  likes: number;
  views: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: BlogComment[];
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}
