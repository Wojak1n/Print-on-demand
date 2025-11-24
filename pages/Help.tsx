import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, MessageCircle, Phone } from 'lucide-react';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first design?',
          a: 'Navigate to the Design Studio from the main menu. Choose a product (t-shirt, hoodie, etc.), then either upload your own design or use our AI-powered design generator to create custom artwork.'
        },
        {
          q: 'What file formats do you accept?',
          a: 'We accept PNG, JPG, and SVG files. For best quality, we recommend using SVG (vector) files or high-resolution PNG files (at least 300 DPI).'
        },
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee.'
        },
      ]
    },
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'Can I track my order?',
          a: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also view order status in your account dashboard.'
        },
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy for defective or damaged items. Custom designs are non-refundable unless there\'s a printing error on our end.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to over 50 countries worldwide. International shipping times vary by location (typically 10-15 business days).'
        },
      ]
    },
    {
      category: 'Design & Printing',
      questions: [
        {
          q: 'What printing method do you use?',
          a: 'We use Direct-to-Garment (DTG) printing technology, which produces high-quality, vibrant prints that last through many washes.'
        },
        {
          q: 'Can I see a preview before ordering?',
          a: 'Absolutely! Our Design Studio provides real-time mockup previews. You can see exactly how your design will look on the product before placing your order.'
        },
        {
          q: 'What are the design size requirements?',
          a: 'For best results, upload designs at least 4500x5400 pixels for full-front prints. Our studio will guide you on optimal sizing for each product.'
        },
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use industry-standard SSL encryption and never store your full credit card information. All payments are processed through secure payment gateways.'
        },
        {
          q: 'Can I save my designs for later?',
          a: 'Yes! Create a free account to save your designs, track orders, and access your design history anytime.'
        },
      ]
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Find answers to common questions and get the support you need.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-xl font-bold text-brand-600 dark:text-brand-400 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 10 + faqIndex;
                    const isOpen = openFaq === globalIndex;
                    
                    return (
                      <div key={faqIndex} className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : globalIndex)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Still Need Help?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Our support team is here to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get help via email</p>
              <a href="mailto:support@khayali.com" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300">
                support@khayali.com
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Chat with our team</p>
              <button className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300">
                Start Chat
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Mon-Fri, 9am-6pm EST</p>
              <a href="tel:+1-800-KHAYALI" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300">
                1-800-KHAYALI
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Help;

