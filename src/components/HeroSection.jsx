import React from 'react';
import { ArrowRight, Sparkles, Download, Leaf } from 'lucide-react';
import PaymentButton from './PaymentButton';
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 py-16 sm:py-20 lg:py-28 px-4 sm:px-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center pt-16 sm:pt-0">
          <div className="flex flex-col items-center mb-8">
            <div className="inline-flex items-center gap-4 mb-3">
              <img
                src="/123.png"
                alt="PageMint Logo"
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">PageMint</h1>
            </div>
            <a
              href="https://www.mintypage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg sm:text-xl font-semibold text-green-400 hover:text-green-300 transition-colors"
            >
              www.mintypage.com
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-black mb-8">
            <Sparkles className="h-4 w-4" />
            Ready-to-Deploy Templates
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Launch Your SaaS
            <span className="text-green-400"> in Hours</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Not Weeks
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
            Professional SaaS landing page templates for indie hackers, startups, and agencies.
            Launch conversion-optimized websites in hours, not weeks. Mobile-first design with premium aesthetics.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <PaymentButton 
              productId="PRO_PACK"
              variant="primary"
              className="text-base w-full sm:w-auto mobile-touch-target"
            >
              <Download className="h-5 w-5" />
              Get Pro Pack - $59
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </PaymentButton>
            <a 
              href="#showcase"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 text-base font-semibold text-neutral-700 hover:text-primary-600 transition-colors mobile-touch-target w-full sm:w-auto justify-center sm:justify-start"
            >
              View Live Demos
            </a>
          </div>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-neutral-500 px-4 sm:px-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              5 Premium Templates
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Conversion Optimized
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Production Ready
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-200 to-accent-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </section>
  );
}

export default HeroSection;
