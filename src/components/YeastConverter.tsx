import { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

interface YeastConverterProps {
  className?: string;
}

export default function YeastConverter({ className = '' }: YeastConverterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const converterUrl = 'https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
        <div>
          <h3 className="font-semibold text-stone-800">Yeast Converter</h3>
          <p className="text-stone-500 text-xs">Convert between sourdough, active dry, and instant yeast</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <a
            href={converterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-stone-400 hover:text-bakery-500 hover:bg-bakery-50 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? 'h-[600px]' : 'h-[400px]'
        }`}
      >
        <iframe
          src={converterUrl}
          title="Yeast Converter Tool"
          className="w-full h-full border-0"
          loading="lazy"
          allow="clipboard-write"
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 text-center">
        <a
          href={converterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-bakery-500 hover:text-bakery-600 inline-flex items-center gap-1"
        >
          Open full tool in new tab
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
