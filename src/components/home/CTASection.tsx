import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold font-bricolage mb-4">
          Ready to Decode Your Prescriptions?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users who trust Rxdecode for clear, accurate medicine information
        </p>
        <Link to="/upload">
          <Button 
            size="lg" 
            className="bg-white text-rxdecode-purple hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            <Zap className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;