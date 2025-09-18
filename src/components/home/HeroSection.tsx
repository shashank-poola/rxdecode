import { Link } from 'react-router-dom';
import { Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 bg-background">
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-helvetica font-bold mb-6 text-foreground">
            Medicine Recommendation System
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-space text-secondary">
            Empowering Informed Healthcare Decisions
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto font-helvetica">
            Simplify understanding of prescription medicines through our AI-powered platform. 
            Upload prescriptions, extract medicine information, and get clear, jargon-free details 
            about your medications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/upload">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-helvetica font-semibold animate-bounce-in"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
            </Link>
            <Link to="/search">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-3 text-lg font-helvetica font-semibold"
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