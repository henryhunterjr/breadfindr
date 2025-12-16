import { Link } from 'react-router-dom';
import { Wheat, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function Privacy() {
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
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
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
                Your privacy matters to us. This Privacy Policy explains how BreadFindr collects, uses, and protects your information.
              </p>

              <h2>1. Information We Collect</h2>

              <h3>For Users (Bread Seekers):</h3>
              <ul>
                <li>We do not require account creation to search the directory</li>
                <li>We may collect anonymized usage data (such as search terms and location filters) to improve the app</li>
                <li>We do not sell or share personal information</li>
              </ul>

              <h3>For Bakers (Listing Submissions):</h3>
              <ul>
                <li>When you submit a listing, we collect the information you provide: business name, location, contact information, social media links, product types, and any other details you choose to share</li>
                <li>This information is displayed publicly in the directory</li>
                <li>By submitting, you consent to public display of your listing information</li>
              </ul>

              <h2>2. Location Data</h2>
              <p>
                BreadFindr may use your general location (city, state, or zip code) to show nearby bakers.
                We do not track precise GPS location or store location history.
              </p>

              <h2>3. Cookies and Analytics</h2>
              <p>
                We use Vercel Analytics to understand general usage patterns such as page views and search activity.
                This data is anonymized and does not identify individual users. We do not use cookies for advertising or tracking.
              </p>

              <h2>4. Third-Party Links</h2>
              <p>
                BreadFindr contains links to third-party websites, including baker websites, social media pages,
                and affiliate partners. These sites have their own privacy policies. We are not responsible for their practices.
              </p>

              <h2>5. Data Security</h2>
              <p>
                We take reasonable measures to protect the information collected through BreadFindr.
                However, no internet transmission is 100% secure. Baker listing information is public by design.
              </p>

              <h2>6. Data Retention</h2>
              <p>
                Baker listing information remains in the directory until the baker requests removal.
                Anonymized analytics data is retained for up to 12 months.
              </p>

              <h2>7. Children's Privacy</h2>
              <p>
                BreadFindr is not directed at children under 13. We do not knowingly collect information from children.
              </p>

              <h2>8. Do Not Track</h2>
              <p>
                BreadFindr does not currently respond to "Do Not Track" browser signals, as we do not track
                individual users across third-party websites.
              </p>

              <h2>9. Your Rights</h2>
              <p>
                If you are a listed baker and wish to update or remove your listing, contact us at{' '}
                <a href="mailto:henrysbreadkitchen@gmail.com" className="text-bakery-500 hover:underline">
                  henrysbreadkitchen@gmail.com
                </a>{' '}
                and we will process your request promptly.
              </p>

              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated date.
              </p>

              <h2>11. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, contact us at{' '}
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
