// Analytics tracking for BreadFindr
import { supabase, isSupabaseConfigured } from './supabase';

export type AnalyticsEvent =
  | 'page_view'
  | 'search'
  | 'bakery_view'
  | 'bakery_click'
  | 'filter_change'
  | 'location_search'
  | 'near_me_click'
  | 'submit_bakery'
  | 'newsletter_signup'
  | 'external_link_click'
  | 'map_interaction'
  | 'featured_bakery_click'
  | 'blog_suggestion_click';

export interface AnalyticsData {
  event: AnalyticsEvent;
  page?: string;
  bakery_id?: string;
  bakery_name?: string;
  search_query?: string;
  search_location?: string;
  filter_type?: string;
  filter_value?: string;
  link_url?: string;
  metadata?: Record<string, unknown>;
}

interface StoredEvent extends AnalyticsData {
  id?: string;
  created_at: string;
  session_id: string;
  user_agent: string;
  referrer: string;
  screen_width: number;
  screen_height: number;
}

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('bf_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('bf_session_id', sessionId);
  }
  return sessionId;
}

// In-memory queue for batching events
const eventQueue: StoredEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

// Flush events to Supabase
async function flushEvents() {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue.length = 0;

  if (!isSupabaseConfigured()) {
    // Store locally for demo mode
    const stored = JSON.parse(localStorage.getItem('bf_analytics') || '[]');
    localStorage.setItem('bf_analytics', JSON.stringify([...stored, ...eventsToSend]));
    return;
  }

  try {
    if (supabase) {
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventsToSend);

      if (error) {
        console.error('Failed to store analytics:', error);
        // Re-queue failed events
        eventQueue.push(...eventsToSend);
      }
    }
  } catch (err) {
    console.error('Analytics error:', err);
  }
}

// Track an analytics event
export function trackEvent(data: AnalyticsData) {
  const event: StoredEvent = {
    ...data,
    created_at: new Date().toISOString(),
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
  };

  eventQueue.push(event);

  // Debounce flush
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushEvents, 2000);
}

// Track page view
export function trackPageView(page: string) {
  trackEvent({
    event: 'page_view',
    page,
  });
}

// Track search
export function trackSearch(query: string, location: string) {
  trackEvent({
    event: 'search',
    search_query: query,
    search_location: location,
  });
}

// Track bakery view
export function trackBakeryView(bakeryId: string, bakeryName: string) {
  trackEvent({
    event: 'bakery_view',
    bakery_id: bakeryId,
    bakery_name: bakeryName,
  });
}

// Track bakery click
export function trackBakeryClick(bakeryId: string, bakeryName: string, source: string) {
  trackEvent({
    event: 'bakery_click',
    bakery_id: bakeryId,
    bakery_name: bakeryName,
    metadata: { source },
  });
}

