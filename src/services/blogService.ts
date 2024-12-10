import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import { BlogPost, BlogComment, BlogAuthor } from '../types/blog';

export class BlogService {
  private static instance: BlogService;

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // Posts
  public async getPosts(status: 'draft' | 'published' | 'all' = 'published'): Promise<BlogPost[]> {
    try {
      const postsRef = collection(db, 'blog_posts');
      let q = query(postsRef, orderBy('publishedAt', 'desc'));
      
      if (status !== 'all') {
        q = query(q, where('status', '==', status));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogPost));
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  }

  public async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar post por slug:', error);
      return null;
    }
  }

  public async createPost(post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'likes' | 'views'>): Promise<BlogPost> {
    try {
      const postsRef = collection(db, 'blog_posts');
      const now = Timestamp.now();
      
      const newPost = {
        ...post,
        publishedAt: now,
        updatedAt: now,
        likes: 0,
        views: 0
      };
      
      const docRef = await addDoc(postsRef, newPost);
      return {
        id: docRef.id,
        ...newPost
      } as BlogPost;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  }

  public async updatePost(id: string, post: Partial<BlogPost>): Promise<void> {
    try {
      const postRef = doc(db, 'blog_posts', id);
      const updateData = {
        ...post,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(postRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      throw error;
    }
  }

  public async deletePost(id: string): Promise<void> {
    try {
      const postRef = doc(db, 'blog_posts', id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      throw error;
    }
  }

  public async likePost(postId: string, userId: string): Promise<void> {
    try {
      const likeRef = doc(db, 'blog_post_likes', `${postId}_${userId}`);
      const likeDoc = await getDoc(likeRef);
      
      if (!likeDoc.exists()) {
        const postRef = doc(db, 'blog_posts', postId);
        await updateDoc(postRef, {
          likes: increment(1)
        });
        await addDoc(collection(db, 'blog_post_likes'), {
          postId,
          userId,
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      throw error;
    }
  }

  // Comments
  public async getComments(postId: string): Promise<BlogComment[]> {
    try {
      const commentsRef = collection(db, 'blog_comments');
      const q = query(
        commentsRef, 
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogComment));
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  }

  public async addComment(comment: Omit<BlogComment, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'replies'>): Promise<BlogComment> {
    try {
      const commentsRef = collection(db, 'blog_comments');
      const now = Timestamp.now();
      
      const newComment = {
        ...comment,
        createdAt: now,
        updatedAt: now,
        likes: 0,
        replies: []
      };
      
      const docRef = await addDoc(commentsRef, newComment);
      return {
        id: docRef.id,
        ...newComment
      } as BlogComment;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  public async likeComment(commentId: string, userId: string): Promise<void> {
    try {
      const likeRef = doc(db, 'blog_comment_likes', `${commentId}_${userId}`);
      const likeDoc = await getDoc(likeRef);
      
      if (!likeDoc.exists()) {
        const commentRef = doc(db, 'blog_comments', commentId);
        await updateDoc(commentRef, {
          likes: increment(1)
        });
        await addDoc(collection(db, 'blog_comment_likes'), {
          commentId,
          userId,
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
      throw error;
    }
  }

  // Authors
  public async getAuthor(id: string): Promise<BlogAuthor | null> {
    try {
      const authorRef = doc(db, 'blog_authors', id);
      const authorDoc = await getDoc(authorRef);
      
      if (!authorDoc.exists()) return null;
      
      return {
        id: authorDoc.id,
        ...authorDoc.data()
      } as BlogAuthor;
    } catch (error) {
      console.error('Erro ao buscar autor:', error);
      return null;
    }
  }

  // Image Upload
  public async uploadImage(file: File): Promise<string> {
    try {
      const storage = getStorage();
      const filename = `blog/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      throw error;
    }
  }
}
