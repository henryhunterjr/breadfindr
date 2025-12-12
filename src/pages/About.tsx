import { Link } from 'react-router-dom';
import { Wheat, ArrowLeft, Heart, Users, MapPin } from 'lucide-react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-yelp-500 to-yelp-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-yelp-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BreadFindr
          </Link>
          <div className="flex items-center gap-3">
            <Wheat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">About BreadFindr</h1>
              <p className="text-yelp-100 text-sm">Our story and mission</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Connecting Bread Lovers with Local Artisan Bakers
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              BreadFindr was created to help people discover the incredible world of artisan bread,
              one local bakery at a time.
            </p>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Our Story</h3>
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 mb-4">
                As a passionate home baker and the creator of Baking Great Bread at Home,
                I've spent years perfecting sourdough recipes and sharing my love for artisan bread
                with an amazing community of bread enthusiasts.
              </p>
              <p className="text-stone-600 mb-4">
                But I realized something was missing. While I could teach people how to bake incredible
                bread at home, many still wanted to discover local bakeries that shared their passion
                for quality ingredients, long fermentation, and traditional techniques.
              </p>
              <p className="text-stone-600 mb-4">
                That's why I created BreadFindr – a community-driven directory that connects
                bread lovers with the artisan bakeries, farmers markets, and talented home bakers
                in their area.
              </p>
              <p className="text-stone-600">
                Whether you're searching for the perfect sourdough, exploring local farmers markets,
                or looking for a home baker who uses heritage grains, BreadFindr is here to help
                you find your next favorite loaf.
              </p>
            </div>
          </div>

          {/* Mission Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-yelp-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-yelp-500" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Support Local</h4>
              <p className="text-stone-600 text-sm">
                Help small bakeries and home bakers thrive by connecting them with bread lovers in their community.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Build Community</h4>
              <p className="text-stone-600 text-sm">
                Create a space for bread enthusiasts to share discoveries, leave reviews, and connect over their love of good bread.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Discover Quality</h4>
              <p className="text-stone-600 text-sm">
                Make it easy to find bakeries that prioritize quality ingredients, proper fermentation, and traditional techniques.
              </p>
            </div>
          </div>

          {/* About the Creator */}
          <div className="bg-stone-800 text-white rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Wheat className="w-16 h-16 text-yelp-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">About the Creator</h3>
                <p className="text-stone-300 mb-4">
                  I'm the founder of Baking Great Bread at Home, where I help thousands of people
                  discover the joy of baking artisan bread. Through tutorials, recipes, and a
                  supportive community, I've dedicated myself to making great bread accessible to everyone.
                </p>
                <a
                  href="https://bakinggreatbread.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yelp-400 hover:text-yelp-300 transition-colors"
                >
                  Visit Baking Great Bread at Home
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
