import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PaymentHistory } from '../../../types/service';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: PaymentHistory) => void;
  payment: PaymentHistory | null;
  clientId: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSave,
  payment,
  clientId,
}: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentHistory['paymentMethod']>();
  const [paymentDate, setPaymentDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<PaymentHistory['status']>('pending');

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount.toString());
      setPaymentMethod(payment.paymentMethod);
      setPaymentDate(payment.paymentDate?.split('T')[0] || '');
      setDueDate(payment.dueDate.split('T')[0]);
      setInvoiceNumber(payment.invoiceNumber || '');
      setNotes(payment.notes || '');
      setStatus(payment.status);
    } else {
      resetForm();
    }
  }, [payment, isOpen]);

  const resetForm = () => {
    setAmount('');
    setPaymentMethod(undefined);
    setPaymentDate('');
    setDueDate('');
    setInvoiceNumber('');
    setNotes('');
    setStatus('pending');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData: PaymentHistory = {
      ...(payment || {
        id: crypto.randomUUID(),
        clientId,
        orderId: '',
        date: new Date().toISOString(),
        type: 'recurring',
        productName: '',
      }),
      amount: parseFloat(amount),
      paymentMethod,
      paymentDate: paymentDate ? new Date(paymentDate).toISOString() : undefined,
      dueDate: new Date(dueDate).toISOString(),
      invoiceNumber: invoiceNumber || undefined,
      notes: notes || undefined,
      status
    };

    onSave(paymentData);
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
            {payment ? 'Editar Pagamento' : 'Novo Pagamento'}
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
                Valor
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Método de Pagamento
              </label>
              <select
                value={paymentMethod || ''}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentHistory['paymentMethod'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione um método</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="bank_transfer">Transferência</option>
                <option value="pix">PIX</option>
                <option value="cash">Dinheiro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data do Pagamento
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número da Fatura
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaymentHistory['status'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Em Atraso</option>
              </select>
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
