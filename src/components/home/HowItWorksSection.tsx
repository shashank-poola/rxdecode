const HowItWorksSection = () => {
  return (
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
  );
};

export default HowItWorksSection;