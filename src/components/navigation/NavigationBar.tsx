import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Wheat,
  Search,
  Plus,
  ChevronDown,
  BookOpen,
  Utensils,
  ExternalLink,
  Menu,
  X,
  Calculator,
  Gift,
  Users,
  Sparkles,
  Home,
  Info,
  Mail
} from 'lucide-react';

interface DropdownItem {
  label: string;
  path?: string;
  href?: string;
  icon: React.ReactNode;
  description?: string;
}

interface NavDropdown {
  label: string;
  items: DropdownItem[];
}

const LEARN_DROPDOWN: NavDropdown = {
  label: 'Learn',
  items: [
    {
      label: 'Bread Encyclopedia',
      path: '/bread-encyclopedia',
      icon: <BookOpen className="w-4 h-4" />,
      description: '50+ bread varieties explained'
    },
    {
      label: 'Baking Techniques',
      path: '/baking-techniques',
      icon: <Utensils className="w-4 h-4" />,
      description: 'Master essential techniques'
    },
    {
      label: 'Sourdough Starter Guide',
      href: 'https://sourdough-starter-master-kxo6qxb.gamma.site/',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Create and maintain your starter'
    },
    {
      label: 'Blog',
      href: 'https://bakinggreatbread.blog/',
      icon: <BookOpen className="w-4 h-4" />,
      description: 'Tutorials and recipes'
    }
  ]
};

const TOOLS_DROPDOWN: NavDropdown = {
  label: 'Tools',
  items: [
    {
      label: 'All Resources',
      path: '/resources',
      icon: <Utensils className="w-4 h-4" />,
      description: 'Browse all baking resources'
    },
    {
      label: 'Yeast Converter',
      href: 'https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en',
      icon: <Calculator className="w-4 h-4" />,
      description: 'Convert yeast types'
    },
    {
      label: 'Holiday Shopping Guide',
      href: 'https://holiday-gifts-2025.vercel.app/',
      icon: <Gift className="w-4 h-4" />,
      description: 'Gift ideas for bakers'
    },
    {
      label: 'Community Cookbook',
      href: 'https://bgbahcommunitycookbook.vercel.app/',
      icon: <Users className="w-4 h-4" />,
      description: 'Community recipes'
    }
  ]
};

interface NavigationBarProps {
  variant?: 'transparent' | 'solid';
}

export default function NavigationBar({ variant = 'solid' }: NavigationBarProps) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isTransparent = variant === 'transparent';
  const baseClasses = isTransparent
    ? 'bg-transparent text-white'
    : 'bg-gradient-to-r from-bakery-500 to-bakery-600 text-white';

  const renderDropdown = (dropdown: NavDropdown) => (
    <div className="relative" key={dropdown.label}>
      <button
        onClick={() => toggleDropdown(dropdown.label)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
          isTransparent
            ? 'hover:bg-white/10'
            : 'hover:bg-bakery-600'
        } ${openDropdown === dropdown.label ? (isTransparent ? 'bg-white/10' : 'bg-bakery-600') : ''}`}
      >
        <span className="text-sm font-medium">{dropdown.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === dropdown.label ? 'rotate-180' : ''}`} />
      </button>

      {openDropdown === dropdown.label && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
          {dropdown.items.map((item, idx) => (
            item.path ? (
              <Link
                key={idx}
                to={item.path}
                className="flex items-start gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                onClick={() => setOpenDropdown(null)}
              >
                <span className="text-bakery-500 mt-0.5">{item.icon}</span>
                <div>
                  <span className="block text-sm font-medium text-stone-800">{item.label}</span>
                  {item.description && (
                    <span className="block text-xs text-stone-500">{item.description}</span>
                  )}
                </div>
              </Link>
            ) : (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                onClick={() => setOpenDropdown(null)}
              >
                <span className="text-bakery-500 mt-0.5">{item.icon}</span>
                <div className="flex-1">
                  <span className="flex items-center gap-1 text-sm font-medium text-stone-800">
                    {item.label}
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </span>
                  {item.description && (
                    <span className="block text-xs text-stone-500">{item.description}</span>
                  )}
                </div>
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className={`${baseClasses} relative z-20`} ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Wheat className="w-7 h-7" />
            <div>
              <h1 className="text-xl font-bold">BreadFindr</h1>
              <p className={`text-xs hidden sm:block ${isTransparent ? 'text-white/80' : 'text-bakery-100'}`}>
                Find local artisan bread near you
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/search"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isTransparent ? 'hover:bg-white/10' : 'hover:bg-bakery-600'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Find Bakeries</span>
            </Link>

            {renderDropdown(LEARN_DROPDOWN)}
            {renderDropdown(TOOLS_DROPDOWN)}

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isTransparent ? 'hover:bg-white/10' : 'hover:bg-bakery-600'
              }`}
            >
              About
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/submit"
              className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors text-sm ${
                isTransparent
                  ? 'bg-white text-bakery-600 hover:bg-stone-100'
                  : 'bg-white text-bakery-500 hover:bg-bakery-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Bakery
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <div className="space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to="/search"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Find Bakeries</span>
              </Link>

              <div className="pt-2 pb-1">
                <span className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Learn</span>
              </div>

              {LEARN_DROPDOWN.items.map((item, idx) => (
                item.path ? (
                  <Link
                    key={idx}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                  </a>
                )
              ))}

              <div className="pt-2 pb-1">
                <span className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">Tools</span>
              </div>

              {TOOLS_DROPDOWN.items.map((item, idx) => (
                item.path ? (
                  <Link
                    key={idx}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                  </a>
                )
              ))}

              <div className="pt-2 pb-1">
                <span className="px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">More</span>
              </div>

              <Link
                to="/about"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </Link>

              <Link
                to="/contact"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>

              <div className="pt-4">
                <Link
                  to="/submit"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white text-bakery-600 font-semibold rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Your Bakery
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
