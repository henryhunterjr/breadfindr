import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wheat,
  Search,
  MapPin,
  Users,
  Star,
  ChevronRight,
  ChevronDown,
  Plus,
  Heart,
  Clock,
  Award,
  Instagram,
  Facebook,
  Mail,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Navigation,
  Loader2
} from 'lucide-react';
import { getCurrentPosition, reverseGeocode } from '../lib/geocoding';
import { fetchBakeries, isSupabaseConfigured } from '../lib/supabase';
import { enrichBakeries } from '../lib/googlePlaces';
import { trackPageView, trackEvent } from '../lib/analytics';
import type { Bakery } from '../types';
import Footer from '../components/Footer';

// Featured bakers data
const FEATURED_BAKERS = [
  {
    id: '1',
    name: 'Heritage Grain Bakehouse',
    location: 'Portland, OR',
    specialty: 'Stone-milled sourdough',
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Wild Yeast Kitchen',
    location: 'Austin, TX',
    specialty: 'Naturally leavened breads',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Tartine Tradition',
    location: 'San Francisco, CA',
    specialty: 'Country loaves',
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop'
  }
];

// Recently added bakers
const RECENTLY_ADDED = [
  { name: 'Sunrise Sourdough', location: 'Denver, CO', daysAgo: 2 },
  { name: 'The Bread Lab', location: 'Seattle, WA', daysAgo: 3 },
  { name: 'Ferment & Co', location: 'Chicago, IL', daysAgo: 5 },
  { name: 'Golden Crust Bakery', location: 'Nashville, TN', daysAgo: 7 }
];

// US States for browse section
const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// Partner logos
const PARTNERS = [
  { name: 'Wire Monkey', url: 'https://wiremonkey.com' },
  { name: 'King Arthur Baking', url: 'https://www.kingarthurbaking.com' },
  { name: 'Challenger Breadware', url: 'https://challengerbreadware.com' },
  { name: 'Sourhouse', url: 'https://sourhouse.co' }
];

