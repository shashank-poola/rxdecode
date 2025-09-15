import { Link } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-bricolage mb-4">Medicine Recommendation System</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering informed healthcare decisions through AI-powered prescription analysis and medicine information.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-rxdecode-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/upload" className="text-gray-300 hover:text-white transition-colors">Upload Prescription</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-white transition-colors">Search Medicine</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Medicine Recommendation System. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This platform is for educational purposes only. Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;