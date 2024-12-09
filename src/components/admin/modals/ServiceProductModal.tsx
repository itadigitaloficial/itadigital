import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ServiceGroup, ServiceProduct } from '../../../types/service';

interface ServiceProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<ServiceProduct, 'id'>) => void;
  product: ServiceProduct | null;
  groups: ServiceGroup[];
}

export function ServiceProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  groups,
}: ServiceProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [price, setPrice] = useState('');
  const [setupFee, setSetupFee] = useState('');
  const [billingCycle, setBillingCycle] = useState<ServiceProduct['billingCycle']>('monthly');
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setGroupId(product.groupId);
      setPrice(product.price.toString());
      setSetupFee(product.setupFee?.toString() || '');
      setBillingCycle(product.billingCycle);
      setCustomFields(product.customFields || {});
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setGroupId('');
    setPrice('');
    setSetupFee('');
    setBillingCycle('monthly');
    setCustomFields({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Omit<ServiceProduct, 'id'> = {
      name,
      description: description || undefined,
      groupId,
      price: parseFloat(price),
      setupFee: setupFee ? parseFloat(setupFee) : undefined,
      billingCycle,
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
    };

    onSave(productData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full h-24"
            />
          </div>

          <div>
            <label htmlFor="groupId" className="block font-medium mb-1">
              Grupo
            </label>
            <select
              id="groupId"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="input-field w-full"
              required
            >
              <option value="">Selecione um grupo</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block font-medium mb-1">
              Preço
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field w-full"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="setupFee" className="block font-medium mb-1">
              Taxa de Setup
            </label>
            <input
              type="number"
              id="setupFee"
              value={setupFee}
              onChange={(e) => setSetupFee(e.target.value)}
              className="input-field w-full"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="billingCycle" className="block font-medium mb-1">
              Ciclo de Cobrança
            </label>
            <select
              id="billingCycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as ServiceProduct['billingCycle'])}
              className="input-field w-full"
              required
            >
              <option value="monthly">Mensal</option>
              <option value="quarterly">Trimestral</option>
              <option value="semiannual">Semestral</option>
              <option value="annual">Anual</option>
              <option value="biennial">Bienal</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
