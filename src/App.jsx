import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import TemplateShowcase from './components/TemplateShowcase';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';


function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="showcase">
          <TemplateShowcase />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <section id="testimonials">
          <TestimonialsSection />
        </section>
        <section id="faq">
          <FAQSection />
        </section>
        <section id="cta">
          <CTASection />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
