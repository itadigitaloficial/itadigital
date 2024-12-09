import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { ServiceGroup, ServiceProduct, ServiceOrder, Client } from '../types/service';

export class SupabaseService {
  private static instance: SupabaseService;

  private constructor() {}

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Grupos
  public async getGroups(): Promise<ServiceGroup[]> {
    const { data, error } = await supabase
      .from('service_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description || '',
      isActive: group.is_active,
      createdAt: group.created_at,
      updatedAt: group.updated_at
    }));
  }

  public async createGroup(group: Omit<ServiceGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceGroup> {
    const { data, error } = await supabase
      .from('service_groups')
      .insert({
        name: group.name,
        description: group.description,
        is_active: group.isActive
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async updateGroup(id: string, group: Partial<Omit<ServiceGroup, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceGroup> {
    const { data, error } = await supabase
      .from('service_groups')
      .update({
        name: group.name,
        description: group.description,
        is_active: group.isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async deleteGroup(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_groups')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Produtos
  public async getProducts(): Promise<ServiceProduct[]> {
    const { data, error } = await supabase
      .from('service_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      groupId: product.group_id,
      price: product.price,
      setupFee: product.setup_fee,
      billingCycle: product.billing_cycle,
      isActive: product.is_active,
      features: product.features,
      stockControl: product.stock_control,
      stockQuantity: product.stock_quantity,
      autoSetup: product.auto_setup,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
  }

  public async createProduct(product: Omit<ServiceProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceProduct> {
    const { data, error } = await supabase
      .from('service_products')
      .insert({
        name: product.name,
        description: product.description,
        group_id: product.groupId,
        price: product.price,
        setup_fee: product.setupFee,
        billing_cycle: product.billingCycle,
        is_active: product.isActive,
        features: product.features,
        stock_control: product.stockControl,
        stock_quantity: product.stockQuantity,
        auto_setup: product.autoSetup
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groupId: data.group_id,
      price: data.price,
      setupFee: data.setup_fee,
      billingCycle: data.billing_cycle,
      isActive: data.is_active,
      features: data.features,
      stockControl: data.stock_control,
      stockQuantity: data.stock_quantity,
      autoSetup: data.auto_setup,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async updateProduct(id: string, product: Partial<Omit<ServiceProduct, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceProduct> {
    const { data, error } = await supabase
      .from('service_products')
      .update({
        name: product.name,
        description: product.description,
        group_id: product.groupId,
        price: product.price,
        setup_fee: product.setupFee,
        billing_cycle: product.billingCycle,
        is_active: product.isActive,
        features: product.features,
        stock_control: product.stockControl,
        stock_quantity: product.stockQuantity,
        auto_setup: product.autoSetup,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      groupId: data.group_id,
      price: data.price,
      setupFee: data.setup_fee,
      billingCycle: data.billing_cycle,
      isActive: data.is_active,
      features: data.features,
      stockControl: data.stock_control,
      stockQuantity: data.stock_quantity,
      autoSetup: data.auto_setup,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Pedidos
  public async getOrders(): Promise<ServiceOrder[]> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(order => ({
      id: order.id,
      productId: order.product_id,
      clientId: order.client_id,
      status: order.status,
      price: order.price,
      setupFee: order.setup_fee,
      billingCycle: order.billing_cycle,
      nextDueDate: order.next_due_date,
      notes: order.notes,
      customFields: order.custom_fields,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }));
  }

  public async createOrder(order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceOrder> {
    const { data, error } = await supabase
      .from('service_orders')
      .insert({
        product_id: order.productId,
        client_id: order.clientId,
        status: order.status,
        price: order.price,
        setup_fee: order.setupFee,
        billing_cycle: order.billingCycle,
        next_due_date: order.nextDueDate,
        notes: order.notes,
        custom_fields: order.customFields
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      productId: data.product_id,
      clientId: data.client_id,
      status: data.status,
      price: data.price,
      setupFee: data.setup_fee,
      billingCycle: data.billing_cycle,
      nextDueDate: data.next_due_date,
      notes: data.notes,
      customFields: data.custom_fields,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async updateOrder(id: string, order: Partial<Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceOrder> {
    const { data, error } = await supabase
      .from('service_orders')
      .update({
        product_id: order.productId,
        client_id: order.clientId,
        status: order.status,
        price: order.price,
        setup_fee: order.setupFee,
        billing_cycle: order.billingCycle,
        next_due_date: order.nextDueDate,
        notes: order.notes,
        custom_fields: order.customFields,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      productId: data.product_id,
      clientId: data.client_id,
      status: data.status,
      price: data.price,
      setupFee: data.setup_fee,
      billingCycle: data.billing_cycle,
      nextDueDate: data.next_due_date,
      notes: data.notes,
      customFields: data.custom_fields,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  public async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Clientes
  public async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      document: client.document,
      createdAt: client.created_at
    }));
  }

  public async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      document: data.document,
      createdAt: data.created_at
    };
  }

  public async updateClient(id: string, client: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      document: data.document,
      createdAt: data.created_at
    };
  }

  public async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
