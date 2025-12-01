import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Heart, Users, Award, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">

      {/* Hero Section */}
      <section className="relative bg-[#f8f7f5] dark:bg-gray-800 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              {t.aboutPage.hero.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {t.aboutPage.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">{t.aboutPage.mission.badge}</h2>
              <h3 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                {t.aboutPage.mission.title}
              </h3>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {t.aboutPage.mission.description}
              </p>
              <div className="space-y-4 mb-8">
                {[
                  t.aboutPage.mission.feature1,
                  t.aboutPage.mission.feature2,
                  t.aboutPage.mission.feature3
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <ShieldCheck size={14} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full -z-10"></div>
              <img
                src="/images/About us.jpg"
                alt={t.aboutPage.mission.imageAlt}
                className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">{t.aboutPage.values.badge}</h2>
            <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white">{t.aboutPage.values.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: t.aboutPage.values.passion.title,
                text: t.aboutPage.values.passion.text
              },
              {
                icon: Users,
                title: t.aboutPage.values.community.title,
                text: t.aboutPage.values.community.text
              },
              {
                icon: Award,
                title: t.aboutPage.values.quality.title,
                text: t.aboutPage.values.quality.text
              }
            ].map((value, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-600 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 rounded-2xl shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">{t.aboutPage.team.badge}</h2>
            <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white">{t.aboutPage.team.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Sarah Johnson', role: t.aboutPage.team.founder, img: 'https://res.cloudinary.com/dwm9hk3qg/image/upload/v1733097600/Creators/Creators-1.jpg' },
              { name: 'Michael Chen', role: t.aboutPage.team.headDesigner, img: 'https://res.cloudinary.com/dwm9hk3qg/image/upload/v1733097600/Creators/Creators-2.jpg' }
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-brand-600 dark:text-brand-400 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 dark:bg-black text-white transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-6 text-brand-400 dark:text-brand-300" />
          <h2 className="text-4xl font-serif font-bold mb-6">{t.aboutPage.cta.title}</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">
            {t.aboutPage.cta.subtitle}
          </p>
          <Link
            to="/studio"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-gray-900 bg-white hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {t.aboutPage.cta.button}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;

