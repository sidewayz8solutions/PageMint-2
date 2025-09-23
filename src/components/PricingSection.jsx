import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import PaymentButton from './PaymentButton';

function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            One-time purchase. Lifetime access. No subscriptions or hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Pack */}
          <div className="relative bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">Starter Pack</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900">$29</span>
                <span className="text-sm text-neutral-500">one-time</span>
              </div>
              <p className="text-sm text-neutral-600 mt-2">Perfect for indie hackers</p>
            </div>
            <ul className="space-y-3 mb-6 sm:mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">2 Template Variations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">HTML + TailwindCSS</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">Mobile Responsive</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">Basic SEO Setup</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-5 w-5 text-blue-500">ℹ</span>
                <span className="text-sm sm:text-base text-neutral-600">Personal & Learning Use</span>
              </li>
            </ul>
            <PaymentButton
              productId="STARTER_PACK"
              variant="secondary"
              className="w-full py-3 px-4 text-neutral-900 bg-neutral-100 hover:bg-neutral-200 shadow-none border-0 mobile-touch-target"
            >
                Get Starter Pack
            </PaymentButton>
          </div>

          {/* Pro Pack - Most Popular */}
          <div className="relative bg-primary-600 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 lg:transform lg:hover:scale-105 lg:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-accent-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                <Star className="h-4 w-4" />
                Most Popular
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Pro Pack</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">$59</span>
                <span className="text-sm text-primary-200">one-time</span>
              </div>
              <p className="text-sm text-primary-200 mt-2">Best value for agencies</p>
            </div>
            <ul className="space-y-3 mb-6 sm:mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-300" />
                <span className="text-sm sm:text-base text-white">All 5 Template Variations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-300" />
                <span className="text-sm sm:text-base text-white">HTML + TailwindCSS</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-300" />
                <span className="text-sm sm:text-base text-white">Mobile Responsive</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-300" />
                <span className="text-sm sm:text-base text-white">Advanced SEO Setup</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-300" />
                <span className="text-sm sm:text-base text-white">Customization Guide</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-5 w-5 text-blue-300">ℹ</span>
                <span className="text-sm sm:text-base text-white">Personal & Learning Use</span>
              </li>
            </ul>
            <PaymentButton
              productId="PRO_PACK"
              variant="secondary"
              className="w-full py-3 px-4 bg-white hover:bg-neutral-50 shadow-none border-0 mobile-touch-target"
            >
              Get Pro Pack
            </PaymentButton>
          </div>

          {/* Agency Pack */}
          <div className="relative bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 hover:shadow-lg transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2">Agency Pack</h3>
              <p className="text-sm text-neutral-600 mb-6">Complete solution for agencies</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900">$99</span>
                <span className="text-sm text-neutral-500">one-time</span>
              </div>
              <p className="text-sm text-neutral-600 mt-2">Everything + React versions</p>
            </div>
            <ul className="space-y-3 mb-6 sm:mb-8">
              <li className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent-500" />
                <span className="text-sm sm:text-base text-neutral-700">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">React + Next.js Versions</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">Figma Source Files</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">White-label Rights</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm sm:text-base text-neutral-700">Priority Support</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-5 w-5 text-blue-500">ℹ</span>
                <span className="text-sm sm:text-base text-neutral-700">Commercial Use</span>
              </li>
            </ul>
              <button 
                disabled
                className="w-full bg-neutral-100 text-neutral-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed opacity-60"
              >
                Contact for Pricing
            </button>
          </div>
        </div>
        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-4xl mx-auto">
            <p className="text-blue-800 font-semibold mb-2">📝 Current License: Personal & Learning Use</p>
            <p className="text-blue-800 font-semibold mb-2">📝 Personal Use License</p>
            <p className="text-blue-700 text-sm">
              Perfect for personal portfolios, learning projects, and non-commercial websites. Commercial licensing available - contact support@pagemint.com for enterprise options.
            </p>
          </div>
          <p className="text-sm text-neutral-500">
            Instant download • Lifetime updates • Premium support • Comprehensive documentation
          </p>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;