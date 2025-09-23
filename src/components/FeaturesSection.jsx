import React from 'react';
import { Smartphone, Code, Search, Zap, Paintbrush, Shield } from 'lucide-react';

function FeaturesSection() {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Responsive",
      description: "Designed mobile-first using TailwindCSS responsive utilities. Flawless performance across all devices with Google PageSpeed optimization.",
    },
    {
      icon: Code,
      title: "Clean HTML + TailwindCSS",
      description: "Production-ready HTML5 with TailwindCSS utility classes. Semantic markup, accessibility compliant, and developer-friendly structure.",
    },
    {
      icon: Search,
      title: "SEO & Meta Ready",
      description: "Complete SEO foundation with optimized meta tags, Open Graph data, structured markup, and Core Web Vitals optimization.",
    },
    {
      icon: Zap,
      title: "Deploy in Minutes",
      description: "Zero build process required - just customize and deploy to Vercel, Netlify, GitHub Pages, or any static hosting provider.",
    },
    {
      icon: Paintbrush,
      title: "Easy Customization",
      description: "Customize everything using CSS variables and simple HTML edits. Comprehensive guides included - no design experience needed.",
    },
    {
      icon: Shield,
      title: "Production Ready",
      description: "Battle-tested code with cross-browser compatibility, WCAG accessibility standards, and performance optimizations built-in.",
    },
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Everything You Need to Launch Successfully
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
              Skip months of design and development. Launch with conversion-optimized, professional landing pages that turn visitors into customers from day one.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="h-full bg-white rounded-xl border border-neutral-200 p-8 hover:shadow-lg transition-all duration-300 hover:border-primary-200">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
