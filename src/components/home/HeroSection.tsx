import { Link } from 'react-router-dom';
import { Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-gradient-to-r from-rxdecode-purple/5 via-transparent to-rxdecode-coral/5"></div>
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold font-bricolage mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Medicine Recommendation System
          </h1>
          <p className="text-xl md:text-2xl mb-4 font-space bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Empowering Informed Healthcare Decisions
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
            Simplify understanding of prescription medicines through our AI-powered platform. 
            Upload prescriptions, extract medicine information, and get clear, jargon-free details 
            about your medications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/upload">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral hover:from-rxdecode-purple/90 hover:to-rxdecode-coral/90 text-white px-8 py-3 text-lg font-semibold animate-bounce-in"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
            </Link>
            <Link to="/search">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-rxdecode-purple text-rxdecode-purple hover:bg-rxdecode-purple hover:text-white px-8 py-3 text-lg font-semibold"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Medicine
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;