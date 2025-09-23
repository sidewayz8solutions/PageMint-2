import React from 'react';
import { Mail, Twitter, Github, Leaf } from 'lucide-react';
function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
             <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary-400" />
              <h3 className="text-xl font-bold">PageMint</h3>
            </div>
           <p className="text-neutral-300 mb-6 max-w-md">
              Professional SaaS landing page templates for indie hackers, founders, and agencies. Launch beautiful, conversion-optimized websites in hours, not weeks.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/teachmecode_ae" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/teachmecode-ae" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors" aria-label="View our GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@pagemint.com" className="text-neutral-400 hover:text-white transition-colors" aria-label="Email us">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Templates</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a 
                  href="/templates/minimalist-clean.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Minimalist Clean
                </a>
              </li>
              <li>
                <a 
                  href="/templates/gradient-startup.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Gradient Startup
                </a>
              </li>
              <li>
                <a 
                  href="/templates/dark-mode-tech.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Dark Mode Tech
                </a>
              </li>
              <li>
                <a 
                  href="/templates/playful-saas.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Playful SaaS
                </a>
              </li>
              <li>
                <a 
                  href="/templates/professional-b2b.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Professional B2B
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <a 
                  href="mailto:support@pagemint.com?subject=Documentation%20Request" 
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#showcase"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Live Examples
                </a>
              </li>
              <li><a href="mailto:support@pagemint.com" className="hover:text-white transition-colors">Contact Support</a></li>
              <li>
                <a 
                  href="mailto:support@pagemint.com?subject=Pre-Purchase%20Questions" 
                  className="hover:text-white transition-colors"
                >
                  Pre-Purchase Help
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-neutral-800 bg-neutral-950 py-3">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-2">
            <div>
              &copy; 2024 PageMint. All rights reserved.
            </div>
            <div>
              Built with ❤️ by{' '}
            <a 
              href="https://biela.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Biela
            </a>
            {' '}• Powered by{' '}
            <a 
              href="https://teachmecode.ae" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              TeachMeCode®
            </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
