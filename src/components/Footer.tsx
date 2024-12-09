import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">ITA DIGITAL</h3>
            <p className="text-gray-300">
              Transformando ideias em soluções digitais inovadoras para impulsionar seu negócio.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contato</h4>
            <div className="space-y-4">
              <a href="tel:+5513981597202" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Phone className="h-5 w-5 mr-2" />
                (13) 9 8159-7202
              </a>
              <a href="mailto:contato@itadigital.com.br" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5 mr-2" />
                contato@itadigital.com.br
              </a>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-2" />
                Brasil
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Área do Cliente</h4>
            <div className="space-y-4">
              <Link to="/login" className="block text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="block text-gray-300 hover:text-white transition-colors">
                Criar Conta
              </Link>
            </div>
            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} ITA DIGITAL. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}