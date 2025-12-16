import { Link } from 'react-router-dom';
import { Wheat, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
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
                href="https://www.instagram.com/wiremonkeyshop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-bakery-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/groups/1082865755403754"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-bakery-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@henryhunterjr"
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

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
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
              <li>
                <Link to="/admin/dashboard" className="text-stone-500 hover:text-stone-400 transition-colors text-sm">
                  Admin
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
            <div className="bg-stone-800 rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
              <iframe
                width="100%"
                height="200"
                scrolling="no"
                frameBorder="0"
                src="https://bakinggreatbread.blog/?mailpoet_form_iframe=1005"
                className="mailpoet_form_iframe"
                id="mailpoet_form_iframe"
                tabIndex={0}
                allowTransparency={true}
                style={{ border: 'none' }}
              />
            </div>
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