// FAQ Data
const FAQ_ITEMS = [
  {
    question: 'How do I find artisan bread near me?',
    answer: 'Simply enter your city, ZIP code, or use the "Near Me" button to find local bakeries, farmers markets, and home bakers in your area. You can filter by bread type and sort by distance or rating.'
  },
  {
    question: 'Is BreadFindr free to use?',
    answer: 'Yes! BreadFindr is completely free for bread lovers. Browse our directory, leave reviews, and discover amazing local bread without any cost.'
  },
  {
    question: 'How can I add my bakery to BreadFindr?',
    answer: 'Click "Add Bakery" in the navigation or visit our submission page. Fill out your bakery details, and our team will review and publish your listing within 24-48 hours.'
  },
  {
    question: 'What types of bakers are listed?',
    answer: 'We feature commercial bakeries, farmers market vendors, and cottage/home bakers. All bakers focus on artisan, naturally-leavened, or traditionally-made breads.'
  },
  {
    question: 'How do I leave a review?',
    answer: 'Click on any bakery listing to open their details page, then scroll down to the reviews section. You can rate your experience and share your thoughts with the community.'
  },
  {
    question: 'Can I suggest edits to a listing?',
    answer: 'Yes! If you notice incorrect information about a bakery, use the "Suggest Edit" link on their listing page or contact us directly.'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showAllStates, setShowAllStates] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [featuredBakeries, setFeaturedBakeries] = useState<Bakery[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Track page view on mount
  useEffect(() => {
    trackPageView('/');
  }, []);

  // Fetch real bakeries for featured section
  useEffect(() => {
    async function loadFeaturedBakeries() {
      setLoadingFeatured(true);
      try {
        if (isSupabaseConfigured()) {
          const allBakeries = await fetchBakeries();

          // Filter to featured bakeries first, or bakeries with good ratings
          let featured = allBakeries.filter(b => b.featured);

          // If not enough featured, get top-rated bakeries
          if (featured.length < 3) {
            const topRated = allBakeries
              .filter(b => !b.featured)
              .sort((a, b) => (b.rating || 0) - (a.rating || 0));
            featured = [...featured, ...topRated].slice(0, 3);
          } else {
            featured = featured.slice(0, 3);
          }

          // Enrich bakeries that need images
          const needsEnrichment = featured.filter(b =>
            !b.image || b.image.includes('unsplash') || b.image.includes('placeholder')
          );

          if (needsEnrichment.length > 0) {
            const enrichmentData = await enrichBakeries(
              needsEnrichment.map(b => ({
                id: b.id,
                name: b.name,
                latitude: b.latitude,
                longitude: b.longitude,
                city: b.city,
                state: b.state
              }))
            );

            featured = featured.map(bakery => {
              const enrichment = enrichmentData.get(bakery.id);
              if (enrichment?.found && enrichment.photoUrl) {
                return { ...bakery, image: enrichment.photoUrl };
              }
              return bakery;
            });
          }

          setFeaturedBakeries(featured);
        }
      } catch (error) {
        console.error('Error loading featured bakeries:', error);
      }
      setLoadingFeatured(false);
    }

    loadFeaturedBakeries();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/search${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleNearMe = async () => {
    setGettingLocation(true);
    trackEvent({ event: 'near_me_click', page: '/' });
    try {
      const position = await getCurrentPosition();
      const locationName = await reverseGeocode(position.lat, position.lng);
      // Navigate directly to search with the location
      navigate(`/search?location=${encodeURIComponent(locationName || 'Near me')}&lat=${position.lat}&lng=${position.lng}`);
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please enter a location manually.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleStateClick = (state: string) => {
    trackEvent({ event: 'location_search', search_location: state });
    navigate(`/search?location=${encodeURIComponent(state)}`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      trackEvent({ event: 'newsletter_signup' });
      setSubscribed(true);
      setEmail('');
    }
  };

  const displayedStates = showAllStates ? STATES : STATES.slice(0, 12);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header - Transparent over hero */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-white drop-shadow-lg">
              <Wheat className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">BreadFindr</h1>
                <p className="text-white/80 text-xs hidden sm:block">Find local artisan bread near you</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/search"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-white/90 hover:text-white transition-colors text-sm drop-shadow"
              >
                <Search className="w-4 h-4" />
                Browse Directory
              </Link>
              <Link
                to="/submit"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-bakery-600 font-semibold rounded-lg hover:bg-cream-100 transition-colors text-sm shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Bakery</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://i.imgur.com/kUTWEGo.jpeg')" }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            Find Real Bread Near You
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow">
            Discover local artisan bakeries, farmers market vendors, and home bakers
            crafting authentic sourdough and naturally-leavened breads.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Sourdough, bakery name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bakery-300 bg-transparent"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City, state, or ZIP"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bakery-300 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-bakery-500 hover:bg-bakery-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleNearMe}
              disabled={gettingLocation}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-medium rounded-xl transition-colors backdrop-blur-sm border border-white/30"
            >
              {gettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              {gettingLocation ? 'Finding you...' : 'Use My Location'}
            </button>
            <span className="text-white/80 text-sm">
              or <Link to="/search" className="underline hover:text-white font-medium">browse all bakeries</Link>
            </span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-stone-200 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-bakery-500">500+</div>
              <div className="text-stone-600 text-sm md:text-base">Artisan Bakers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-bakery-500">10k+</div>
              <div className="text-stone-600 text-sm md:text-base">Loaves Discovered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-bakery-500">48</div>
              <div className="text-stone-600 text-sm md:text-base">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-12">
            How BreadFindr Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-bakery-500" />
              </div>
              <div className="text-lg font-semibold text-stone-800 mb-2">1. Search</div>
              <p className="text-stone-600">
                Enter your location or browse by state to find artisan bakers near you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-bakery-500" />
              </div>
              <div className="text-lg font-semibold text-stone-800 mb-2">2. Discover</div>
              <p className="text-stone-600">
                Explore bakeries, read reviews, and find the perfect loaf for your taste.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-bakery-500" />
              </div>
              <div className="text-lg font-semibold text-stone-800 mb-2">3. Enjoy</div>
              <p className="text-stone-600">
                Visit your local baker, enjoy real bread, and support small businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Bakers */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-800">
              Featured Bakers
            </h3>
            <Link
              to="/search"
              className="flex items-center gap-1 text-bakery-500 hover:text-bakery-600 font-medium"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {loadingFeatured ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="p-4">
                    <div className="h-5 bg-stone-200 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-stone-200 rounded mb-2 w-1/2" />
                    <div className="h-4 bg-stone-200 rounded mb-3 w-2/3" />
                    <div className="h-4 bg-stone-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : featuredBakeries.length > 0 ? (
              featuredBakeries.map((bakery) => (
                <Link
                  key={bakery.id}
                  to={`/search?bakery=${bakery.id}`}
                  className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                    {bakery.image ? (
                      <img
                        src={bakery.image}
                        alt={bakery.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wheat className="w-12 h-12 text-stone-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-stone-800 mb-1">{bakery.name}</h4>
                    <p className="text-stone-500 text-sm flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" /> {bakery.city}{bakery.state ? `, ${bakery.state}` : ''}
                    </p>
                    <p className="text-stone-600 text-sm mb-3">
                      {bakery.specialties?.[0] || bakery.type || 'Artisan Bakery'}
                    </p>
                    <div className="flex items-center gap-2">
                      {bakery.rating > 0 ? (
                        <>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium text-stone-800">{bakery.rating.toFixed(1)}</span>
                          </div>
                          {bakery.reviewCount > 0 && (
                            <span className="text-stone-400 text-sm">({bakery.reviewCount} reviews)</span>
                          )}
                        </>
                      ) : (
                        <span className="text-stone-400 text-sm">New listing</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback to placeholder cards if no bakeries loaded
              FEATURED_BAKERS.map((baker) => (
                <Link
                  key={baker.id}
                  to="/search"
                  className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={baker.image}
                      alt={baker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-stone-800 mb-1">{baker.name}</h4>
                    <p className="text-stone-500 text-sm flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" /> {baker.location}
                    </p>
                    <p className="text-stone-600 text-sm mb-3">{baker.specialty}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium text-stone-800">{baker.rating}</span>
                      </div>
                      <span className="text-stone-400 text-sm">({baker.reviews} reviews)</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-800">
              Recently Added
            </h3>
            <Link
              to="/submit"
              className="flex items-center gap-1 text-bakery-500 hover:text-bakery-600 font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Add yours
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECENTLY_ADDED.map((baker, index) => (
              <Link
                key={index}
                to="/search"
                className="bg-white rounded-lg p-4 shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-stone-800 mb-1">{baker.name}</h4>
                <p className="text-stone-500 text-sm flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" /> {baker.location}
                </p>
                <p className="text-stone-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Added {baker.daysAgo} days ago
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join the Movement */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4">
            Why Join the Movement
          </h3>
          <p className="text-stone-600 text-center mb-12 max-w-2xl mx-auto">
            Real bread matters. Here's why bread lovers and bakers choose BreadFindr.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800 mb-2">Support Local Artisans</h4>
                <p className="text-stone-600 text-sm">
                  Help small bakeries and home bakers thrive by connecting them with bread lovers in their community.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800 mb-2">Quality Over Quantity</h4>
                <p className="text-stone-600 text-sm">
                  We focus on bakers who prioritize real ingredients, long fermentation, and traditional techniques.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800 mb-2">Community Driven</h4>
                <p className="text-stone-600 text-sm">
                  Built by bread enthusiasts for bread enthusiasts. Share reviews and help others discover great bread.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Wheat className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-800 mb-2">Real Bread Revival</h4>
                <p className="text-stone-600 text-sm">
                  Join the movement bringing back authentic, naturally-leavened bread to communities across America.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Baker CTA */}
      <section className="py-16 bg-gradient-to-r from-bread-500 to-bread-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Share Your Craft?
          </h3>
          <p className="text-bread-100 mb-8 max-w-2xl mx-auto">
            Whether you're a professional bakery, farmers market vendor, or cottage baker,
            join our community and connect with bread lovers in your area.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-bread-600 font-semibold rounded-lg hover:bg-bread-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your Bakery - It's Free
          </Link>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-8">
            Find Bakers by State
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {displayedStates.map((state) => (
              <button
                key={state}
                onClick={() => handleStateClick(state)}
                className="px-3 py-2 bg-white rounded-lg text-stone-700 hover:bg-bakery-50 hover:text-bakery-600 transition-colors text-sm border border-stone-200"
              >
                {state}
              </button>
            ))}
          </div>
          {!showAllStates && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllStates(true)}
                className="inline-flex items-center gap-1 text-bakery-500 hover:text-bakery-600 font-medium"
              >
                Show all states <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-stone-500 text-center text-sm mb-6">Trusted by bakers who use</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {PARTNERS.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-600 transition-colors font-medium text-lg"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Newsletter */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Social */}
            <div>
              <h3 className="text-xl font-bold mb-4">Join Our Community</h3>
              <p className="text-stone-400 mb-6">
                Connect with fellow bread lovers and stay updated on the latest bakery discoveries.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/bakinggreatbread"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
                <a
                  href="https://instagram.com/bakinggreatbread"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4">Bread Updates in Your Inbox</h3>
              <p className="text-stone-400 mb-6">
                Get notified about new bakeries, bread tips, and community highlights.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Mail className="w-5 h-5" />
                  Thanks for subscribing! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bakery-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-bakery-500 hover:bg-bakery-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog & Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4">
            Learn to Bake Great Bread
          </h3>
          <p className="text-stone-600 text-center mb-8 max-w-2xl mx-auto">
            BreadFindr is a project by Baking Great Bread at Home. Visit our blog for recipes,
            tutorials, and tips to bake amazing bread in your own kitchen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://bakinggreatbread.blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-bakery-500 hover:bg-bakery-600 text-white font-semibold rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Visit the Blog
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://bakinggreatbread.com/recipes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg transition-colors"
            >
              <Wheat className="w-5 h-5" />
              Browse Recipes
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-stone-600 text-center mb-8">
            Everything you need to know about finding and listing artisan bread.
          </p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors"
                >
                  <span className="font-medium text-stone-800 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-bakery-500 flex-shrink-0" />
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pl-11">
                    <p className="text-stone-600 text-sm">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
