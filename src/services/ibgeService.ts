import axios from 'axios';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

export class IbgeService {
  private static instance: IbgeService;
  private readonly api = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
  });

  private constructor() {}

  public static getInstance(): IbgeService {
    if (!IbgeService.instance) {
      IbgeService.instance = new IbgeService();
    }
    return IbgeService.instance;
  }

  public async getEstados(): Promise<Estado[]> {
    try {
      const response = await this.api.get<Estado[]>('/estados?orderBy=nome');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      return [];
    }
  }

  public async getCidades(ufId: number): Promise<Cidade[]> {
    try {
      const response = await this.api.get<Cidade[]>(`/estados/${ufId}/municipios?orderBy=nome`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return [];
    }
  }
}
