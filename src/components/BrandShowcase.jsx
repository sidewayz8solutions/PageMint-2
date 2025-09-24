import React from 'react';
import { Sparkles, Zap, Rocket, Star } from 'lucide-react';

function BrandShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,249,129,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Large Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <img 
                src="/123.png" 
                alt="PageMint Logo" 
                className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Crafted for
              <span className="text-green-400"> Excellence</span>
            </h2>
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Where premium design meets developer-friendly code. 
              <br className="hidden sm:block" />
              Built by creators, for creators.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <div className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 hover:bg-gray-800/70">
                  <Sparkles className="h-8 w-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold mb-2">Premium Quality</h3>
                  <p className="text-gray-400 text-sm">Pixel-perfect designs with attention to every detail</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 hover:bg-gray-800/70">
                  <Zap className="h-8 w-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-400 text-sm">Optimized for speed and performance</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 hover:bg-gray-800/70">
                  <Rocket className="h-8 w-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold mb-2">Launch Ready</h3>
                  <p className="text-gray-400 text-sm">Deploy in minutes, not months</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 hover:bg-gray-800/70">
                  <Star className="h-8 w-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold mb-2">Future Proof</h3>
                  <p className="text-gray-400 text-sm">Built with modern standards and best practices</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-800">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">5</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Premium Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Mobile Responsive</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">∞</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Lifetime Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandShowcase;
