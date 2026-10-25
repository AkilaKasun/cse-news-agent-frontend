import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MarketStats from './components/MarketStats';
import SectorGrid from './components/SectorGrid';
import StoriesFeed from './components/StoriesFeed';
import ArchiveModal from './components/ArchiveModal';
import { BarChart3, Newspaper, Search, Filter, ChevronDown, Check } from 'lucide-react';
import { getMarketStats, getSectors, getStories } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('sectors');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [marketData, setMarketData] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [allSectorsList, setAllSectorsList] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Sector Tab Filters
  const [selectedSector, setSelectedSector] = useState('');
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [sectorSearchQuery, setSectorSearchQuery] = useState('');

  // Stories Tab Filters
  const [selectedStorySector, setSelectedStorySector] = useState('');
  const [storySectorDropdownOpen, setStorySectorDropdownOpen] = useState(false);
  const [storySectorSearchQuery, setStorySectorSearchQuery] = useState('');
  const [storySearch, setStorySearch] = useState('');
  const [storyImportance, setStoryImportance] = useState('');

  const sectorDropdownRef = useRef(null);
  const storySectorDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setSectorDropdownOpen(false);
      }
      if (storySectorDropdownRef.current && !storySectorDropdownRef.current.contains(event.target)) {
        setStorySectorDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Fetch Market Stats & All Sectors list for dropdowns on date change
  useEffect(() => {
    let isMounted = true;
    getMarketStats(selectedDate).then(stats => {
      if (isMounted) setMarketData(stats);
    });

    getSectors(selectedDate, '').then(sectorsList => {
      if (isMounted) setAllSectorsList(sectorsList);
    });

    return () => { isMounted = false; };
  }, [selectedDate]);

  // 2. Fetch Filtered Sectors for Sector Matrix Tab
  useEffect(() => {
    let isMounted = true;
    getSectors(selectedDate, selectedSector).then(sectorsList => {
      if (isMounted) setSectors(sectorsList);
    });

    return () => { isMounted = false; };
  }, [selectedDate, selectedSector]);

  // 3. Fetch Filtered Stories for Stories Feed Tab
  useEffect(() => {
    let isMounted = true;
    getStories(15, storyImportance, selectedStorySector, storySearch).then(storiesList => {
      if (isMounted) {
        setStories(storiesList);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [storyImportance, selectedStorySector, storySearch]);

  const filteredDropdownSectors = allSectorsList.filter(s => 
    s.sector.toLowerCase().includes(sectorSearchQuery.toLowerCase())
  );

  const filteredStoryDropdownSectors = allSectorsList.filter(s => 
    s.sector.toLowerCase().includes(storySectorSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Header 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        onOpenArchive={() => setIsArchiveOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Market Overview Cards */}
        <MarketStats marketData={marketData} loading={loading} />

        {/* Navigation Tabs & Active Tab Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-4">
          
          {/* Tabs Switcher */}
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('sectors')}
              className={`flex items-center space-x-2 pb-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sectors'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Sector Evidence Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex items-center space-x-2 pb-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'stories'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Top Market Stories Feed</span>
            </button>
          </div>

          {/* Dynamic Filters Bar based on Active Tab */}
          <div className="flex items-center space-x-3">
            {activeTab === 'sectors' ? (
              /* Searchable Sector Dropdown for Sectors Tab */
              <div className="relative w-full md:w-72" ref={sectorDropdownRef}>
                <button
                  onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 flex items-center justify-between hover:border-slate-600 transition-colors"
                >
                  <span className="truncate">{selectedSector || 'All Sectors'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                </button>

                {sectorDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-slate-800 bg-slate-950/50">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search sector name..."
                          value={sectorSearchQuery}
                          onChange={(e) => setSectorSearchQuery(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setSelectedSector('');
                          setSectorDropdownOpen(false);
                          setSectorSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          selectedSector === '' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>All Sectors</span>
                        {selectedSector === '' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>

                      {filteredDropdownSectors.length > 0 ? (
                        filteredDropdownSectors.map((sec, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedSector(sec.sector);
                              setSectorDropdownOpen(false);
                              setSectorSearchQuery('');
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              selectedSector === sec.sector ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{sec.sector}</span>
                            {selectedSector === sec.sector && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-center text-xs text-slate-500">No sectors found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Filters for Stories Tab: Searchable Sector Dropdown + Importance + Text Search */
              <div className="flex items-center space-x-2 w-full md:w-auto">
                
                {/* Searchable Sector Dropdown for Stories Tab */}
                <div className="relative w-56" ref={storySectorDropdownRef}>
                  <button
                    onClick={() => setStorySectorDropdownOpen(!storySectorDropdownOpen)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 flex items-center justify-between hover:border-slate-600 transition-colors"
                  >
                    <span className="truncate">{selectedStorySector || 'All Sectors'}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                  </button>

                  {storySectorDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-2 border-b border-slate-800 bg-slate-950/50">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search sector..."
                            value={storySectorSearchQuery}
                            onChange={(e) => setStorySectorSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setSelectedStorySector('');
                            setStorySectorDropdownOpen(false);
                            setStorySectorSearchQuery('');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            selectedStorySector === '' ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>All Sectors</span>
                          {selectedStorySector === '' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>

                        {filteredStoryDropdownSectors.length > 0 ? (
                          filteredStoryDropdownSectors.map((sec, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedStorySector(sec.sector);
                                setStorySectorDropdownOpen(false);
                                setStorySectorSearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                selectedStorySector === sec.sector ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span className="truncate">{sec.sector}</span>
                              {selectedStorySector === sec.sector && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-3 text-center text-xs text-slate-500">No sectors found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Importance Dropdown Filter */}
                <div className="relative flex items-center">
                  <Filter className="absolute left-3 w-3.5 h-3.5 text-cyan-400 pointer-events-none" />
                  <select
                    value={storyImportance}
                    onChange={(e) => setStoryImportance(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-6 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none"
                  >
                    <option value="">All Importances</option>
                    <option value="major">Major</option>
                    <option value="moderate">Moderate</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>

                {/* Search Stories input */}
                <div className="relative flex-1 md:w-48">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stories..."
                    value={storySearch}
                    onChange={(e) => setStorySearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Tab Content Display */}
        {loading && sectors.length === 0 ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <>
            {activeTab === 'sectors' && <SectorGrid sectors={sectors} />}
            {activeTab === 'stories' && <StoriesFeed stories={stories} />}
          </>
        )}
      </main>

      {/* Archive Modal Drawer */}
      {isArchiveOpen && <ArchiveModal onClose={() => setIsArchiveOpen(false)} />}
    </div>
  );
}