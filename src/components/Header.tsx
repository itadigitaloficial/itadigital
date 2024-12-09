import React from 'react';
import { Mail, Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="https://cliente.itadigital.com.br/logo_itadigital.png" 
              alt="ITA DIGITAL" 
              className="h-8 w-auto"
            />
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://wa.me/5513981597202"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">(13) 9 8159-7202</span>
            </a>
            <a
              href="mailto:contato@itadigital.com.br"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">contato@itadigital.com.br</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}