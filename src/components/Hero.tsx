import React from 'react';
import { Code2, Cpu, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Soluções Digitais
            <span className="block text-blue-600">Sob Medida</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transformamos suas ideias em realidade com sistemas personalizados
            que impulsionam seu negócio para o futuro.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fale Conosco
            </a>
            <a
              href="#services"
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Nossos Serviços
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}