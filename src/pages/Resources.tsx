import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Wheat,
  Calculator,
  Gift,
  Users,
  Globe,
  FileText,
  Utensils,
  Sparkles,
  ChefHat
} from 'lucide-react';
import Footer from '../components/Footer';
import YeastConverter from '../components/YeastConverter';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  category: 'tools' | 'content' | 'community';
  featured?: boolean;
  isInternal?: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: 'yeast-converter',
    title: 'Yeast Converter',
    description: 'Convert between sourdough starter, active dry yeast, and instant yeast. Calculate exact amounts for any recipe.',
    url: 'https://sourdough-yeast-converter-5rtj.vercel.app/?lang=en',
    icon: <Calculator className="w-6 h-6" />,
    category: 'tools',
    featured: true
  },
  {
    id: 'holiday-shopping',
    title: 'Holiday Shopping Guide 2025',
    description: 'Curated gift ideas for bread bakers - from beginner essentials to professional tools and ingredients.',
    url: 'https://holiday-gifts-2025.vercel.app/',
    icon: <Gift className="w-6 h-6" />,
    category: 'tools',
    featured: true
  },
  {
    id: 'sourdough-starter',
    title: 'Sourdough Starter Master Guide',
    description: 'Everything you need to know about creating, maintaining, and troubleshooting your sourdough starter.',
    url: 'https://sourdough-starter-master-kxo6qxb.gamma.site/',
    icon: <Sparkles className="w-6 h-6" />,
    category: 'content',
    featured: true
  },
  {
    id: 'community-cookbook',
    title: 'Community Cookbook',
    description: 'Recipes shared by the Baking Great Bread at Home community. Browse and contribute your favorites.',
    url: 'https://bgbahcommunitycookbook.vercel.app/',
    icon: <Users className="w-6 h-6" />,
    category: 'community',
    featured: true
  },
  {
    id: 'blog',
    title: 'Baking Great Bread Blog',
    description: 'In-depth tutorials, recipes, technique guides, and the latest in artisan bread baking.',
    url: 'https://bakinggreatbread.blog/',
    icon: <BookOpen className="w-6 h-6" />,
    category: 'content'
  },
  {
    id: 'website',
    title: 'Baking Great Bread at Home',
    description: 'The main hub for all things bread baking - recipes, resources, courses, and community.',
    url: 'https://bakinggreatbread.com/',
    icon: <Globe className="w-6 h-6" />,
    category: 'content'
  },
  {
    id: 'recipes',
    title: 'Recipe Collection',
    description: 'Browse our complete collection of tested and perfected bread recipes for all skill levels.',
    url: 'https://bakinggreatbread.com/recipes',
    icon: <Wheat className="w-6 h-6" />,
    category: 'content'
  }
];

const INTERNAL_RESOURCES = [
  {
    id: 'bread-encyclopedia',
    title: 'Bread Encyclopedia',
    description: 'Comprehensive guide to 50+ bread varieties from around the world.',
    path: '/bread-encyclopedia',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 'baking-techniques',
    title: 'Baking Techniques',
    description: 'Master essential techniques from autolyse to scoring.',
    path: '/baking-techniques',
    icon: <Utensils className="w-6 h-6" />
  }
];

export default function Resources() {
  const featuredResources = RESOURCES.filter(r => r.featured);
  const toolsResources = RESOURCES.filter(r => r.category === 'tools');
  const contentResources = RESOURCES.filter(r => r.category === 'content');
  const communityResources = RESOURCES.filter(r => r.category === 'community');

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-bakery-500 to-bakery-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-bakery-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BreadFindr
          </Link>
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Baking Resources</h1>
              <p className="text-bakery-100 text-sm">Tools, guides, and community for bread bakers</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Featured Resources */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-bakery-500" />
              Featured Resources
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md hover:border-bakery-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-bakery-50 rounded-lg text-bakery-500 group-hover:bg-bakery-100 transition-colors">
                      {resource.icon}
                    </div>
                    <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-bakery-400 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-2 group-hover:text-bakery-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-stone-600 text-sm">{resource.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Yeast Converter Embed */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-bakery-500" />
              Yeast Converter Tool
            </h2>
            <YeastConverter />
          </section>

          {/* Internal Resources */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bakery-500" />
              BreadFindr Guides
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {INTERNAL_RESOURCES.map(resource => (
                <Link
                  key={resource.id}
                  to={resource.path}
                  className="group flex items-start gap-4 bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md hover:border-bakery-300 transition-all"
                >
                  <div className="p-2 bg-sage-50 rounded-lg text-sage-500 group-hover:bg-sage-100 transition-colors">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-800 mb-1 group-hover:text-bakery-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-stone-600 text-sm">{resource.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Tools & Calculators */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-bakery-500" />
              Tools & Calculators
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolsResources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md hover:border-bakery-300 transition-all"
                >
                  <div className="p-2 bg-bakery-50 rounded-lg text-bakery-500 group-hover:bg-bakery-100 transition-colors flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-stone-800 group-hover:text-bakery-600 transition-colors">
                        {resource.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-bakery-400 transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-stone-600 text-sm mt-1">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Learning & Content */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bakery-500" />
              Learning & Content
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentResources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md hover:border-bakery-300 transition-all"
                >
                  <div className="p-2 bg-glow-50 rounded-lg text-glow-500 group-hover:bg-glow-100 transition-colors flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-stone-800 group-hover:text-bakery-600 transition-colors">
                        {resource.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-bakery-400 transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-stone-600 text-sm mt-1">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Community */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-bakery-500" />
              Community
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communityResources.map(resource => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md hover:border-bakery-300 transition-all"
                >
                  <div className="p-2 bg-sage-50 rounded-lg text-sage-500 group-hover:bg-sage-100 transition-colors flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-stone-800 group-hover:text-bakery-600 transition-colors">
                        {resource.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-bakery-400 transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-stone-600 text-sm mt-1">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-bakery-500 to-bakery-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Join the Baking Community</h3>
            <p className="text-bakery-100 mb-6 max-w-xl mx-auto">
              Connect with thousands of bread enthusiasts, share your creations, and learn from experienced bakers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://bakinggreatbread.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-bakery-600 font-semibold rounded-lg hover:bg-bakery-50 transition-colors"
              >
                <Globe className="w-5 h-5" />
                Visit Main Site
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://bgbahcommunitycookbook.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-bakery-600 text-white font-semibold rounded-lg hover:bg-bakery-700 transition-colors border border-bakery-400"
              >
                <Users className="w-5 h-5" />
                Community Cookbook
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
