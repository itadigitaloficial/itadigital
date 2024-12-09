import React, { useState, useEffect } from 'react';
import { ServiceManagementService } from '../../services/serviceManagement';
import { ServiceGroup, ServiceProduct, ServiceOrder } from '../../types/service';
import { Package, Settings, ShoppingCart, Server } from 'lucide-react';

export function ServiceManagement() {
  const [activeTab, setActiveTab] = useState<'groups' | 'products' | 'orders'>('groups');
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ServiceGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (group: Omit<ServiceGroup, 'id'>) => {
    try {
      const newGroup = await serviceManager.createGroup(group);
      setGroups([...groups, newGroup]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao criar grupo');
      console.error(err);
    }
  };

  const handleCreateProduct = async (product: Omit<ServiceProduct, 'id'>) => {
    try {
      const newProduct = await serviceManager.createProduct(product);
      setProducts([...products, newProduct]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao criar produto');
      console.error(err);
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
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          <Package className="inline-block mr-2" size={16} />
          Grupos de Serviços
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          <Settings className="inline-block mr-2" size={16} />
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${
            activeTab === 'orders'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          <ShoppingCart className="inline-block mr-2" size={16} />
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
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Grupo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium">{group.name}</h3>
            <p className="text-gray-600 mt-2">{group.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${
                group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {group.isActive ? 'Ativo' : 'Inativo'}
              </span>
              <button
                onClick={() => setSelectedGroup(group)}
                className="text-blue-500 hover:text-blue-700"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Produtos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Produto
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4">
              <p className="text-lg font-bold text-blue-600">
                R$ {product.price.toFixed(2)}
                <span className="text-sm text-gray-500 ml-2">
                  /{product.billingCycle}
                </span>
              </p>
              <ul className="mt-2 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${
                product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.isActive ? 'Ativo' : 'Inativo'}
              </span>
              <button
                onClick={() => {/* Implementar edição */}}
                className="text-blue-500 hover:text-blue-700"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
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
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.clientId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {products.find(p => p.id === order.productId)?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'active' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {order.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.nextDueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {/* Implementar ações */}}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Gerenciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

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
      {/* Implementar modais de criação/edição */}
    </div>
  );
}
