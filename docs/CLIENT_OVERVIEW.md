# BreadFindr - Project Overview

**A Partnership Between:**
- **Tyler Cartner** (Wire Monkey) - Vision & Strategy
- **Henry Hunter** (Baking Great Bread at Home) - Development & Build

**Date:** December 2024
**Version:** 1.0

---

## Executive Summary

BreadFindr is a modern web application designed to help bread enthusiasts discover local artisan bakeries, farmers market bread vendors, and home bakers in their area. The platform combines curated bakery listings with intelligent auto-discovery powered by Google Places API, creating a comprehensive directory of bread sources that grows organically.

The application is built with scalability in mind, featuring a responsive design that works seamlessly on desktop and mobile devices, real-time location-based search, and an interactive map interface.

---

## Current Capabilities

### 1. Location-Based Bakery Discovery

| Feature | Description |
|---------|-------------|
| **Search by Location** | Users can enter a city, ZIP code, or address to find bakeries nearby |
| **"Near Me" Search** | One-click geolocation to instantly find bakeries around the user's current position |
| **Radius Control** | Adjustable search radius (5, 10, 25, 50, 100 miles) |
| **Distance Calculation** | Real-time distance display from user to each bakery |

### 2. Auto-Discovery via Google Places

The application automatically searches Google Places API when users explore new areas:

- **Automatic Population** - When a user searches a location, the app discovers bakeries in that area from Google
- **Chain Filtering** - Automatically excludes chain bakeries (Panera, Starbucks, etc.) to focus on local/artisan shops
- **Smart Caching** - 30-minute cache to minimize API costs and improve performance
- **Visual Distinction** - Discovered bakeries appear with blue styling to differentiate from verified listings
- **Save for Review** - Users can save discovered bakeries to the database for admin approval

### 3. Interactive Map View

- **Color-Coded Markers** - Different colors for bakeries (red), farmers markets (green), home bakers (purple), and discovered locations (blue)
- **Numbered Markers** - Markers correspond to list position for easy reference
- **Popup Details** - Click any marker to see bakery info, rating, and distance
- **Auto-Fit Bounds** - Map automatically adjusts to show all relevant bakeries plus user location
- **User Location Indicator** - Blue pulsing dot shows the user's current position

### 4. Bakery Listings & Details

Each bakery listing includes:
- Name and verification status
- Type classification (Bakery, Farmers Market, Home Baker)
- Star rating and review count
- Full address with distance from user
- Contact information (phone, website, Instagram)
- Operating hours
- Specialty bread types (Sourdough, Baguettes, Croissants, etc.)
- Photo gallery

### 5. User Reviews & Ratings

- **Submit Reviews** - Users can leave ratings (1-5 stars) and written reviews
- **Auto-Updated Ratings** - Bakery ratings automatically recalculate when new reviews are added
- **Review Display** - Reviews shown with reviewer name, rating, date, and comment

### 6. Bakery Submission System

A 5-step submission form allows users to add new bakeries:
1. Basic Info (name, type, description)
2. Location (address with auto-geocoding)
3. Contact (phone, website, social media)
4. Details (hours, specialties)
5. Review & Submit

Submissions are held for admin approval before appearing publicly.

### 7. Search & Filtering

| Filter | Options |
|--------|---------|
| **Text Search** | Search by name, specialty, description, or location |
| **Type Filter** | All, Bakeries, Farmers Markets, Home Bakers |
| **Sort Options** | Highest Rated, Nearest, Name A-Z |
| **Radius Filter** | 5, 10, 25, 50, 100 miles |

### 8. Responsive Design

- **Desktop** - Split-view layout with list on left, map on right
- **Mobile** - Full-screen map with draggable bottom sheet for listings
- **Tablet** - Adaptive layout based on screen size

---

## Technical Architecture

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast builds and hot module replacement
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side navigation
- **Leaflet** for interactive maps (free, open-source)

### Backend & Database
- **Supabase** (PostgreSQL) for data storage
- **Row-Level Security** for data protection
- **Automatic Triggers** for rating calculations
- **Real-time Capabilities** (available for future features)

### External APIs
- **Google Places API** - Bakery auto-discovery
- **Nominatim** (OpenStreetMap) - Free geocoding for address lookup

### Hosting
- Configured for **Vercel** deployment
- Static site with SPA routing
- CDN-delivered assets for fast global access

---

## Content Management

### Bakery Status Flags

