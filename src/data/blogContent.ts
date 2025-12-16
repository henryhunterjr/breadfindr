// Blog content for cross-promotion
// Update this file to add new recipes and articles

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'recipe' | 'article';
  tags: string[]; // bread types, techniques, etc.
  image?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  // Sourdough recipes
  {
    id: 'sourdough-starter',
    title: 'How to Make a Sourdough Starter',
    description: 'The complete guide to creating and maintaining your own sourdough starter from scratch.',
    url: 'https://bakinggreatbread.com/recipes/sourdough-starter',
    type: 'recipe',
    tags: ['sourdough', 'starter', 'beginner'],
  },
  {
    id: 'basic-sourdough',
    title: 'Basic Sourdough Bread',
    description: 'A foolproof recipe for your first loaf of artisan sourdough bread.',
    url: 'https://bakinggreatbread.com/recipes/basic-sourdough',
    type: 'recipe',
    tags: ['sourdough', 'artisan', 'beginner'],
  },
  {
    id: 'sourdough-discard',
    title: 'Sourdough Discard Recipes',
    description: 'Creative ways to use your sourdough discard - crackers, pancakes, and more.',
    url: 'https://bakinggreatbread.com/recipes/sourdough-discard',
    type: 'recipe',
    tags: ['sourdough', 'discard'],
  },

  // Baguettes
  {
    id: 'french-baguette',
    title: 'Classic French Baguette',
    description: 'Achieve bakery-quality baguettes with a crispy crust and airy crumb at home.',
    url: 'https://bakinggreatbread.com/recipes/french-baguette',
    type: 'recipe',
    tags: ['baguette', 'french', 'crusty'],
  },

  // Focaccia
  {
    id: 'focaccia',
    title: 'Easy Focaccia Bread',
    description: 'Soft, olive oil-rich Italian flatbread with endless topping possibilities.',
    url: 'https://bakinggreatbread.com/recipes/focaccia',
    type: 'recipe',
    tags: ['focaccia', 'italian', 'flatbread', 'beginner'],
  },

  // Croissants
  {
    id: 'croissants',
    title: 'Homemade Croissants',
    description: 'Master the art of laminated dough for flaky, buttery croissants.',
    url: 'https://bakinggreatbread.com/recipes/croissants',
    type: 'recipe',
    tags: ['croissant', 'pastry', 'french', 'laminated'],
  },

  // Whole grain
  {
    id: 'whole-wheat',
    title: 'Honey Whole Wheat Bread',
    description: 'Soft, nutritious sandwich bread with 100% whole wheat flour.',
    url: 'https://bakinggreatbread.com/recipes/whole-wheat-bread',
    type: 'recipe',
    tags: ['whole wheat', 'healthy', 'sandwich'],
  },

  // Blog articles
  {
    id: 'bread-scoring',
    title: 'The Art of Bread Scoring',
    description: 'Learn scoring patterns and techniques for beautiful bread designs.',
    url: 'https://bakinggreatbread.blog/bread-scoring-guide',
    type: 'article',
    tags: ['technique', 'scoring', 'artisan'],
  },
  {
    id: 'hydration-guide',
    title: 'Understanding Dough Hydration',
    description: 'How water content affects your bread and how to work with wet doughs.',
    url: 'https://bakinggreatbread.blog/hydration-guide',
    type: 'article',
    tags: ['technique', 'hydration', 'sourdough'],
  },
  {
    id: 'dutch-oven',
    title: 'Baking Bread in a Dutch Oven',
    description: 'Why a Dutch oven creates the perfect crust and how to use one.',
    url: 'https://bakinggreatbread.blog/dutch-oven-baking',
    type: 'article',
    tags: ['technique', 'equipment', 'beginner'],
  },
  {
    id: 'flour-types',
    title: 'Guide to Bread Flours',
    description: 'Bread flour, AP, whole wheat, rye - which flour for which bread?',
    url: 'https://bakinggreatbread.blog/flour-guide',
    type: 'article',
    tags: ['ingredients', 'flour', 'beginner'],
  },
];

// Get posts matching search terms or specialties
export function getMatchingPosts(
  searchTerms: string[],
  limit: number = 3
): BlogPost[] {
  if (searchTerms.length === 0) {
    return getRandomPosts(limit);
  }

  const normalizedTerms = searchTerms.map(t => t.toLowerCase());

  // Score each post by how many terms match
  const scored = BLOG_POSTS.map(post => {
    let score = 0;
    const postText = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();

    for (const term of normalizedTerms) {
      if (postText.includes(term)) {
        score += 1;
      }
      // Extra points for tag matches
      if (post.tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 2;
      }
    }

    return { post, score };
  });

  // Filter to posts with at least one match, sort by score
  const matching = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.post);

  // If not enough matches, fill with random posts
  if (matching.length < limit) {
    const remainingIds = new Set(matching.map(p => p.id));
    const additional = BLOG_POSTS
      .filter(p => !remainingIds.has(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, limit - matching.length);
    return [...matching, ...additional];
  }

  return matching;
}

// Get random posts (for when no search is active)
export function getRandomPosts(limit: number = 3): BlogPost[] {
  const shuffled = [...BLOG_POSTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// Get a single featured post (rotates based on time)
export function getFeaturedPost(): BlogPost {
  // Rotate every 30 minutes based on current time
  const rotationPeriod = 30 * 60 * 1000; // 30 minutes in ms
  const index = Math.floor(Date.now() / rotationPeriod) % BLOG_POSTS.length;
  return BLOG_POSTS[index];
}
