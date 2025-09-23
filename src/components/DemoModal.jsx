import React, { useState } from 'react';
import { X, Monitor, Smartphone } from 'lucide-react';

function DemoModal({ isOpen, onClose, template }) {
  const [viewMode, setViewMode] = useState('desktop');

  if (!isOpen || !template) return null;

  const getTemplateUrl = () => {
    const timestamp = Date.now();
    switch (template.name) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative h-full flex flex-col">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {template.name} - Live Demo
            </h3>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'desktop' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'mobile' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Demo Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className={`mx-auto transition-all duration-300 ${
            viewMode === 'mobile' ? 'max-w-sm' : 'max-w-6xl'
          }`}>
            <div className="mb-4 text-center text-sm text-gray-600">
              Loading {template.name} template from {getTemplateUrl()}...
              <a 
                href={getTemplateUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-2"
              >
                Open in new tab →
              </a>
            </div>
            <iframe 
              src={getTemplateUrl()}
              key={`${template.name}-${Date.now()}`}
              className="w-full h-full min-h-[800px] rounded-lg border border-gray-300 bg-white"
              title={`${template.name} Template Demo`}
              loading="eager"
              onLoad={() => console.log(`${template.name} template loaded successfully from:`, getTemplateUrl())}
              onError={() => console.error(`Failed to load ${template.name} template from:`, getTemplateUrl())}
            />
         </div>
        </div>
      </div>
    </div>
  );
}

export default DemoModal;
