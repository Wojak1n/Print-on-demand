import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Custom Apparel Design',
      excerpt: 'Discover the secrets behind creating stunning custom designs that sell. From concept to final product.',
      author: 'Sarah Johnson',
      date: 'March 15, 2024',
      category: 'Design Tips',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800&auto=format&fit=crop',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Sustainable Printing: Our Commitment',
      excerpt: 'Learn about our eco-friendly practices and how we\'re reducing our environmental footprint.',
      author: 'Michael Chen',
      date: 'March 10, 2024',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'Top 10 Design Trends for 2024',
      excerpt: 'Stay ahead of the curve with these emerging design trends that are shaping the apparel industry.',
      author: 'Emma Davis',
      date: 'March 5, 2024',
      category: 'Trends',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=800&auto=format&fit=crop',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Building Your Brand with Custom Merch',
      excerpt: 'How custom apparel can elevate your brand identity and create lasting customer connections.',
      author: 'David Martinez',
      date: 'February 28, 2024',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop',
      readTime: '7 min read'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              KHAYALI Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Insights, tips, and stories from the world of custom apparel design.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-xl transition-all group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-600 dark:bg-brand-500 text-white text-xs font-semibold rounded-full">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    
                    <button className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 bg-brand-600 dark:bg-brand-500 text-white rounded-lg font-semibold">1</button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">2</button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">3</button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">
            Subscribe to our newsletter for the latest design tips, trends, and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-brand-600 dark:bg-brand-500 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Blog;

