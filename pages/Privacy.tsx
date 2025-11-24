import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="w-16 h-16 mx-auto mb-6 text-brand-600 dark:text-brand-400" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Last updated: March 1, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <Lock className="w-8 h-8 text-brand-600 dark:text-brand-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Secure Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your information is encrypted and protected</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <Eye className="w-8 h-8 text-brand-600 dark:text-brand-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Transparency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">We're clear about what we collect and why</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <Shield className="w-8 h-8 text-brand-600 dark:text-brand-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Your Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">You can access, update, or delete your data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
                <li><strong>Design Content:</strong> Images, text, and other content you upload or create</li>
                <li><strong>Order Information:</strong> Shipping address, billing information, and order history</li>
                <li><strong>Payment Information:</strong> Credit card details (processed securely through third-party payment processors)</li>
                <li><strong>Communications:</strong> Messages you send to our support team or through our platform</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations, shipping updates, and customer support messages</li>
                <li>Communicate with you about products, services, and promotional offers</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                <li>Personalize your experience and provide relevant content</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment processors, shipping companies, etc.)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee access to personal information</li>
                <li>Two-factor authentication options for accounts</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Access and review your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Our services are not intended for children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white font-semibold mb-2">KHAYALI Privacy Team</p>
                <p className="text-gray-600 dark:text-gray-400">Email: privacy@khayali.com</p>
                <p className="text-gray-600 dark:text-gray-400">Phone: 1-800-KHAYALI</p>
              </div>
            </section>

          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Documents</h3>
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold">
                <FileText className="w-4 h-4" />
                Terms of Service
              </Link>
              <Link to="/help" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold">
                <Shield className="w-4 h-4" />
                Help Center
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Privacy;

