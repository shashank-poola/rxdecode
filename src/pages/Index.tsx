
import { Link } from 'react-router-dom';
import { Upload, Search, Shield, Zap, Camera, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: <Camera className="h-8 w-8 text-rxdecode-green" />,
      title: "Prescription Upload",
      description: "Simply take a photo of your prescription and upload it. Our system handles the rest."
    },
    {
      icon: <Brain className="h-8 w-8 text-rxdecode-purple" />,
      title: "OCR Powered",
      description: "Advanced text extraction using Google Cloud Vision API to read handwritten and printed prescriptions."
    },
    {
      icon: <Search className="h-8 w-8 text-rxdecode-coral" />,
      title: "Real-Time Medicine Info",
      description: "Get comprehensive medicine details including usage, dosage, side effects, and precautions."
    },
    {
      icon: <Shield className="h-8 w-8 text-rxdecode-blue" />,
      title: "Privacy Focused",
      description: "Your medical data stays private and secure. We don't provide medical advice, just information."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-gradient-to-r from-rxdecode-purple/5 via-transparent to-rxdecode-coral/5"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold font-bricolage mb-6" style={{ color: '#0000FF' }}>
              Medicine Recommendation System
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-space" style={{ color: '#0000FF' }}>
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-bricolage mb-4 text-gray-800">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience cutting-edge technology that makes medicine information accessible and understandable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold font-bricolage mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-bricolage mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to get comprehensive medicine information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-rxdecode-green to-rxdecode-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold font-bricolage mb-3">Upload Prescription</h3>
              <p className="text-gray-600">Take a clear photo of your prescription and upload it to our secure platform</p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold font-bricolage mb-3">AI Analysis</h3>
              <p className="text-gray-600">Our OCR technology extracts medicine names and fetches detailed information</p>
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-rxdecode-coral to-rxdecode-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold font-bricolage mb-3">Get Results</h3>
              <p className="text-gray-600">Receive clear, jargon-free information about usage, dosage, and precautions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer Section */}
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
    </div>
  );
};

export default Index;
