import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, ArrowLeft, ArrowRight, MapPin, Check, Loader2 } from 'lucide-react';
import { SPECIALTY_OPTIONS, US_STATES } from '../types';
import { submitBakery } from '../lib/supabase';
import { geocodeLocation } from '../lib/geocoding';
import Footer from '../components/Footer';

interface FormData {
  name: string;
  type: 'bakery' | 'farmers_market' | 'home_baker';
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  website: string;
  instagram: string;
  hours: string;
  specialties: string[];
  image: string;
}

const initialFormData: FormData = {
  name: '',
  type: 'bakery',
  description: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  website: '',
  instagram: '',
  hours: '',
  specialties: [],
  image: ''
};

export default function Submit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [verifyingLocation, setVerifyingLocation] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 5;

  const handleVerifyLocation = async () => {
    if (!formData.city || !formData.state) return;

    setVerifyingLocation(true);
    setError('');

    const query = formData.address
      ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`
      : `${formData.city}, ${formData.state}`;

    const location = await geocodeLocation(query);

    if (location) {
      setFormData({ ...formData, latitude: location.lat, longitude: location.lng });
      setLocationVerified(true);
    } else {
      setError('Could not verify location. Please check the address.');
    }

    setVerifyingLocation(false);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    const result = await submitBakery({
      name: formData.name,
      type: formData.type,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      latitude: formData.latitude,
      longitude: formData.longitude,
      phone: formData.phone || undefined,
      website: formData.website || undefined,
      instagram: formData.instagram || undefined,
      hours: formData.hours || undefined,
      image: formData.image || undefined,
      specialties: formData.specialties
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to submit. Please try again.');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.type;
      case 2:
        return formData.city.trim() && formData.state;
      case 3:
        return true; // Contact info is optional
      case 4:
        return true; // Details are optional
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Thank You!</h2>
          <p className="text-stone-600 mb-6">
            Your bakery has been submitted for review. It will appear on BreadFindr once approved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-bakery-500 hover:bg-bakery-600 text-white font-semibold rounded-lg transition-colors"
          >
            Return to BreadFindr
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-bakery-500 to-bakery-600 text-white py-6">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-bakery-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BreadFindr
          </button>
          <div className="flex items-center gap-3">
            <Wheat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Add Your Bakery</h1>
              <p className="text-bakery-100 text-sm">Join the BreadFindr community</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                s === step
                  ? 'bg-bakery-500 text-white'
                  : s < step
                  ? 'bg-yelp-200 text-bakery-600'
                  : 'bg-stone-200 text-stone-500'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-stone-200 rounded-full">
          <div
            className="h-full bg-bakery-500 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-500 mt-1">
          <span>Basic Info</span>
          <span>Location</span>
          <span>Contact</span>
          <span>Details</span>
          <span>Review</span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Bakery Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="e.g., Artisan Bread Co."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'bakery', label: 'Bakery' },
                    { value: 'farmers_market', label: 'Farmers Market' },
                    { value: 'home_baker', label: 'Home Baker' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: option.value as FormData['type'] })}
                      className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                        formData.type === option.value
                          ? 'border-bakery-500 bg-bakery-50 text-bakery-600'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500 resize-none"
                  rows={3}
                  placeholder="Tell us about your bakery..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Location</h2>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    setLocationVerified(false);
                  }}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      setLocationVerified(false);
                    }}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      setFormData({ ...formData, state: e.target.value });
                      setLocationVerified(false);
                    }}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  >
                    <option value="">Select state</option>
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => {
                    setFormData({ ...formData, zip: e.target.value });
                    setLocationVerified(false);
                  }}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="94110"
                />
              </div>
              <button
                type="button"
                onClick={handleVerifyLocation}
                disabled={!formData.city || !formData.state || verifyingLocation}
                className="flex items-center justify-center gap-2 w-full py-2 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors"
              >
                {verifyingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : locationVerified ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                {locationVerified ? 'Location Verified!' : 'Verify Location'}
              </button>
              {locationVerified && formData.latitude && formData.longitude && (
                <p className="text-sm text-green-600 text-center">
                  Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Contact Information</h2>
              <p className="text-sm text-stone-500 mb-4">All fields are optional</p>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="(415) 555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="https://yourbakery.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="@yourbakery"
                />
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Details</h2>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Hours of Operation
                </label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="e.g., Mon-Sat 7am-3pm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Specialties
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_OPTIONS.map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.specialties.includes(specialty)
                          ? 'bg-bakery-500 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bakery-500"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Paste a link to a photo of your bakery or bread
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Review Your Submission</h2>
              <div className="bg-stone-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm text-stone-500">Name:</span>
                  <p className="font-medium text-stone-800">{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm text-stone-500">Type:</span>
                  <p className="font-medium text-stone-800 capitalize">{formData.type.replace('_', ' ')}</p>
                </div>
                {formData.description && (
                  <div>
                    <span className="text-sm text-stone-500">Description:</span>
                    <p className="text-stone-800">{formData.description}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-stone-500">Location:</span>
                  <p className="text-stone-800">
                    {formData.address && `${formData.address}, `}
                    {formData.city}, {formData.state} {formData.zip}
                  </p>
                </div>
                {formData.phone && (
                  <div>
                    <span className="text-sm text-stone-500">Phone:</span>
                    <p className="text-stone-800">{formData.phone}</p>
                  </div>
                )}
                {formData.website && (
                  <div>
                    <span className="text-sm text-stone-500">Website:</span>
                    <p className="text-stone-800">{formData.website}</p>
                  </div>
                )}
                {formData.instagram && (
                  <div>
                    <span className="text-sm text-stone-500">Instagram:</span>
                    <p className="text-stone-800">{formData.instagram}</p>
                  </div>
                )}
                {formData.hours && (
                  <div>
                    <span className="text-sm text-stone-500">Hours:</span>
                    <p className="text-stone-800">{formData.hours}</p>
                  </div>
                )}
                {formData.specialties.length > 0 && (
                  <div>
                    <span className="text-sm text-stone-500">Specialties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.specialties.map((s) => (
                        <span key={s} className="bg-bakery-100 text-bakery-600 px-2 py-0.5 rounded text-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2 bg-bakery-500 hover:bg-bakery-600 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-stone-400 text-white font-medium rounded-lg transition-colors"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Submit Bakery
              </button>
            )}
          </div>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
