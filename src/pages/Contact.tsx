import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wheat, ArrowLeft, Mail, Send, Loader2, Check, MessageSquare, HelpCircle, Flag } from 'lucide-react';
import Footer from '../components/Footer';

type ContactReason = 'general' | 'bakery_issue' | 'feedback' | 'partnership';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    reason: 'general' as ContactReason,
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitting(false);
    setSubmitted(true);
  };

  const reasons = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'bakery_issue', label: 'Report a Bakery Issue', icon: Flag },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: HelpCircle },
    { value: 'partnership', label: 'Partnership Opportunity', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-yelp-500 to-yelp-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-yelp-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BreadFindr
          </Link>
          <div className="flex items-center gap-3">
            <Wheat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Contact Us</h1>
              <p className="text-yelp-100 text-sm">We'd love to hear from you</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {submitted ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">Message Sent!</h2>
              <p className="text-stone-600 mb-6">
                Thanks for reaching out. We'll get back to you as soon as possible.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yelp-500 hover:bg-yelp-600 text-white font-medium rounded-lg transition-colors"
              >
                Return to BreadFindr
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-800 mb-4">Get in Touch</h2>
                <p className="text-stone-600">
                  Have a question, suggestion, or want to report an issue? Fill out the form below
                  and we'll get back to you.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {reasons.map((reason) => (
                        <button
                          key={reason.value}
                          type="button"
                          onClick={() => setForm({ ...form, reason: reason.value as ContactReason })}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors text-left ${
                            form.reason === reason.value
                              ? 'border-yelp-500 bg-yelp-50 text-yelp-600'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <reason.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{reason.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-500 resize-none"
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting || !form.name || !form.email || !form.message}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-yelp-500 hover:bg-yelp-600 disabled:bg-stone-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Additional Contact Info */}
              <div className="mt-8 text-center">
                <p className="text-stone-600 mb-2">You can also reach us directly at:</p>
                <a
                  href="mailto:hello@breadfindr.com"
                  className="text-yelp-500 hover:underline font-medium"
                >
                  hello@breadfindr.com
                </a>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