| Flag | Purpose |
|------|---------|
| `approved` | Controls visibility - only approved bakeries appear to users |
| `verified` | Indicates bakery has been confirmed/vetted (green checkmark) |
| `featured` | Highlights bakery in search results |
| `source` | Tracks origin: manual, google_places, or user_submitted |

### Admin Workflow

1. **User Submissions** - Arrive with `approved: false`
2. **Discovered Bakeries** - Saved with `approved: false`, `source: google_places`
3. **Admin Review** - Query unapproved bakeries, verify info, set `approved: true`
4. **Feature Selection** - Set `featured: true` for highlighted listings

---

## What BreadFindr Does Well

1. **Frictionless Discovery** - Users get immediate results without needing a pre-populated database
2. **Quality Focus** - Chain bakery filtering ensures users find authentic artisan options
3. **Community Building** - User submissions and reviews create engagement
4. **Cost Efficiency** - Caching and smart API usage minimize operational costs
5. **Mobile-First** - Excellent experience on phones where users need it most
6. **Scalable Architecture** - Can grow from local to national without code changes

---

## Future Opportunities

### High-Value Enhancements

#### 1. **User Accounts & Favorites**
- Allow users to create accounts
- Save favorite bakeries
- Track visited locations
- Personalized recommendations

#### 2. **Admin Dashboard**
- Web interface for approving/rejecting submissions
- Bulk actions for bakery management
- Analytics on search patterns and popular locations
- User submission moderation tools

#### 3. **Bakery Owner Claims**
- Allow bakery owners to "claim" their listing
- Self-service updates to hours, photos, menu
- Response to reviews
- Premium placement options (potential revenue)

#### 4. **Advanced Search Features**
- Filter by specialty (only sourdough bakeries)
- Filter by features (gluten-free, vegan options)
- "Open Now" filter using hours data
- Price range indicators

#### 5. **Social Features**
- Share bakeries to social media
- "Bread Trail" - save a list of bakeries to visit
- Check-ins and badges
- Community bread photos

#### 6. **Notifications & Alerts**
- New bakery alerts for saved locations
- Push notifications for mobile
- Email digest of new bakeries in your area

### Medium-Value Enhancements

#### 7. **Enhanced Photos**
- Multiple photos per bakery
- User-submitted photos
- Photo moderation system

#### 8. **Events & Specials**
- Farmers market schedules
- Special bread availability (e.g., "sourdough Saturdays")
- Pop-up bakery announcements

#### 9. **Directions Integration**
- One-click directions to Apple/Google Maps
- Walking/driving time estimates
- Multi-stop route planning

#### 10. **Internationalization**
- Multi-language support
- International bakery categories
- Currency localization (for future e-commerce)

### Revenue Opportunities

#### 11. **Featured Listings (Paid)**
- Bakeries pay for premium placement
- Highlighted cards and map markers
- Top of search results

#### 12. **Affiliate/Partnership**
- Partner with bread-making supply companies
- Baking class referrals
- Recipe book recommendations

#### 13. **API Access**
- License bakery data to food apps
- Integration partners

---

## Cost Considerations

### Current Costs (Estimated)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Hosting | Free | Hobby tier covers most use cases |
| Supabase | Free | Up to 500MB, 2GB bandwidth |
| Google Places API | ~$17-32/1000 requests | With 30-min caching, ~$50-200/month at scale |
| Domain | ~$12/year | If using custom domain |

### Scaling Costs

As usage grows:
- **Supabase Pro**: $25/month (8GB storage, 50GB bandwidth)
- **Google Places**: Consider negotiated rates at volume
- **Vercel Pro**: $20/month (if needed for team features)

---

## Deliverables Summary

### What's Included

- Fully functional bakery discovery web application
- Mobile-responsive design
- Google Places integration for auto-discovery
- User review and rating system
- Bakery submission system
- Interactive map with location services
- Supabase database with schema
- Deployment configuration for Vercel

### What's Needed to Launch

1. **Supabase Project** - Create account and run schema
2. **Google Cloud Project** - API key with Places API enabled
3. **Domain** (optional) - For custom branding
4. **Initial Content** - Seed data or rely on auto-discovery

---

## Next Steps

1. **Review this document** and identify priority features from the opportunities list
2. **Set up production accounts** (Supabase, Google Cloud)
3. **Define launch geography** - Start with specific cities/regions?
4. **Plan admin workflow** - How will bakery approvals be handled?
5. **Discuss timeline** for Phase 2 features

---

*Document prepared by Henry Hunter - Baking Great Bread at Home*
*In partnership with Tyler Cartner - Wire Monkey*
