import React from 'react';
import { Code2, Cpu, Shield, Smartphone, Cloud, LineChart } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Desenvolvimento Web",
      description: "Sites e aplicações web modernas e responsivas com as melhores tecnologias do mercado."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Aplicativos Mobile",
      description: "Apps nativos e híbridos para iOS e Android que proporcionam a melhor experiência aos usuários."
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Sistemas em Nuvem",
      description: "Soluções escaláveis e seguras hospedadas na nuvem para seu negócio."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança Digital",
      description: "Proteção de dados e implementação de práticas seguras em todos os sistemas."
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Automação",
      description: "Automatização de processos para aumentar a eficiência operacional."
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: "Análise de Dados",
      description: "Insights valiosos através de análise e visualização de dados."
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos soluções completas em tecnologia para transformar seu negócio
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50/50"
            >
              <div className="text-blue-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}