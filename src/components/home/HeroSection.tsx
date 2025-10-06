import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center px-4 bg-background pt-24">
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 text-foreground leading-tight">
            AI That Translates Your <span className="italic">Prescription</span> into <span className="italic">Clarity.</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto font-sans">
            RxDecode instantly analyzes prescriptions or medicines you upload—giving you complete insights into dosage, usage, and safety, Powered by Gemini AI.
          </p>
          <Link to="/generate">
            <Button 
              size="lg" 
              className="bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white px-12 py-6 text-lg font-sans font-medium rounded-lg transition-opacity"
            >
              Generate
            </Button>
          </Link>
          
          {/* Video Section Placeholder */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
              <div className="text-center space-y-2">
                <svg 
                  className="w-16 h-16 mx-auto text-muted-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-muted-foreground font-sans">Video Demo Coming Soon</p>
                <p className="text-sm text-muted-foreground font-sans">Tella video will be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;