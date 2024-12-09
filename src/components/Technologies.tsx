import React from 'react';
import { Sparkles, Database, Flame, Smartphone, Brain } from 'lucide-react';

export function Technologies() {
  const technologies = [
    {
      icon: <Sparkles className="h-12 w-12" />,
      name: "Bubble.io",
      description: "Desenvolvimento no-code rápido e eficiente"
    },
    {
      icon: <Database className="h-12 w-12" />,
      name: "Supabase",
      description: "Backend robusto e escalável"
    },
    {
      icon: <Flame className="h-12 w-12" />,
      name: "Firebase",
      description: "Plataforma completa para apps modernos"
    },
    {
      icon: <Smartphone className="h-12 w-12" />,
      name: "Flutterflow",
      description: "Apps mobile de alta performance"
    },
    {
      icon: <Brain className="h-12 w-12" />,
      name: "Tecnologias com IA",
      description: "Soluções inteligentes e inovadoras"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossas Tecnologias
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Utilizamos as tecnologias mais avançadas do mercado
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all bg-white border border-gray-100"
            >
              <div className="text-gradient mb-4">{tech.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tech.name}</h3>
              <p className="text-gray-600 text-center text-sm">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}