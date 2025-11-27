import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Truck, ShieldCheck, Palette, Layers, TrendingUp, LayoutDashboard } from 'lucide-react';
import { INITIAL_DESIGNS } from '../constants';

const Home: React.FC = () => {
  const latestDesigns = INITIAL_DESIGNS.slice(0, 3);
  const mostRequested = INITIAL_DESIGNS.slice(3, 6);
  const [showAdminButton, setShowAdminButton] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">

      {/* Floating Admin Button */}
      {showAdminButton && (
        <Link
          to="/admin"
          className="fixed bottom-8 right-8 z-50 bg-brand-600 dark:bg-brand-500 text-white p-4 rounded-full shadow-2xl hover:bg-brand-700 dark:hover:bg-brand-600 transition-all transform hover:scale-110 animate-popup group"
          title="Admin Dashboard"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Admin Dashboard
          </span>
        </Link>
      )}

      {/* Hero Section */}
      <section className="relative bg-[#f8f7f5] dark:bg-gray-800 overflow-hidden pt-10 lg:pt-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8 text-center lg:text-left pt-10 lg:pt-0">
              <div className="inline-block px-4 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium text-sm tracking-wide uppercase">
                Premium Print on Demand
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                Curated Art. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">
                  Wearable Canvas.
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Create exclusive T-shirts, Hoodies, Sweaters, and Caps.
                Where high-end design meets everyday comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/studio" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-gray-900 dark:bg-brand-600 hover:bg-gray-800 dark:hover:bg-brand-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a href="#collections" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md">
                  Explore Designs
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
                  <span className="font-bold text-gray-900 dark:text-white">10k+</span> Artists joined
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block h-full min-h-[600px]">
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-tl-[100px] -z-10"></div>
               <img
                src="/images/Main Pic.jpeg"
                alt="Fashion Model"
                className="absolute bottom-0 right-10 w-4/5 h-auto object-cover drop-shadow-2xl rounded-t-[40px]"
               />

               {/* Floating Card 1 */}
               <div className="absolute top-20 left-0 bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-xl max-w-[200px] animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="font-bold text-sm dark:text-white">Premium Cotton</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-600 rounded-full w-full"></div>
               </div>

               {/* Floating Card 2 */}
               <div className="absolute bottom-40 -left-8 bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-xl max-w-[220px]" >
                  <div className="flex items-center gap-3">
                    <img src={latestDesigns[0].imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="Art" />
                    <div>
                      <p className="font-bold text-sm dark:text-white">New Arrival</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Limited Edition</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase (Mockups Models) */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">The Collection</h2>
             <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">Choose Your Canvas</p>
             <p className="text-gray-500 dark:text-gray-400 text-lg">We focus on the essentials. Four premium base products, infinite possibilities.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'T-Shirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', desc: '100% Organic Cotton' },
                { name: 'Hoodies', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', desc: 'Heavyweight Fleece' },
                { name: 'Sweaters', img: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80', desc: 'Cozy Knit Blend' },
                { name: 'Caps', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', desc: 'Structured Snapback' }
              ].map((item, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl cursor-pointer">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 dark:bg-gray-700">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold font-serif mb-1">{item.name}</h3>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                    <div className="mt-4 h-1 w-0 bg-white group-hover:w-12 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Latest Designs */}
      <section id="collections" className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-serif">Fresh Drops</h2>
              <div className="h-1 w-20 bg-brand-500 dark:bg-brand-400 mt-4 rounded-full"></div>
            </div>
            <Link to="/studio" className="group flex items-center gap-2 font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              <span>View all collections</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestDesigns.map((design) => (
              <div key={design.id} className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
                <div className="relative h-80 overflow-hidden">
                   <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-white shadow-sm">
                    New
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Link to="/studio" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-brand-50 dark:hover:bg-brand-900/30">
                       Customize
                     </Link>
                  </div>
                </div>
                <div className="p-6">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wide">{design.category}</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{design.title}</h3>
                      </div>
                      <span className="text-lg font-serif font-bold text-gray-900 dark:text-white">${design.price}</span>
                   </div>
                   <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{design.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-200">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-brand-100 dark:bg-brand-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">Our Promise</h2>
             <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Why Designers Choose Us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Palette, title: 'True-to-Life Color', text: 'Our advanced DTG printing tech ensures your design looks exactly as you imagined.' },
              { icon: Layers, title: 'Premium Materials', text: 'We only stock high-GSM cotton, soft blends, and durable fabrics.' },
              { icon: TrendingUp, title: 'Global Scale', text: 'From one unit to one thousand. We scale with your ambition seamlessly.' }
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

      {/* Most Requested / Trending */}
      <section className="py-24 bg-[#111827] dark:bg-black text-white transition-colors duration-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-3xl font-serif font-bold">Community Favorites</h2>
               <div className="flex space-x-2">
                  <button className="p-2 rounded-full border border-gray-700 dark:border-gray-800 hover:bg-gray-800 dark:hover:bg-gray-900 text-white"><ArrowRight className="rotate-180 w-5 h-5" /></button>
                  <button className="p-2 rounded-full border border-gray-700 dark:border-gray-800 hover:bg-gray-800 dark:hover:bg-gray-900 text-white"><ArrowRight className="w-5 h-5" /></button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {mostRequested.map((design) => (
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
                             <span className="font-medium text-brand-400 dark:text-brand-300">${design.price}</span>
                             <button className="text-xs font-bold uppercase tracking-wider hover:text-brand-300 dark:hover:text-brand-200">Add +</button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* About Us */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full -z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
                    alt="Design Team"
                    className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                  />
                  <div className="absolute bottom-10 -right-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                     <p className="font-serif text-xl italic text-gray-800 dark:text-gray-200">"Design is intelligence made visible."</p>
                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-bold">- Alina Wheeler</p>
                  </div>
               </div>
               <div>
                  <h2 className="text-base text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase mb-3">Who We Are</h2>
                  <h3 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">We Bridge the Gap Between Art and Apparel.</h3>
                  <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                     Ink & Thread wasn't built for mass production. It was built for the obsessed.
                     For the creators who spend hours perfecting a single vector line.
                     For the wearers who want their clothes to say something meaningful.
                  </p>
                  <div className="space-y-4 mb-8">
                     {[
                        'Eco-friendly inks and sustainable packaging',
                        'Artist-first royalty model',
                        'Quality control on every single stitch'
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
                     Read our full story <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;