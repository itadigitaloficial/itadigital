import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { ServiceManagementService } from '../../services/serviceManagement';
import { ClientFinancial as IClientFinancial, PaymentHistory } from '../../types/service';
import { PaymentModal } from './modals/PaymentModal';

interface ClientFinancialProps {
  clientId: string;
  clientName: string;
}

export function ClientFinancial({ clientId, clientName }: ClientFinancialProps) {
  const [financial, setFinancial] = useState<IClientFinancial | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceManager = ServiceManagementService.getInstance();

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceManager.getClientFinancial(clientId);
      setFinancial(data);
    } catch (err: any) {
      console.error('Erro ao carregar dados financeiros:', err);
      setError(err.message || 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (payment: PaymentHistory) => {
    try {
      setError(null);
      await serviceManager.updatePayment(payment);
      await loadData();
      setIsPaymentModalOpen(false);
    } catch (err: any) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.message || 'Erro ao processar pagamento');
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

  if (!financial) {
    return <div className="text-gray-500 py-4">Nenhum dado financeiro encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-4">Financeiro - {clientName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className={`text-2xl font-bold ${financial.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(financial.balance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(financial.totalPaid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(financial.totalPending)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Em Atraso</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(financial.totalOverdue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faturas Pendentes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Faturas Pendentes</h3>
          <div className="flex space-x-2">
            {financial.pendingInvoices.length > 0 && (
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setIsPaymentModalOpen(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
              >
                <DollarSign size={16} className="mr-2" />
                Registrar Pagamento
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financial.pendingInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.invoiceNumber || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.productName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invoice.type === 'setup' ? 'Taxa de Setup' : 'Mensalidade'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(invoice.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status === 'pending' ? 'Pendente' : 'Em Atraso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPayment(invoice);
                        setIsPaymentModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Registrar Pagamento
                    </button>
                  </td>
                </tr>
              ))}
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
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financial.paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(payment.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.productName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.type === 'setup' ? 'Taxa de Setup' : 'Mensalidade'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.paymentMethod === 'credit_card'
                        ? 'Cartão de Crédito'
                        : payment.paymentMethod === 'bank_transfer'
                        ? 'Transferência'
                        : payment.paymentMethod === 'pix'
                        ? 'PIX'
                        : payment.paymentMethod === 'cash'
                        ? 'Dinheiro'
                        : '-'}
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
                        : 'Em Atraso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setIsPaymentModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handlePayment}
        payment={selectedPayment}
        clientId={clientId}
      />
    </div>
  );
}
