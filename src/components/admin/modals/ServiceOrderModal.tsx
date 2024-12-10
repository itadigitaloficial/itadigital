import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FirebaseService } from "../../../services/firebaseService";
import { ServiceOrder, ServiceProduct } from '../../../types/service';

interface ServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  order?: ServiceOrder;
  products: ServiceProduct[];
  clientId: string;
}

export function ServiceOrderModal({
  isOpen,
  onClose,
  onSave,
  order,
  products,
  clientId,
}: ServiceOrderModalProps) {
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState<ServiceOrder['status']>('pending');
  const [billingCycle, setBillingCycle] = useState('');
  const [price, setPrice] = useState('');
  const [setupFee, setSetupFee] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  useEffect(() => {
    if (order) {
      setProductId(order.productId);
      setStatus(order.status);
      setBillingCycle(order.billingCycle);
      setPrice(order.price.toString());
      setSetupFee(order.setupFee?.toString() || '');
      setNextDueDate(order.nextDueDate.split('T')[0]);
      setNotes(order.notes || '');
      setCustomFields(order.customFields || {});
    } else {
      resetForm();
    }
  }, [order, isOpen]);

  const resetForm = () => {
    setProductId('');
    setStatus('pending');
    setBillingCycle('');
    setPrice('');
    setSetupFee('');
    setNextDueDate('');
    setNotes('');
    setCustomFields({});
  };

  const handleProductChange = (selectedProductId: string) => {
    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      setProductId(product.id);
      setPrice(product.price.toString());
      setSetupFee(product.setupFee?.toString() || '');
      setBillingCycle(product.billingCycle);
      
      // Calcular próxima data de vencimento
      const today = new Date();
      let nextDate = new Date(today);
      
      switch (product.billingCycle) {
        case 'monthly':
          nextDate.setMonth(today.getMonth() + 1);
          break;
        case 'quarterly':
          nextDate.setMonth(today.getMonth() + 3);
          break;
        case 'semiannual':
          nextDate.setMonth(today.getMonth() + 6);
          break;
        case 'annual':
          nextDate.setFullYear(today.getFullYear() + 1);
          break;
        case 'biennial':
          nextDate.setFullYear(today.getFullYear() + 2);
          break;
      }

      setNextDueDate(nextDate.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'> = {
      productId,
      clientId,
      status,
      price: parseFloat(price),
      setupFee: setupFee ? parseFloat(setupFee) : undefined,
      billingCycle: billingCycle as ServiceOrder['billingCycle'],
      nextDueDate: new Date(nextDueDate).toISOString(),
      notes: notes || undefined,
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
    };

    try {
      await FirebaseService.getInstance().createOrder(orderData);
      onSave(orderData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Produto
              </label>
              <select
                value={productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ServiceOrder['status'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="pending">Pendente</option>
                <option value="active">Ativo</option>
                <option value="suspended">Suspenso</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Taxa de Setup
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={setupFee}
                  onChange={(e) => setSetupFee(e.target.value)}
                  className="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ciclo de Cobrança
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um ciclo</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="semiannual">Semestral</option>
                <option value="annual">Anual</option>
                <option value="biennial">Bienal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Próximo Vencimento
              </label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
