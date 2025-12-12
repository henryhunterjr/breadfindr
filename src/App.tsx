import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Filter, ChevronDown, ExternalLink, Phone, Instagram, Clock, CheckCircle, Wheat } from 'lucide-react';
import { BreadSource, SearchFilters } from './types';
import { MOCK_BREAD_SOURCES, TYPE_LABELS, TYPE_COLORS } from './constants';

function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    location: '',
    radius: 25,
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSource, setSelectedSource] = useState<BreadSource | null>(null);

  const filteredSources = useMemo(() => {
    let results = [...MOCK_BREAD_SOURCES];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(source =>
        source.name.toLowerCase().includes(query) ||
        source.description.toLowerCase().includes(query) ||
        source.specialties.some(s => s.toLowerCase().includes(query))
      );
    }

    if (filters.type !== 'all') {
      results = results.filter(source => source.type === filters.type);
    }

    if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [filters]);

  const featuredSources = filteredSources.filter(s => s.featured);
  const regularSources = filteredSources.filter(s => !s.featured);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Wheat className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">BreadFindr</h1>
              <p className="text-amber-100 text-sm">Find local artisan bread near you</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for bread, bakeries, or specialties..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="City or ZIP"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full md:w-48 pl-10 pr-4 py-3 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-amber-800/50 rounded-lg flex flex-wrap gap-4">
              <div>
                <label className="block text-sm text-amber-100 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as SearchFilters['type'] })}
                  className="px-3 py-2 rounded text-stone-800"
                >
                  <option value="all">All Types</option>
                  <option value="bakery">Bakeries</option>
                  <option value="farmers_market">Farmers Markets</option>
                  <option value="home_baker">Home Bakers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-amber-100 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })}
                  className="px-3 py-2 rounded text-stone-800"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                  <option value="distance">Nearest</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-amber-100 mb-1">Radius</label>
                <select
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
                  className="px-3 py-2 rounded text-stone-800"
                >
                  <option value={5}>5 miles</option>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-stone-600">
            Found <span className="font-semibold text-stone-800">{filteredSources.length}</span> bread sources
          </p>
        </div>

        {featuredSources.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredSources.map(source => (
                <BreadSourceCard
                  key={source.id}
                  source={source}
                  onClick={() => setSelectedSource(source)}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">All Results</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularSources.map(source => (
              <BreadSourceCard
                key={source.id}
                source={source}
                onClick={() => setSelectedSource(source)}
              />
            ))}
          </div>
        </section>

        {filteredSources.length === 0 && (
          <div className="text-center py-12">
            <Wheat className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No bread sources found</h3>
            <p className="text-stone-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {selectedSource && (
        <DetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}

      <footer className="bg-stone-800 text-stone-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="flex items-center justify-center gap-2">
            <Wheat className="w-5 h-5" />
            BreadFindr - A project by Baking Great Bread at Home
          </p>
          <p className="text-sm text-stone-500 mt-2">
            Connecting bread lovers with local artisan bakers
          </p>
        </div>
      </footer>
    </div>
  );
}

interface BreadSourceCardProps {
  source: BreadSource;
  onClick: () => void;
  featured?: boolean;
}

function BreadSourceCard({ source, onClick, featured }: BreadSourceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border ${
        featured ? 'border-amber-300 ring-1 ring-amber-200' : 'border-stone-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            {source.name}
            {source.verified && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </h3>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${TYPE_COLORS[source.type]}`}>
            {TYPE_LABELS[source.type]}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-600">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{source.rating}</span>
          <span className="text-stone-400 text-sm">({source.reviewCount})</span>
        </div>
      </div>

      <p className="text-sm text-stone-600 mb-3 line-clamp-2">{source.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {source.specialties.slice(0, 3).map(specialty => (
          <span
            key={specialty}
            className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
          >
            {specialty}
          </span>
        ))}
        {source.specialties.length > 3 && (
          <span className="text-xs text-stone-400">+{source.specialties.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-sm text-stone-500">
        <MapPin className="w-4 h-4" />
        <span>{source.city}, {source.state}</span>
      </div>
    </button>
  );
}

interface DetailModalProps {
  source: BreadSource;
  onClose: () => void;
}

function DetailModal({ source, onClose }: DetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                {source.name}
                {source.verified && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </h2>
              <span className={`inline-block text-sm px-3 py-1 rounded-full mt-2 ${TYPE_COLORS[source.type]}`}>
                {TYPE_LABELS[source.type]}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-lg">{source.rating}</span>
            <span className="text-stone-500">({source.reviewCount} reviews)</span>
          </div>

          <p className="text-stone-600 mb-6">{source.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-stone-800">{source.address}</p>
                <p className="text-stone-600">{source.city}, {source.state} {source.zip}</p>
              </div>
            </div>

            {source.hours && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-stone-400 mt-0.5" />
                <p className="text-stone-600">{source.hours}</p>
              </div>
            )}

            {source.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-stone-400" />
                <a href={`tel:${source.phone}`} className="text-amber-600 hover:underline">
                  {source.phone}
                </a>
              </div>
            )}

            {source.website && (
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-stone-400" />
                <a
                  href={source.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            {source.instagram && (
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-stone-400" />
                <a
                  href={`https://instagram.com/${source.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  {source.instagram}
                </a>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-stone-800 mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {source.specialties.map(specialty => (
                <span
                  key={specialty}
                  className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
