import React from 'react';
import { Download, ArrowRight, Clock } from 'lucide-react';
import PaymentButton from './PaymentButton';

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white mb-8">
          <Clock className="h-4 w-4" />
          Launch Today, Not Next Month
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Launch?
          <br />
          Start Building Today.
        </h2>
        <p className="mt-6 text-lg leading-8 text-primary-100 max-w-2xl mx-auto">
          While others spend months on design, you could be converting customers. 
          Launch your professional SaaS landing page today and start growing your business.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <PaymentButton
            productId="PRO_PACK"
            variant="secondary"
            className="text-base bg-white text-primary-600 hover:bg-neutral-50"
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
            className="inline-flex items-center gap-2 text-base font-semibold text-white hover:text-primary-100 transition-colors"
          >
            View Live Demos
          </a>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-primary-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Instant Download
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Lifetime Updates
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Premium Support
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
