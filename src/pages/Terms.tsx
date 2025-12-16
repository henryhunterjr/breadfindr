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
              <p className="text-bakery-100 text-sm">Last Updated: December 15, 2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="prose prose-stone max-w-none">
              <p className="text-stone-600 mb-6">
                Welcome to BreadFindr. By accessing or using this application, you agree to the following terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By using BreadFindr, you agree to be bound by these Terms of Service. If you do not agree,
                please do not use the application.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                BreadFindr is a free directory connecting consumers with local artisan bread bakers. The app
                is provided "as is" for informational purposes. We do not sell bread, process transactions,
                or guarantee the availability of any baker or product listed.
              </p>

              <h2>3. Baker Listings</h2>
              <p>
                Bakers may submit their information for inclusion in the directory. By submitting, bakers
                confirm they have the legal right to sell baked goods in their jurisdiction and that all
                information provided is accurate. We reserve the right to remove any listing at our discretion.
              </p>

              <h2>4. User Conduct</h2>
              <p>You agree not to use BreadFindr to:</p>
              <ul>
                <li>Submit false or misleading information</li>
                <li>Harass, spam, or harm bakers or other users</li>
                <li>Scrape, copy, or reproduce directory data for commercial purposes</li>
                <li>Attempt to interfere with the app's functionality</li>
              </ul>

              <h2>5. Affiliate Links and Partnerships</h2>
              <p>
                BreadFindr may contain links to affiliate partners and sponsors. When you click these links
                and make a purchase, we may earn a small commission at no additional cost to you. We only
                partner with brands we trust.
              </p>

              <h2>6. No Endorsement or Guarantee</h2>
              <p>
                Listing a baker on BreadFindr does not constitute an endorsement. We do not verify licensing,
                food safety compliance, or product quality. Users are responsible for their own due diligence
                when purchasing from any baker.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                BreadFindr is provided without warranties of any kind. We are not liable for any damages
                arising from your use of this application, interactions with bakers, or reliance on its content.
              </p>

              <h2>8. Intellectual Property</h2>
              <p>
                All content within BreadFindr, including text, images, logos, and design, is owned by
                Baking Great Bread at Home or used with permission. You may not reproduce, distribute,
                or sell any content without written permission.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to update these Terms of Service at any time. Continued use of the
                application after changes constitutes acceptance of the new terms.
              </p>

              <h2>10. Dispute Resolution</h2>
              <p>
                BreadFindr is a directory service only. Any disputes between users and bakers are between
                those parties. We are not responsible for resolving complaints, refunds, or disputes related
                to purchases made outside our platform.
              </p>

              <h2>11. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Illinois, without regard to conflict
                of law principles.
              </p>

              <h2>12. Contact</h2>
              <p>
                Questions about these terms? Contact us at{' '}
                <a href="mailto:henrysbreadkitchen@gmail.com" className="text-bakery-500 hover:underline">
                  henrysbreadkitchen@gmail.com
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
