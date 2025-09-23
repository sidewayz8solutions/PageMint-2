import React from 'react';
import { Monitor, Palette, Moon, Heart, Building } from 'lucide-react';
function TemplateShowcase() {
  const getTemplateUrl = (templateName) => {
    const timestamp = Date.now();
    switch (templateName) {
      case "Minimalist Clean":
        return `/templates/minimalist-clean.html?v=${timestamp}`;
      case "Gradient Startup":
        return `/templates/gradient-startup.html?v=${timestamp}`;
      case "Dark Mode Tech":
        return `/templates/dark-mode-tech.html?v=${timestamp}`;
      case "Playful SaaS":
        return `/templates/playful-saas.html?v=${timestamp}`;
      case "Professional B2B":
        return `/templates/professional-b2b.html?v=${timestamp}`;
      default:
        return `/templates/minimalist-clean.html?v=${timestamp}`;
    }
  };
 const templates = [
    {
      icon: Monitor,
      name: "Minimalist Clean",
      description: "Plain typography with pastel accents for a clean, professional look",
      color: "bg-gradient-to-br from-slate-50 to-blue-50",
      accent: "text-blue-600",
    },
    {
      icon: Palette,
      name: "Gradient Startup",
      description: "Eye-catching gradient backgrounds with modern card layouts",
      color: "bg-gradient-to-br from-purple-50 to-pink-50",
      accent: "text-purple-600",
    },
    {
      icon: Moon,
      name: "Dark Mode Tech",
      description: "Sleek dark theme with neon CTAs for tech-forward brands",
      color: "bg-gradient-to-br from-gray-800 to-gray-900",
      accent: "text-green-400",
    },
    {
      icon: Heart,
      name: "Playful SaaS",
      description: "Rounded cards and friendly icons for approachable brands",
      color: "bg-gradient-to-br from-orange-50 to-yellow-50",
      accent: "text-orange-600",
    },
    {
      icon: Building,
      name: "Professional B2B",
      description: "Muted colors and corporate layout for enterprise clients",
      color: "bg-gradient-to-br from-indigo-50 to-gray-50",
      accent: "text-indigo-600",
    },
  ];

return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              5 Production-Ready Template Variations
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
              Each template includes all essential SaaS sections with unique visual personalities and conversion-optimized layouts. 
              Choose the style that matches your brand perfectly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <div key={index} className="group relative">
              <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white hover:shadow-xl transition-all duration-300 md:transform md:hover:-translate-y-2">
                <div className={`h-32 ${template.color} relative`}>
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="absolute top-4 left-4">
                    <template.icon className={`h-6 w-6 ${template.accent}`} />
                  </div>
      
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{template.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                      Template #{index + 1}
                    </span>
                    <a 
                      href={getTemplateUrl(template.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium ${template.accent} hover:underline transition-colors mobile-touch-target inline-block`}
                    >
                      Live Demo →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 sm:mt-16 text-center px-4">
          <div className="inline-flex items-center gap-4 rounded-full bg-primary-50 px-6 py-3">
            <span className="text-xs sm:text-sm font-medium text-primary-700 text-center">
              All templates include: Hero • Features • Pricing • Testimonials • FAQ • CTA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
export default TemplateShowcase;