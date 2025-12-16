import { Link } from 'react-router-dom';
import { Wheat, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-bakery-500 to-bakery-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-bakery-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BreadFindr
          </Link>
          <div className="flex items-center gap-3">
            <Wheat className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Terms of Service</h1>
              <p className="text-bakery-100 text-sm">Last updated: January 2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="prose prose-stone max-w-none">
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using BreadFindr, you agree to be bound by these Terms of Service.
                If you disagree with any part of these terms, you may not access our service.
              </p>

              <h2>Description of Service</h2>
              <p>
                BreadFindr is a community-driven directory that helps users discover artisan
                bakeries, farmers markets with bread vendors, and home bakers. Our service
                includes bakery listings, reviews, location-based search, and related features.
              </p>

              <h2>User Accounts</h2>
              <p>
                Some features may require you to provide information. You are responsible for:
              </p>
              <ul>
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of any account credentials</li>
                <li>All activities that occur under your account</li>
              </ul>

              <h2>User Content</h2>
              <h3>Reviews and Submissions</h3>
              <p>By submitting content (reviews, bakery listings, etc.), you:</p>
              <ul>
                <li>Grant us a non-exclusive, worldwide license to use, display, and distribute your content</li>
                <li>Represent that you own or have rights to the content</li>
                <li>Agree not to submit false, misleading, or defamatory content</li>
              </ul>

              <h3>Prohibited Content</h3>
              <p>You may not submit content that:</p>
              <ul>
                <li>Is illegal, harmful, or offensive</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains spam, advertising, or promotional material</li>
                <li>Impersonates others or misrepresents your identity</li>
                <li>Contains malware or harmful code</li>
              </ul>

              <h2>Bakery Listings</h2>
              <p>
                Bakery information is provided by users and business owners. While we strive
                for accuracy, we do not guarantee the completeness or accuracy of listings.
                Always verify business information directly with the bakery.
              </p>

              <h2>Intellectual Property</h2>
              <p>
                The BreadFindr name, logo, and website design are our intellectual property.
                You may not use our branding without written permission.
              </p>

              <h2>Disclaimers</h2>
              <p>
                BreadFindr is provided "as is" without warranties of any kind. We do not
                guarantee that our service will be uninterrupted, secure, or error-free.
              </p>
              <p>
                We are not responsible for:
              </p>
              <ul>
                <li>The quality or safety of products from listed bakeries</li>
                <li>Accuracy of user-submitted reviews or business information</li>
                <li>Any transactions between users and bakeries</li>
                <li>Third-party content or websites linked from our service</li>
              </ul>

              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, BreadFindr shall not be liable for
                any indirect, incidental, special, or consequential damages arising from
                your use of our service.
              </p>

              <h2>Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless BreadFindr from any claims, damages,
                or expenses arising from your use of our service or violation of these terms.
              </p>

              <h2>Modifications</h2>
              <p>
                We reserve the right to modify or discontinue our service at any time.
                We may also update these Terms of Service, and continued use constitutes
                acceptance of any changes.
              </p>

              <h2>Governing Law</h2>
              <p>
                These terms shall be governed by the laws of the United States, without
                regard to conflict of law provisions.
              </p>

              <h2>Contact</h2>
              <p>
                For questions about these Terms of Service, contact us at{' '}
                <a href="mailto:legal@breadfindr.com" className="text-bakery-500 hover:underline">
                  legal@breadfindr.com
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
