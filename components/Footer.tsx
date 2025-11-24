import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800 dark:border-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-serif text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">KHAYALI</span>
            <p className="mt-4 text-gray-400 dark:text-gray-500 text-sm leading-relaxed max-w-xs">
              Empowering creativity through high-quality print-on-demand services.
              Wear your imagination. Built for designers, by designers.
            </p>
            <div className="flex space-x-6 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/about" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">Blog</Link></li>
              <li><Link to="/press" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link to="/help" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-base text-gray-400 dark:text-gray-500 hover:text-brand-400 dark:hover:text-brand-300 transition-colors">Privacy Policy</Link></li>
              <li className="flex items-center gap-2 text-base text-gray-400 dark:text-gray-500">
                <Mail className="h-4 w-4" />
                <span>contact@khayali.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 dark:border-gray-900 pt-8 text-center">
          <p className="text-base text-gray-500 dark:text-gray-600">&copy; 2024 KHAYALI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
