import { Link } from 'react-router-dom';

export function Projects() {
  const projects = [
    {
      title: 'Controle de Estoque',
      description: 'Sistema inteligente de gestão de estoque que simplifica o controle de produtos, entradas, saídas e inventário em tempo real, otimizando seus processos empresariais.',
      link: 'https://stock.itadigital.com.br',
    },
    {
      title: 'Controle de Vencimento',
      description: 'Solução automatizada para monitoramento de datas de vencimento de produtos e documentos, garantindo conformidade e evitando perdas com alertas inteligentes.',
      link: 'https://vencimento.itadigital.com.br/',
    },
    {
      title: 'Ava Sobrevoo Táxi Aéreo',
      description: 'Plataforma exclusiva para gerenciamento de voos e serviços de táxi aéreo, oferecendo uma experiência premium em transporte aéreo executivo.',
      link: 'https://voeava.com.br',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Projetos</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Acessar Projeto
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
