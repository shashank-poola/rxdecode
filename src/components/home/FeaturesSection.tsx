import { Camera, Brain, Search, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
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
  );
};

export default FeaturesSection;