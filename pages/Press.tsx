import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, ExternalLink } from 'lucide-react';

const Press: React.FC = () => {
  const pressReleases = [
    {
      date: 'March 20, 2024',
      title: 'KHAYALI Launches AI-Powered Design Studio',
      excerpt: 'Revolutionary new feature helps creators generate custom designs in seconds using advanced AI technology.'
    },
    {
      date: 'February 15, 2024',
      title: 'KHAYALI Reaches 100,000 Designers Milestone',
      excerpt: 'Platform celebrates major growth milestone as creative community continues to expand globally.'
    },
    {
      date: 'January 10, 2024',
      title: 'New Sustainability Initiative Announced',
      excerpt: 'KHAYALI commits to carbon-neutral shipping and 100% eco-friendly packaging by end of 2024.'
    },
  ];

  const mediaKit = [
    { name: 'Company Logo (PNG)', size: '2.4 MB' },
    { name: 'Brand Guidelines (PDF)', size: '5.1 MB' },
    { name: 'Product Images (ZIP)', size: '45.2 MB' },
    { name: 'Executive Photos (ZIP)', size: '12.8 MB' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Latest news, press releases, and media resources from KHAYALI.
            </p>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-8 border border-brand-200 dark:border-brand-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Media Inquiries</h2>
                <p className="text-gray-600 dark:text-gray-400">For press inquiries, interviews, or media requests, please contact our PR team.</p>
              </div>
              <a 
                href="mailto:press@khayali.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors font-semibold whitespace-nowrap"
              >
                <Mail className="w-5 h-5" />
                press@khayali.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-12">Recent Press Releases</h2>
          
          <div className="space-y-6">
            {pressReleases.map((release, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{release.date}</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{release.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{release.excerpt}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors whitespace-nowrap">
                    Read More
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Media Kit</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Download our brand assets and media resources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mediaKit.map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.size}</p>
                  </div>
                  <button className="p-3 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors font-semibold">
              <Download className="w-5 h-5" />
              Download Complete Media Kit
            </button>
          </div>
        </div>
      </section>

      {/* Featured In */}
      <section className="py-24 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">As Featured In</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center text-2xl font-bold">TechCrunch</div>
            <div className="text-center text-2xl font-bold">Forbes</div>
            <div className="text-center text-2xl font-bold">Wired</div>
            <div className="text-center text-2xl font-bold">Fast Company</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Press;

