import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientTop() + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handlePurchase = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white/90'
    }`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-h-[64px]">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary-600" />
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl font-bold text-neutral-900 hover:text-primary-600 transition-colors mobile-touch-target flex items-center"
            >
              PageMint
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button 
              onClick={() => scrollToSection('showcase')}
              className="text-neutral-600 hover:text-primary-600 transition-colors font-medium mobile-touch-target"
            >
              Templates
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-neutral-600 hover:text-primary-600 transition-colors font-medium mobile-touch-target"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-neutral-600 hover:text-primary-600 transition-colors font-medium mobile-touch-target"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-neutral-600 hover:text-primary-600 transition-colors font-medium mobile-touch-target"
            >
              FAQ
            </button>
            <button 
              onClick={handlePurchase}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mobile-touch-target whitespace-nowrap"
            >
              Get Templates
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors mobile-touch-target p-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-neutral-200 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 space-y-2">
              <button 
                onClick={() => scrollToSection('showcase')}
                className="block w-full text-left text-neutral-600 hover:text-primary-600 transition-colors font-medium py-3 mobile-touch-target"
              >
                Templates
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-neutral-600 hover:text-primary-600 transition-colors font-medium py-3 mobile-touch-target"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left text-neutral-600 hover:text-primary-600 transition-colors font-medium py-3 mobile-touch-target"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left text-neutral-600 hover:text-primary-600 transition-colors font-medium py-3 mobile-touch-target"
              >
                FAQ
              </button>
              <button 
                onClick={handlePurchase}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors mobile-touch-target mt-4"
              >
                Get Templates
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
