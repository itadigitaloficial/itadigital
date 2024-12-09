import React, { useState, useEffect } from 'react';
import { Play, Pause, Ban, RefreshCw, DollarSign, AlertTriangle } from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';
import { ClientService, ServiceOrder, ServiceProduct } from '../../types/service';
import { ServiceOrderModal } from './modals/ServiceOrderModal';
import { ClientFinancial } from './ClientFinancial';

interface ClientServicesProps {
  clientId: string;
  clientName: string;
}

export function ClientServices({ clientId, clientName }: ClientServicesProps) {
  const [clientServices, setClientServices] = useState<ClientService | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Array<{
    date: string;
    amount: number;
    type: 'setup' | 'recurring';
    productName: string;
    status: 'paid' | 'pending' | 'overdue';
  }>>([]);
  const [selectedService, setSelectedService] = useState<ServiceOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'financial'>('services');

  const serviceManager = SupabaseService.getInstance();

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar produtos
      const productsData = await serviceManager.getProducts();
      setProducts(productsData);

      // Carregar pedidos do cliente
      const orders = await serviceManager.getOrders();
      const clientOrders = orders.filter(order => order.clientId === clientId);
      const activeOrders = clientOrders.filter(order => order.status === 'active');

      // Calcular total gasto
      const totalSpent = clientOrders.reduce((total, order) => {
        return total + order.price + (order.setupFee || 0);
      }, 0);

      // Encontrar última data de pedido
      const lastOrderDate = clientOrders.length > 0
        ? Math.max(...clientOrders.map(order => new Date(order.createdAt).getTime()))
        : null;

      // Encontrar próxima data de vencimento
      const nextDueDate = activeOrders.length > 0
        ? Math.min(...activeOrders.map(order => new Date(order.nextDueDate).getTime()))
        : null;

      // Verificar se há pagamentos em atraso
      const hasOverduePayments = activeOrders.some(order => 
        new Date(order.nextDueDate).getTime() < new Date().getTime()
      );

      // Montar objeto de serviços do cliente
      const clientServicesData: ClientService = {
        clientId,
        totalActiveServices: activeOrders.length,
        totalSpent,
        lastOrderDate: lastOrderDate ? new Date(lastOrderDate).toISOString() : null,
        nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : null,
        status: activeOrders.length === 0 ? 'inactive' : hasOverduePayments ? 'overdue' : 'active',
        orders: clientOrders
      };

      setClientServices(clientServicesData);

      // Gerar histórico de pagamentos
      const history: Array<{
        date: string;
        amount: number;
        type: 'setup' | 'recurring';
        productName: string;
        status: 'paid' | 'pending' | 'overdue';
      }> = [];

      for (const order of clientOrders) {
        const product = productsData.find(p => p.id === order.productId);
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

      setPaymentHistory(history.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));

    } catch (err: any) {
      console.error('Erro ao carregar dados do cliente:', err);
      setError(err.message || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      if (selectedOrder) {
        await serviceManager.updateOrder(selectedOrder.id, orderData);
      } else {
        await serviceManager.createOrder({
          ...orderData,
          clientId
        });
      }
      await loadData();
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Erro ao salvar pedido:', err);
      setError(err.message || 'Erro ao salvar pedido');
    }
  };

  const handleSuspendServices = async () => {
    if (!confirm('Tem certeza que deseja suspender todos os serviços ativos?')) return;
    
    try {
      setError(null);
      const orders = await serviceManager.getOrders();
      const activeOrders = orders.filter(order => 
        order.clientId === clientId && order.status === 'active'
      );

      await Promise.all(
        activeOrders.map(order => 
          serviceManager.updateOrder(order.id, { status: 'suspended' })
        )
      );

      await loadData();
    } catch (err: any) {
      console.error('Erro ao suspender serviços:', err);
      setError(err.message || 'Erro ao suspender serviços');
    }
  };

  const handleReactivateServices = async () => {
    try {
      setError(null);
      const orders = await serviceManager.getOrders();
      const suspendedOrders = orders.filter(order => 
        order.clientId === clientId && order.status === 'suspended'
      );

      await Promise.all(
        suspendedOrders.map(order => 
          serviceManager.updateOrder(order.id, { status: 'active' })
        )
      );

      await loadData();
    } catch (err: any) {
      console.error('Erro ao reativar serviços:', err);
      setError(err.message || 'Erro ao reativar serviços');
    }
  };

  const handleCancelServices = async () => {
    if (!confirm('Tem certeza que deseja cancelar todos os serviços ativos? Esta ação não pode ser desfeita.')) return;
    
    try {
      setError(null);
      const orders = await serviceManager.getOrders();
      const activeOrders = orders.filter(order => 
        order.clientId === clientId && order.status !== 'cancelled'
      );

      await Promise.all(
        activeOrders.map(order => 
          serviceManager.updateOrder(order.id, { status: 'cancelled' })
        )
      );

      await loadData();
    } catch (err: any) {
      console.error('Erro ao cancelar serviços:', err);
      setError(err.message || 'Erro ao cancelar serviços');
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

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  if (!clientServices) {
    return <div className="text-gray-500 py-4">Nenhum serviço encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`${
              activeTab === 'services'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`${
              activeTab === 'financial'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Financeiro
          </button>
        </nav>
      </div>

      {activeTab === 'services' ? (
        <>
          {/* Cabeçalho com Resumo */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-4">{clientName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Serviços Ativos</p>
                    <p className="text-2xl font-bold">{clientServices.totalActiveServices}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Gasto</p>
                    <p className="text-2xl font-bold">{formatCurrency(clientServices.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        clientServices.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : clientServices.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {clientServices.status === 'active'
                        ? 'Ativo'
                        : clientServices.status === 'inactive'
                        ? 'Inativo'
                        : 'Inadimplente'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                >
                  <DollarSign size={16} className="mr-2" />
                  Novo Serviço
                </button>
                {clientServices.totalActiveServices > 0 && (
                  <>
                    <button
                      onClick={handleSuspendServices}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                    >
                      <Pause size={16} className="mr-2" />
                      Suspender
                    </button>
                    <button
                      onClick={handleReactivateServices}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                    >
                      <Play size={16} className="mr-2" />
                      Reativar
                    </button>
                    <button
                      onClick={handleCancelServices}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                    >
                      <Ban size={16} className="mr-2" />
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Serviços */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Serviços Contratados</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
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
                  {clientServices.orders.map((order) => {
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
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'suspended'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.status === 'active'
                              ? 'Ativo'
                              : order.status === 'suspended'
                              ? 'Suspenso'
                              : 'Cancelado'}
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {order.status === 'active' && (
                            <button
                              onClick={async () => {
                                try {
                                  await serviceManager.updateOrderStatus(order.id, 'suspended');
                                  await loadData();
                                } catch (err: any) {
                                  console.error('Erro ao suspender serviço:', err);
                                  setError(err.message || 'Erro ao suspender serviço');
                                }
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Suspender
                            </button>
                          )}
                          {order.status === 'suspended' && (
                            <button
                              onClick={async () => {
                                try {
                                  await serviceManager.updateOrderStatus(order.id, 'active');
                                  await loadData();
                                } catch (err: any) {
                                  console.error('Erro ao reativar serviço:', err);
                                  setError(err.message || 'Erro ao reativar serviço');
                                }
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Reativar
                            </button>
                          )}
                          {order.status !== 'cancelled' && (
                            <button
                              onClick={async () => {
                                if (!confirm('Tem certeza que deseja cancelar este serviço? Esta ação não pode ser desfeita.')) return;
                                try {
                                  await serviceManager.updateOrderStatus(order.id, 'cancelled');
                                  await loadData();
                                } catch (err: any) {
                                  console.error('Erro ao cancelar serviço:', err);
                                  setError(err.message || 'Erro ao cancelar serviço');
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsOrderModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Histórico de Pagamentos */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.type === 'setup' ? 'Setup' : 'Recorrente'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status === 'paid'
                            ? 'Pago'
                            : payment.status === 'pending'
                            ? 'Pendente'
                            : 'Atrasado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <ClientFinancial clientId={clientId} clientName={clientName} />
      )}

      <ServiceOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onSave={handleSaveOrder}
        order={selectedOrder}
        products={products}
        clientId={clientId}
      />
    </div>
  );
}
