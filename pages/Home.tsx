import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Zap, Truck, ShieldCheck, Palette, Layers, TrendingUp, LayoutDashboard, Sparkles, ShoppingCart, Quote } from 'lucide-react';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { cld, IMAGES } from '../config/cloudinary';
import { isAuthenticated, isAdmin } from '../utils/auth';
import useTranslation from '../hooks/useTranslation';
import { formatPrice } from '../utils/currency';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAdminButton, setShowAdminButton] = useState(false);

  // Get featured designs - load from admin catalog only
  const [featuredDesigns, setFeaturedDesigns] = useState<any[]>([]);

  useEffect(() => {
    const loadFeaturedDesigns = () => {
      console.log('🔄 Loading featured designs...');
      const savedCatalog = localStorage.getItem('catalogDesigns');
      console.log('📦 Catalog from localStorage:', savedCatalog);

      // Load only featured designs from admin catalog
      let allDesigns: any[] = [];

      if (savedCatalog) {
        const customDesigns = JSON.parse(savedCatalog);
        console.log('📋 All designs:', customDesigns);
        const customFeatured = customDesigns.filter((d: any) => d.featured === true);
        console.log('⭐ Featured designs:', customFeatured);
        allDesigns = customFeatured;
      }

      console.log('✅ Setting featured designs:', allDesigns.length, 'designs');
      setFeaturedDesigns(allDesigns);
    };

    loadFeaturedDesigns();

    // Reload when storage changes (e.g., when admin updates designs)
    window.addEventListener('storage', loadFeaturedDesigns);
    window.addEventListener('catalogDesignsUpdated', loadFeaturedDesigns);

    return () => {
      window.removeEventListener('storage', loadFeaturedDesigns);
      window.removeEventListener('catalogDesignsUpdated', loadFeaturedDesigns);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down more than 300px
      if (window.scrollY > 300) {
        setShowAdminButton(true);
      } else {
        setShowAdminButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if user is authenticated and is admin
    if (isAuthenticated() && isAdmin()) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">

      {/* Floating Admin Button */}
      {showAdminButton && (
        <button
          onClick={handleAdminClick}
          className="fixed bottom-8 right-8 z-50 bg-brand-600 dark:bg-brand-500 text-white p-4 rounded-full shadow-2xl hover:bg-brand-700 dark:hover:bg-brand-600 transition-all transform hover:scale-110 animate-popup group"
          title="Admin Dashboard"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Admin Dashboard
          </span>
        </button>
      )}

      {/* Hero Section */}
      <section className="relative bg-[#f8f7f5] dark:bg-gray-800 overflow-hidden pt-10 lg:pt-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8 text-center lg:text-left pt-10 lg:pt-0">
              <div className="inline-block px-4 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium text-sm tracking-wide uppercase">
                {t.hero.badge}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                {t.hero.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">
                  {t.hero.subtitle}
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/studio" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-gray-900 dark:bg-brand-600 hover:bg-gray-800 dark:hover:bg-brand-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#collections" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md">
                  {t.hero.ctaSecondary}
                </a>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                       <img src={`https://picsum.photos/seed/${i}/100/100`} alt="User" />
                     </div>
                   ))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">10k+</span> {t.hero.artistsJoined}
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block h-full min-h-[700px]">
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-tl-[100px] -z-10"></div>
               <AdvancedImage
                cldImg={cld.image(IMAGES.HERO)
                  .format('auto')
                  .quality('auto')
                  .resize(auto().gravity(autoGravity()).width(800))}
                alt="Fashion Model"
                className="absolute -bottom-12 right-5 w-[95%] h-auto object-cover drop-shadow-2xl rounded-t-[40px]"
               />

               {/* Floating Card - New Arrival */}
               {featuredDesigns.length > 0 && (
                 <div className="absolute bottom-40 -left-8 bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-xl max-w-[220px]" >
                    <div className="flex items-center gap-3">
                      <img src={featuredDesigns[0].imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="Art" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">{t.hero.newArrival}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.hero.limitedEdition}</p>
                      </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      {featuredDesigns.length > 0 && (
        <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm uppercase tracking-wider">{t.handpicked.badge}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                {t.handpicked.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                {t.handpicked.description}
              </p>
            </div>

            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDesigns.map((design) => (
                <div
                  key={design.id}
                  onClick={() => navigate('/studio')}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer transform hover:-translate-y-1 relative"
                >
                  {/* Product Image */}
                  <div className="relative h-96 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {design.featuredTag && (
                      <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {design.featuredTag}
                      </div>
                    )}
                    <img
                      src={design.featuredMockup || design.imageUrl}
                      alt={design.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Click to Customize Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Palette className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-lg font-bold">{t.handpicked.clickToCustomize}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
                        {design.category}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {design.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {design.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t.handpicked.startingAt}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(design.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {featuredDesigns.length > 3 && (
              <div className="text-center mt-12">
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  View All Featured Designs
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-200">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-brand-100 dark:bg-brand-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">{t.features.badge}</h2>
             <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white">{t.features.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Palette, title: t.features.feature1Title, text: t.features.feature1Text },
              { icon: Layers, title: t.features.feature2Title, text: t.features.feature2Text },
              { icon: TrendingUp, title: t.features.feature3Title, text: t.features.feature3Text }
            ].map((feat, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-brand-200 dark:hover:border-brand-600 hover:shadow-lg transition-all duration-300">
                 <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-2xl shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 rotate-3 hover:rotate-6 transition-transform">
                    <feat.icon size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
                 <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mb-4">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-sm uppercase tracking-wider">{t.reviews.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              {t.reviews.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t.reviews.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: t.reviews.review1Name,
                role: t.reviews.review1Role,
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
                rating: 5,
                review: t.reviews.review1Text,
                date: t.reviews.review1Date
              },
              {
                name: t.reviews.review2Name,
                role: t.reviews.review2Role,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
                rating: 5,
                review: t.reviews.review2Text,
                date: t.reviews.review2Date
              },
              {
                name: t.reviews.review3Name,
                role: t.reviews.review3Role,
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
                rating: 5,
                review: t.reviews.review3Text,
                date: t.reviews.review3Date
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-brand-100 dark:text-brand-900/30">
                  <Quote className="w-12 h-12 fill-current" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed relative z-10">
                  "{review.review}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900/30"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.role}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Rating */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-700 rounded-full px-8 py-4 shadow-lg border border-gray-100 dark:border-gray-600">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9/5</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.reviews.basedOn}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Requested / Trending */}
      {featuredDesigns.length > 0 && (
        <section className="py-24 bg-[#111827] dark:bg-black text-white transition-colors duration-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                 <h2 className="text-3xl font-serif font-bold">{t.community.title}</h2>
                 <div className="flex space-x-2">
                    <button className="p-2 rounded-full border border-gray-700 dark:border-gray-800 hover:bg-gray-800 dark:hover:bg-gray-900 text-white"><ArrowRight className="rotate-180 w-5 h-5" /></button>
                    <button className="p-2 rounded-full border border-gray-700 dark:border-gray-800 hover:bg-gray-800 dark:hover:bg-gray-900 text-white"><ArrowRight className="w-5 h-5" /></button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {featuredDesigns.slice(0, 3).map((design) => (
                 <div key={design.id} className="bg-gray-800 dark:bg-gray-900 rounded-xl p-4 hover:bg-gray-750 dark:hover:bg-gray-800 transition-colors border border-gray-700 dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-700">
                    <div className="flex gap-4">
                       <img src={design.imageUrl} alt={design.title} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                       <div className="flex flex-col justify-between py-1 flex-1">
                          <div>
                            <div className="flex justify-between items-start">
                               <h4 className="font-bold text-lg">{design.title}</h4>
                               <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                            <p className="text-sm text-gray-400 dark:text-gray-500">{design.category}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                             <span className="font-medium text-brand-400 dark:text-brand-300">{formatPrice(design.price)}</span>
                             <button className="text-xs font-bold uppercase tracking-wider hover:text-brand-300 dark:hover:text-brand-200">Add +</button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
        </section>
      )}

      {/* About Us */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full -z-10"></div>
                  <img
                    src="/images/About us.jpg"
                    alt="Broderie dorée détaillée sur manche de veste noire"
                    className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                  />
                  <div className="absolute bottom-10 -right-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                     <p className="font-serif text-xl italic text-gray-800 dark:text-gray-200">{t.about.quote}</p>
                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-bold">{t.about.quoteAuthor}</p>
                  </div>
               </div>
               <div>
                  <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">{t.about.badge}</h2>
                  <h3 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">{t.about.title}</h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                     {t.about.description}
                  </p>
                  <div className="space-y-4 mb-8">
                     {[
                        t.about.feature1,
                        t.about.feature2,
                        t.about.feature3
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                              <ShieldCheck size={14} />
                           </div>
                           <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                     ))}
                  </div>
                  <Link to="/about" className="text-brand-600 dark:text-brand-400 font-bold hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center">
                     {t.about.readStory} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;