import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ServiceGroup, ServiceProduct, ServiceOrder, Client } from '../types/service';

export class FirebaseService {
  private static instance: FirebaseService;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Clientes
  public async getClients(): Promise<Client[]> {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      phone: doc.data().phone,
      document: doc.data().document,
      createdAt: doc.data().createdAt
    }));
  }

  public async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const clientsRef = collection(db, 'clients');
    const newClient = {
      ...client,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(clientsRef, newClient);
    return {
      id: docRef.id,
      ...client,
      createdAt: newClient.createdAt.toISOString()
    };
  }

  public async updateClient(id: string, client: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const clientRef = doc(db, 'clients', id);
    const updateData = {
      ...client,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(clientRef, updateData);
    return {
      id,
      ...client,
      createdAt: updateData.updatedAt.toISOString()
    } as Client;
  }

  // Grupos de Serviço
  public async getGroups(): Promise<ServiceGroup[]> {
    const groupsRef = collection(db, 'serviceGroups');
    const q = query(groupsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description || '',
      isActive: doc.data().isActive,
      createdAt: doc.data().createdAt.toISOString(),
      updatedAt: doc.data().updatedAt?.toISOString()
    }));
  }

  public async createGroup(group: Omit<ServiceGroup, 'id'>): Promise<ServiceGroup> {
    const groupsRef = collection(db, 'serviceGroups');
    const now = Timestamp.now();
    const newGroup = {
      ...group,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(groupsRef, newGroup);
    return {
      id: docRef.id,
      ...group,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  public async updateGroup(id: string, group: Partial<ServiceGroup>): Promise<void> {
    const groupRef = doc(db, 'serviceGroups', id);
    const updateData = {
      ...group,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(groupRef, updateData);
  }

  public async deleteGroup(id: string): Promise<void> {
    const groupRef = doc(db, 'serviceGroups', id);
    await deleteDoc(groupRef);
  }

  // Produtos
  public async getProducts(): Promise<ServiceProduct[]> {
    const productsRef = collection(db, 'serviceProducts');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      groupId: doc.data().groupId,
      price: doc.data().price,
      setupFee: doc.data().setupFee,
      billingCycle: doc.data().billingCycle,
      isActive: doc.data().isActive,
      features: doc.data().features,
      stockControl: doc.data().stockControl,
      stockQuantity: doc.data().stockQuantity,
      autoSetup: doc.data().autoSetup,
      createdAt: doc.data().createdAt.toISOString(),
      updatedAt: doc.data().updatedAt?.toISOString()
    }));
  }

  public async createProduct(product: Omit<ServiceProduct, 'id'>): Promise<ServiceProduct> {
    const productsRef = collection(db, 'serviceProducts');
    const now = Timestamp.now();
    const newProduct = {
      ...product,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(productsRef, newProduct);
    return {
      id: docRef.id,
      ...product,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  public async updateProduct(id: string, product: Partial<ServiceProduct>): Promise<void> {
    const productRef = doc(db, 'serviceProducts', id);
    const updateData = {
      ...product,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(productRef, updateData);
  }

  public async deleteProduct(id: string): Promise<void> {
    const productRef = doc(db, 'serviceProducts', id);
    await deleteDoc(productRef);
  }

  // Pedidos
  public async getOrders(): Promise<ServiceOrder[]> {
    const ordersRef = collection(db, 'serviceOrders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      productId: doc.data().productId,
      clientId: doc.data().clientId,
      status: doc.data().status,
      price: doc.data().price,
      setupFee: doc.data().setupFee,
      billingCycle: doc.data().billingCycle,
      nextDueDate: doc.data().nextDueDate,
      notes: doc.data().notes,
      customFields: doc.data().customFields,
      createdAt: doc.data().createdAt.toISOString(),
      updatedAt: doc.data().updatedAt?.toISOString()
    }));
  }

  public async createOrder(order: Omit<ServiceOrder, 'id'>): Promise<ServiceOrder> {
    const ordersRef = collection(db, 'serviceOrders');
    const now = Timestamp.now();
    const newOrder = {
      ...order,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(ordersRef, newOrder);
    return {
      id: docRef.id,
      ...order,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  public async updateOrder(id: string, order: Partial<ServiceOrder>): Promise<void> {
    const orderRef = doc(db, 'serviceOrders', id);
    const updateData = {
      ...order,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(orderRef, updateData);
  }

  public async deleteOrder(id: string): Promise<void> {
    const orderRef = doc(db, 'serviceOrders', id);
    await deleteDoc(orderRef);
  }
}
