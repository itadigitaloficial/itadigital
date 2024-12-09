export interface EnderecoENotas {
  codigoIbgeUf: number;
  codigoIbgeCidade: number;
  pais: string;
  uf: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
}

export interface ConfiguracoesNFSe {
  sequencialNFe: number;
  serieNFe: string;
  sequencialLoteNFe: number;
  usuarioAcessoProvedor: string | null;
  senhaAcessoProvedor: string | null;
  tokenAcessoProvedor: string | null;
}

export interface EmpresaENotas {
  id: string | null;
  cnpj: string;
  inscricaoMunicipal: string;
  inscricaoEstadual?: string;
  razaoSocial: string;
  nomeFantasia: string;
  optanteSimplesNacional: boolean;
  email: string;
  enviarEmailCliente: boolean;
  telefoneComercial: string;
  incentivadorCultural: boolean;
  endereco: EnderecoENotas;
  regimeEspecialTributacao: string;
  codigoServicoMunicipal: string;
  itemListaServicoLC116: string;
  cnae: string;
  aliquotaIss: number;
  descricaoServico: string;
  configuracoesNFSeHomologacao: ConfiguracoesNFSe;
  configuracoesNFSeProducao: ConfiguracoesNFSe;
}
