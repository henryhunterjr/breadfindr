import { Link } from 'react-router-dom';
import { Wheat, ArrowLeft, Heart, Users, MapPin, ExternalLink } from 'lucide-react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-bakery-500 to-bakery-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-bakery-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BreadFindr
          </Link>
          <div className="flex items-center gap-3">
            <Wheat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">About BreadFindr</h1>
              <p className="text-bakery-100 text-sm">The Hands Behind BreadFindr</p>
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
              BreadFindr exists because real bread matters
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              And the people who make it deserve to be found.
            </p>
          </div>

          {/* Founders Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Tyler Cartner */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src="https://i.imgur.com/EKmKeUB.png"
                  alt="Tyler Cartner - Wire Monkey"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-1">Tyler Cartner</h3>
                <p className="text-bakery-500 font-medium text-sm mb-3">Wire Monkey</p>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Tyler is the craftsman behind Wire Monkey, maker of the iconic UFO lame.
                  What started as a solution for his wife's sourdough scoring became the most
                  trusted bread scoring tool in the baking world. Tyler builds every tool by
                  hand in Connecticut using American Black Walnut, recycled materials, and
                  zero plastic. Beyond the workshop, he's a builder of ideas—someone who sees
                  problems and sketches solutions the same day.
                </p>
                <a
                  href="https://wiremonkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-bakery-500 hover:text-bakery-600 text-sm font-medium"
                >
                  Visit Wire Monkey <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Henry Hunter */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src="https://i.imgur.com/FDARiHD.jpeg"
                  alt="Henry Hunter - Baking Great Bread at Home"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-1">Henry Hunter</h3>
                <p className="text-bakery-500 font-medium text-sm mb-3">Baking Great Bread at Home</p>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Henry is the founder of Baking Great Bread at Home, a community of over 50,000
                  home bakers, and author of "Sourdough for the Rest of Us." After 26 years in
                  advertising and marketing, Henry pivoted to teaching the craft he learned from
                  his German landlord while stationed overseas in the Army. He takes ideas and
                  makes them real.
                </p>
                <a
                  href="https://bakinggreatbread.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-bakery-500 hover:text-bakery-600 text-sm font-medium"
                >
                  Visit Baking Great Bread <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">How We Met</h3>
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 mb-4">
                We met serving the same community: home bakers who wanted to get better. Through
                that work, we discovered something. Tyler's ability to conceptualize and Henry's
                ability to execute made us natural partners.
              </p>
              <p className="text-stone-600 mb-4">
                BreadFindr came from a simple frustration. People wanted real bread—loaves made by
                hand, not factories. But they couldn't find it. Local bakers were scattered across
                farmers markets, Instagram pages, and word-of-mouth networks. There was no central
                place to discover them.
              </p>
              <p className="text-stone-600 font-medium">
                So we built one.
              </p>
            </div>
          </div>

          {/* What We Built */}
          <div className="bg-gradient-to-br from-bakery-50 to-cream-100 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">What BreadFindr Does</h3>
            <p className="text-stone-600 mb-6">
              BreadFindr connects bread lovers with artisan bakers across the country. Whether
              you're searching for sourdough in Seattle or a cottage baker in South Carolina,
              this is where real bread lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <p className="text-stone-700 font-medium">
                Tyler brings the vision. Henry brings the execution. Together, we're helping
                people find real bread and support the bakers who make it.
              </p>
            </div>
          </div>

          {/* Mission Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-bakery-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-bakery-500" />
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

          {/* CTA Section */}
          <div className="bg-stone-800 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Let's Grow This Together</h3>
            <p className="text-stone-300 mb-6 max-w-xl mx-auto">
              Looking for real bread? Start searching. A baker? Join the directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="px-6 py-3 bg-bakery-500 hover:bg-bakery-600 text-white font-semibold rounded-lg transition-colors"
              >
                Find Real Bread
              </Link>
              <Link
                to="/submit"
                className="px-6 py-3 bg-white text-stone-800 font-semibold rounded-lg hover:bg-stone-100 transition-colors"
              >
                Add Your Bakery
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
