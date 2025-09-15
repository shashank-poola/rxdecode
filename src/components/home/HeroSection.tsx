import { Link } from 'react-router-dom';
import { Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 bg-white">
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="animate-fade-in">
          <img src={logo} alt="RxDecode Logo" className="h-20 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-poppins mb-6 text-black">
            Transform <span className="font-caveat text-5xl md:text-7xl">Prescription Confusion</span> into
          </h1>
          <h2 className="text-4xl md:text-6xl font-poppins mb-8 text-black">
            Clear Guidance with RxDecode
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto font-poppins">
            Simplify understanding of prescription medicines through our AI-powered platform. 
            Upload prescriptions, extract medicine information, and get clear, jargon-free details 
            about your medications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/upload">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-poppins font-semibold animate-bounce-in"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
            </Link>
            <Link to="/search">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-black text-black hover:bg-black hover:text-white px-8 py-3 text-lg font-poppins font-semibold"
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