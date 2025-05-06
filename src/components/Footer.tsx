import React from 'react';
import { Link } from 'react-router-dom';
import { PlusSquare, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-primary-600">
                <PlusSquare className="h-6 w-6" />
              </div>
              <span className="font-bricolage text-lg font-bold text-gray-900">
                Rxdecode
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Empowering informed healthcare decisions by making medicine
              information accessible and easy to understand.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 transition-colors hover:text-primary-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 transition-colors hover:text-primary-600"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Disclaimer
            </h4>
            <p className="text-sm text-gray-600">
              This platform is for informational purposes only. Always consult a
              licensed medical professional before making health-related
              decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="flex items-center justify-center text-sm text-gray-500">
            © {new Date().getFullYear()} Rxdecode. Made with{' '}
            <Heart className="mx-1 h-4 w-4 text-error-500" /> for healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;