import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What do I get exactly?",
      answer: "You receive 5 professionally designed HTML templates built with TailwindCSS, premium icon sets, optimized images, custom fonts, and comprehensive setup guides. Everything is production-ready and fully documented."
    },
    {
      question: "What's the license for commercial use?",
      answer: "Currently, PageMint templates are licensed for personal use only - perfect for portfolios, learning projects, and personal websites. For commercial licensing options, contact our team at support@pagemint.com."
    },
    {
      question: "How easy is customization?",
      answer: "Extremely straightforward! Customize colors using CSS variables, update content directly in HTML, and replace images in the assets folder. Our detailed guide walks you through every step - most users complete customization in under 30 minutes."
    },
    {
      question: "Are the templates mobile responsive?",
      answer: "Absolutely! All templates are built mobile-first using TailwindCSS responsive utilities. They're tested across devices and pass Google's mobile-friendly tests with perfect scores."
    },
    {
      question: "Do you offer refunds?",
      answer: "All sales are final. We provide comprehensive previews, live demos, and detailed documentation to help you make an informed decision before purchasing."
    },
    {
      question: "Will there be updates?",
      answer: "Definitely! Your purchase includes lifetime updates at no additional cost. New templates, improvements, and feature additions are delivered automatically to all customers."
    },

  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Everything you need to know about PageMint.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                  <div className="ml-4 flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-neutral-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-neutral-500" />
                    )}
                  </div>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 bg-neutral-50">
                  <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;