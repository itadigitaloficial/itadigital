import axios from 'axios';

const ENOTAS_API_KEY = import.meta.env.VITE_ENOTAS_API_KEY;
const ENOTAS_BASE_URL = 'https://api.enotas.com.br';

const enotasApi = axios.create({
  baseURL: ENOTAS_BASE_URL,
  headers: {
    'Authorization': `Basic ${ENOTAS_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export interface Empresa {
  id?: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoMunicipal: string;
  email: string;
  telefone?: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export interface NotaFiscal {
  idExterno?: string;
  cliente: {
    nome: string;
    email: string;
    cpfCnpj: string;
    telefone?: string;
    endereco?: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
  };
  servico: {
    descricao: string;
    valorUnitario: number;
    quantidade?: number;
  };
}

export const enotasService = {
  // Cadastro e gestão de empresas
  async cadastrarEmpresa(empresa: Empresa) {
    try {
      const response = await enotasApi.post('/v1/empresas', empresa);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao cadastrar empresa:', error.response?.data || error.message);
      throw error;
    }
  },

  async atualizarEmpresa(empresaId: string, empresa: Partial<Empresa>) {
    try {
      const response = await enotasApi.put(`/v1/empresas/${empresaId}`, empresa);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar empresa:', error.response?.data || error.message);
      throw error;
    }
  },

  async buscarEmpresa(empresaId: string) {
    try {
      const response = await enotasApi.get(`/v1/empresas/${empresaId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar empresa:', error.response?.data || error.message);
      throw error;
    }
  },

  async listarEmpresas() {
    try {
      const response = await enotasApi.get('/v1/empresas');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao listar empresas:', error.response?.data || error.message);
      throw error;
    }
  },

  // Emissão de notas fiscais
  async emitirNota(empresaId: string, nota: NotaFiscal) {
    try {
      const response = await enotasApi.post(`/v1/empresas/${empresaId}/nfes`, {
        ...nota,
        tipo: 'NFS-e',
        ambiente: process.env.NODE_ENV === 'production' ? 'Producao' : 'Homologacao'
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao emitir nota fiscal:', error.response?.data || error.message);
      throw error;
    }
  },

  async consultarNota(empresaId: string, notaId: string) {
    try {
      const response = await enotasApi.get(`/v1/empresas/${empresaId}/nfes/${notaId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao consultar nota fiscal:', error.response?.data || error.message);
      throw error;
    }
  },

  async cancelarNota(empresaId: string, notaId: string, motivo: string) {
    try {
      const response = await enotasApi.post(`/v1/empresas/${empresaId}/nfes/${notaId}/cancelar`, {
        motivo
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao cancelar nota fiscal:', error.response?.data || error.message);
      throw error;
    }
  }
};
