import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, AlertCircle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FileText className="w-16 h-16 mx-auto mb-6 text-brand-600 dark:text-brand-400" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Last updated: March 1, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Important Notice */}
          <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700 rounded-xl p-6 mb-12 flex gap-4">
            <AlertCircle className="w-6 h-6 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Please Read Carefully</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                By accessing and using KHAYALI's services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Welcome to KHAYALI. By accessing or using our website, mobile application, or services, you agree to comply with and be bound by these Terms of Service. These terms apply to all visitors, users, and others who access or use our service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of Service</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                KHAYALI provides a print-on-demand platform for custom apparel design and ordering. You may use our service only for lawful purposes and in accordance with these Terms.
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree not to use the service for any illegal or unauthorized purpose</li>
                <li>You must not transmit any worms, viruses, or destructive code</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You retain all rights to the designs you create and upload to KHAYALI. However, by uploading content, you grant us a license to use, reproduce, and display your designs solely for the purpose of providing our services.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You represent and warrant that you own or have the necessary rights to all content you upload, and that your content does not infringe on the intellectual property rights of any third party.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Orders and Payment</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Prices are subject to change without notice.
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Payment must be received before order processing begins</li>
                <li>All prices are in USD unless otherwise stated</li>
                <li>You are responsible for any applicable taxes</li>
                <li>Refunds are subject to our return policy</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Shipping and Returns</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We strive to ship all orders within 3-5 business days. Shipping times vary by location. We offer a 30-day return policy for defective or damaged items. Custom designs are non-refundable unless there is a printing error on our part.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                KHAYALI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount you paid for the specific product or service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Modifications to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes via email or through our website. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white font-semibold mb-2">KHAYALI Legal Department</p>
                <p className="text-gray-600 dark:text-gray-400">Email: legal@khayali.com</p>
                <p className="text-gray-600 dark:text-gray-400">Phone: 1-800-KHAYALI</p>
              </div>
            </section>

          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Documents</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </Link>
              <Link to="/help" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold">
                <FileText className="w-4 h-4" />
                Help Center
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Terms;

