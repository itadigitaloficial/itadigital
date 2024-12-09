import React from 'react';
import { Target, Users, Lightbulb } from 'lucide-react';

export function About() {
  return (
    <section className="py-20 bg-gradient-to-bl from-blue-50 via-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Sobre a ITA DIGITAL
            </h2>
            <p className="text-gray-600 mb-8">
              Somos uma empresa especializada em desenvolvimento de sistemas personalizados,
              focada em entregar soluções inovadoras que impulsionam o crescimento dos
              nossos clientes.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Target className="h-6 w-6 text-gradient flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Missão</h3>
                  <p className="text-gray-600">
                    Transformar ideias em soluções digitais que geram valor real para nossos clientes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-gradient flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Valores</h3>
                  <p className="text-gray-600">
                    Inovação, excelência técnica e compromisso com resultados.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Lightbulb className="h-6 w-6 text-gradient flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Visão</h3>
                  <p className="text-gray-600">
                    Ser referência em desenvolvimento de soluções tecnológicas personalizadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-green-400 opacity-10 absolute inset-0"></div>
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80"
              alt="Equipe ITA Digital"
              className="rounded-lg shadow-xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}