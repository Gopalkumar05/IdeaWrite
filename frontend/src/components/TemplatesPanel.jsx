// components/TemplatesPanel.js
import React from 'react';

const TemplatesPanel = ({ setShowTemplates, applyTemplate, addPageSpread, PAGE_TEMPLATES }) => {
  return (
    <div className="fixed left-6 top-24 bg-gray-800/95 backdrop-blur-lg text-white p-6 rounded-2xl shadow-2xl w-80 z-50 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Page Templates</h3>
        <button onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => addPageSpread()}
          className="w-full p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left border-2 border-dashed border-gray-600"
        >
          <div className="font-semibold">+ Blank Spread</div>
          <div className="text-sm text-gray-400">Two empty pages</div>
        </button>
        
        {PAGE_TEMPLATES.map((template, index) => (
          <button
            key={index}
            onClick={() => applyTemplate(template)}
            className="w-full p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left border border-gray-600"
          >
            <div className="font-semibold">{template.name}</div>
            <div className="text-sm text-gray-400 truncate">
              {template.content.substring(0, 50)}...
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPanel;