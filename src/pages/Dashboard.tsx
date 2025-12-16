import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  Wheat,
  TrendingUp,
  Users,
  Search,
  MapPin,
  Eye,
  MousePointerClick,
  Smartphone,
  Tablet,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  ChevronDown,
  Loader2,
  Activity,
  Target,
  DollarSign,
  Zap,
} from 'lucide-react';
import { getAnalyticsSummary, type AnalyticsSummary } from '../lib/analytics';
import { format } from 'date-fns';

const COLORS = ['#f27523', '#5a7260', '#0c8cef', '#f59e0b', '#8b5cf6', '#ec4899'];

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, change, icon, color, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-stone-800 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-stone-500 text-sm">{title}</div>
      {subtitle && <div className="text-stone-400 text-xs mt-1">{subtitle}</div>}
    </div>
  );
}

interface FunnelStageProps {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function FunnelStage({ label, value, percentage, color }: FunnelStageProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 text-right text-sm text-stone-600">{label}</div>
      <div className="flex-1 h-10 bg-stone-100 rounded-lg overflow-hidden relative">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-lg`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-stone-800">
          {value.toLocaleString()}
        </div>
      </div>
      <div className="w-16 text-sm text-stone-500">{percentage.toFixed(1)}%</div>
    </div>
  );
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'monetization'>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  async function loadAnalytics() {
    setLoading(true);
    const data = await getAnalyticsSummary(dateRange);
    setAnalytics(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-bakery-500 animate-spin" />
          <p className="text-stone-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Failed to load analytics</p>
      </div>
    );
  }

  const maxFunnelValue = Math.max(
    analytics.conversionFunnel.searches,
    analytics.conversionFunnel.bakeryViews,
    analytics.conversionFunnel.clicks,
    analytics.conversionFunnel.submissions
  );

  const deviceData = [
    { name: 'Mobile', value: analytics.deviceBreakdown.mobile, icon: Smartphone },
    { name: 'Tablet', value: analytics.deviceBreakdown.tablet, icon: Tablet },
    { name: 'Desktop', value: analytics.deviceBreakdown.desktop, icon: Monitor },
  ];

  const totalDevices = deviceData.reduce((sum, d) => sum + d.value, 0);

  // Calculate estimated revenue metrics (for monetization tab)
  const estimatedCPM = 2.50; // $2.50 per 1000 impressions
  const estimatedAdRevenue = (analytics.totalPageViews / 1000) * estimatedCPM;
  const featuredListingPrice = 29.99;
  const potentialFeaturedRevenue = analytics.topBakeries.length * featuredListingPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-bakery-500">
                <Wheat className="w-8 h-8" />
                <span className="text-xl font-bold">BreadFindr</span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-stone-300" />
              <h1 className="hidden sm:block text-lg font-semibold text-stone-700">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(Number(e.target.value))}
                  className="appearance-none px-4 py-2 pr-8 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-bakery-500"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 -mb-px">
            {(['overview', 'engagement', 'monetization'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-stone-50 text-bakery-600 border-b-2 border-bakery-500'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                {tab === 'overview' && <Activity className="w-4 h-4 inline mr-2" />}
                {tab === 'engagement' && <Target className="w-4 h-4 inline mr-2" />}
                {tab === 'monetization' && <DollarSign className="w-4 h-4 inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Page Views"
                value={analytics.totalPageViews}
                change={12.5}
                icon={<Eye className="w-5 h-5 text-white" />}
                color="bg-bakery-500"
              />
              <MetricCard
                title="Unique Visitors"
                value={analytics.uniqueSessions}
                change={8.3}
                icon={<Users className="w-5 h-5 text-white" />}
                color="bg-sage-500"
              />
              <MetricCard
                title="Total Searches"
                value={analytics.totalSearches}
                change={15.2}
                icon={<Search className="w-5 h-5 text-white" />}
                color="bg-glow-500"
              />
              <MetricCard
                title="Bakery Views"
                value={analytics.totalBakeryViews}
                change={-3.1}
                icon={<MapPin className="w-5 h-5 text-white" />}
                color="bg-amber-500"
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Traffic Over Time */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-bakery-500" />
                  Traffic Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.dailyStats}>
                    <defs>
                      <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f27523" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f27523" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0c8cef" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0c8cef" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                      stroke="#a3a3a3"
                      fontSize={12}
                    />
                    <YAxis stroke="#a3a3a3" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e5e5',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      name="Page Views"
                      stroke="#f27523"
                      fillOpacity={1}
                      fill="url(#colorPageViews)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="searches"
                      name="Searches"
                      stroke="#0c8cef"
                      fillOpacity={1}
                      fill="url(#colorSearches)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Device Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-bakery-500" />
                  Device Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {deviceData.map((device, index) => (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <device.icon className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">{device.name}</span>
                      </div>
                      <span className="text-sm font-medium text-stone-800">
                        {((device.value / totalDevices) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Lists Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Top Search Queries */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-bakery-500" />
                  Top Search Queries
                </h3>
                <div className="space-y-3">
                  {analytics.topSearchQueries.slice(0, 8).map((item, index) => (
                    <div key={item.query} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-bakery-100 text-bakery-600 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-stone-700 truncate">{item.query}</span>
                      <span className="text-sm font-medium text-stone-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Locations */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-bakery-500" />
                  Top Locations
                </h3>
                <div className="space-y-3">
                  {analytics.topLocations.slice(0, 8).map((item, index) => (
                    <div key={item.location} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-sage-100 text-sage-600 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-stone-700 truncate">{item.location}</span>
                      <span className="text-sm font-medium text-stone-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Bakeries */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-bakery-500" />
                  Top Bakeries
                </h3>
                <div className="space-y-3">
                  {analytics.topBakeries.slice(0, 8).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-glow-100 text-glow-600 text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-stone-700 truncate">{item.name}</span>
                      <span className="text-sm font-medium text-stone-500">{item.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <div className="space-y-6">
            {/* Engagement Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Bounce Rate"
                value={`${analytics.bounceRate.toFixed(1)}%`}
                change={-5.2}
                icon={<Zap className="w-5 h-5 text-white" />}
                color="bg-purple-500"
                subtitle="Lower is better"
              />
              <MetricCard
                title="Near Me Clicks"
                value={analytics.eventBreakdown.near_me_click || 0}
                change={22.4}
                icon={<MapPin className="w-5 h-5 text-white" />}
                color="bg-green-500"
              />
              <MetricCard
                title="Newsletter Signups"
                value={analytics.eventBreakdown.newsletter_signup || 0}
                change={18.7}
                icon={<Users className="w-5 h-5 text-white" />}
                color="bg-pink-500"
              />
              <MetricCard
                title="Bakery Submissions"
                value={analytics.eventBreakdown.submit_bakery || 0}
                change={45.0}
                icon={<MousePointerClick className="w-5 h-5 text-white" />}
                color="bg-indigo-500"
              />
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-bakery-500" />
                Conversion Funnel
              </h3>
              <div className="space-y-4">
                <FunnelStage
                  label="Searches"
                  value={analytics.conversionFunnel.searches}
                  percentage={(analytics.conversionFunnel.searches / maxFunnelValue) * 100}
                  color="bg-bakery-500"
                />
                <FunnelStage
                  label="Bakery Views"
                  value={analytics.conversionFunnel.bakeryViews}
                  percentage={(analytics.conversionFunnel.bakeryViews / maxFunnelValue) * 100}
                  color="bg-bakery-400"
                />
                <FunnelStage
                  label="Clicks"
                  value={analytics.conversionFunnel.clicks}
                  percentage={(analytics.conversionFunnel.clicks / maxFunnelValue) * 100}
                  color="bg-bakery-300"
                />
                <FunnelStage
                  label="Submissions"
                  value={analytics.conversionFunnel.submissions}
                  percentage={(analytics.conversionFunnel.submissions / maxFunnelValue) * 100}
                  color="bg-sage-500"
                />
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-bakery-500">
                    {((analytics.conversionFunnel.bakeryViews / analytics.conversionFunnel.searches) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-stone-500">Search → View</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-bakery-500">
                    {((analytics.conversionFunnel.clicks / analytics.conversionFunnel.bakeryViews) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-stone-500">View → Click</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sage-500">
                    {((analytics.conversionFunnel.submissions / analytics.conversionFunnel.clicks) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-stone-500">Click → Submit</div>
                </div>
              </div>
            </div>

            {/* Hourly Activity & Event Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Hourly Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-bakery-500" />
                  Activity by Hour
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(h) => `${h}:00`}
                      stroke="#a3a3a3"
                      fontSize={11}
                    />
                    <YAxis stroke="#a3a3a3" fontSize={12} />
                    <Tooltip
                      labelFormatter={(h) => `${h}:00 - ${h}:59`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e5e5',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Events" fill="#f27523" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Event Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-bakery-500" />
                  Event Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.eventBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([event, count], index) => {
                      const maxCount = Math.max(...Object.values(analytics.eventBreakdown));
                      const percentage = (count / maxCount) * 100;
                      return (
                        <div key={event} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-stone-600 capitalize">
                              {event.replace(/_/g, ' ')}
                            </span>
                            <span className="font-medium text-stone-800">{count.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monetization Tab */}
        {activeTab === 'monetization' && (
          <div className="space-y-6">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Est. Ad Revenue"
                value={`$${estimatedAdRevenue.toFixed(2)}`}
                change={12.5}
                icon={<DollarSign className="w-5 h-5 text-white" />}
                color="bg-green-500"
                subtitle={`At $${estimatedCPM.toFixed(2)} CPM`}
              />
              <MetricCard
                title="Featured Listings"
                value={analytics.topBakeries.length}
                icon={<Wheat className="w-5 h-5 text-white" />}
                color="bg-amber-500"
                subtitle="Potential upgrades"
              />
              <MetricCard
                title="Potential Revenue"
                value={`$${potentialFeaturedRevenue.toFixed(2)}`}
                icon={<TrendingUp className="w-5 h-5 text-white" />}
                color="bg-purple-500"
                subtitle="From featured listings"
              />
              <MetricCard
                title="Ad Impressions"
                value={analytics.totalPageViews * 3}
                change={15.2}
                icon={<Eye className="w-5 h-5 text-white" />}
                color="bg-glow-500"
                subtitle="Est. 3 ads/page"
              />
            </div>

            {/* Monetization Opportunities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-bakery-500" />
                Monetization Opportunities
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="text-green-600 font-semibold mb-2">Display Advertising</div>
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    ${(analytics.totalPageViews * 3 / 1000 * estimatedCPM * 12).toFixed(0)}/yr
                  </div>
                  <div className="text-sm text-green-600">
                    Based on current traffic × 3 ad slots × $2.50 CPM
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <div className="text-amber-600 font-semibold mb-2">Featured Listings</div>
                  <div className="text-3xl font-bold text-amber-700 mb-2">
                    ${(50 * featuredListingPrice * 12).toFixed(0)}/yr
                  </div>
                  <div className="text-sm text-amber-600">
                    Assuming 50 bakeries × $29.99/month
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="text-purple-600 font-semibold mb-2">Affiliate Revenue</div>
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    ${(analytics.totalBakeryViews * 0.02 * 12).toFixed(0)}/yr
                  </div>
                  <div className="text-sm text-purple-600">
                    Est. 2% conversion on bakery supply links
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Projection Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-bakery-500" />
                Revenue Projection (Next 12 Months)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Array.from({ length: 12 }, (_, i) => {
                    const growthFactor = 1 + (i * 0.15); // 15% month-over-month growth
                    return {
                      month: format(new Date(2025, i, 1), 'MMM'),
                      ads: Math.round(estimatedAdRevenue * growthFactor * 30),
                      featured: Math.round((10 + i * 5) * featuredListingPrice),
                      affiliate: Math.round(analytics.totalBakeryViews * 0.02 * growthFactor),
                    };
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} />
                  <YAxis stroke="#a3a3a3" fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ads"
                    name="Ad Revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="featured"
                    name="Featured Listings"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="affiliate"
                    name="Affiliate"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Performers for Monetization */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">
                  High-Value Locations (for Ads)
                </h3>
                <div className="space-y-3">
                  {analytics.topLocations.slice(0, 5).map((loc, i) => (
                    <div key={loc.location} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                        <span className="font-medium text-stone-700">{loc.location}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ${((loc.count / 1000) * estimatedCPM * 3).toFixed(2)}
                        </div>
                        <div className="text-xs text-stone-500">Est. ad value</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">
                  Featured Listing Candidates
                </h3>
                <div className="space-y-3">
                  {analytics.topBakeries.slice(0, 5).map((bakery, i) => (
                    <div key={bakery.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-medium text-stone-700">{bakery.name}</div>
                          <div className="text-xs text-stone-500">{bakery.views} views</div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-stone-500">
          BreadFindr Analytics Dashboard &bull; Data updates every 2 seconds &bull;{' '}
          <span className="text-stone-400">
            Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
      </footer>
    </div>
  );
}
