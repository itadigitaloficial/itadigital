import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FirebaseService } from "../../../services/firebaseService";
import { ServiceGroup } from '../../../types/service';

interface ServiceGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  group?: ServiceGroup;
}

export function ServiceGroupModal({
  isOpen,
  onClose,
  onSave,
  group,
}: ServiceGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description || '');
    } else {
      resetForm();
    }
  }, [group, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const groupData: Omit<ServiceGroup, 'id'> = {
      name,
      description: description || undefined,
    };

    FirebaseService.getInstance().createGroup(groupData).then(onSave);
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
          {group ? 'Editar Grupo' : 'Novo Grupo'}
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
