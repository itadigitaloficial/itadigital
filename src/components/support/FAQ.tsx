import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Como faço para solicitar um novo projeto?',
    answer: 'Para solicitar um novo projeto, faça login na sua conta e clique no botão "Novo Projeto" no dashboard. Preencha o formulário com os detalhes do seu projeto e nossa equipe entrará em contato em até 24 horas.',
    category: 'Projetos',
  },
  {
    question: 'Quais são os métodos de pagamento aceitos?',
    answer: 'Aceitamos pagamentos via cartão de crédito, boleto bancário, transferência bancária e PIX. Para projetos maiores, também oferecemos a opção de parcelamento.',
    category: 'Pagamentos',
  },
  {
    question: 'Qual é o prazo médio de desenvolvimento de um projeto?',
    answer: 'O prazo de desenvolvimento varia de acordo com a complexidade do projeto. Projetos simples podem levar de 2 a 4 semanas, enquanto projetos mais complexos podem levar de 2 a 6 meses. Uma estimativa mais precisa será fornecida após a análise dos requisitos.',
    category: 'Projetos',
  },
  {
    question: 'Como posso acompanhar o progresso do meu projeto?',
    answer: 'Você pode acompanhar o progresso do seu projeto através do dashboard do cliente. Lá você encontrará atualizações em tempo real, marcos do projeto e poderá se comunicar diretamente com nossa equipe.',
    category: 'Projetos',
  },
  {
    question: 'O que está incluído no suporte técnico?',
    answer: 'Nosso suporte técnico inclui correção de bugs, atualizações de segurança, backup regular dos dados e suporte via chat/ticket 24/7. Para projetos em produção, garantimos um tempo de resposta máximo de 4 horas.',
    category: 'Suporte',
  },
  {
    question: 'Como posso solicitar alterações no meu projeto?',
    answer: 'Para solicitar alterações, abra um ticket de suporte descrevendo as mudanças desejadas. Nossa equipe avaliará as alterações e responderá com uma estimativa de prazo e custo, se aplicável.',
    category: 'Suporte',
  },
];

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(faqData.map(item => item.category))];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQ = faqData.filter(item =>
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    (item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Base de Conhecimento</h2>
        
        <div className="mt-4 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <div key={index} className="border rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-medium text-left">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-4 py-3 border-t bg-gray-50">
                  <p className="text-gray-600">{item.answer}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredFAQ.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
