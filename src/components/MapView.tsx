import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Bakery, UserLocation } from '../types';
import { TYPE_LABELS } from '../constants';
import { Star, MapPin } from 'lucide-react';

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const markerColors: Record<string, string> = {
  bakery: '#FF1A1A',
  farmers_market: '#16a34a',
  home_baker: '#9333ea',
  discovered: '#3b82f6', // Blue for discovered bakeries
};

// Featured founder locations
const FOUNDER_LOCATIONS = [
  {
    id: 'founder-tyler',
    name: 'Tyler Cartner',
    title: 'Wire Monkey',
    description: 'Craftsman & Co-Founder',
    lat: 41.6032,  // Connecticut (roughly center of state)
    lng: -73.0877,
    color: '#d97706', // Amber/orange
  },
  {
    id: 'founder-henry',
    name: 'Henry Hunter',
    title: 'Baking Great Bread',
    description: 'Educator & Co-Founder',
    lat: 32.7765,  // Charleston, SC
    lng: -79.9311,
    color: '#d97706', // Amber/orange
  },
];

interface MapViewProps {
  bakeries: Bakery[];
  userLocation: UserLocation | null;
  onSelectBakery: (bakery: Bakery) => void;
  onMarkerClick?: (bakery: Bakery) => void;
  highlightedBakeryId?: string | null;
  bakeryIndexMap?: Map<string, number>;
}

// Component to auto-fit bounds
function MapBounds({ bakeries, userLocation }: { bakeries: Bakery[]; userLocation: UserLocation | null }) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [];

    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    bakeries.forEach(b => {
      if (b.latitude && b.longitude) {
        points.push([b.latitude, b.longitude]);
      }
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else {
      map.setView([39.8283, -98.5795], 4);
    }
  }, [bakeries, userLocation, map]);

  return null;
}

// Create a numbered icon using L.divIcon
function createNumberedIcon(number: number, color: string, highlighted: boolean = false): L.DivIcon {
  const size = highlighted ? 36 : 28;
  const fontSize = highlighted ? 14 : 12;

  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${highlighted ? '3px solid #fbbf24' : '2px solid white'};
      box-shadow: ${highlighted ? '0 0 12px rgba(251, 191, 36, 0.8)' : '0 2px 6px rgba(0,0,0,0.3)'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: ${fontSize}px;
      font-family: system-ui, sans-serif;
    ">${number}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// Create user location icon
function createUserIcon(): L.DivIcon {
  return L.divIcon({
    className: 'user-marker',
    html: `<div style="
      background-color: #3b82f6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2), 0 0 12px rgba(59, 130, 246, 0.6);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

// Create founder location icon with home/star symbol
function createFounderIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'founder-marker',
    html: `<div style="
      background: linear-gradient(135deg, ${color} 0%, #92400e 100%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 4px rgba(217, 119, 6, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

export default function MapView({
  bakeries,
  userLocation,
  onSelectBakery,
  onMarkerClick,
  highlightedBakeryId,
  bakeryIndexMap
}: MapViewProps) {
  const mappableBakeries = useMemo(() =>
    bakeries.filter(b => b.latitude && b.longitude),
    [bakeries]
  );

  const initialCenter: [number, number] = useMemo(() => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    if (mappableBakeries.length > 0) {
      const avgLat = mappableBakeries.reduce((sum, b) => sum + (b.latitude || 0), 0) / mappableBakeries.length;
      const avgLng = mappableBakeries.reduce((sum, b) => sum + (b.longitude || 0), 0) / mappableBakeries.length;
      return [avgLat, avgLng];
    }
    return [39.8283, -98.5795];
  }, [userLocation, mappableBakeries]);

  // Pre-create icons
  const userIcon = useMemo(() => createUserIcon(), []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={initialCenter}
        zoom={10}
        className="h-full w-full"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds bakeries={mappableBakeries} userLocation={userLocation} />

        {/* Founder location markers */}
        {FOUNDER_LOCATIONS.map((founder) => (
          <Marker
            key={founder.id}
            position={[founder.lat, founder.lng]}
            icon={createFounderIcon(founder.color)}
            zIndexOffset={100}
          >
            <Popup>
              <div className="min-w-[160px] py-1 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 className="font-semibold text-stone-800">{founder.name}</h3>
                <p className="text-amber-600 text-sm font-medium">{founder.title}</p>
                <p className="text-stone-500 text-xs mt-1">{founder.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="text-center py-1">
                <span className="font-medium text-stone-800">Your Location</span>
                {userLocation.displayName && (
                  <p className="text-xs text-stone-500 mt-0.5">{userLocation.displayName}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Bakery markers */}
        {mappableBakeries.map((bakery) => {
          const isHighlighted = highlightedBakeryId === bakery.id;
          const isDiscovered = bakery.source === 'google_places';
          const listNumber = (bakeryIndexMap?.get(bakery.id) ?? 0) + 1;
          const markerColor = isDiscovered ? markerColors.discovered : (markerColors[bakery.type] || '#d97706');
          const icon = createNumberedIcon(listNumber, markerColor, isHighlighted);

          return (
            <Marker
              key={bakery.id}
              position={[bakery.latitude!, bakery.longitude!]}
              icon={icon}
              zIndexOffset={isHighlighted ? 500 : 0}
              eventHandlers={{
                click: () => onMarkerClick?.(bakery),
              }}
            >
              <Popup>
                <div className="min-w-[180px] py-1">
                  <h3 className="font-semibold text-stone-800">{bakery.name}</h3>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                      bakery.type === 'bakery' ? 'bg-amber-100 text-amber-800' :
                      bakery.type === 'farmers_market' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {TYPE_LABELS[bakery.type]}
                    </span>
                    {isDiscovered && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Discovered
                      </span>
                    )}
                  </div>

                  {bakery.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-amber-600 text-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{bakery.rating.toFixed(1)}</span>
                      <span className="text-stone-400">({bakery.reviewCount})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-1 text-xs text-stone-500">
                    <MapPin className="w-3 h-3" />
                    <span>{bakery.city}, {bakery.state}</span>
                    {bakery.distance !== undefined && (
                      <span className="text-amber-600 ml-1">({bakery.distance.toFixed(1)} mi)</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBakery(bakery);
                    }}
                    className="mt-2 w-full px-3 py-1.5 bg-bakery-500 hover:bg-bakery-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md z-[1000]">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-bakery-500"></div>
            <span>Storefront</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Market</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span>Cottage</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Discovered</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 24 24" fill="white">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <span>Founder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