// Get analytics summary (for dashboard)
export async function getAnalyticsSummary(days: number = 30): Promise<AnalyticsSummary | null> {
  if (!isSupabaseConfigured() || !supabase) {
    // Return demo data from localStorage
    return getDemoAnalytics();
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    return processAnalyticsData(data || []);
  } catch (err) {
    console.error('Failed to fetch analytics:', err);
    return getDemoAnalytics();
  }
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  totalSearches: number;
  totalBakeryViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  topSearchQueries: Array<{ query: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  topBakeries: Array<{ id: string; name: string; views: number }>;
  dailyStats: Array<{ date: string; pageViews: number; searches: number; bakeryViews: number }>;
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  eventBreakdown: Record<string, number>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  conversionFunnel: { searches: number; bakeryViews: number; clicks: number; submissions: number };
}

function processAnalyticsData(events: StoredEvent[]): AnalyticsSummary {
  const sessions = new Set(events.map(e => e.session_id));
  const pageViews = events.filter(e => e.event === 'page_view');
  const searches = events.filter(e => e.event === 'search');
  const bakeryViews = events.filter(e => e.event === 'bakery_view');
  const submissions = events.filter(e => e.event === 'submit_bakery');

  // Top search queries
  const queryCount: Record<string, number> = {};
  searches.forEach(s => {
    if (s.search_query) {
      queryCount[s.search_query] = (queryCount[s.search_query] || 0) + 1;
    }
  });
  const topSearchQueries = Object.entries(queryCount)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top locations
  const locationCount: Record<string, number> = {};
  searches.forEach(s => {
    if (s.search_location) {
      locationCount[s.search_location] = (locationCount[s.search_location] || 0) + 1;
    }
  });
  const topLocations = Object.entries(locationCount)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top bakeries
  const bakeryCount: Record<string, { name: string; views: number }> = {};
  bakeryViews.forEach(b => {
    if (b.bakery_id) {
      if (!bakeryCount[b.bakery_id]) {
        bakeryCount[b.bakery_id] = { name: b.bakery_name || 'Unknown', views: 0 };
      }
      bakeryCount[b.bakery_id].views++;
    }
  });
  const topBakeries = Object.entries(bakeryCount)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Daily stats
  const dailyMap: Record<string, { pageViews: number; searches: number; bakeryViews: number }> = {};
  events.forEach(e => {
    const date = e.created_at.split('T')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { pageViews: 0, searches: 0, bakeryViews: 0 };
    }
    if (e.event === 'page_view') dailyMap[date].pageViews++;
    if (e.event === 'search') dailyMap[date].searches++;
    if (e.event === 'bakery_view') dailyMap[date].bakeryViews++;
  });
  const dailyStats = Object.entries(dailyMap)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Device breakdown
  const deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
  events.forEach(e => {
    if (e.screen_width < 768) deviceBreakdown.mobile++;
    else if (e.screen_width < 1024) deviceBreakdown.tablet++;
    else deviceBreakdown.desktop++;
  });

  // Event breakdown
  const eventBreakdown: Record<string, number> = {};
  events.forEach(e => {
    eventBreakdown[e.event] = (eventBreakdown[e.event] || 0) + 1;
  });

  // Hourly activity
  const hourlyMap: Record<number, number> = {};
  events.forEach(e => {
    const hour = new Date(e.created_at).getHours();
    hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
  });
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourlyMap[hour] || 0,
  }));

  // Conversion funnel
  const conversionFunnel = {
    searches: searches.length,
    bakeryViews: bakeryViews.length,
    clicks: events.filter(e => e.event === 'bakery_click').length,
    submissions: submissions.length,
  };

  // Bounce rate (sessions with only 1 page view)
  const sessionPageViews: Record<string, number> = {};
  pageViews.forEach(e => {
    sessionPageViews[e.session_id] = (sessionPageViews[e.session_id] || 0) + 1;
  });
  const bouncedSessions = Object.values(sessionPageViews).filter(v => v === 1).length;
  const bounceRate = sessions.size > 0 ? (bouncedSessions / sessions.size) * 100 : 0;

  return {
    totalPageViews: pageViews.length,
    uniqueSessions: sessions.size,
    totalSearches: searches.length,
    totalBakeryViews: bakeryViews.length,
    avgSessionDuration: 0, // Would need session start/end tracking
    bounceRate,
    topSearchQueries,
    topLocations,
    topBakeries,
    dailyStats,
    deviceBreakdown,
    eventBreakdown,
    hourlyActivity,
    conversionFunnel,
  };
}

// Demo analytics data for when Supabase isn't configured
function getDemoAnalytics(): AnalyticsSummary {
  const today = new Date();
  const dailyStats = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    const baseViews = 50 + Math.floor(Math.random() * 100);
    return {
      date: date.toISOString().split('T')[0],
      pageViews: baseViews + Math.floor(Math.random() * 50),
      searches: Math.floor(baseViews * 0.6) + Math.floor(Math.random() * 20),
      bakeryViews: Math.floor(baseViews * 0.3) + Math.floor(Math.random() * 15),
    };
  });

  return {
    totalPageViews: 4523,
    uniqueSessions: 1847,
    totalSearches: 2156,
    totalBakeryViews: 892,
    avgSessionDuration: 245,
    bounceRate: 42.3,
    topSearchQueries: [
      { query: 'sourdough', count: 342 },
      { query: 'bakery near me', count: 287 },
      { query: 'artisan bread', count: 198 },
      { query: 'farmers market', count: 156 },
      { query: 'french bread', count: 134 },
      { query: 'gluten free', count: 98 },
      { query: 'whole wheat', count: 87 },
      { query: 'rye bread', count: 76 },
    ],
    topLocations: [
      { location: 'New York, NY', count: 234 },
      { location: 'Los Angeles, CA', count: 198 },
      { location: 'Chicago, IL', count: 156 },
      { location: 'Austin, TX', count: 134 },
      { location: 'Portland, OR', count: 123 },
      { location: 'Seattle, WA', count: 112 },
      { location: 'Denver, CO', count: 98 },
      { location: 'San Francisco, CA', count: 87 },
    ],
    topBakeries: [
      { id: '1', name: 'Tartine Bakery', views: 156 },
      { id: '2', name: 'Sullivan Street Bakery', views: 134 },
      { id: '3', name: 'Amy\'s Bread', views: 112 },
      { id: '4', name: 'Bien Cuit', views: 98 },
      { id: '5', name: 'Acme Bread Company', views: 87 },
    ],
    dailyStats,
    deviceBreakdown: { mobile: 2345, tablet: 456, desktop: 1722 },
    eventBreakdown: {
      page_view: 4523,
      search: 2156,
      bakery_view: 892,
      bakery_click: 567,
      near_me_click: 345,
      filter_change: 234,
      newsletter_signup: 89,
      submit_bakery: 23,
    },
    hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(50 + Math.sin((hour - 6) * Math.PI / 12) * 100 + Math.random() * 30),
    })),
    conversionFunnel: {
      searches: 2156,
      bakeryViews: 892,
      clicks: 567,
      submissions: 23,
    },
  };
}

// Flush any remaining events before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushEvents);
}
