import { Link } from 'react-router-dom';
import { Wheat, Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Wheat className="w-8 h-8 text-bakery-500" />
              <span className="text-xl font-bold">BreadFindr</span>
            </Link>
            <p className="text-stone-400 text-sm mb-4">
              Connecting bread lovers with local artisan bakers since 2025.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/bakinggreatbread"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-bakery-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/bakinggreatbread"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-bakery-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@bakinggreatbread"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-bakery-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-stone-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-stone-400 hover:text-white transition-colors">
                  Find Bakeries
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-stone-400 hover:text-white transition-colors">
                  Add Bakery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn & Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bread-encyclopedia" className="text-stone-400 hover:text-white transition-colors">
                  Bread Encyclopedia
                </Link>
              </li>
              <li>
                <Link to="/baking-techniques" className="text-stone-400 hover:text-white transition-colors">
                  Baking Techniques
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-stone-400 hover:text-white transition-colors">
                  Tools & Resources
                </Link>
              </li>
              <li>
                <a
                  href="https://bakinggreatbread.blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-stone-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-stone-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-stone-400 text-sm mb-4">
              Get notified about new bakeries and bread tips!
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Mail className="w-4 h-4" />
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-bakery-500 hover:bg-bakery-600 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-400 text-sm text-center md:text-left">
              &copy; 2025 BreadFindr - A project by{' '}
              <a
                href="https://bakinggreatbread.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bakery-500 hover:underline"
              >
                Baking Great Bread at Home
              </a>
            </p>
            <p className="text-stone-500 text-xs">
              Made with love for the bread community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
