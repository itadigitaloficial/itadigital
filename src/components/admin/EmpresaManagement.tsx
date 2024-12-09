import React, { useState, useEffect } from 'react';
import { ENotasService } from '../../services/enotasService';
import { IbgeService } from '../../services/ibgeService';
import { EmpresaENotas } from '../../types/enotas';
import { Building2, Plus, Pencil, Key } from 'lucide-react';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

export function EmpresaManagement() {
  const [empresas, setEmpresas] = useState<EmpresaENotas[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaENotas | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertificadoModalOpen, setIsCertificadoModalOpen] = useState(false);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [selectedEstadoSigla, setSelectedEstadoSigla] = useState<string>('');
  const [servicosMunicipais, setServicosMunicipais] = useState<any[]>([]);
  const [selectedServicoMunicipal, setSelectedServicoMunicipal] = useState<string>('');

  const eNotasService = ENotasService.getInstance();
  const ibgeService = IbgeService.getInstance();

  useEffect(() => {
    try {
      const eNotasService = ENotasService.getInstance();
      const ibgeService = IbgeService.getInstance();
      fetchEmpresas();
      fetchEstados();
    } catch (error: any) {
      console.error('Erro ao inicializar serviços:', error);
      setInitError(error.message || 'Erro ao inicializar os serviços. Verifique a configuração.');
    }
  }, []);

  if (initError) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro! </strong>
          <span className="block sm:inline">{initError}</span>
          <p className="mt-2 text-sm">
            Verifique se todas as variáveis de ambiente necessárias estão configuradas corretamente.
          </p>
        </div>
      </div>
    );
  }

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const data = await eNotasService.listarEmpresas();
      setEmpresas(data);
    } catch (err) {
      setError('Erro ao carregar empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstados = async () => {
    const data = await ibgeService.getEstados();
    setEstados(data);
  };

  const fetchCidades = async (ufId: number) => {
    const data = await ibgeService.getCidades(ufId);
    setCidades(data);
  };

  const handleEstadoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const ufId = parseInt(event.target.value);
    setSelectedEstado(event.target.value);
    if (ufId) {
      const estado = estados.find(e => e.id === ufId);
      if (estado) {
        setSelectedEstadoSigla(estado.sigla);
        console.log('Estado selecionado:', { id: ufId, sigla: estado.sigla });
      }
      await fetchCidades(ufId);
    } else {
      setCidades([]);
      setSelectedEstadoSigla('');
      setServicosMunicipais([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const empresaData: EmpresaENotas = {
      id: null,
      cnpj: formData.get('cnpj') as string,
      inscricaoMunicipal: formData.get('inscricaoMunicipal') as string,
      inscricaoEstadual: (formData.get('inscricaoEstadual') as string) || undefined,
      razaoSocial: formData.get('razaoSocial') as string,
      nomeFantasia: formData.get('nomeFantasia') as string,
      optanteSimplesNacional: formData.get('optanteSimplesNacional') === 'true',
      email: formData.get('email') as string,
      enviarEmailCliente: formData.get('enviarEmailCliente') === 'true',
      telefoneComercial: formData.get('telefoneComercial') as string,
      incentivadorCultural: formData.get('incentivadorCultural') === 'true',
      endereco: {
        codigoIbgeUf: parseInt(formData.get('codigoIbgeUf') as string),
        codigoIbgeCidade: parseInt(formData.get('codigoIbgeCidade') as string),
        pais: 'Brasil',
        uf: formData.get('uf') as string,
        cidade: formData.get('cidade') as string,
        logradouro: formData.get('logradouro') as string,
        numero: formData.get('numero') as string,
        complemento: formData.get('complemento') as string || undefined,
        bairro: formData.get('bairro') as string,
        cep: formData.get('cep') as string
      },
      regimeEspecialTributacao: formData.get('regimeEspecialTributacao') as string,
      codigoServicoMunicipal: formData.get('codigoServicoMunicipal') as string,
      itemListaServicoLC116: formData.get('itemListaServicoLC116') as string,
      cnae: formData.get('cnae') as string,
      aliquotaIss: parseFloat(formData.get('aliquotaIss') as string),
      descricaoServico: formData.get('descricaoServico') as string,
      configuracoesNFSeHomologacao: {
        sequencialNFe: 1,
        serieNFe: "NF",
        sequencialLoteNFe: 1,
        usuarioAcessoProvedor: null,
        senhaAcessoProvedor: null,
        tokenAcessoProvedor: null
      },
      configuracoesNFSeProducao: {
        sequencialNFe: 1,
        serieNFe: "NF",
        sequencialLoteNFe: 1,
        usuarioAcessoProvedor: null,
        senhaAcessoProvedor: null,
        tokenAcessoProvedor: null
      }
    };

    try {
      setLoading(true);
      if (selectedEmpresa?.id) {
        await eNotasService.atualizarEmpresa(selectedEmpresa.id, empresaData);
      } else {
        await eNotasService.cadastrarEmpresa(empresaData);
      }
      await fetchEmpresas();
      setIsModalOpen(false);
      setSelectedEmpresa(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleCertificadoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEmpresaId) return;

    const formData = new FormData(e.currentTarget);
    const certificado = formData.get('certificado') as File;
    const senha = formData.get('senha') as string;

    try {
      setLoading(true);
      await eNotasService.vincularCertificado(selectedEmpresaId, certificado, senha);
      setIsCertificadoModalOpen(false);
      setSelectedEmpresaId(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao vincular certificado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Empresas</h2>
        <button
          onClick={() => {
            setSelectedEmpresa(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {empresas.map((empresa) => (
            <li key={empresa.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex text-sm">
                      <p className="font-medium text-blue-600 truncate">{empresa.razaoSocial}</p>
                      <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                        {empresa.nomeFantasia && `(${empresa.nomeFantasia})`}
                      </p>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <Building2 className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>CNPJ: {empresa.cnpj}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedEmpresa(empresa);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmpresaId(empresa.id || null);
                      setIsCertificadoModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-green-600"
                  >
                    <Key className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de Cadastro/Edição */}
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
                    <div>
                      <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700">
                        Razão Social
                      </label>
                      <input
                        type="text"
                        name="razaoSocial"
                        id="razaoSocial"
                        required
                        defaultValue={selectedEmpresa?.razaoSocial}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700">
                        Nome Fantasia
                      </label>
                      <input
                        type="text"
                        name="nomeFantasia"
                        id="nomeFantasia"
                        defaultValue={selectedEmpresa?.nomeFantasia}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                          CNPJ
                        </label>
                        <input
                          type="text"
                          name="cnpj"
                          id="cnpj"
                          required
                          defaultValue={selectedEmpresa?.cnpj}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="inscricaoMunicipal" className="block text-sm font-medium text-gray-700">
                          Inscrição Municipal
                        </label>
                        <input
                          type="text"
                          name="inscricaoMunicipal"
                          id="inscricaoMunicipal"
                          required
                          defaultValue={selectedEmpresa?.inscricaoMunicipal}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          defaultValue={selectedEmpresa?.email}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="telefoneComercial" className="block text-sm font-medium text-gray-700">
                          Telefone Comercial
                        </label>
                        <input
                          type="tel"
                          name="telefoneComercial"
                          id="telefoneComercial"
                          defaultValue={selectedEmpresa?.telefoneComercial}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-gray-700">
                          Inscrição Estadual
                        </label>
                        <input
                          type="text"
                          name="inscricaoEstadual"
                          id="inscricaoEstadual"
                          defaultValue={selectedEmpresa?.inscricaoEstadual}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="optanteSimplesNacional" className="block text-sm font-medium text-gray-700">
                          Optante Simples Nacional
                        </label>
                        <select
                          name="optanteSimplesNacional"
                          id="optanteSimplesNacional"
                          defaultValue={selectedEmpresa?.optanteSimplesNacional ? 'true' : 'false'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="enviarEmailCliente" className="block text-sm font-medium text-gray-700">
                          Enviar Email ao Cliente
                        </label>
                        <select
                          name="enviarEmailCliente"
                          id="enviarEmailCliente"
                          defaultValue={selectedEmpresa?.enviarEmailCliente ? 'true' : 'false'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="incentivadorCultural" className="block text-sm font-medium text-gray-700">
                          Incentivador Cultural
                        </label>
                        <select
                          name="incentivadorCultural"
                          id="incentivadorCultural"
                          defaultValue={selectedEmpresa?.incentivadorCultural ? 'true' : 'false'}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">
                        Logradouro
                      </label>
                      <input
                        type="text"
                        name="logradouro"
                        id="logradouro"
                        required
                        defaultValue={selectedEmpresa?.endereco.logradouro}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                          Número
                        </label>
                        <input
                          type="text"
                          name="numero"
                          id="numero"
                          required
                          defaultValue={selectedEmpresa?.endereco.numero}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                          Complemento
                        </label>
                        <input
                          type="text"
                          name="complemento"
                          id="complemento"
                          defaultValue={selectedEmpresa?.endereco.complemento}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                          Bairro
                        </label>
                        <input
                          type="text"
                          name="bairro"
                          id="bairro"
                          required
                          defaultValue={selectedEmpresa?.endereco.bairro}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                          CEP
                        </label>
                        <input
                          type="text"
                          name="cep"
                          id="cep"
                          required
                          defaultValue={selectedEmpresa?.endereco.cep}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
                          Estado
                        </label>
                        <select
                          name="uf"
                          id="uf"
                          onChange={handleEstadoChange}
                          value={selectedEstado}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Selecione um estado</option>
                          {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                              {estado.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                          Cidade
                        </label>
                        <select
                          name="cidade"
                          id="cidade"
                          onChange={(e) => {
                            const cidade = cidades.find(c => c.id === parseInt(e.target.value));
                            if (cidade) {
                              const form = e.target.form;
                              if (form) {
                                const codigoIbgeCidadeInput = form.elements.namedItem('codigoIbgeCidade') as HTMLInputElement;
                                const cidadeInput = form.elements.namedItem('cidade') as HTMLInputElement;
                                if (codigoIbgeCidadeInput) {
                                  codigoIbgeCidadeInput.value = cidade.id.toString();
                                }
                                if (cidadeInput) {
                                  cidadeInput.value = cidade.nome;
                                }

                                // Buscar serviços municipais
                                if (selectedEstadoSigla && cidade.nome) {
                                  console.log('Buscando serviços para:', {
                                    estado: selectedEstadoSigla,
                                    cidade: cidade.nome
                                  });
                                  
                                  eNotasService.buscarServicosMunicipais(selectedEstadoSigla, cidade.nome)
                                    .then(data => {
                                      console.log('Serviços municipais recebidos:', data);
                                      if (Array.isArray(data) && data.length > 0) {
                                        setServicosMunicipais(data);
                                        setSelectedServicoMunicipal('');
                                        setError(null);
                                      } else {
                                        console.warn('Nenhum serviço municipal encontrado');
                                        setServicosMunicipais([]);
                                        setError('Nenhum serviço municipal encontrado para esta cidade');
                                      }
                                    })
                                    .catch(error => {
                                      console.error('Erro ao buscar serviços municipais:', error);
                                      setError('Erro ao buscar serviços municipais: ' + (error.message || 'Erro desconhecido'));
                                      setServicosMunicipais([]);
                                    });
                                } else {
                                  console.warn('Estado ou cidade não selecionados:', {
                                    estado: selectedEstadoSigla,
                                    cidade: cidade?.nome
                                  });
                                }
                              }
                            }
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          disabled={!selectedEstado}
                        >
                          <option value="">Selecione uma cidade</option>
                          {cidades.map((cidade) => (
                            <option key={cidade.id} value={cidade.id}>
                              {cidade.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <input type="hidden" name="codigoIbgeUf" value={selectedEstado} />
                    <input type="hidden" name="codigoIbgeCidade" />
                    <input type="hidden" name="cidade" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="regimeEspecialTributacao" className="block text-sm font-medium text-gray-700">
                          Regime Especial Tributação
                        </label>
                        <input
                          type="text"
                          name="regimeEspecialTributacao"
                          id="regimeEspecialTributacao"
                          defaultValue={selectedEmpresa?.regimeEspecialTributacao}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="codigoServicoMunicipal" className="block text-sm font-medium text-gray-700">
                          Código Serviço Municipal
                        </label>
                        <select
                          name="codigoServicoMunicipal"
                          id="codigoServicoMunicipal"
                          value={selectedServicoMunicipal}
                          onChange={(e) => {
                            const valor = e.target.value;
                            setSelectedServicoMunicipal(valor);
                            console.log('Serviço selecionado:', {
                              valor,
                              servico: servicosMunicipais.find(s => s.codigo === valor)
                            });
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Selecione um serviço</option>
                          {servicosMunicipais && servicosMunicipais.length > 0 ? (
                            servicosMunicipais.map((servico) => (
                              <option key={servico.codigo} value={servico.codigo}>
                                {servico.codigo} - {servico.descricao || 'Sem descrição'}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              {error || 'Nenhum serviço disponível'}
                            </option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="itemListaServicoLC116" className="block text-sm font-medium text-gray-700">
                          Item Lista Serviço LC116
                        </label>
                        <input
                          type="text"
                          name="itemListaServicoLC116"
                          id="itemListaServicoLC116"
                          defaultValue={selectedEmpresa?.itemListaServicoLC116}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="cnae" className="block text-sm font-medium text-gray-700">
                          CNAE
                        </label>
                        <input
                          type="text"
                          name="cnae"
                          id="cnae"
                          defaultValue={selectedEmpresa?.cnae}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="aliquotaIss" className="block text-sm font-medium text-gray-700">
                          Alíquota ISS (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="aliquotaIss"
                          id="aliquotaIss"
                          defaultValue={selectedEmpresa?.aliquotaIss}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="descricaoServico" className="block text-sm font-medium text-gray-700">
                          Descrição do Serviço
                        </label>
                        <input
                          type="text"
                          name="descricaoServico"
                          id="descricaoServico"
                          defaultValue={selectedEmpresa?.descricaoServico}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                          CEP
                        </label>
                        <input
                          type="text"
                          name="cep"
                          id="cep"
                          required
                          defaultValue={selectedEmpresa?.endereco.cep}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {loading ? 'Salvando...' : selectedEmpresa ? 'Atualizar' : 'Cadastrar'}
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
      {/* Modal de Upload de Certificado */}
      {isCertificadoModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCertificadoSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Key className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Vincular Certificado Digital
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="certificado" className="block text-sm font-medium text-gray-700">
                            Arquivo do Certificado (.pfx)
                          </label>
                          <input
                            type="file"
                            name="certificado"
                            id="certificado"
                            accept=".pfx"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                            Senha do Certificado
                          </label>
                          <input
                            type="password"
                            name="senha"
                            id="senha"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {loading ? 'Vinculando...' : 'Vincular'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCertificadoModalOpen(false);
                      setSelectedEmpresaId(null);
                    }}
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

const handleEstadoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  const ufId = parseInt(event.target.value);
  setSelectedEstado(event.target.value);
  if (ufId) {
    const estado = estados.find(e => e.id === ufId);
    if (estado) {
      setSelectedEstadoSigla(estado.sigla);
      console.log('Estado selecionado:', { id: ufId, sigla: estado.sigla });
    }
    await fetchCidades(ufId);
  } else {
    setCidades([]);
    setSelectedEstadoSigla('');
    setServicosMunicipais([]);
  }
};
