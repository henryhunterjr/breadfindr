import { Link } from 'react-router-dom';
import { Wheat, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function Privacy() {
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
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="text-yelp-100 text-sm">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="prose prose-stone max-w-none">
              <h2>Introduction</h2>
              <p>
                BreadFindr ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website and use our services.
              </p>

              <h2>Information We Collect</h2>
              <h3>Information You Provide</h3>
              <p>We may collect information you voluntarily provide, including:</p>
              <ul>
                <li>Name and email address when submitting a bakery or contact form</li>
                <li>Review content and ratings you submit</li>
                <li>Bakery information you submit for listing</li>
                <li>Newsletter subscription email addresses</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
                <li>Approximate geographic location (city/region level)</li>
              </ul>

              <h3>Location Information</h3>
              <p>
                With your permission, we may collect your precise location to show nearby bakeries.
                You can disable location services through your browser settings at any time.
              </p>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our service</li>
                <li>Display bakery listings and reviews</li>
                <li>Send newsletters (if subscribed)</li>
                <li>Respond to your inquiries</li>
                <li>Improve our website and user experience</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul>
                <li>Service providers who assist in operating our website</li>
                <li>Law enforcement when required by law</li>
                <li>Other parties with your consent</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement reasonable security measures to protect your information.
                However, no internet transmission is completely secure, and we cannot
                guarantee absolute security.
              </p>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
                <li>Disable location tracking</li>
              </ul>

              <h2>Cookies</h2>
              <p>
                We use cookies and similar technologies to improve your experience,
                analyze traffic, and remember your preferences. You can control cookies
                through your browser settings.
              </p>

              <h2>Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not
                responsible for the privacy practices of these external sites.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our service is not directed to children under 13. We do not knowingly
                collect information from children under 13.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of
                significant changes by posting the new policy on this page.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@breadfindr.com" className="text-yelp-500 hover:underline">
                  privacy@breadfindr.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
