import { Star, MapPin, CheckCircle, Globe } from 'lucide-react';
import type { Bakery } from '../types';
import { TYPE_LABELS, TYPE_COLORS } from '../constants';

interface BakeryCardProps {
  bakery: Bakery;
  onClick: () => void;
  featured?: boolean;
  listNumber?: number;
}

export default function BakeryCard({ bakery, onClick, featured, listNumber }: BakeryCardProps) {
  const typeColor = bakery.type === 'bakery' ? 'bg-yelp-500' :
                    bakery.type === 'farmers_market' ? 'bg-green-600' : 'bg-purple-600';

  const isDiscovered = bakery.source === 'google_places';

  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border flex gap-3 ${
        featured ? 'border-yelp-300 ring-1 ring-yelp-200' :
        isDiscovered ? 'border-blue-200 bg-blue-50/30' : 'border-stone-200'
      }`}
    >
      {/* Number Badge */}
      {listNumber !== undefined && (
        <div className={`flex-shrink-0 w-7 h-7 ${isDiscovered ? 'bg-blue-500' : typeColor} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
          {listNumber}
        </div>
      )}

      {/* Image */}
      {bakery.image && (
        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-stone-100">
          <img
            src={bakery.image}
            alt={bakery.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-stone-800 text-sm flex items-center gap-1.5 truncate">
              {bakery.name}
              {bakery.verified && (
                <span title="Verified">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                </span>
              )}
              {isDiscovered && (
                <span title="Discovered from Google">
                  <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`inline-block text-xs px-1.5 py-0.5 rounded ${TYPE_COLORS[bakery.type]}`}>
                {TYPE_LABELS[bakery.type]}
              </span>
              {isDiscovered && (
                <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  Discovered
                </span>
              )}
              {bakery.rating > 0 && (
                <div className="flex items-center gap-0.5 text-amber-600 text-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{bakery.rating.toFixed(1)}</span>
                  <span className="text-stone-400">({bakery.reviewCount})</span>
                </div>
              )}
            </div>
          </div>
          {bakery.distance !== undefined && (
            <span className="text-yelp-500 font-semibold text-sm flex-shrink-0">
              {bakery.distance.toFixed(1)} mi
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <MapPin className="w-3 h-3" />
            <span>{bakery.city}, {bakery.state}</span>
          </div>
          <div className="flex gap-1">
            {bakery.specialties.slice(0, 2).map(specialty => (
              <span
                key={specialty}
                className="text-xs bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
