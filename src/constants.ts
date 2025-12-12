import { BreadSource } from './types';

export const MOCK_BREAD_SOURCES: BreadSource[] = [
  {
    id: '1',
    name: 'Tartine Bakery',
    type: 'bakery',
    description: 'Iconic San Francisco bakery known for their country bread and morning buns.',
    specialties: ['Country Bread', 'Croissants', 'Morning Buns', 'Sourdough'],
    rating: 4.8,
    reviewCount: 2847,
    address: '600 Guerrero St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94110',
    phone: '(415) 487-2600',
    website: 'https://tartinebakery.com',
    instagram: '@tartinebakery',
    hours: 'Mon-Sun 7:30am-7pm',
    verified: true,
    featured: true
  },
  {
    id: '2',
    name: 'Ferry Plaza Farmers Market',
    type: 'farmers_market',
    description: 'Premier farmers market featuring multiple artisan bread vendors every Saturday.',
    specialties: ['Sourdough', 'Whole Grain', 'Focaccia', 'Baguettes'],
    rating: 4.7,
    reviewCount: 1523,
    address: '1 Ferry Building',
    city: 'San Francisco',
    state: 'CA',
    zip: '94111',
    website: 'https://cuesa.org/markets/ferry-plaza-farmers-market',
    hours: 'Sat 8am-2pm, Tue & Thu 10am-2pm',
    verified: true,
    featured: true
  },
  {
    id: '3',
    name: "Sarah's Sourdough",
    type: 'home_baker',
    description: 'Home baker specializing in long-fermented sourdough and seasonal specials.',
    specialties: ['Sourdough Boules', 'Cinnamon Raisin', 'Seeded Loaves'],
    rating: 4.9,
    reviewCount: 89,
    address: 'Mission District',
    city: 'San Francisco',
    state: 'CA',
    zip: '94110',
    instagram: '@sarahs_sourdough',
    hours: 'Order by Wed, pickup Sat',
    verified: true,
    featured: false
  },
  {
    id: '4',
    name: 'Josey Baker Bread',
    type: 'bakery',
    description: 'Whole grain focused bakery milling their own flour on-site.',
    specialties: ['Whole Wheat', 'Adventure Bread', 'Danish Rye'],
    rating: 4.6,
    reviewCount: 892,
    address: '1434 Haight St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94117',
    phone: '(415) 872-9770',
    website: 'https://joseybakerbread.com',
    instagram: '@joseybakerbread',
    hours: 'Wed-Sun 8am-3pm',
    verified: true,
    featured: false
  },
  {
    id: '5',
    name: 'Bread SRSLY',
    type: 'bakery',
    description: 'Gluten-free sourdough bakery with incredible texture and flavor.',
    specialties: ['GF Sourdough', 'GF Cinnamon Raisin', 'GF Seeded'],
    rating: 4.7,
    reviewCount: 456,
    address: '503 Divisadero St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94117',
    website: 'https://breadsrsly.com',
    instagram: '@breadsrsly',
    hours: 'Thu-Sun 9am-2pm',
    verified: true,
    featured: false
  },
  {
    id: '6',
    name: "Marcus's Micro Bakery",
    type: 'home_baker',
    description: 'Weekend baker focusing on heritage grains and natural leavening.',
    specialties: ['Einkorn Sourdough', 'Spelt Loaves', 'Focaccia'],
    rating: 4.8,
    reviewCount: 34,
    address: 'Noe Valley',
    city: 'San Francisco',
    state: 'CA',
    zip: '94114',
    instagram: '@marcus_bakes',
    hours: 'Pre-order only, Sat pickup',
    verified: false,
    featured: false
  }
];

export const TYPE_LABELS = {
  bakery: 'Bakery',
  farmers_market: 'Farmers Market',
  home_baker: 'Home Baker'
};

export const TYPE_COLORS = {
  bakery: 'bg-amber-100 text-amber-800',
  farmers_market: 'bg-green-100 text-green-800',
  home_baker: 'bg-purple-100 text-purple-800'
};
