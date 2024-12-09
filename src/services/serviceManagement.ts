import { ServiceGroup, ServiceProduct, ServiceOrder, ServiceConfig, ClientService, Client, PaymentHistory } from '../types/service';

export class ServiceManagementService {
  private static instance: ServiceManagementService;
  private storagePrefix = '@ita-digital:service-management:';
  private products: ServiceProduct[] = [];
  private orders: ServiceOrder[] = [];
  private clients: Client[] = [];

  private constructor() {
    const storedProducts = localStorage.getItem(this.storagePrefix + 'products');
    const storedOrders = localStorage.getItem(this.storagePrefix + 'orders');
    const storedClients = localStorage.getItem('clients');

    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    }
    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
    }
    if (storedClients) {
      this.clients = JSON.parse(storedClients);
    }
  }

  public static getInstance(): ServiceManagementService {
    if (!ServiceManagementService.instance) {
      ServiceManagementService.instance = new ServiceManagementService();
    }
    return ServiceManagementService.instance;
  }

  // Grupos
  public async getGroups(): Promise<ServiceGroup[]> {
    const groups = localStorage.getItem(this.storagePrefix + 'groups');
    return groups ? JSON.parse(groups) : [];
  }

  public async createGroup(group: Omit<ServiceGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceGroup> {
    const groups = await this.getGroups();
    const newGroup: ServiceGroup = {
      ...group,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    groups.push(newGroup);
    localStorage.setItem(this.storagePrefix + 'groups', JSON.stringify(groups));
    return newGroup;
  }

  public async updateGroup(id: string, group: Partial<Omit<ServiceGroup, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceGroup> {
    const groups = await this.getGroups();
    const index = groups.findIndex(g => g.id === id);
    
    if (index === -1) {
      throw new Error('Grupo não encontrado');
    }

    const updatedGroup: ServiceGroup = {
      ...groups[index],
      ...group,
      updatedAt: new Date().toISOString(),
    };

    groups[index] = updatedGroup;
    localStorage.setItem(this.storagePrefix + 'groups', JSON.stringify(groups));
    return updatedGroup;
  }

  public async deleteGroup(id: string): Promise<void> {
    const groups = await this.getGroups();
    const products = await this.getProducts();
    
    if (products.some(p => p.groupId === id)) {
      throw new Error('Não é possível excluir um grupo que possui produtos');
    }

    const filteredGroups = groups.filter(g => g.id !== id);
    localStorage.setItem(this.storagePrefix + 'groups', JSON.stringify(filteredGroups));
  }

  // Produtos
  public async getProducts(): Promise<ServiceProduct[]> {
    const products = localStorage.getItem(this.storagePrefix + 'products');
    return products ? JSON.parse(products) : [];
  }

  public async getProductsByGroup(groupId: string): Promise<ServiceProduct[]> {
    const products = await this.getProducts();
    return products.filter(p => p.groupId === groupId);
  }

  public async createProduct(product: Omit<ServiceProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceProduct> {
    const products = await this.getProducts();
    const newProduct: ServiceProduct = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    localStorage.setItem(this.storagePrefix + 'products', JSON.stringify(products));
    return newProduct;
  }

  public async updateProduct(id: string, product: Partial<Omit<ServiceProduct, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceProduct> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Produto não encontrado');
    }

    const updatedProduct: ServiceProduct = {
      ...products[index],
      ...product,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;
    localStorage.setItem(this.storagePrefix + 'products', JSON.stringify(products));
    return updatedProduct;
  }

  public async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const orders = await this.getOrders();
    
    if (orders.some(o => o.productId === id)) {
      throw new Error('Não é possível excluir um produto que possui pedidos');
    }

    const filteredProducts = products.filter(p => p.id !== id);
    localStorage.setItem(this.storagePrefix + 'products', JSON.stringify(filteredProducts));
  }

  // Pedidos
  public async getOrders(): Promise<ServiceOrder[]> {
    return this.orders;
  }

  public async getOrdersByUser(userId: string): Promise<ServiceOrder[]> {
    return this.orders.filter(o => o.userId === userId);
  }

  public async getOrdersByProduct(productId: string): Promise<ServiceOrder[]> {
    return this.orders.filter(o => o.productId === productId);
  }

  public async createOrder(order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceOrder> {
    const newOrder: ServiceOrder = {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.orders.push(newOrder);
    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
    return newOrder;
  }

  public async updateOrder(id: string, orderData: Partial<Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServiceOrder> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Pedido não encontrado');
    }

    const updatedOrder: ServiceOrder = {
      ...this.orders[index],
      ...orderData,
      updatedAt: new Date().toISOString()
    };

    this.orders[index] = updatedOrder;
    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
    return updatedOrder;
  }

  public async deleteOrder(id: string): Promise<void> {
    this.orders = this.orders.filter(o => o.id !== id);
    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
  }

  // Configurações
  public async getConfig(): Promise<ServiceConfig> {
    const config = localStorage.getItem(this.storagePrefix + 'config');
    if (!config) {
      const defaultConfig: ServiceConfig = {
        autoSetupEnabled: false,
        stockControlEnabled: false,
        defaultBillingCycle: 'monthly',
        paymentGateways: [],
        notificationSettings: {
          emailEnabled: true,
          smsEnabled: false,
        },
      };
      await this.updateConfig(defaultConfig);
      return defaultConfig;
    }
    return JSON.parse(config);
  }

  public async updateConfig(config: Partial<ServiceConfig>): Promise<ServiceConfig> {
    const currentConfig = await this.getConfig();
    const updatedConfig: ServiceConfig = {
      ...currentConfig,
      ...config,
    };
    localStorage.setItem(this.storagePrefix + 'config', JSON.stringify(updatedConfig));
    return updatedConfig;
  }

  // Métodos para gerenciar serviços de clientes
  public async getClientServices(clientId: string): Promise<ClientService> {
    const clientOrders = this.orders.filter(order => order.clientId === clientId);
    const activeOrders = clientOrders.filter(order => order.status === 'active');
    
    const totalSpent = clientOrders.reduce((total, order) => {
      return total + order.price + (order.setupFee || 0);
    }, 0);

    const lastOrderDate = clientOrders.length > 0
      ? Math.max(...clientOrders.map(order => new Date(order.createdAt).getTime()))
      : null;

    const nextDueDate = activeOrders.length > 0
      ? Math.min(...activeOrders.map(order => new Date(order.nextDueDate).getTime()))
      : null;

    const hasOverduePayments = activeOrders.some(order => 
      new Date(order.nextDueDate).getTime() < new Date().getTime()
    );

    return {
      clientId,
      totalActiveServices: activeOrders.length,
      totalSpent,
      lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString() : null,
      nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : null,
      status: activeOrders.length === 0 ? 'inactive' : hasOverduePayments ? 'overdue' : 'active',
      orders: clientOrders
    };
  }

  public async getClientPaymentHistory(clientId: string): Promise<PaymentHistory[]> {
    const clientOrders = this.orders.filter(order => order.clientId === clientId);
    const history: PaymentHistory[] = [];

    for (const order of clientOrders) {
      const product = this.products.find(p => p.id === order.productId);
      if (!product) continue;

      // Adicionar taxa de setup se existir
      if (order.setupFee) {
        history.push({
          date: order.createdAt,
          amount: order.setupFee,
          type: 'setup',
          productName: product.name,
          status: 'paid'
        });
      }

      // Adicionar pagamentos recorrentes
      const startDate = new Date(order.createdAt);
      const today = new Date();
      let currentDate = new Date(startDate);

      while (currentDate <= today) {
        const dueDate = new Date(currentDate);
        const status = dueDate <= today ? 'paid' : 'pending';

        history.push({
          date: dueDate.toISOString(),
          amount: order.price,
          type: 'recurring',
          productName: product.name,
          status
        });

        // Avançar para o próximo ciclo
        switch (order.billingCycle) {
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'quarterly':
            currentDate.setMonth(currentDate.getMonth() + 3);
            break;
          case 'semiannual':
            currentDate.setMonth(currentDate.getMonth() + 6);
            break;
          case 'annual':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
          case 'biennial':
            currentDate.setFullYear(currentDate.getFullYear() + 2);
            break;
        }
      }
    }

    // Ordenar por data, mais recente primeiro
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async getClientFinancial(clientId: string): Promise<ClientFinancial> {
    const clientOrders = this.orders.filter(order => order.clientId === clientId);
    const payments = await this.getClientPaymentHistory(clientId);
    
    const paidPayments = payments.filter(p => p.status === 'paid');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const overduePayments = payments.filter(p => p.status === 'overdue');

    const totalPaid = paidPayments.reduce((total, p) => total + p.amount, 0);
    const totalPending = pendingPayments.reduce((total, p) => total + p.amount, 0);
    const totalOverdue = overduePayments.reduce((total, p) => total + p.amount, 0);
    const balance = totalPaid - (totalPending + totalOverdue);

    const lastPaymentDate = paidPayments.length > 0
      ? Math.max(...paidPayments.map(p => new Date(p.paymentDate || p.date).getTime()))
      : undefined;

    const nextDueDate = pendingPayments.length > 0
      ? Math.min(...pendingPayments.map(p => new Date(p.dueDate).getTime()))
      : undefined;

    return {
      clientId,
      balance,
      totalPaid,
      totalPending,
      totalOverdue,
      lastPaymentDate: lastPaymentDate ? new Date(lastPaymentDate).toISOString() : undefined,
      nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : undefined,
      paymentHistory: payments.filter(p => p.status === 'paid'),
      pendingInvoices: [...pendingPayments, ...overduePayments].sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    };
  }

  public async updatePayment(payment: PaymentHistory): Promise<void> {
    const storedPayments = localStorage.getItem(this.storagePrefix + 'payments') || '[]';
    const payments: PaymentHistory[] = JSON.parse(storedPayments);
    
    const index = payments.findIndex(p => p.id === payment.id);
    if (index === -1) {
      payments.push(payment);
    } else {
      payments[index] = payment;
    }

    localStorage.setItem(this.storagePrefix + 'payments', JSON.stringify(payments));
  }

  public async getClientPaymentHistory(clientId: string): Promise<PaymentHistory[]> {
    const storedPayments = localStorage.getItem(this.storagePrefix + 'payments') || '[]';
    const payments: PaymentHistory[] = JSON.parse(storedPayments);
    return payments
      .filter(p => p.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async suspendClientServices(clientId: string): Promise<void> {
    const clientOrders = this.orders.filter(order => order.clientId === clientId && order.status === 'active');
    
    for (const order of clientOrders) {
      const index = this.orders.findIndex(o => o.id === order.id);
      if (index !== -1) {
        this.orders[index] = {
          ...order,
          status: 'suspended',
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
  }

  public async reactivateClientServices(clientId: string): Promise<void> {
    const clientOrders = this.orders.filter(order => order.clientId === clientId && order.status === 'suspended');
    
    for (const order of clientOrders) {
      const index = this.orders.findIndex(o => o.id === order.id);
      if (index !== -1) {
        this.orders[index] = {
          ...order,
          status: 'active',
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
  }

  public async cancelClientServices(clientId: string): Promise<void> {
    const clientOrders = this.orders.filter(order => order.clientId === clientId && order.status !== 'cancelled');
    
    for (const order of clientOrders) {
      const index = this.orders.findIndex(o => o.id === order.id);
      if (index !== -1) {
        this.orders[index] = {
          ...order,
          status: 'cancelled',
          updatedAt: new Date().toISOString()
        };
      }
    }
    
    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
  }

  public async updateOrderStatus(orderId: string, status: ServiceOrder['status']): Promise<void> {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) {
      throw new Error('Pedido não encontrado');
    }

    this.orders[index] = {
      ...this.orders[index],
      status,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.storagePrefix + 'orders', JSON.stringify(this.orders));
  }

  // Client Management
  async getClients() {
    const storedClients = localStorage.getItem('clients');
    return storedClients ? JSON.parse(storedClients) : [];
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>) {
    const newClient = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this.clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(this.clients));
    return newClient;
  }
}

interface ClientFinancial {
  clientId: string;
  balance: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  lastPaymentDate: string | undefined;
  nextDueDate: string | undefined;
  paymentHistory: PaymentHistory[];
  pendingInvoices: PaymentHistory[];
}
