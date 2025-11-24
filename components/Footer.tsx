import React from 'react';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">KHAYALI</span>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering creativity through high-quality print-on-demand services.
              Wear your imagination. Built for designers, by designers.
            </p>
            <div className="flex space-x-6 mt-6">
              <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-brand-400 transition-colors">Privacy Policy</a></li>
              <li className="flex items-center gap-2 text-base text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contact@khayali.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-base text-gray-500">&copy; 2024 KHAYALI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
