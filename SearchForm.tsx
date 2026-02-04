
import React from 'react';
import { SearchType } from '../types';

interface SearchFormProps {
  onSearch: (query: string, type: SearchType) => void;
  isLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  searchType: SearchType;
  setSearchType: (t: SearchType) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  isLoading, 
  query, 
  setQuery, 
  searchType, 
  setSearchType 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-4">
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
        
        {/* Search Type Toggles */}
        <div className="flex p-1 bg-stone-200/80 backdrop-blur-sm rounded-lg w-fit self-center sm:self-start border border-stone-300/30 shadow-inner">
          <button
            type="button"
            onClick={() => setSearchType(SearchType.LOCATION)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              searchType === SearchType.LOCATION
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Search by Location
          </button>
          <button
            type="button"
            onClick={() => setSearchType(SearchType.COMPANY)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              searchType === SearchType.COMPANY
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Search by Company
          </button>
        </div>

        {/* Input Area */}
        <div className="relative group shadow-xl shadow-stone-200/50 rounded-xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg className={`w-5 h-5 transition-colors ${isLoading ? 'text-blue-500 animate-spin' : 'text-stone-400 group-focus-within:text-blue-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isLoading ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              )}
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchType === SearchType.LOCATION ? "E.g., California, British Columbia, New York..." : "E.g., Globus Family, Coach USA..."}
            className="w-full pl-11 pr-24 py-4 bg-white border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200/50"
          >
            {isLoading ? 'Searching...' : 'Find'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;