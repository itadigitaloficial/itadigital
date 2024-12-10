import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/auth';

export class AuthService {
  private static instance: AuthService;
  private auth = getAuth();
  private googleProvider = new GoogleAuthProvider();

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return this.getUserData(result.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return this.getUserData(result.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser);
        callback(userData);
      } else {
        callback(null);
      }
    });
  }

  private async getUserData(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      // Criar novo usuário no Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
        photoURL: firebaseUser.photoURL || undefined,
        isAdmin: false // Por padrão, novos usuários não são admin
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    }

    return userDoc.data() as User;
  }

  private handleAuthError(error: any): Error {
    console.error('Erro de autenticação:', error);

    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-email': 'Email inválido',
      'auth/email-already-in-use': 'Email já está em uso',
      'auth/weak-password': 'Senha muito fraca',
      'auth/popup-closed-by-user': 'Login com Google cancelado',
      'auth/network-request-failed': 'Erro de conexão',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    };

    return new Error(
      errorMessages[error.code] || 'Ocorreu um erro durante a autenticação'
    );
  }
}
