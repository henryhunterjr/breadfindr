import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Utensils,
  Clock,
  Target,
  Lightbulb,
  Wheat
} from 'lucide-react';
import Footer from '../components/Footer';

interface Technique {
  id: string;
  name: string;
  alternateNames?: string[];
  description: string;
  purpose: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timing?: string;
  steps: string[];
  tips: string[];
  relatedTechniques?: string[];
  blogLink?: string;
  videoLink?: string;
}

interface TechniqueCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  techniques: Technique[];
}

const TECHNIQUE_CATEGORIES: TechniqueCategory[] = [
  {
    id: 'dough-development',
    name: 'Dough Development',
    description: 'Techniques for building gluten structure and developing flavor',
    icon: '🫳',
    techniques: [
      {
        id: 'autolyse',
        name: 'Autolyse',
        alternateNames: ['Autolysis'],
        description: 'A rest period where flour and water hydrate before adding salt and leavening, allowing enzymes to begin breaking down starches and gluten to develop naturally.',
        purpose: 'Improves dough extensibility, enhances flavor, reduces mixing time, and creates a more open crumb structure.',
        difficulty: 'Beginner',
        timing: '20 minutes to 2 hours',
        steps: [
          'Combine flour and water in a bowl',
          'Mix until no dry flour remains',
          'Cover and rest at room temperature',
          'Add salt and starter/yeast after resting'
        ],
        tips: [
          'Longer autolyse benefits whole grain flours',
          'For sourdough, some bakers include the starter in autolyse',
          'Warmer water speeds up enzyme activity',
          'Very long autolyse may require refrigeration'
        ],
        relatedTechniques: ['Rubaud Method', 'Bassinage'],
        blogLink: 'https://bakinggreatbread.blog/autolyse'
      },
      {
        id: 'rubaud-method',
        name: 'Rubaud Method',
        alternateNames: ['Rubaud Mixing', 'French Fold'],
        description: 'A vigorous hand mixing technique developed by Gerard Rubaud, involving scooping and slapping the dough in the bowl to develop gluten without a mixer.',
        purpose: 'Develops strong gluten structure quickly, fully incorporates ingredients, and works well for high-hydration doughs.',
        difficulty: 'Intermediate',
        timing: '3-5 minutes',
        steps: [
          'Place dough in a bowl with enough room to work',
          'Wet your hand slightly to prevent sticking',
          'Scoop under the dough with fingers together',
          'Lift and slap the dough back into the bowl',
          'Rotate bowl and repeat until dough becomes smooth and elastic'
        ],
        tips: [
          'Keep fingers together like a paddle',
          'Work quickly with a consistent rhythm',
          'Dough will start sticky but become smoother',
          'Stop when dough pulls cleanly from the bowl'
        ],
        relatedTechniques: ['Slap and Fold', 'Stretch and Fold'],
        blogLink: 'https://bakinggreatbread.blog/rubaud-method'
      },
      {
        id: 'slap-fold',
        name: 'Slap and Fold',
        alternateNames: ['French Slap', 'Kneading by Slapping'],
        description: 'A technique where dough is lifted, stretched, slapped onto the counter, and folded over itself to develop gluten.',
        purpose: 'Builds strong gluten structure rapidly, works air into the dough, and is effective for wet, sticky doughs.',
        difficulty: 'Intermediate',
        timing: '5-10 minutes',
        steps: [
          'Pick up the dough with both hands',
          'Stretch it upward, letting it hang',
          'Slap the bottom onto the work surface',
          'Fold the top over onto itself',
          'Rotate and repeat'
        ],
        tips: [
          'The work surface should be clean but not floured',
          'Dough will be very sticky at first but will come together',
          'Use this technique when stretch and fold isn\'t enough',
          'Great for brioche and other enriched doughs'
        ],
        relatedTechniques: ['Rubaud Method', 'Window Pane Test'],
        blogLink: 'https://bakinggreatbread.blog/slap-and-fold'
      },
      {
        id: 'bassinage',
        name: 'Bassinage',
        alternateNames: ['Double Hydration', 'Water in Stages'],
        description: 'The technique of adding water in stages during mixing, allowing the dough to fully absorb each addition before adding more.',
        purpose: 'Allows for higher hydration levels, gives better control over dough consistency, and helps develop gluten more evenly.',
        difficulty: 'Advanced',
        timing: 'Throughout mixing process',
        steps: [
          'Begin with 80-90% of total water',
          'Mix until dough comes together',
          'Add remaining water in small amounts',
          'Continue mixing until each addition is absorbed',
          'Stop when dough reaches desired consistency'
        ],
        tips: [
          'Essential for very high hydration doughs (80%+)',
          'Add water gradually - you can always add more',
          'The dough will look "broken" temporarily',
          'Works especially well with strong bread flours'
        ],
        relatedTechniques: ['Autolyse', 'Rubaud Method'],
        blogLink: 'https://bakinggreatbread.blog/bassinage'
      }
    ]
  },
  {
    id: 'folding-techniques',
    name: 'Folding Techniques',
    description: 'Methods for building structure during bulk fermentation',
    icon: '🔄',
    techniques: [
      {
        id: 'stretch-fold',
        name: 'Stretch and Fold',
        alternateNames: ['S&F', 'Four-Fold'],
        description: 'The classic technique of stretching the dough up from one side of the container and folding it over to the opposite side, rotating and repeating.',
        purpose: 'Builds gluten strength, redistributes temperature and fermentation, degasses dough gently, and creates layers.',
        difficulty: 'Beginner',
        timing: 'Every 30-60 minutes during bulk fermentation',
        steps: [
          'Wet your hand to prevent sticking',
          'Grab the dough from the far side of the container',
          'Stretch it upward without tearing',
          'Fold it over to the near side',
          'Rotate container 90° and repeat 3 more times'
        ],
        tips: [
          'Be gentle - don\'t tear the dough',
          'The first fold will stretch the most',
          'Dough should become tighter with each set',
          '3-4 sets are typical during bulk fermentation'
        ],
        relatedTechniques: ['Coil Fold', 'Letter Fold'],
        blogLink: 'https://bakinggreatbread.blog/stretch-and-fold'
      },
      {
        id: 'coil-fold',
        name: 'Coil Fold',
        alternateNames: ['Coil Folding'],
        description: 'A gentle folding technique where you lift the dough from the center, letting the sides fall and fold under themselves.',
        purpose: 'Very gentle on the dough, preserves gas bubbles, works well for high-hydration and delicate doughs.',
        difficulty: 'Intermediate',
        timing: 'Every 30-60 minutes during bulk fermentation',
        steps: [
          'Wet both hands lightly',
          'Slide hands under the center of the dough',
          'Lift straight up, letting the sides fall',
          'Lower center back down, tucking sides underneath',
          'Rotate 90° and repeat'
        ],
        tips: [
          'Perfect for slack, high-hydration doughs',
          'Gentler than stretch and fold on developed gluten',
          'Great for later folds when dough is puffy',
          'The dough should slowly release from your hands'
        ],
        relatedTechniques: ['Stretch and Fold', 'Lamination'],
        blogLink: 'https://bakinggreatbread.blog/coil-fold'
      },
      {
        id: 'letter-fold',
        name: 'Letter Fold',
        alternateNames: ['Business Letter Fold', 'Tri-Fold'],
        description: 'Folding the dough in thirds like a letter, creating distinct layers. Often used in laminated doughs.',
        purpose: 'Creates layers, builds strength, and is essential for laminated doughs like croissants.',
        difficulty: 'Beginner',
        timing: 'During shaping or bulk fermentation',
        steps: [
          'Pat dough into a rectangle on a lightly floured surface',
          'Fold the bottom third up to the center',
          'Fold the top third down over it',
          'You now have three layers',
          'Can rotate 90° and repeat for more layers'
        ],
        tips: [
          'Essential technique for croissant dough',
          'Keep edges aligned for even layers',
          'Rest dough between folds if it resists',
          'Creates beautiful internal structure'
        ],
        relatedTechniques: ['Lamination', 'Stretch and Fold'],
        blogLink: 'https://bakinggreatbread.blog/letter-fold'
      },
      {
        id: 'lamination',
        name: 'Lamination',
        alternateNames: ['Laminating', 'Full Stretch'],
        description: 'Stretching the dough very thin on a work surface, then folding it back onto itself multiple times to build layers and strength.',
        purpose: 'Maximum gluten development, creates many thin layers, perfect for adding inclusions, and produces excellent crumb structure.',
        difficulty: 'Advanced',
        timing: 'Usually once during bulk fermentation',
        steps: [
          'Oil or wet your work surface lightly',
          'Turn dough onto the surface',
          'Gently stretch from the center outward',
          'Continue until dough is very thin and nearly translucent',
          'If adding inclusions, spread them evenly now',
          'Fold edges to center, then fold in half repeatedly',
          'Return to container'
        ],
        tips: [
          'Wait until dough has relaxed enough to stretch easily',
          'Don\'t rush - let gravity help stretch the dough',
          'Perfect for adding cheese, olives, herbs',
          'One lamination can replace multiple stretch and folds'
        ],
        relatedTechniques: ['Window Pane Test', 'Letter Fold'],
        blogLink: 'https://bakinggreatbread.blog/lamination'
      }
    ]
  },
  {
    id: 'testing-assessment',
    name: 'Testing & Assessment',
    description: 'Methods to evaluate dough readiness and fermentation progress',
    icon: '🔍',
    techniques: [
      {
        id: 'windowpane-test',
        name: 'Windowpane Test',
        alternateNames: ['Window Test', 'Membrane Test'],
        description: 'Testing gluten development by stretching a small piece of dough thin enough to see light through without tearing.',
        purpose: 'Confirms adequate gluten development for good bread structure and open crumb.',
        difficulty: 'Beginner',
        timing: 'After mixing or folding is complete',
        steps: [
          'Pinch off a small piece of dough (golf ball size)',
          'Gently stretch it from the edges',
          'Rotate and continue stretching evenly',
          'Try to stretch until nearly translucent',
          'If it tears easily, more development is needed'
        ],
        tips: [
          'A proper windowpane should be thin enough to see through',
          'Whole grain doughs may not pass this test cleanly',
          'The edges of the tear matter - smooth = good, ragged = underdeveloped',
          'This test works for both hand-mixed and machine-mixed doughs'
        ],
        relatedTechniques: ['Poke Test', 'Slap and Fold'],
        blogLink: 'https://bakinggreatbread.blog/windowpane-test'
      },
      {
        id: 'poke-test',
        name: 'Poke Test',
        alternateNames: ['Finger Poke Test', 'Dent Test'],
        description: 'Pressing a floured finger into proofed dough to assess readiness for baking based on how quickly it springs back.',
        purpose: 'Determines if shaped dough is properly proofed and ready for baking.',
        difficulty: 'Beginner',
        timing: 'Before baking, after final proof',
        steps: [
          'Flour your finger lightly',
          'Press gently into the dough about 1/2 inch deep',
          'Remove finger and observe the indent',
          'Assess the spring back rate'
        ],
        tips: [
          'Underproofed: Springs back quickly and fully',
          'Properly proofed: Springs back slowly, leaving slight indent',
          'Overproofed: Doesn\'t spring back, may deflate',
          'Temperature affects spring back - cold dough is slower'
        ],
        relatedTechniques: ['Float Test', 'Jiggle Test'],
        blogLink: 'https://bakinggreatbread.blog/poke-test'
      },
      {
        id: 'float-test',
        name: 'Float Test',
        alternateNames: ['Starter Float Test'],
        description: 'Testing if sourdough starter is active by dropping a spoonful into water to see if it floats.',
        purpose: 'Confirms starter has enough gas production to leaven bread.',
        difficulty: 'Beginner',
        timing: 'Before adding starter to dough',
        steps: [
          'Fill a glass with room temperature water',
          'Scoop a spoonful of starter',
          'Drop gently into the water',
          'Observe if it floats or sinks'
        ],
        tips: [
          'Floating = ready to use',
          'Sinking = needs more time or feeding',
          'Very high hydration starters may not float even when active',
          'Not 100% reliable but a good indicator'
        ],
        relatedTechniques: ['Poke Test', 'Bulk Fermentation'],
        blogLink: 'https://bakinggreatbread.blog/float-test'
      },
      {
        id: 'jiggle-test',
        name: 'Jiggle Test',
        alternateNames: ['Wobble Test'],
        description: 'Gently shaking the container or touching the dough to assess its consistency and fermentation level.',
        purpose: 'Quick visual/tactile assessment of bulk fermentation progress.',
        difficulty: 'Beginner',
        timing: 'During bulk fermentation',
        steps: [
          'Gently shake or nudge the container',
          'Observe how the dough moves',
          'Well-fermented dough should jiggle like jello',
          'Look for domed top and aerated appearance'
        ],
        tips: [
          'Young dough is dense and sluggish',
          'Properly fermented dough is puffy and jiggly',
          'Overfermented dough may be very loose or flat',
          'Combine with volume observation for best results'
        ],
        relatedTechniques: ['Poke Test', 'Volume Assessment'],
        blogLink: 'https://bakinggreatbread.blog/jiggle-test'
      }
    ]
  },
  {
    id: 'shaping',
    name: 'Shaping Techniques',
    description: 'Methods for forming dough into final loaf shapes',
    icon: '🍞',
    techniques: [
      {
        id: 'pre-shaping',
        name: 'Pre-shaping (Rounding)',
        alternateNames: ['Rounding', 'Bench Rest Prep'],
        description: 'An initial, gentle shaping that creates surface tension and organizes the dough before final shaping.',
        purpose: 'Begins building structure, allows dough to relax before final shaping, and makes final shaping easier.',
        difficulty: 'Beginner',
        timing: 'After dividing, before bench rest',
        steps: [
          'Turn dough onto a lightly floured surface',
          'Using a bench scraper, tuck edges under',
          'Rotate the dough, creating a round shape',
          'Create some surface tension without degassing too much',
          'Cover and let rest (bench rest) for 20-30 minutes'
        ],
        tips: [
          'Don\'t over-tighten - you want some gas retention',
          'The dough should relax and spread slightly during bench rest',
          'If dough is too tight, final shaping will be difficult',
          'Use minimal flour to allow friction for shaping'
        ],
        relatedTechniques: ['Final Shaping', 'Boule Shaping'],
        blogLink: 'https://bakinggreatbread.blog/pre-shaping'
      },
      {
        id: 'boule-shaping',
        name: 'Boule Shaping',
        alternateNames: ['Round Loaf Shaping'],
        description: 'Creating a round loaf with smooth, taut surface tension for even baking and beautiful appearance.',
        purpose: 'Creates the classic round loaf shape with proper tension for oven spring.',
        difficulty: 'Intermediate',
        timing: 'After bench rest',
        steps: [
          'Flip pre-shaped dough onto lightly floured surface',
          'Pat gently into a rectangle',
          'Fold bottom third up, sides in',
          'Roll toward yourself, sealing seam',
          'Rotate on the bench to build tension',
          'Place seam-side up in proofing basket'
        ],
        tips: [
          'The seam should seal with a slight pinch',
          'Use the bench to create friction and tension',
          'Too much flour prevents proper sealing',
          'A tight shape = better oven spring'
        ],
        relatedTechniques: ['Batard Shaping', 'Pre-shaping'],
        blogLink: 'https://bakinggreatbread.blog/boule-shaping'
      },
      {
        id: 'batard-shaping',
        name: 'Batard Shaping',
        alternateNames: ['Oval Loaf Shaping'],
        description: 'Creating an oval/football shaped loaf, the classic shape for many artisan breads.',
        purpose: 'Creates an oval loaf with good crumb and crust distribution.',
        difficulty: 'Intermediate',
        timing: 'After bench rest',
        steps: [
          'Flip pre-shaped dough smooth side down',
          'Pat into a rectangle slightly wider than long',
          'Fold top edge to center and press to seal',
          'Fold again, rolling toward you',
          'Seal the seam by pressing with heel of hand',
          'Taper ends slightly if desired'
        ],
        tips: [
          'Keep the seam tight throughout',
          'The final seam should be on the bottom',
          'Consistent width = even baking',
          'Practice creates muscle memory'
        ],
        relatedTechniques: ['Boule Shaping', 'Baguette Shaping'],
        blogLink: 'https://bakinggreatbread.blog/batard-shaping'
      },
      {
        id: 'stitching',
        name: 'Stitching',
        alternateNames: ['Stitch Shaping', 'Cinching'],
        description: 'A shaping technique where the dough is pulled and tucked from the sides alternately to create tension.',
        purpose: 'Builds extra surface tension for slack doughs, creates a tighter final shape.',
        difficulty: 'Intermediate',
        timing: 'During final shaping',
        steps: [
          'Place dough smooth side down',
          'Pull left edge to center',
          'Pull right edge over and to center',
          'Continue alternating, working down the dough',
          'Roll to seal and create final shape'
        ],
        tips: [
          'Think of it like lacing up shoes',
          'Great for high hydration doughs that spread',
          'Creates extra layers in the crumb',
          'Can be combined with other shaping methods'
        ],
        relatedTechniques: ['Batard Shaping', 'Pre-shaping'],
        blogLink: 'https://bakinggreatbread.blog/stitching'
      }
    ]
  },
  {
    id: 'scoring-baking',
    name: 'Scoring & Baking',
    description: 'Techniques for scoring and creating steam for optimal oven spring',
    icon: '🔥',
    techniques: [
      {
        id: 'scoring',
        name: 'Scoring (Slashing)',
        alternateNames: ['Slashing', 'Grigne'],
        description: 'Cutting the top of a loaf before baking to control where the bread expands and create decorative patterns.',
        purpose: 'Controls oven spring direction, prevents blowouts, and creates beautiful ears and patterns.',
        difficulty: 'Intermediate',
        timing: 'Immediately before baking',
        steps: [
          'Chill dough for easier scoring (optional)',
          'Hold blade at 30-45° angle for ears',
          'Score with quick, confident strokes',
          'Depth should be about 1/4 to 1/2 inch',
          'Spray with water and bake immediately'
        ],
        tips: [
          'A sharp blade is essential',
          'Cold dough scores cleaner',
          'Angled cuts create ears, straight cuts open evenly',
          'Practice patterns on shaped play-dough first'
        ],
        relatedTechniques: ['Steam Baking', 'Ear Formation'],
        blogLink: 'https://bakinggreatbread.blog/scoring'
      },
      {
        id: 'steam-baking',
        name: 'Steam Baking',
        alternateNames: ['Steam Injection', 'Covered Baking'],
        description: 'Using steam or a covered vessel in the first phase of baking to keep the crust flexible for maximum oven spring.',
        purpose: 'Delays crust formation, allows maximum rise, creates a crispy, glossy crust.',
        difficulty: 'Beginner',
        timing: 'First 15-20 minutes of baking',
        steps: [
          'Preheat oven with Dutch oven or steam setup',
          'Load dough carefully',
          'Add steam or cover with lid',
          'Bake covered for 20 minutes',
          'Remove lid and finish baking until golden'
        ],
        tips: [
          'Dutch oven is the easiest method for home bakers',
          'Alternatively: ice cubes, spraying, lava rocks with water',
          'Steam should stop before browning phase',
          'Higher hydration doughs need more steam'
        ],
        relatedTechniques: ['Scoring', 'Oven Spring'],
        blogLink: 'https://bakinggreatbread.blog/steam-baking'
      },
      {
        id: 'cold-retard',
        name: 'Cold Retard',
        alternateNames: ['Cold Proof', 'Refrigerator Proof'],
        description: 'Proofing shaped dough in the refrigerator overnight to develop flavor and improve handling.',
        purpose: 'Develops complex flavors, improves scoring, and allows flexible baking schedule.',
        difficulty: 'Beginner',
        timing: 'After shaping, 8-16 hours before baking',
        steps: [
          'Shape dough and place in proofing basket',
          'Cover tightly with plastic or shower cap',
          'Refrigerate for 8-16 hours',
          'Bake directly from refrigerator',
          'No need to warm before baking'
        ],
        tips: [
          'Cold dough scores beautifully',
          'Longer retard = more sour flavor',
          'Don\'t let it over-proof before refrigerating',
          'Dutch oven should be preheated'
        ],
        relatedTechniques: ['Scoring', 'Bulk Fermentation'],
        blogLink: 'https://bakinggreatbread.blog/cold-retard'
      }
    ]
  },
  {
    id: 'fermentation',
    name: 'Fermentation Methods',
    description: 'Approaches to fermentation timing and temperature control',
    icon: '🧫',
    techniques: [
      {
        id: 'bulk-fermentation',
        name: 'Bulk Fermentation',
        alternateNames: ['First Rise', 'Bulk Proof'],
        description: 'The primary fermentation period where the entire batch of dough ferments together before dividing and shaping.',
        purpose: 'Develops flavor, builds gluten structure, and allows gas production for rise.',
        difficulty: 'Beginner',
        timing: '3-6 hours at room temperature, or longer cold',
        steps: [
          'After mixing, place dough in a container',
          'Note the volume (markings help)',
          'Perform folds as needed (30-60 min intervals)',
          'Monitor for 50-75% volume increase',
          'Check for domed top and airy texture'
        ],
        tips: [
          'Temperature greatly affects timing',
          '75-78°F is ideal for most sourdoughs',
          'Use a proofing box or oven with light for warmth',
          'Under-fermented = dense bread, over = flat bread'
        ],
        relatedTechniques: ['Stretch and Fold', 'Cold Retard'],
        blogLink: 'https://bakinggreatbread.blog/bulk-fermentation'
      },
      {
        id: 'poolish',
        name: 'Poolish',
        alternateNames: ['Polish Sponge', 'Liquid Preferment'],
        description: 'A liquid pre-ferment made with equal parts flour and water plus a small amount of yeast, fermented before adding to final dough.',
        purpose: 'Develops flavor complexity, improves texture, and extends shelf life.',
        difficulty: 'Intermediate',
        timing: '8-16 hours before mixing final dough',
        steps: [
          'Combine equal weights flour and water',
          'Add small amount of yeast (0.1-0.5%)',
          'Mix until smooth',
          'Cover and ferment at room temperature',
          'Use when bubbly and domed'
        ],
        tips: [
          'Perfect for baguettes and pizza',
          '100% hydration makes it easy to mix',
          'Ready when it starts to recede from peak',
          'Can use up to 30% of total flour'
        ],
        relatedTechniques: ['Biga', 'Levain'],
        blogLink: 'https://bakinggreatbread.blog/poolish'
      },
      {
        id: 'biga',
        name: 'Biga',
        alternateNames: ['Italian Preferment'],
        description: 'A stiff Italian pre-ferment made with flour, water, and yeast at about 50-60% hydration.',
        purpose: 'Adds nutty, complex flavors and improves crumb structure in Italian breads.',
        difficulty: 'Intermediate',
        timing: '12-24 hours before mixing final dough',
        steps: [
          'Combine flour with 50-60% water',
          'Add small amount of yeast',
          'Mix until a stiff, shaggy dough forms',
          'Cover and ferment at cool room temperature',
          'Use when tripled and fragrant'
        ],
        tips: [
          'Traditional for ciabatta and focaccia',
          'Stiff texture = different flavor than poolish',
          'Can ferment up to 24 hours',
          'Tear into pieces before adding to dough'
        ],
        relatedTechniques: ['Poolish', 'Pâte Fermentée'],
        blogLink: 'https://bakinggreatbread.blog/biga'
      },
      {
        id: 'levain',
        name: 'Levain Build',
        alternateNames: ['Leaven', 'Starter Build'],
        description: 'A portion of sourdough starter refreshed at specific ratios to peak at the right time for mixing.',
        purpose: 'Creates an active, predictable leaven for consistent sourdough bread.',
        difficulty: 'Intermediate',
        timing: '4-12 hours before mixing, depending on ratio',
        steps: [
          'Calculate needed levain amount',
          'Combine starter, flour, and water',
          'Mix well and cover',
          'Ferment until doubled and bubbly',
          'Use at peak activity'
        ],
        tips: [
          'Ratio affects timing: 1:5:5 = slower, 1:1:1 = faster',
          'Young levain = milder, mature = more sour',
          'Float test can indicate readiness',
          'Don\'t let it overripen and collapse'
        ],
        relatedTechniques: ['Float Test', 'Bulk Fermentation'],
        blogLink: 'https://bakinggreatbread.blog/levain-build'
      }
    ]
  }
];

