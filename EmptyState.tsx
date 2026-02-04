
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 opacity-70 mt-12 animate-in fade-in zoom-in duration-700">
      <div className="w-24 h-24 bg-stone-200/50 backdrop-blur rounded-full flex items-center justify-center mb-6 shadow-inner border border-stone-300/30">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-stone-500">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-stone-700 mb-2">Ready to Locate Executives</h3>
      <p className="text-stone-500 max-w-md">
        Search by state/province to find lists of operators, or by company name to find specific contact details for presidents, sales, and marketing teams.
      </p>
    </div>
  );
};

export default EmptyState;