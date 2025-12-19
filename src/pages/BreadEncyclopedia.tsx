import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wheat,
  ArrowLeft,
  Search,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Utensils
} from 'lucide-react';
import Footer from '../components/Footer';

interface BreadEntry {
  id: string;
  name: string;
  description: string;
  origin: string;
  characteristics: string[];
  blogLink?: string;
  cookbookLink?: string;
  recipeLink?: string;
  featured?: boolean;
}

interface BreadCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  breads: BreadEntry[];
}

const BREAD_CATEGORIES: BreadCategory[] = [
  {
    id: 'artisan',
    name: 'Artisan Breads',
    description: 'Handcrafted breads made with traditional techniques and long fermentation',
    icon: '🥖',
    breads: [
      {
        id: 'classic-sourdough',
        name: 'Classic Sourdough',
        description: 'A naturally leavened bread with a tangy flavor, chewy crumb, and crispy crust. Made with wild yeast and long fermentation.',
        origin: 'San Francisco, USA / Ancient Origins',
        characteristics: ['Tangy flavor', 'Open crumb', 'Crispy crust', 'Long fermentation'],
        blogLink: 'https://bakinggreatbread.blog/sourdough',
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/',
        recipeLink: 'https://bakinggreatbread.com/recipes',
        featured: true
      },
      {
        id: 'country-loaf',
        name: 'Country Loaf (Pain de Campagne)',
        description: 'A rustic French bread with a mix of white and whole grain flours, offering a mild sourdough flavor.',
        origin: 'France',
        characteristics: ['Rustic appearance', 'Mixed flours', 'Mild tang', 'Versatile'],
        blogLink: 'https://bakinggreatbread.blog/country-loaf',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'miche',
        name: 'Miche',
        description: 'A large, round French sourdough loaf traditionally made with whole wheat or rye flour.',
        origin: 'Poilâne, France',
        characteristics: ['Large size', 'Dense crumb', 'Whole grain', 'Long shelf life'],
        blogLink: 'https://bakinggreatbread.blog/miche'
      },
      {
        id: 'batard',
        name: 'Bâtard',
        description: 'An oval-shaped French bread, shorter and fatter than a baguette, with a soft interior.',
        origin: 'France',
        characteristics: ['Oval shape', 'Soft crumb', 'Crisp crust', 'Versatile size'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'boule',
        name: 'Boule',
        description: 'A round, ball-shaped French bread perfect for soups and table bread.',
        origin: 'France',
        characteristics: ['Round shape', 'Thick crust', 'Soft interior', 'Great for scoring'],
        blogLink: 'https://bakinggreatbread.blog/boule'
      },
      {
        id: 'pain-au-levain',
        name: 'Pain au Levain',
        description: 'Traditional French sourdough bread made with natural leaven and a mix of flours.',
        origin: 'France',
        characteristics: ['Natural leaven', 'Complex flavor', 'Chewy texture', 'Aromatic'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'san-francisco-sourdough',
        name: 'San Francisco Sourdough',
        description: 'Famous for its distinctively tangy flavor due to the unique wild yeast and bacteria in the Bay Area.',
        origin: 'San Francisco, USA',
        characteristics: ['Very tangy', 'Chewy crumb', 'Golden crust', 'Regional culture'],
        blogLink: 'https://bakinggreatbread.blog/sf-sourdough'
      }
    ]
  },
  {
    id: 'french',
    name: 'French Breads',
    description: 'Classic breads from France known for their crispy crusts and light interiors',
    icon: '🇫🇷',
    breads: [
      {
        id: 'baguette',
        name: 'Baguette',
        description: 'The iconic French bread with a thin, crispy crust and light, airy interior. Protected by French law.',
        origin: 'France',
        characteristics: ['Thin crust', 'Light crumb', 'Elongated shape', 'Best fresh'],
        blogLink: 'https://bakinggreatbread.blog/baguette',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'pain-de-mie',
        name: 'Pain de Mie',
        description: 'French sandwich bread with a soft, tender crumb and thin crust, baked in a lidded pan.',
        origin: 'France',
        characteristics: ['Soft crumb', 'Square shape', 'Thin crust', 'Perfect for sandwiches'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'fougasse',
        name: 'Fougasse',
        description: 'A decorative flat bread from Provence, often flavored with olives, herbs, or cheese.',
        origin: 'Provence, France',
        characteristics: ['Leaf shape', 'Decorative cuts', 'Flavored', 'Crispy'],
        blogLink: 'https://bakinggreatbread.blog/fougasse'
      },
      {
        id: 'pain-epi',
        name: 'Pain Épi',
        description: 'Wheat stalk shaped bread made by cutting a baguette to create tear-off portions.',
        origin: 'France',
        characteristics: ['Wheat stalk shape', 'Pull-apart', 'Extra crust', 'Decorative'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'ficelle',
        name: 'Ficelle',
        description: 'A thinner, crispier version of the baguette, meaning "string" in French.',
        origin: 'France',
        characteristics: ['Very thin', 'Extra crispy', 'All crust', 'Quick to bake'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'pain-fendu',
        name: 'Pain Fendu',
        description: 'Split bread with a distinctive groove down the center, creating a unique shape.',
        origin: 'France',
        characteristics: ['Split top', 'Unique shape', 'Good crust ratio', 'Traditional']
      }
    ]
  },
  {
    id: 'italian',
    name: 'Italian Breads',
    description: 'Mediterranean breads featuring olive oil, herbs, and rustic textures',
    icon: '🇮🇹',
    breads: [
      {
        id: 'focaccia',
        name: 'Focaccia',
        description: 'Flat Italian bread dimpled with olive oil, often topped with rosemary and sea salt.',
        origin: 'Genoa, Italy',
        characteristics: ['Olive oil rich', 'Dimpled surface', 'Fluffy interior', 'Versatile toppings'],
        blogLink: 'https://bakinggreatbread.blog/focaccia',
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/',
        recipeLink: 'https://bakinggreatbread.com/recipes',
        featured: true
      },
      {
        id: 'ciabatta',
        name: 'Ciabatta',
        description: 'Italian white bread with large holes and a chewy texture, meaning "slipper" in Italian.',
        origin: 'Veneto, Italy',
        characteristics: ['Large holes', 'Chewy texture', 'Flat shape', 'High hydration'],
        blogLink: 'https://bakinggreatbread.blog/ciabatta',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'pane-toscano',
        name: 'Pane Toscano',
        description: 'Tuscan bread made without salt, designed to pair with salty cured meats and cheeses.',
        origin: 'Tuscany, Italy',
        characteristics: ['No salt', 'Dense crumb', 'Thick crust', 'Regional specialty'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'grissini',
        name: 'Grissini',
        description: 'Long, thin Italian breadsticks, crispy and perfect for appetizers.',
        origin: 'Turin, Italy',
        characteristics: ['Thin sticks', 'Very crispy', 'Snack bread', 'Various flavors'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'pane-pugliese',
        name: 'Pane Pugliese',
        description: 'Large rustic bread from Puglia made with durum wheat semolina.',
        origin: 'Puglia, Italy',
        characteristics: ['Yellow crumb', 'Semolina flour', 'Long lasting', 'Rustic'],
        blogLink: 'https://bakinggreatbread.blog/pugliese'
      },
      {
        id: 'pagnotta',
        name: 'Pagnotta',
        description: 'A round Italian country bread with a thick, crusty exterior.',
        origin: 'Italy',
        characteristics: ['Round shape', 'Thick crust', 'Rustic appearance', 'Dense crumb']
      },
      {
        id: 'altamura',
        name: 'Pane di Altamura',
        description: 'Protected designation bread from Altamura, made with local durum wheat.',
        origin: 'Altamura, Italy',
        characteristics: ['DOP protected', 'Durum wheat', 'Yellow color', 'Excellent flavor'],
        blogLink: 'https://bakinggreatbread.blog/altamura'
      }
    ]
  },
  {
    id: 'enriched',
    name: 'Enriched Breads',
    description: 'Breads made with eggs, butter, milk, or sugar for extra richness',
    icon: '🧈',
    breads: [
      {
        id: 'brioche',
        name: 'Brioche',
        description: 'Rich French bread with high butter and egg content, creating a tender, golden crumb.',
        origin: 'France',
        characteristics: ['Butter-rich', 'Tender crumb', 'Slightly sweet', 'Golden color'],
        blogLink: 'https://bakinggreatbread.blog/brioche',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'challah',
        name: 'Challah',
        description: 'Traditional Jewish bread, braided and enriched with eggs, often served on Shabbat.',
        origin: 'Jewish tradition',
        characteristics: ['Braided shape', 'Egg-enriched', 'Slightly sweet', 'Ceremonial'],
        blogLink: 'https://bakinggreatbread.blog/challah',
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'milk-bread',
        name: 'Milk Bread (Shokupan)',
        description: 'Super soft Japanese bread made with a tangzhong roux for incredible fluffiness.',
        origin: 'Japan',
        characteristics: ['Ultra soft', 'Milk-enriched', 'Tangzhong method', 'Pull-apart texture'],
        blogLink: 'https://bakinggreatbread.blog/milk-bread',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'white-sandwich-bread',
        name: 'White Sandwich Bread',
        description: 'Classic American-style soft bread perfect for sandwiches and toast.',
        origin: 'USA',
        characteristics: ['Soft texture', 'Fine crumb', 'Square slices', 'Versatile'],
        blogLink: 'https://bakinggreatbread.blog/sandwich-bread',
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/',
        recipeLink: 'https://bakinggreatbread.com/recipes',
        featured: true
      },
      {
        id: 'panettone',
        name: 'Panettone',
        description: 'Italian Christmas bread studded with dried fruit and candied citrus.',
        origin: 'Milan, Italy',
        characteristics: ['Tall dome', 'Dried fruits', 'Long fermentation', 'Holiday bread'],
        blogLink: 'https://bakinggreatbread.blog/panettone'
      },
      {
        id: 'pandoro',
        name: 'Pandoro',
        description: 'Golden Italian bread from Verona, star-shaped and dusted with powdered sugar.',
        origin: 'Verona, Italy',
        characteristics: ['Star shape', 'No fruit', 'Butter-rich', 'Christmas tradition'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'hawaiian-rolls',
        name: 'Hawaiian Rolls',
        description: 'Sweet, fluffy rolls with pineapple juice that create a slightly tropical flavor.',
        origin: 'Hawaii, USA',
        characteristics: ['Sweet', 'Soft', 'Pineapple flavor', 'Pull-apart'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'portuguese-sweet-bread',
        name: 'Portuguese Sweet Bread (Pão Doce)',
        description: 'Egg-rich sweet bread popular in Portuguese communities, especially around Easter.',
        origin: 'Portugal',
        characteristics: ['Egg-rich', 'Sweet', 'Soft texture', 'Holiday bread'],
        blogLink: 'https://bakinggreatbread.blog/pao-doce'
      }
    ]
  },
  {
    id: 'whole-grain',
    name: 'Whole Grain Breads',
    description: 'Nutritious breads made with whole wheat, rye, and other whole grains',
    icon: '🌾',
    breads: [
      {
        id: 'whole-wheat',
        name: 'Whole Wheat Bread',
        description: 'Hearty bread made with 100% whole wheat flour, packed with fiber and nutrients.',
        origin: 'Various',
        characteristics: ['High fiber', 'Nutty flavor', 'Dense texture', 'Nutritious'],
        blogLink: 'https://bakinggreatbread.blog/whole-wheat',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'pumpernickel',
        name: 'Pumpernickel',
        description: 'Dark German bread made with coarse rye flour, baked slowly for deep flavor.',
        origin: 'Germany',
        characteristics: ['Dark color', 'Dense', 'Slow-baked', 'Earthy flavor'],
        blogLink: 'https://bakinggreatbread.blog/pumpernickel'
      },
      {
        id: 'volkornbrot',
        name: 'Vollkornbrot',
        description: 'Dense German whole grain bread made with cracked rye berries.',
        origin: 'Germany',
        characteristics: ['Very dense', 'Whole grains', 'Long-lasting', 'Highly nutritious'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'rye-bread',
        name: 'Rye Bread',
        description: 'Traditional bread made with rye flour, offering earthy flavors and dense texture.',
        origin: 'Northern Europe',
        characteristics: ['Earthy flavor', 'Dense crumb', 'Lower gluten', 'Pairs with smoked meats'],
        blogLink: 'https://bakinggreatbread.blog/rye-bread',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'multigrain',
        name: 'Multigrain Bread',
        description: 'Bread made with multiple grains and seeds for varied texture and nutrition.',
        origin: 'Various',
        characteristics: ['Multiple grains', 'Seeds', 'Varied texture', 'Nutritious'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'spelt-bread',
        name: 'Spelt Bread',
        description: 'Ancient grain bread with a slightly sweet, nutty flavor and good nutrition.',
        origin: 'Ancient Middle East',
        characteristics: ['Ancient grain', 'Nutty flavor', 'Easier to digest', 'Nutritious'],
        blogLink: 'https://bakinggreatbread.blog/spelt'
      },
      {
        id: 'einkorn-bread',
        name: 'Einkorn Bread',
        description: 'Made from the oldest known wheat variety, offering unique flavor and nutrition.',
        origin: 'Fertile Crescent',
        characteristics: ['Ancient variety', 'Golden color', 'Rich flavor', 'High protein'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      }
    ]
  },
  {
    id: 'flatbreads',
    name: 'Flatbreads',
    description: 'Thin breads from around the world, perfect for wraps and dipping',
    icon: '🫓',
    breads: [
      {
        id: 'pita',
        name: 'Pita',
        description: 'Middle Eastern pocket bread that puffs during baking, perfect for stuffing.',
        origin: 'Middle East',
        characteristics: ['Pocket', 'Soft', 'Puffs when baked', 'Versatile'],
        blogLink: 'https://bakinggreatbread.blog/pita',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'naan',
        name: 'Naan',
        description: 'Soft, leavened Indian flatbread traditionally baked in a tandoor oven.',
        origin: 'India',
        characteristics: ['Soft', 'Slightly chewy', 'Charred spots', 'Butter-brushed'],
        blogLink: 'https://bakinggreatbread.blog/naan',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'lavash',
        name: 'Lavash',
        description: 'Thin Armenian flatbread, UNESCO protected, used for wraps and as table bread.',
        origin: 'Armenia',
        characteristics: ['Very thin', 'Flexible', 'UNESCO heritage', 'Dries crisp'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'tortilla',
        name: 'Flour Tortilla',
        description: 'Soft Mexican flatbread made with wheat flour, essential for burritos and tacos.',
        origin: 'Mexico',
        characteristics: ['Soft', 'Pliable', 'Quick to make', 'Neutral flavor'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'roti',
        name: 'Roti/Chapati',
        description: 'Unleavened Indian whole wheat bread, a staple in South Asian cuisine.',
        origin: 'India',
        characteristics: ['Unleavened', 'Whole wheat', 'Thin', 'Daily bread'],
        blogLink: 'https://bakinggreatbread.blog/roti'
      },
      {
        id: 'paratha',
        name: 'Paratha',
        description: 'Layered, flaky Indian flatbread cooked with ghee or oil.',
        origin: 'India',
        characteristics: ['Layered', 'Flaky', 'Pan-fried', 'Rich'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/'
      },
      {
        id: 'barbari',
        name: 'Barbari',
        description: 'Thick Persian flatbread with ridges, topped with sesame seeds.',
        origin: 'Iran',
        characteristics: ['Thick', 'Ridged', 'Sesame topped', 'Chewy'],
        blogLink: 'https://bakinggreatbread.blog/barbari'
      },
      {
        id: 'sangak',
        name: 'Sangak',
        description: 'Large Iranian flatbread baked on hot pebbles, creating a unique texture.',
        origin: 'Iran',
        characteristics: ['Whole wheat', 'Pebble-baked', 'Large size', 'Irregular shape'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      }
    ]
  },
  {
    id: 'quick-breads',
    name: 'Quick Breads',
    description: 'Breads leavened with baking powder or soda instead of yeast',
    icon: '🍌',
    breads: [
      {
        id: 'banana-bread',
        name: 'Banana Bread',
        description: 'Moist quick bread made with ripe bananas, a beloved comfort food.',
        origin: 'USA',
        characteristics: ['Moist', 'Sweet', 'Ripe bananas', 'No yeast'],
        blogLink: 'https://bakinggreatbread.blog/banana-bread',
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/',
        recipeLink: 'https://bakinggreatbread.com/recipes',
        featured: true
      },
      {
        id: 'irish-soda-bread',
        name: 'Irish Soda Bread',
        description: 'Traditional Irish bread leavened with baking soda, quick and hearty.',
        origin: 'Ireland',
        characteristics: ['No yeast', 'Dense crumb', 'Cross scored', 'Buttermilk'],
        blogLink: 'https://bakinggreatbread.blog/soda-bread',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'cornbread',
        name: 'Cornbread',
        description: 'American quick bread made with cornmeal, perfect with chili or barbecue.',
        origin: 'Southern USA',
        characteristics: ['Cornmeal', 'Crumbly', 'Slightly sweet', 'Quick to make'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'zucchini-bread',
        name: 'Zucchini Bread',
        description: 'Moist bread made with shredded zucchini, often with nuts and spices.',
        origin: 'USA',
        characteristics: ['Moist', 'Hidden veggie', 'Spiced', 'Versatile'],
        blogLink: 'https://bakinggreatbread.blog/zucchini-bread'
      },
      {
        id: 'pumpkin-bread',
        name: 'Pumpkin Bread',
        description: 'Spiced quick bread made with pumpkin puree, perfect for fall.',
        origin: 'USA',
        characteristics: ['Pumpkin spice', 'Moist', 'Seasonal', 'Sweet'],
        cookbookLink: 'https://bgbahcommunitycookbook.vercel.app/',
        recipeLink: 'https://bakinggreatbread.com/recipes'
      },
      {
        id: 'beer-bread',
        name: 'Beer Bread',
        description: 'Quick bread using beer as leavening, with a slightly yeasty flavor.',
        origin: 'USA',
        characteristics: ['Beer leavened', 'Dense', 'Crusty top', 'Easy to make'],
        blogLink: 'https://bakinggreatbread.blog/beer-bread'
      },
      {
        id: 'scones',
        name: 'Scones',
        description: 'British quick bread, either sweet or savory, served with clotted cream.',
        origin: 'Scotland/England',
        characteristics: ['Tender', 'Flaky', 'Quick to bake', 'Served with tea'],
        recipeLink: 'https://bakinggreatbread.com/recipes'
      }
    ]
  }
];

export default function BreadEncyclopedia() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(BREAD_CATEGORIES.map(c => c.id))
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = BREAD_CATEGORIES.map(category => ({
    ...category,
    breads: category.breads.filter(bread =>
      bread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bread.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bread.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bread.characteristics.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.breads.length > 0 || !searchQuery);

  const totalBreads = BREAD_CATEGORIES.reduce((acc, cat) => acc + cat.breads.length, 0);
  const featuredBreads = BREAD_CATEGORIES.flatMap(cat => cat.breads.filter(b => b.featured));

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
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Bread Encyclopedia</h1>
              <p className="text-bakery-100 text-sm">{totalBreads}+ bread varieties from around the world</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search breads by name, origin, or characteristics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-bakery-300 bg-white"
              />
            </div>
          </div>

          {/* Featured Breads Section */}
          {!searchQuery && featuredBreads.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Wheat className="w-5 h-5 text-bakery-500" />
                Featured Recipes
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredBreads.map(bread => (
                  <div key={bread.id} className="bg-white rounded-xl shadow-sm border border-bakery-200 p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-stone-800 mb-2">{bread.name}</h3>
                    <p className="text-stone-600 text-sm mb-3 line-clamp-2">{bread.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {bread.blogLink && (
                        <a
                          href={bread.blogLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-bakery-50 text-bakery-600 rounded-full hover:bg-bakery-100 transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          Blog
                        </a>
                      )}
                      {bread.recipeLink && (
                        <a
                          href={bread.recipeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-sage-50 text-sage-600 rounded-full hover:bg-sage-100 transition-colors"
                        >
                          <Utensils className="w-3 h-3" />
                          Recipes
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Sections */}
          <div className="space-y-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-stone-800">{category.name}</h2>
                      <p className="text-stone-500 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-stone-400">{category.breads.length} breads</span>
                    {expandedCategories.has(category.id) ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {/* Breads Grid */}
                {expandedCategories.has(category.id) && (
                  <div className="border-t border-stone-100 p-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.breads.map(bread => (
                        <div
                          key={bread.id}
                          className={`p-4 rounded-lg border ${
                            bread.featured
                              ? 'border-bakery-200 bg-bakery-50/30'
                              : 'border-stone-100 bg-stone-50/50'
                          } hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-stone-800">{bread.name}</h3>
                            {bread.featured && (
                              <span className="text-xs px-2 py-0.5 bg-bakery-100 text-bakery-600 rounded-full">Featured</span>
                            )}
                          </div>
                          <p className="text-stone-600 text-sm mb-2">{bread.description}</p>
                          <p className="text-stone-400 text-xs mb-3">Origin: {bread.origin}</p>

                          {/* Characteristics */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {bread.characteristics.slice(0, 3).map((char, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full"
                              >
                                {char}
                              </span>
                            ))}
                          </div>

                          {/* Links */}
                          <div className="flex flex-wrap gap-2">
                            {bread.blogLink && (
                              <a
                                href={bread.blogLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-bakery-500 hover:text-bakery-600"
                              >
                                <BookOpen className="w-3 h-3" />
                                Blog
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                            {bread.cookbookLink && (
                              <a
                                href={bread.cookbookLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-sage-500 hover:text-sage-600"
                              >
                                <Utensils className="w-3 h-3" />
                                Cookbook
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                            {bread.recipeLink && (
                              <a
                                href={bread.recipeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-glow-500 hover:text-glow-600"
                              >
                                <Wheat className="w-3 h-3" />
                                Recipes
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No results */}
          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Wheat className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-600 mb-2">No breads found</h3>
              <p className="text-stone-500">Try a different search term</p>
            </div>
          )}

          {/* Resources CTA */}
          <div className="mt-12 bg-gradient-to-r from-bakery-500 to-bakery-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Bake?</h3>
            <p className="text-bakery-100 mb-6 max-w-xl mx-auto">
              Explore our resources for recipes, techniques, and tools to help you bake amazing bread at home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/baking-techniques"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-bakery-600 font-semibold rounded-lg hover:bg-bakery-50 transition-colors"
              >
                <Utensils className="w-5 h-5" />
                Baking Techniques
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 bg-bakery-600 text-white font-semibold rounded-lg hover:bg-bakery-700 transition-colors border border-bakery-400"
              >
                <ExternalLink className="w-5 h-5" />
                All Resources
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
