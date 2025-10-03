import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center px-4 bg-background">
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-foreground leading-tight">
            AI That Translates Your Prescription into <span className="italic">Clarity.</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto font-sans">
            Powered by Gemini AI, RxDecode instantly analyzes prescriptions or medicines you upload—giving you complete insights into dosage, usage, and safety.
          </p>
          <Link to="/generate">
            <Button 
              size="lg" 
              className="bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white px-12 py-6 text-lg font-sans font-medium rounded-lg transition-opacity"
            >
              Generate
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;