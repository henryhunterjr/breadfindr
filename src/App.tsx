import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, ChevronDown, Wheat, Plus, Loader2, Navigation, ChevronUp, GripHorizontal } from 'lucide-react';
import type { Bakery, SearchFilters, UserLocation } from './types';
import { MOCK_BAKERIES } from './constants';
import { fetchBakeries, isSupabaseConfigured } from './lib/supabase';
import { geocodeLocation, calculateDistance, getCurrentPosition, reverseGeocode } from './lib/geocoding';
import { searchNearbyBakeries, isGooglePlacesConfigured } from './lib/googlePlaces';
import BakeryCard from './components/BakeryCard';
import BakeryModal from './components/BakeryModal';
import MapView from './components/MapView';
import BlogSuggestions from './components/BlogSuggestions';

type SheetState = 'collapsed' | 'half' | 'expanded';

function App() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    location: '',
    radius: 25,
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBakery, setSelectedBakery] = useState<Bakery | null>(null);
  const [hoveredBakeryId, setHoveredBakeryId] = useState<string | null>(null);

  // Data loading state
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [discoveredBakeries, setDiscoveredBakeries] = useState<Bakery[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Mobile bottom sheet state
  const [sheetState, setSheetState] = useState<SheetState>('half');
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartState = useRef<SheetState>('half');

  // Refs for scrolling to cards
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Read URL params on mount
  useEffect(() => {
    const q = searchParams.get('q');
    const location = searchParams.get('location');
    if (q || location) {
      setFilters(prev => ({
        ...prev,
        query: q || prev.query,
        location: location || prev.location
      }));
    }
  }, [searchParams]);

  // Load bakeries on mount
  useEffect(() => {
    async function loadBakeries() {
      setLoading(true);
      setError(null);

      try {
        if (isSupabaseConfigured()) {
          const data = await fetchBakeries();
          if (data.length > 0) {
            setBakeries(data);
          } else {
            setBakeries(MOCK_BAKERIES);
          }
        } else {
          setBakeries(MOCK_BAKERIES);
        }
      } catch (err) {
        console.error('Error loading bakeries:', err);
        setError('Failed to load bakeries. Using cached data.');
        setBakeries(MOCK_BAKERIES);
      }

      setLoading(false);
    }

    loadBakeries();
  }, []);

  // Handle location search
  const handleLocationSearch = useCallback(async () => {
    if (!filters.location.trim()) {
      setUserLocation(null);
      return;
    }

    setSearchingLocation(true);
    setLocationError(null);

    const location = await geocodeLocation(filters.location);

    if (location) {
      setUserLocation(location);
      setFilters(prev => ({ ...prev, sortBy: 'distance' }));
    } else {
      setLocationError('Could not find that location. Try a city name or ZIP code.');
    }

    setSearchingLocation(false);
  }, [filters.location]);

  // Debounced location search
  useEffect(() => {
    if (!filters.location) {
      setUserLocation(null);
      return;
    }

    const timeout = setTimeout(() => {
      handleLocationSearch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters.location, handleLocationSearch]);

  // Auto-discover bakeries from Google Places when user location changes
  useEffect(() => {
    if (!userLocation || !isGooglePlacesConfigured()) {
      return;
    }

    const discoverBakeries = async () => {
      setDiscovering(true);
      try {
        // Convert radius from miles to meters
        const radiusMeters = filters.radius * 1609;
        const discovered = await searchNearbyBakeries(
          userLocation.lat,
          userLocation.lng,
          radiusMeters
        );

        // Filter out any that match existing bakeries by name/location
        const existingNames = new Set(
          bakeries.map(b => `${b.name.toLowerCase()}-${b.city.toLowerCase()}`)
        );
        const newDiscoveries = discovered.filter(
          d => !existingNames.has(`${d.name.toLowerCase()}-${d.city.toLowerCase()}`)
        );

        setDiscoveredBakeries(newDiscoveries);
      } catch (err) {
        console.error('Error discovering bakeries:', err);
      }
      setDiscovering(false);
    };

    discoverBakeries();
  }, [userLocation, filters.radius, bakeries]);

  // Get user's current location
  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    setLocationError(null);

    try {
      const position = await getCurrentPosition();
      const displayName = await reverseGeocode(position.lat, position.lng);

      setUserLocation({
        lat: position.lat,
        lng: position.lng,
        displayName: displayName || undefined
      });

      if (displayName) {
        setFilters(prev => ({ ...prev, location: displayName }));
      }

      setFilters(prev => ({ ...prev, sortBy: 'distance' }));
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Could not get your location');
    }

    setGettingLocation(false);
  };

  // Handle marker click from map - scroll to card
  const handleMarkerClick = (bakery: Bakery) => {
    setHoveredBakeryId(bakery.id);
    const cardEl = cardRefs.current.get(bakery.id);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Expand bottom sheet on mobile when marker is clicked
    if (window.innerWidth < 1024) {
      setSheetState('half');
    }
  };

  // Filter and sort bakeries (including discovered ones)
  const filteredBakeries = useMemo(() => {
    // Combine database bakeries with discovered ones
    // Database bakeries are marked with source: 'manual', discovered with 'google_places'
    const allBakeries = [
      ...bakeries.map(b => ({ ...b, source: b.source || 'manual' as const })),
      ...discoveredBakeries
    ];

    let results = [...allBakeries];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(bakery =>
        bakery.name.toLowerCase().includes(query) ||
        bakery.description.toLowerCase().includes(query) ||
        bakery.specialties.some(s => s.toLowerCase().includes(query)) ||
        bakery.city.toLowerCase().includes(query) ||
        bakery.state.toLowerCase().includes(query)
      );
    }

    if (filters.type !== 'all') {
      results = results.filter(bakery => bakery.type === filters.type);
    }

    if (userLocation) {
      results = results.map(bakery => {
        if (bakery.latitude && bakery.longitude) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            bakery.latitude,
            bakery.longitude
          );
          return { ...bakery, distance };
        }
        return { ...bakery, distance: undefined };
      });

      results = results.filter(bakery =>
        bakery.distance === undefined || bakery.distance <= filters.radius
      );
    }

    // Sort: verified/featured first, then by selected criteria
    if (filters.sortBy === 'rating') {
      results.sort((a, b) => {
        // Verified bakeries first
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return b.rating - a.rating;
      });
    } else if (filters.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'distance' && userLocation) {
      results.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return results;
  }, [bakeries, discoveredBakeries, filters, userLocation]);

  // Create index map for numbered markers
  const bakeryIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredBakeries.forEach((bakery, index) => {
      map.set(bakery.id, index);
    });
    return map;
  }, [filteredBakeries]);

  // Bottom sheet drag handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartState.current = sheetState;
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = dragStartY.current - clientY;
    const threshold = 50;

    if (deltaY > threshold) {
      // Dragged up
      if (dragStartState.current === 'collapsed') setSheetState('half');
      else if (dragStartState.current === 'half') setSheetState('expanded');
    } else if (deltaY < -threshold) {
      // Dragged down
      if (dragStartState.current === 'expanded') setSheetState('half');
      else if (dragStartState.current === 'half') setSheetState('collapsed');
    }
  };

  const getSheetHeight = () => {
    switch (sheetState) {
      case 'collapsed': return 'h-[15vh]';
      case 'half': return 'h-[50vh]';
      case 'expanded': return 'h-[85vh]';
    }
  };

  return (
    <div className="h-screen bg-stone-50 flex flex-col overflow-hidden">
      <header className="bg-gradient-to-r from-bakery-500 to-bakery-600 text-white flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2">
              <Wheat className="w-7 h-7" />
              <div>
                <h1 className="text-xl font-bold">BreadFindr</h1>
                <p className="text-bakery-100 text-xs hidden sm:block">Find local artisan bread near you</p>
              </div>
            </Link>
            <Link
              to="/submit"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-bakery-500 font-semibold rounded-lg hover:bg-bakery-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Bakery</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bakeries, specialties..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bakery-300 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:flex-none">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="City or ZIP"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full md:w-36 pl-9 pr-4 py-2 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bakery-300 text-sm"
                />
                {searchingLocation && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-stone-400 animate-spin" />
                )}
              </div>
              <button
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-bakery-600 hover:bg-bakery-50 disabled:bg-white/50 rounded-lg transition-colors font-medium text-sm"
                title="Use my location"
              >
                {gettingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Near Me</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-1 px-2.5 py-2 bg-bakery-600 hover:bg-bakery-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {locationError && (
            <div className="mt-2 text-bakery-100 text-xs">
              {locationError}
            </div>
          )}

          {showFilters && (
            <div className="mt-2 p-3 bg-bakery-600/30 rounded-lg flex flex-wrap gap-3">
              <div>
                <label className="block text-xs text-bakery-100 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as SearchFilters['type'] })}
                  className="px-2 py-1 rounded text-stone-800 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="bakery">Bakeries</option>
                  <option value="farmers_market">Farmers Markets</option>
                  <option value="home_baker">Home Bakers</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-bakery-100 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })}
                  className="px-2 py-1 rounded text-stone-800 text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                  <option value="distance">Nearest</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-bakery-100 mb-1">Radius</label>
                <select
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
                  className="px-2 py-1 rounded text-stone-800 text-sm"
                >
                  <option value={5}>5 mi</option>
                  <option value={10}>10 mi</option>
                  <option value={25}>25 mi</option>
                  <option value={50}>50 mi</option>
                  <option value={100}>100 mi</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Split View Layout */}
      <main className="flex-1 hidden lg:flex overflow-hidden">
        {/* Bakery List - Left Side (40%) */}
        <div className="w-[40%] flex flex-col border-r border-stone-200 bg-white">
          {/* List Header */}
          <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">
                  <span className="font-semibold text-stone-800">{filteredBakeries.length}</span> bakeries
                  {userLocation && (
                    <span className="text-bakery-500"> near {userLocation.displayName || filters.location}</span>
                  )}
                </p>
                {discovering && (
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Discovering more bakeries nearby...
                  </p>
                )}
                {discoveredBakeries.length > 0 && !discovering && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    Including {discoveredBakeries.length} discovered from Google
                  </p>
                )}
              </div>
              {!isSupabaseConfigured() && (
                <span className="text-xs text-bakery-500">Demo mode</span>
              )}
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-bakery-500 animate-spin" />
                <span className="ml-2 text-stone-600 text-sm">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-bakery-500 text-sm">{error}</p>
              </div>
            ) : filteredBakeries.length === 0 ? (
              <div className="text-center py-12">
                <Wheat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-stone-600 mb-1">No bakeries found</h3>
                <p className="text-stone-500 text-sm mb-6">Try adjusting your search or filters</p>

                {/* Show blog suggestions even when no bakeries */}
                <div className="text-left">
                  <BlogSuggestions
                    searchTerms={filters.query ? filters.query.split(' ') : []}
                    variant="inline"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBakeries.map((bakery, index) => (
                  <div
                    key={bakery.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(bakery.id, el);
                    }}
                    onMouseEnter={() => setHoveredBakeryId(bakery.id)}
                    onMouseLeave={() => setHoveredBakeryId(null)}
                    className={`transition-all duration-200 rounded-xl ${
                      hoveredBakeryId === bakery.id ? 'ring-2 ring-bakery-400' : ''
                    }`}
                  >
                    <BakeryCard
                      bakery={bakery}
                      onClick={() => setSelectedBakery(bakery)}
                      featured={bakery.featured}
                      listNumber={index + 1}
                    />
                  </div>
                ))}

                {/* Blog/Recipe Suggestions */}
                <div className="mt-4">
                  <BlogSuggestions
                    searchTerms={filters.query ? filters.query.split(' ') : []}
                    specialties={filteredBakeries.flatMap(b => b.specialties).slice(0, 5)}
                    variant="inline"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-6 pt-4 border-t border-stone-200 text-center">
              <p className="flex items-center justify-center gap-2 text-stone-500 text-xs">
                <Wheat className="w-3 h-3" />
                BreadFindr - A project by Baking Great Bread at Home
              </p>
            </footer>
          </div>
        </div>

        {/* Map - Right Side (60%) */}
        <div className="w-[60%] relative h-full">
          <MapView
            bakeries={filteredBakeries}
            userLocation={userLocation}
            onSelectBakery={setSelectedBakery}
            onMarkerClick={handleMarkerClick}
            highlightedBakeryId={hoveredBakeryId}
            bakeryIndexMap={bakeryIndexMap}
          />
        </div>
      </main>

      {/* Mobile Layout with Draggable Bottom Sheet */}
      <main className="flex-1 lg:hidden flex flex-col relative overflow-hidden">
        {/* Map (full height background) */}
        <div className="absolute inset-0">
          <MapView
            bakeries={filteredBakeries}
            userLocation={userLocation}
            onSelectBakery={setSelectedBakery}
            onMarkerClick={handleMarkerClick}
            highlightedBakeryId={hoveredBakeryId}
            bakeryIndexMap={bakeryIndexMap}
          />
        </div>

        {/* Draggable Bottom Sheet */}
        <div
          ref={sheetRef}
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out ${getSheetHeight()}`}
          style={{ zIndex: 1000 }}
        >
          {/* Drag Handle */}
          <div
            className="flex flex-col items-center py-2 cursor-grab active:cursor-grabbing touch-none"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
          >
            <GripHorizontal className="w-8 h-1.5 text-stone-300" />
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setSheetState(sheetState === 'expanded' ? 'half' : 'expanded')}
                className="p-1 text-stone-400"
              >
                <ChevronUp className={`w-4 h-4 transition-transform ${sheetState === 'expanded' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Sheet Header */}
          <div className="px-4 pb-2 border-b border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone-600 text-sm">
                  <span className="font-semibold text-stone-800">{filteredBakeries.length}</span> bakeries
                  {userLocation && (
                    <span className="text-bakery-500 text-xs"> near you</span>
                  )}
                </p>
                {discovering && (
                  <p className="text-xs text-stone-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Discovering...
                  </p>
                )}
              </div>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })}
                className="text-xs border border-stone-200 rounded px-2 py-1"
              >
                <option value="rating">Top Rated</option>
                <option value="distance">Nearest</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(100% - 80px)' }}>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-bakery-500 animate-spin" />
                <span className="ml-2 text-stone-600 text-sm">Loading...</span>
              </div>
            ) : filteredBakeries.length === 0 ? (
              <div className="text-center py-8">
                <Wheat className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-500 text-sm mb-4">No bakeries found</p>

                {/* Show blog suggestions even when no bakeries - Mobile */}
                <div className="text-left">
                  <BlogSuggestions
                    searchTerms={filters.query ? filters.query.split(' ') : []}
                    variant="inline"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBakeries.map((bakery, index) => (
                  <div
                    key={bakery.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(bakery.id, el);
                    }}
                    className={`transition-all duration-200 rounded-xl ${
                      hoveredBakeryId === bakery.id ? 'ring-2 ring-bakery-400' : ''
                    }`}
                  >
                    <BakeryCard
                      bakery={bakery}
                      onClick={() => setSelectedBakery(bakery)}
                      featured={bakery.featured}
                      listNumber={index + 1}
                    />
                  </div>
                ))}

                {/* Blog/Recipe Suggestions - Mobile */}
                <div className="mt-4">
                  <BlogSuggestions
                    searchTerms={filters.query ? filters.query.split(' ') : []}
                    specialties={filteredBakeries.flatMap(b => b.specialties).slice(0, 5)}
                    variant="inline"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedBakery && (
        <BakeryModal
          bakery={selectedBakery}
          onClose={() => setSelectedBakery(null)}
        />
      )}
    </div>
  );
}

export default App;
