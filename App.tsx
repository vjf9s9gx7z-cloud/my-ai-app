
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultDisplay from './components/ResultDisplay';
import EmptyState from './components/EmptyState';
import { searchExecutives } from './services/geminiService';
import { SearchState, SearchType, RecentSearch } from './types';

const STORAGE_KEY = 'tourconnect_recent_searches';
const MAX_HISTORY = 6;

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.LOCATION);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    data: null
  });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = (q: string, type: SearchType) => {
    setRecentSearches(prev => {
      const newHistory = [
        { query: q, type, timestamp: Date.now() },
        ...prev.filter(item => !(item.query.toLowerCase() === q.toLowerCase() && item.type === type))
      ].slice(0, MAX_HISTORY);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = async (searchQuery: string, type: SearchType) => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await searchExecutives(searchQuery, type);
      setSearchState({
        isLoading: false,
        error: null,
        data: result
      });
      addToHistory(searchQuery, type);
    } catch (err) {
      setSearchState({
        isLoading: false,
        error: err instanceof Error ? err.message : "An unknown error occurred",
        data: null
      });
    }
  };

  const handleRecentClick = (recent: RecentSearch) => {
    setQuery(recent.query);
    setSearchType(recent.type);
    handleSearch(recent.query, recent.type);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto bg-[#ddd8d0] custom-scrollbar">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          
          {/* Search Section */}
          <div className="flex-shrink-0">
             {/* Headline and Subheadline */}
             <div className="max-w-3xl mx-auto text-center mb-8">
               <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3 tracking-tight">
                 Connect with Group Travel Professionals
               </h2>
               <p className="text-lg text-stone-800 leading-relaxed max-w-2xl mx-auto font-medium">
                 Unlock direct access to presidents, marketing, and sales executives at thousands of tour operators and motorcoach companies across the USA and Canada.
               </p>
             </div>

             <SearchForm 
                onSearch={handleSearch} 
                isLoading={searchState.isLoading} 
                query={query}
                setQuery={setQuery}
                searchType={searchType}
                setSearchType={setSearchType}
             />

             {/* Search Tip and Recent Searches Row */}
             <div className="max-w-3xl mx-auto flex flex-col gap-4 mb-8">
               {/* Search Tip */}
               <div className="flex items-center gap-2 text-stone-800 bg-white/40 backdrop-blur-sm py-2 px-4 rounded-lg border border-white/20 text-sm font-semibold animate-in fade-in slide-in-from-top-1 duration-500 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-700 shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Searches by town or city will be more successful than by state or province</span>
               </div>

               {recentSearches.length > 0 && (
                 <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest mr-1">Recent:</span>
                    {recentSearches.map((item, idx) => (
                      <button
                        key={`${item.query}-${idx}`}
                        onClick={() => handleRecentClick(item)}
                        disabled={searchState.isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-full text-sm text-stone-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {item.type === SearchType.LOCATION ? (
                          <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                        <span className="truncate max-w-[120px]">{item.query}</span>
                      </button>
                    ))}
                    <button 
                      onClick={clearHistory}
                      className="text-[10px] font-bold text-stone-600 hover:text-red-600 underline ml-auto uppercase tracking-tighter"
                    >
                      Clear History
                    </button>
                 </div>
               )}
             </div>

             {/* Industry Image Gallery */}
             {!searchState.data && !searchState.isLoading && (
               <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl border-4 border-white ring-1 ring-stone-400/30">
                    <img 
                      src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=800" 
                      alt="Tour Group" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <p className="text-white font-semibold text-sm">Guided Tour Experiences</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl border-4 border-white ring-1 ring-stone-400/30">
                    <img 
                      src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=800" 
                      alt="USA Destination" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <p className="text-white font-semibold text-sm">Iconic North American Destinations</p>
                    </div>
                  </div>
                  <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl border-4 border-white ring-1 ring-stone-400/30">
                    <img 
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800" 
                      alt="Motorcoach" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <p className="text-white font-semibold text-sm">Premium Motorcoach Transport</p>
                    </div>
                  </div>
               </div>
             )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-h-0 pb-6">
            {searchState.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2 mb-6 max-w-3xl mx-auto shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {searchState.error}
              </div>
            )}

            {!searchState.data && !searchState.isLoading && !searchState.error && (
              <EmptyState />
            )}

            {searchState.data && (
              <div className="max-w-6xl mx-auto h-[650px] animate-in fade-in duration-500">
                <ResultDisplay result={searchState.data} />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
