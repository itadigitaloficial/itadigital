import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import { ServiceGroup, ServiceProduct } from '../../types/service';
import { ServiceGroupModal } from './modals/ServiceGroupModal';
import { ServiceProductModal } from './modals/ServiceProductModal';

export function ServiceGroupList() {
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ServiceGroup | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ServiceProduct | null>(null);

  const serviceManager = FirebaseService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [groupsData, productsData] = await Promise.all([
        serviceManager.getGroups(),
        serviceManager.getProducts()
      ]);

      setGroups(groupsData);
      setProducts(productsData);
    } catch (err: any) {
      console.error('Erro ao carregar grupos de serviço:', err);
      setError(err.message || 'Erro ao carregar grupos de serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGroup = async (groupData: Omit<ServiceGroup, 'id'>) => {
    try {
      setError(null);
      if (selectedGroup) {
        await serviceManager.updateGroup(selectedGroup.id, groupData);
      } else {
        await serviceManager.createGroup(groupData);
      }
      await loadData();
      setIsGroupModalOpen(false);
      setSelectedGroup(null);
    } catch (err: any) {
      console.error('Erro ao salvar grupo:', err);
      setError(err.message || 'Erro ao salvar grupo');
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo? Todos os produtos associados também serão excluídos.')) return;

    try {
      setError(null);
      await serviceManager.deleteGroup(groupId);
      await loadData();
    } catch (err: any) {
      console.error('Erro ao excluir grupo:', err);
      setError(err.message || 'Erro ao excluir grupo');
    }
  };

  const handleSaveProduct = async (productData: Omit<ServiceProduct, 'id'>) => {
    try {
      setError(null);
      if (selectedProduct) {
        await serviceManager.updateProduct(selectedProduct.id, productData);
      } else {
        await serviceManager.createProduct(productData);
      }
      await loadData();
      setIsProductModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      console.error('Erro ao salvar produto:', err);
      setError(err.message || 'Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      setError(null);
      await serviceManager.deleteProduct(productId);
      await loadData();
    } catch (err: any) {
      console.error('Erro ao excluir produto:', err);
      setError(err.message || 'Erro ao excluir produto');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Grupos de Serviço</h2>
        <button
          onClick={() => {
            setSelectedGroup(null);
            setIsGroupModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Grupo
        </button>
      </div>

      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{group.name}</h3>
                <p className="text-gray-600">{group.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedGroup(group);
                    setIsGroupModalOpen(true);
                  }}
                  className="btn-secondary"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="btn-danger"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Produtos</h4>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="btn-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter(product => product.groupId === group.id)
                  .map(product => (
                    <div
                      key={product.id}
                      className="border rounded p-3 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{product.name}</h5>
                          <p className="text-sm text-gray-600">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsProductModalOpen(true);
                            }}
                            className="btn-secondary"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-danger"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p>
                          Preço: R$ {product.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        {product.setupFee && (
                          <p>
                            Taxa de Setup: R${' '}
                            {product.setupFee.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        )}
                        <p>
                          Ciclo de Cobrança:{' '}
                          {
                            {
                              monthly: 'Mensal',
                              quarterly: 'Trimestral',
                              semiannual: 'Semestral',
                              annual: 'Anual',
                              biennial: 'Bienal',
                            }[product.billingCycle]
                          }
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isGroupModalOpen && (
        <ServiceGroupModal
          isOpen={isGroupModalOpen}
          onClose={() => {
            setIsGroupModalOpen(false);
            setSelectedGroup(null);
          }}
          onSave={handleSaveGroup}
          group={selectedGroup}
        />
      )}

      {isProductModalOpen && (
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
      )}
    </div>
  );
}
