import React, { useState, useEffect } from 'react';
import { Package, Settings, ShoppingCart, Server, Pencil, Trash2 } from 'lucide-react';
import { ServiceManagementService } from '../../services/serviceManagement';
import { ServiceGroup, ServiceProduct, ServiceOrder } from '../../types/service';
import { ServiceGroupModal } from './modals/ServiceGroupModal';
import { ServiceProductModal } from './modals/ServiceProductModal';
import { ServiceOrderModal } from './modals/ServiceOrderModal';

export function ServicosManagement() {
  const [activeTab, setActiveTab] = useState<'groups' | 'products' | 'orders'>('groups');
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ServiceGroup | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ServiceProduct | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const serviceManager = ServiceManagementService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsData, productsData, ordersData] = await Promise.all([
        serviceManager.getGroups(),
        serviceManager.getProducts(),
        serviceManager.getOrders()
      ]);
      setGroups(groupsData);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async (group: Omit<ServiceGroup, 'id'>) => {
    try {
      if (selectedGroup) {
        await serviceManager.updateGroup(selectedGroup.id, group);
      } else {
        await serviceManager.createGroup(group);
      }
      await loadData();
      setIsGroupModalOpen(false);
      setSelectedGroup(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar grupo');
    }
  };

  const handleEditGroup = (group: ServiceGroup) => {
    setSelectedGroup(group);
    setIsGroupModalOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo?')) return;

    try {
      // Implementar exclusão
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir grupo');
    }
  };

  const handleSaveProduct = async (product: Omit<ServiceProduct, 'id'>) => {
    try {
      if (selectedProduct) {
        await serviceManager.updateProduct(selectedProduct.id, product);
      } else {
        await serviceManager.createProduct(product);
      }
      await loadData();
      setIsProductModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto');
    }
  };

  const handleEditProduct = (product: ServiceProduct) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      // Implementar exclusão
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir produto');
    }
  };

  const handleSaveOrder = async (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedOrder) {
        await serviceManager.updateOrder(selectedOrder.id, order);
      } else {
        await serviceManager.createOrder(order);
      }
      await loadData();
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar pedido');
    }
  };

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    try {
      await serviceManager.deleteOrder(orderId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir pedido');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusColor = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'suspended':
        return 'Suspenso';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const renderTabs = () => (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => setActiveTab('groups')}
          className={`${
            activeTab === 'groups'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <Package className="mr-2" size={16} />
          Grupos de Serviços
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <Settings className="mr-2" size={16} />
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${
            activeTab === 'orders'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
        >
          <ShoppingCart className="mr-2" size={16} />
          Pedidos
        </button>
      </nav>
    </div>
  );

  const renderGroups = () => (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Grupos de Serviços</h2>
        <button
          onClick={() => {
            setSelectedGroup(null);
            setIsGroupModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Package className="mr-2" size={16} />
          Novo Grupo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">
            Nenhum grupo de serviço cadastrado. Clique em "Novo Grupo" para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{group.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditGroup(group)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{group.description}</p>
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    group.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {group.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <span className="text-sm text-gray-500">
                  {/* Adicionar contagem de produtos quando implementarmos */}
                  0 produtos
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Produtos</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsProductModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Settings className="mr-2" size={16} />
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">
            Nenhum produto cadastrado. Clique em "Novo Produto" para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">{product.description}</p>

              <div className="mb-3">
                <p className="text-lg font-bold text-blue-600">
                  R$ {product.price.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    /{product.billingCycle}
                  </span>
                </p>
                {product.setupFee && (
                  <p className="text-sm text-gray-600">
                    Taxa de Setup: R$ {product.setupFee.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Recursos:</p>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    product.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.isActive ? 'Ativo' : 'Inativo'}
                </span>

                {product.stockControl && (
                  <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    Estoque: {product.stockQuantity}
                  </span>
                )}

                {product.autoSetup && (
                  <span className="px-2 py-1 rounded text-sm bg-purple-100 text-purple-800">
                    Setup Automático
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Pedidos</h2>
        <button
          onClick={() => {
            setSelectedOrder(null);
            setIsOrderModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Settings className="mr-2" size={16} />
          Novo Pedido
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">
            Nenhum pedido cadastrado. Clique em "Novo Pedido" para começar.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próximo Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ciclo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product?.name || 'Produto não encontrado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(order.price)}
                          {order.setupFee && (
                            <div className="text-xs text-gray-500">
                              + {formatCurrency(order.setupFee)} (setup)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.nextDueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.billingCycle === 'monthly'
                            ? 'Mensal'
                            : order.billingCycle === 'quarterly'
                            ? 'Trimestral'
                            : order.billingCycle === 'semiannual'
                            ? 'Semestral'
                            : order.billingCycle === 'annual'
                            ? 'Anual'
                            : 'Bienal'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestão de Serviços</h1>
        <Server className="text-gray-500" size={24} />
      </div>

      {renderTabs()}
      {activeTab === 'groups' && renderGroups()}
      {activeTab === 'products' && renderProducts()}
      {activeTab === 'orders' && renderOrders()}

      <ServiceGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setSelectedGroup(null);
        }}
        onSave={handleSaveGroup}
        group={selectedGroup}
      />

      <ServiceProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={selectedProduct}
        groups={groups}
      />

      <ServiceOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onSave={handleSaveOrder}
        order={selectedOrder}
        products={products}
        userId="temp-user-id" // TODO: Pegar o ID do usuário logado
      />
    </div>
  );
}
