import React, { useState, useEffect } from 'react';
import { enotasService, NotaFiscal, Empresa } from '../../lib/enotas';
import { FileText, Plus, Download } from 'lucide-react';

export function NotaFiscalEmission() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const data = await enotasService.listarEmpresas();
      setEmpresas(data);
    } catch (err) {
      setError('Erro ao carregar empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    
    const notaFiscal: NotaFiscal = {
      cliente: {
        nome: formData.get('clienteNome') as string,
        email: formData.get('clienteEmail') as string,
        cpfCnpj: formData.get('clienteCpfCnpj') as string,
        telefone: formData.get('clienteTelefone') as string,
      },
      servico: {
        descricao: formData.get('servicoDescricao') as string,
        valorUnitario: parseFloat(formData.get('servicoValor') as string),
        quantidade: parseInt(formData.get('servicoQuantidade') as string, 10) || 1,
      }
    };

    try {
      setLoading(true);
      const response = await enotasService.emitirNota(selectedEmpresa, notaFiscal);
      setSuccess('Nota fiscal emitida com sucesso!');
      setIsModalOpen(false);
      
      // Opcional: Abrir o PDF da nota em uma nova aba
      if (response.urlPdf) {
        window.open(response.urlPdf, '_blank');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao emitir nota fiscal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Emissão de Nota Fiscal</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!empresas.length}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota Fiscal
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Emissão */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="space-y-4">
                    {/* Seleção de Empresa */}
                    <div>
                      <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">
                        Empresa Emissora
                      </label>
                      <select
                        id="empresa"
                        name="empresa"
                        required
                        value={selectedEmpresa}
                        onChange={(e) => setSelectedEmpresa(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Selecione uma empresa</option>
                        {empresas.map((empresa) => (
                          <option key={empresa.id} value={empresa.id}>
                            {empresa.razaoSocial}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dados do Cliente */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Cliente</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="clienteNome" className="block text-sm font-medium text-gray-700">
                            Nome
                          </label>
                          <input
                            type="text"
                            name="clienteNome"
                            id="clienteNome"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="clienteEmail" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="clienteEmail"
                            id="clienteEmail"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="clienteCpfCnpj" className="block text-sm font-medium text-gray-700">
                              CPF/CNPJ
                            </label>
                            <input
                              type="text"
                              name="clienteCpfCnpj"
                              id="clienteCpfCnpj"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="clienteTelefone" className="block text-sm font-medium text-gray-700">
                              Telefone
                            </label>
                            <input
                              type="tel"
                              name="clienteTelefone"
                              id="clienteTelefone"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dados do Serviço */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Serviço</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="servicoDescricao" className="block text-sm font-medium text-gray-700">
                            Descrição
                          </label>
                          <textarea
                            name="servicoDescricao"
                            id="servicoDescricao"
                            required
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="servicoValor" className="block text-sm font-medium text-gray-700">
                              Valor Unitário
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">R$</span>
                              </div>
                              <input
                                type="number"
                                name="servicoValor"
                                id="servicoValor"
                                required
                                step="0.01"
                                min="0"
                                className="mt-1 block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="servicoQuantidade" className="block text-sm font-medium text-gray-700">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              name="servicoQuantidade"
                              id="servicoQuantidade"
                              min="1"
                              defaultValue="1"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading || !selectedEmpresa}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? 'Emitindo...' : 'Emitir Nota Fiscal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
