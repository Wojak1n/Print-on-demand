import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Heart, Users, Zap } from 'lucide-react';

const Careers: React.FC = () => {
  const openPositions = [
    { title: 'Senior Full-Stack Developer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
    { title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
    { title: 'Customer Success Manager', department: 'Support', location: 'Hybrid', type: 'Full-time' },
    { title: 'Marketing Specialist', department: 'Marketing', location: 'Remote', type: 'Part-time' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Help us empower creators worldwide. Build the future of print-on-demand with a passionate team.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">Why KHAYALI</h2>
            <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Why Work With Us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Passion-Driven', text: 'Work on projects you truly care about with a team that shares your values.' },
              { icon: Users, title: 'Collaborative Culture', text: 'Open communication, mutual respect, and teamwork are at our core.' },
              { icon: Zap, title: 'Growth Opportunities', text: 'Continuous learning, skill development, and career advancement.' },
              { icon: Briefcase, title: 'Work-Life Balance', text: 'Flexible hours, remote options, and generous time off policies.' }
            ].map((benefit, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 mx-auto">
                  <benefit.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Find your next opportunity</p>
          </div>

          <div className="space-y-4">
            {openPositions.map((position, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {position.department}
                      </span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <button className="inline-flex items-center justify-center px-6 py-3 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors font-semibold">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Don't see a perfect fit?</p>
            <button className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300">
              Send us your resume anyway →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">
            Join a team that's revolutionizing the print-on-demand industry.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-gray-900 bg-white hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Explore KHAYALI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Careers;