export default function BakingTechniques() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(TECHNIQUE_CATEGORIES.map(c => c.id))
  );
  const [expandedTechniques, setExpandedTechniques] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleTechnique = (techniqueId: string) => {
    const newExpanded = new Set(expandedTechniques);
    if (newExpanded.has(techniqueId)) {
      newExpanded.delete(techniqueId);
    } else {
      newExpanded.add(techniqueId);
    }
    setExpandedTechniques(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-700';
    }
  };

  const filteredCategories = TECHNIQUE_CATEGORIES.map(category => ({
    ...category,
    techniques: category.techniques.filter(tech =>
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.alternateNames?.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  })).filter(category => category.techniques.length > 0 || !searchQuery);

  const totalTechniques = TECHNIQUE_CATEGORIES.reduce((acc, cat) => acc + cat.techniques.length, 0);

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
            <Utensils className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Baking Techniques</h1>
              <p className="text-bakery-100 text-sm">{totalTechniques} essential techniques for bread baking</p>
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
                placeholder="Search techniques by name or purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-bakery-300 bg-white"
              />
            </div>
          </div>

          {/* Quick Reference */}
          {!searchQuery && (
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-bakery-500" />
                Quick Reference: Core Techniques
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {['autolyse', 'stretch-fold', 'windowpane-test', 'scoring'].map(techId => {
                  const tech = TECHNIQUE_CATEGORIES.flatMap(c => c.techniques).find(t => t.id === techId);
                  return tech ? (
                    <button
                      key={tech.id}
                      onClick={() => {
                        toggleTechnique(tech.id);
                        document.getElementById(tech.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="p-3 bg-bakery-50 rounded-lg text-left hover:bg-bakery-100 transition-colors"
                    >
                      <span className="font-medium text-stone-800">{tech.name}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(tech.difficulty)}`}>
                        {tech.difficulty}
                      </span>
                    </button>
                  ) : null;
                })}
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
                    <span className="text-sm text-stone-400">{category.techniques.length} techniques</span>
                    {expandedCategories.has(category.id) ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

                {/* Techniques List */}
                {expandedCategories.has(category.id) && (
                  <div className="border-t border-stone-100">
                    {category.techniques.map((technique, idx) => (
                      <div
                        key={technique.id}
                        id={technique.id}
                        className={`border-b border-stone-100 last:border-b-0 ${
                          idx % 2 === 0 ? 'bg-stone-50/30' : ''
                        }`}
                      >
                        {/* Technique Header */}
                        <button
                          onClick={() => toggleTechnique(technique.id)}
                          className="w-full p-4 text-left hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-stone-800">{technique.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(technique.difficulty)}`}>
                                  {technique.difficulty}
                                </span>
                                {technique.timing && (
                                  <span className="flex items-center gap-1 text-xs text-stone-400">
                                    <Clock className="w-3 h-3" />
                                    {technique.timing}
                                  </span>
                                )}
                              </div>
                              {technique.alternateNames && (
                                <p className="text-xs text-stone-400 mt-0.5">
                                  Also known as: {technique.alternateNames.join(', ')}
                                </p>
                              )}
                              <p className="text-stone-600 text-sm mt-1">{technique.description}</p>
                            </div>
                            {expandedTechniques.has(technique.id) ? (
                              <ChevronUp className="w-5 h-5 text-stone-400 flex-shrink-0 ml-2" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>

                        {/* Technique Details */}
                        {expandedTechniques.has(technique.id) && (
                          <div className="px-4 pb-4 space-y-4">
                            {/* Purpose */}
                            <div className="flex items-start gap-3 p-3 bg-bakery-50 rounded-lg">
                              <Target className="w-5 h-5 text-bakery-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-sm font-medium text-stone-700">Purpose: </span>
                                <span className="text-sm text-stone-600">{technique.purpose}</span>
                              </div>
                            </div>

                            {/* Steps */}
                            <div>
                              <h4 className="text-sm font-medium text-stone-700 mb-2">Steps:</h4>
                              <ol className="space-y-1">
                                {technique.steps.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                                    <span className="flex-shrink-0 w-5 h-5 bg-bakery-100 text-bakery-600 rounded-full flex items-center justify-center text-xs font-medium">
                                      {idx + 1}
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Tips */}
                            <div>
                              <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-1">
                                <Lightbulb className="w-4 h-4 text-yellow-500" />
                                Tips:
                              </h4>
                              <ul className="space-y-1">
                                {technique.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                                    <span className="text-yellow-500">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Related & Links */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              {technique.relatedTechniques && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-stone-400">Related:</span>
                                  {technique.relatedTechniques.map((rel, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
                                      {rel}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {technique.blogLink && (
                                <a
                                  href={technique.blogLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-bakery-500 hover:text-bakery-600"
                                >
                                  <BookOpen className="w-3 h-3" />
                                  Learn more
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No results */}
          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Utensils className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-600 mb-2">No techniques found</h3>
              <p className="text-stone-500">Try a different search term</p>
            </div>
          )}

          {/* Resources CTA */}
          <div className="mt-12 bg-gradient-to-r from-bakery-500 to-bakery-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Master These Techniques</h3>
            <p className="text-bakery-100 mb-6 max-w-xl mx-auto">
              Learn more about each technique with detailed tutorials and videos on our blog.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/bread-encyclopedia"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-bakery-600 font-semibold rounded-lg hover:bg-bakery-50 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Bread Encyclopedia
              </Link>
              <a
                href="https://bakinggreatbread.blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-bakery-600 text-white font-semibold rounded-lg hover:bg-bakery-700 transition-colors border border-bakery-400"
              >
                <Wheat className="w-5 h-5" />
                Visit the Blog
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
