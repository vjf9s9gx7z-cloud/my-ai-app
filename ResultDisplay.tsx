
import React from 'react';
import { SearchResult, GroundingChunk } from '../types';

interface ResultDisplayProps {
  result: SearchResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim().startsWith('##')) {
        const content = line.replace(/^##\s*/, '');
        return <h3 key={index} className="text-lg font-bold text-stone-800 mt-6 mb-2">{processBold(content)}</h3>;
      }
      if (line.trim().startsWith('#')) {
        const content = line.replace(/^#\s*/, '');
        return <h2 key={index} className="text-xl font-bold text-blue-800 mt-6 mb-3 border-b border-blue-100 pb-2">{processBold(content)}</h2>;
      }
      
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
         const content = line.replace(/^[\*\-]\s*/, '');
         return (
             <div key={index} className="flex items-start gap-2 mb-1 ml-4">
                <span className="text-blue-500 mt-1.5">•</span>
                <p className="text-stone-700 leading-relaxed">{processBold(content)}</p>
             </div>
         )
      }
      
      if (!line.trim()) return <div key={index} className="h-2"></div>;

      return <p key={index} className="text-stone-700 mb-1 leading-relaxed">{processBold(line)}</p>;
    });
  };

  const processBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const uniqueSources = result.groundingChunks.reduce((acc, current) => {
    if (current.web?.uri && !acc.find(a => a.web?.uri === current.web?.uri)) {
      acc.push(current);
    }
    return acc;
  }, [] as GroundingChunk[]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-stone-100 bg-stone-50/80">
           <h2 className="font-semibold text-stone-700">Executives & Company Details</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
           <div className="prose prose-stone max-w-none">
             {formatText(result.text)}
           </div>
        </div>
      </div>

      {/* Sources Sidebar */}
      <div className="w-full lg:w-80 bg-[#f4f1ea] rounded-2xl p-4 overflow-y-auto h-auto lg:h-full max-h-[300px] lg:max-h-none flex-shrink-0 border border-stone-200 shadow-sm">
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 border-b border-stone-300/50 pb-2">Verified Sources</h3>
        {uniqueSources.length === 0 ? (
            <p className="text-sm text-stone-400 italic">No direct web citations returned.</p>
        ) : (
            <div className="space-y-3">
            {uniqueSources.map((chunk, idx) => (
                <a 
                key={idx} 
                href={chunk.web?.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-3 bg-white rounded-lg border border-stone-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                >
                <div className="text-sm font-medium text-blue-700 group-hover:text-blue-800 mb-1 line-clamp-2">
                    {chunk.web?.title || "Source Link"}
                </div>
                <div className="text-xs text-stone-400 break-all">
                    {new URL(chunk.web?.uri || '').hostname}
                </div>
                </a>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;