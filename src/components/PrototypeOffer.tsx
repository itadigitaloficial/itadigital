import React from 'react';
import { Rocket, Clock, Check, ArrowRight } from 'lucide-react';

export function PrototypeOffer() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transform -skew-y-6 z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 text-blue-600 mb-6">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-semibold">Protótipo em 24 Horas</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Transforme sua ideia em realidade
                <span className="block text-blue-600">em apenas 24 horas!</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Teste gratuitamente e veja seu projeto ganhar vida com nossa equipe especializada.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Prototipagem rápida e profissional',
                  'Feedback instantâneo',
                  'Sem compromisso inicial',
                  'Suporte especializado'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              
              <a
                href="https://wa.me/5513981597202?text=Olá! Gostaria de saber mais sobre o protótipo em 24 horas."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
              >
                <span className="font-semibold">Comece Agora</span>
                <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl transform rotate-3" />
              <div className="relative bg-white p-8 rounded-2xl shadow-lg">
                <Rocket className="h-16 w-16 text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Por que escolher nosso serviço?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-600">Equipe especializada com anos de experiência</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-600">Metodologia ágil para entrega rápida</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-600">Tecnologias modernas e escaláveis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-600">Suporte contínuo durante todo o processo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}