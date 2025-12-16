import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Phone, ExternalLink, Instagram, CheckCircle, X, Send, Loader2, ChevronLeft, Globe, Database } from 'lucide-react';
import type { Bakery, Review } from '../types';
import { TYPE_LABELS, TYPE_COLORS } from '../constants';
import { fetchReviews, submitReview, saveDiscoveredBakery, isSupabaseConfigured } from '../lib/supabase';

interface BakeryModalProps {
  bakery: Bakery;
  onClose: () => void;
}

export default function BakeryModal({ bakery, onClose }: BakeryModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isDiscovered = bakery.source === 'google_places';

  useEffect(() => {
    // Trigger animation on mount
    requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  useEffect(() => {
    async function loadReviews() {
      setLoadingReviews(true);
      const data = await fetchReviews(bakery.id);
      setReviews(data);
      setLoadingReviews(false);
    }
    loadReviews();
  }, [bakery.id]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim()) return;

    setSubmitting(true);
    const result = await submitReview({
      bakeryId: bakery.id,
      reviewerName: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment || undefined
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      setShowReviewForm(false);
      const data = await fetchReviews(bakery.id);
      setReviews(data);
      setReviewForm({ name: '', rating: 5, comment: '' });
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  const handleSaveBakery = async () => {
    setSaving(true);
    setSaveError(null);

    const result = await saveDiscoveredBakery(bakery);

    setSaving(false);

    if (result.success) {
      setSaveSuccess(true);
    } else {
      setSaveError(result.error || 'Failed to save');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Slide-over Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] lg:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-stone-200 bg-white">
            <button
              onClick={handleClose}
              className="p-2 -ml-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-stone-800 truncate flex items-center gap-1.5">
                {bakery.name}
                {isDiscovered && <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs ${TYPE_COLORS[bakery.type]}`}>
                  {TYPE_LABELS[bakery.type]}
                </span>
                {isDiscovered && (
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                    Discovered
                  </span>
                )}
                {bakery.rating > 0 && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{bakery.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Image */}
            {bakery.image && (
              <div className="w-full h-48 bg-stone-100">
                <img
                  src={bakery.image}
                  alt={bakery.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Save to Database Banner for Discovered Bakeries */}
            {isDiscovered && isSupabaseConfigured() && (
              <div className="mx-5 mt-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 text-sm">Auto-discovered bakery</h4>
                    <p className="text-blue-600 text-xs mt-0.5">
                      This bakery was found via Google Places. Save it to our database for admin review.
                    </p>
                    {saveSuccess ? (
                      <div className="mt-2 flex items-center gap-2 text-green-700 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Saved! Pending admin approval.
                      </div>
                    ) : saveError ? (
                      <div className="mt-2 text-red-600 text-sm">{saveError}</div>
                    ) : (
                      <button
                        onClick={handleSaveBakery}
                        disabled={saving}
                        className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Database className="w-4 h-4" />
                        )}
                        Save to Database
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-5">
              {/* Name & Verified Badge */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                  {bakery.name}
                  {bakery.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </h2>
              </div>

              {/* Rating & Distance */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-lg">{bakery.rating}</span>
                  <span className="text-stone-500 text-sm">({bakery.reviewCount})</span>
                </div>
                {bakery.distance !== undefined && (
                  <span className="text-amber-600 font-medium">{bakery.distance.toFixed(1)} mi</span>
                )}
              </div>

              <p className="text-stone-600 mb-5">{bakery.description}</p>

              {/* Details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-stone-800">{bakery.address}</p>
                    <p className="text-stone-600 text-sm">{bakery.city}, {bakery.state} {bakery.zip}</p>
                  </div>
                </div>

                {bakery.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-stone-400 mt-0.5 flex-shrink-0" />
                    <p className="text-stone-600">{bakery.hours}</p>
                  </div>
                )}

                {bakery.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-stone-400 flex-shrink-0" />
                    <a href={`tel:${bakery.phone}`} className="text-yelp-500 hover:underline">
                      {bakery.phone}
                    </a>
                  </div>
                )}

                {bakery.website && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-stone-400 flex-shrink-0" />
                    <a
                      href={bakery.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yelp-500 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {bakery.instagram && (
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-stone-400 flex-shrink-0" />
                    <a
                      href={`https://instagram.com/${bakery.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yelp-500 hover:underline"
                    >
                      {bakery.instagram}
                    </a>
                  </div>
                )}
              </div>

              {/* Specialties */}
              <div className="mb-5">
                <h3 className="font-semibold text-stone-800 mb-2 text-sm">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {bakery.specialties.map(specialty => (
                    <span
                      key={specialty}
                      className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-stone-200 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-stone-800">Reviews</h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-sm text-yelp-500 hover:text-yelp-600 font-medium"
                  >
                    Write a Review
                  </button>
                </div>

                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                    Thank you for your review!
                  </div>
                )}

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-4 p-4 bg-stone-50 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-500 text-sm"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewForm.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-stone-700 mb-1">Comment (optional)</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-500 resize-none text-sm"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || !reviewForm.name.trim()}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-yelp-500 hover:bg-yelp-600 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Submit Review
                    </button>
                  </form>
                )}

                {loadingReviews ? (
                  <div className="text-center py-4 text-stone-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-stone-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-stone-800 text-sm">{review.reviewerName}</span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-stone-600">{review.comment}</p>
                        )}
                        <p className="text-xs text-stone-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-500 text-center py-4">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-stone-200 bg-white">
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
