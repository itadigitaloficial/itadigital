import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.enotasgw.com.br',
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken: string | null = null;

const enotasgw = {
  auth: (token: string) => {
    authToken = token;
    api.defaults.headers.common['Authorization'] = token;
  },

  listarEmpresas: async () => {
    return api.get('/v2/empresas');
  },

  buscarEmpresa: async (id: string) => {
    return api.get(`/v2/empresas/${id}`);
  },

  incluirEmpresa: async (empresa: any) => {
    return api.post('/v2/empresas', empresa);
  },

  atualizarEmpresa: async (id: string, empresa: any) => {
    return api.put(`/v2/empresas/${id}`, empresa);
  },

  excluirEmpresa: async (id: string) => {
    return api.delete(`/v2/empresas/${id}`);
  },

  vincularCertificadoEmpresa: async (empresaId: string, certificado: File, senha: string) => {
    const formData = new FormData();
    formData.append('arquivo', certificado);
    formData.append('senha', senha);
    
    return api.post(`/v1/empresas/${empresaId}/certificadoDigital`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  buscarServicosMunicipais: async (uf: string, cidade: string) => {
    try {
      if (!uf || !cidade) {
        console.error('UF ou cidade não fornecidos:', { uf, cidade });
        throw new Error('UF e cidade são obrigatórios');
      }

      // Normaliza a UF para maiúsculo e remove espaços
      const ufNormalizado = uf.trim().toUpperCase();
      
      // Normaliza o nome da cidade (mantém espaços e acentos, apenas remove espaços extras)
      const cidadeNormalizada = cidade
        .trim()
        .replace(/\s+/g, ' ');

      const url = `/v2/estados/${encodeURIComponent(ufNormalizado)}/municipios/${encodeURIComponent(cidadeNormalizada)}/servicos`;

      console.log('Buscando serviços municipais:', {
        ufOriginal: uf,
        cidadeOriginal: cidade,
        ufNormalizado,
        cidadeNormalizada,
        urlCompleta: `${api.defaults.baseURL}${url}`
      });

      const response = await api.get(url);

      console.log('Resposta da API:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      return response;
    } catch (error: any) {
      console.error('Erro na chamada da API de serviços municipais:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        ufOriginal: uf,
        cidadeOriginal: cidade
      });
      throw error;
    }
  }
};

export default enotasgw;
