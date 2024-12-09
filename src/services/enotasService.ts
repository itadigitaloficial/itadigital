import enotasgw from '../lib/api/enotasgw';
import { EmpresaENotas } from '../types/enotas';

export class ENotasService {
  private static instance: ENotasService;

  private constructor() {
    const apiKey = import.meta.env.VITE_ENOTAS_API_KEY;
    if (!apiKey) {
      console.error('API key do eNotas não encontrada no ambiente. Verifique as variáveis de ambiente.');
      throw new Error('Configuração incompleta: API key do eNotas não encontrada');
    }
    try {
      enotasgw.auth(`Basic ${apiKey}`);
    } catch (error) {
      console.error('Erro ao configurar autenticação do eNotas:', error);
      throw new Error('Falha ao inicializar serviço do eNotas');
    }
  }

  public static getInstance(): ENotasService {
    if (!ENotasService.instance) {
      ENotasService.instance = new ENotasService();
    }
    return ENotasService.instance;
  }

  public async cadastrarEmpresa(empresa: EmpresaENotas): Promise<any> {
    try {
      const validacao = this.validarDadosEmpresa(empresa);
      if (!validacao.valido) {
        throw new Error(`Dados inválidos: ${validacao.erros.join(', ')}`);
      }
      const response = await enotasgw.incluirEmpresa(empresa);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar empresa no eNotas:', error);
      throw error;
    }
  }

  public async listarEmpresas(): Promise<EmpresaENotas[]> {
    try {
      const response = await enotasgw.listarEmpresas();
      return response.data;
    } catch (error) {
      console.error('Erro ao listar empresas do eNotas:', error);
      throw error;
    }
  }

  public async atualizarEmpresa(id: string, empresa: EmpresaENotas): Promise<any> {
    try {
      const validacao = this.validarDadosEmpresa(empresa);
      if (!validacao.valido) {
        throw new Error(`Dados inválidos: ${validacao.erros.join(', ')}`);
      }
      const response = await enotasgw.atualizarEmpresa(id, empresa);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar empresa no eNotas:', error);
      throw error;
    }
  }

  public async excluirEmpresa(id: string): Promise<void> {
    try {
      await enotasgw.excluirEmpresa(id);
    } catch (error) {
      console.error('Erro ao excluir empresa do eNotas:', error);
      throw error;
    }
  }

  public async vincularCertificado(empresaId: string, certificado: File, senha: string): Promise<void> {
    try {
      await enotasgw.vincularCertificadoEmpresa(empresaId, certificado, senha);
    } catch (error) {
      console.error('Erro ao vincular certificado digital:', error);
      throw error;
    }
  }

  public async buscarEmpresa(id: string): Promise<EmpresaENotas> {
    try {
      const response = await enotasgw.buscarEmpresa(id);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar empresa do eNotas:', error);
      throw error;
    }
  }

  public async buscarServicosMunicipais(uf: string, cidade: string): Promise<any[]> {
    try {
      const response = await enotasgw.buscarServicosMunicipais(uf, cidade);
      console.log('Resposta do gateway:', response);

      if (!response?.data) {
        console.warn('Resposta sem dados:', response);
        return [];
      }

      // Verifica se a resposta é um array
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Se a resposta for um objeto com uma propriedade que contém o array
      const possibleArrayProperties = ['items', 'servicos', 'data', 'results'];
      for (const prop of possibleArrayProperties) {
        if (response.data[prop] && Array.isArray(response.data[prop])) {
          return response.data[prop];
        }
      }

      // Se a resposta for um objeto com os serviços como propriedades
      if (typeof response.data === 'object') {
        return Object.entries(response.data).map(([codigo, descricao]) => ({
          codigo,
          descricao: typeof descricao === 'string' ? descricao : 'Sem descrição'
        }));
      }

      console.warn('Formato de resposta não reconhecido:', response.data);
      return [];
    } catch (error: any) {
      console.error('Erro ao buscar serviços municipais:', {
        error,
        message: error.message,
        response: error.response
      });
      throw error;
    }
  }

  // Método auxiliar para validar CNPJ
  private validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    return true;
  }

  // Método para validar os dados da empresa
  public validarDadosEmpresa(empresa: EmpresaENotas): { valido: boolean; erros: string[] } {
    const erros: string[] = [];

    if (!this.validarCNPJ(empresa.cnpj)) {
      erros.push('CNPJ inválido');
    }

    if (!empresa.razaoSocial) {
      erros.push('Razão Social é obrigatória');
    }

    if (!empresa.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.email)) {
      erros.push('Email inválido');
    }

    if (!empresa.endereco.cep || !/^\d{8}$/.test(empresa.endereco.cep.replace(/[^\d]/g, ''))) {
      erros.push('CEP inválido');
    }

    if (!empresa.codigoServicoMunicipal) {
      erros.push('Código de Serviço Municipal é obrigatório');
    }

    if (empresa.aliquotaIss < 0 || empresa.aliquotaIss > 100) {
      erros.push('Alíquota ISS deve estar entre 0 e 100');
    }

    if (!empresa.descricaoServico) {
      erros.push('Descrição do Serviço é obrigatória');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }
}
