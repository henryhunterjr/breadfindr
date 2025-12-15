import { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/search${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleStateClick = (state: string) => {
    navigate(`/search?location=${encodeURIComponent(state)}`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const displayedStates = showAllStates ? STATES : STATES.slice(0, 12);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-yelp-500 to-yelp-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Wheat className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">BreadFindr</h1>
                <p className="text-yelp-100 text-xs hidden sm:block">Find local artisan bread near you</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/search"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-yelp-100 hover:text-white transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                Browse Directory
              </Link>
              <Link
                to="/submit"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-yelp-500 font-semibold rounded-lg hover:bg-yelp-50 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Bakery</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yelp-500 via-yelp-600 to-yelp-700 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Real Bread Near You
          </h2>
          <p className="text-xl text-yelp-100 mb-8 max-w-2xl mx-auto">
            Discover local artisan bakeries, farmers market vendors, and home bakers
            crafting authentic sourdough and naturally-leavened breads.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Sourdough, bakery name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-yelp-300"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="City, state, or ZIP"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-yelp-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-yelp-500 hover:bg-yelp-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          <p className="mt-4 text-yelp-200 text-sm">
            or <Link to="/search" className="underline hover:text-white">browse all bakeries</Link>
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-stone-200 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yelp-500">500+</div>
              <div className="text-stone-600 text-sm md:text-base">Artisan Bakers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yelp-500">10k+</div>
              <div className="text-stone-600 text-sm md:text-base">Loaves Discovered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yelp-500">48</div>
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
              <div className="w-16 h-16 bg-yelp-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-yelp-500" />
              </div>
              <div className="text-lg font-semibold text-stone-800 mb-2">1. Search</div>
              <p className="text-stone-600">
                Enter your location or browse by state to find artisan bakers near you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yelp-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-yelp-500" />
              </div>
              <div className="text-lg font-semibold text-stone-800 mb-2">2. Discover</div>
              <p className="text-stone-600">
                Explore bakeries, read reviews, and find the perfect loaf for your taste.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yelp-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-yelp-500" />
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
              className="flex items-center gap-1 text-yelp-500 hover:text-yelp-600 font-medium"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_BAKERS.map((baker) => (
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
            ))}
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
              className="flex items-center gap-1 text-yelp-500 hover:text-yelp-600 font-medium text-sm"
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
                className="px-3 py-2 bg-white rounded-lg text-stone-700 hover:bg-yelp-50 hover:text-yelp-600 transition-colors text-sm border border-stone-200"
              >
                {state}
              </button>
            ))}
          </div>
          {!showAllStates && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllStates(true)}
                className="inline-flex items-center gap-1 text-yelp-500 hover:text-yelp-600 font-medium"
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
                    className="flex-1 px-4 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-yelp-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yelp-500 hover:bg-yelp-600 text-white font-medium rounded-lg transition-colors"
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
              className="flex items-center gap-2 px-6 py-3 bg-yelp-500 hover:bg-yelp-600 text-white font-semibold rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Visit the Blog
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://bakinggreatbread.blog/recipes"
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
                    <HelpCircle className="w-5 h-5 text-yelp-500 flex-shrink-0" />
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
