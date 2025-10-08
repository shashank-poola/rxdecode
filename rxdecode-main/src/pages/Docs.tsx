import { FileText, Upload, Search, Shield } from 'lucide-react';

const Docs = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-foreground">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground font-sans">
            Learn how to use RxDecode to decode your prescriptions with AI
          </p>
        </div>

        <div className="space-y-12">
          {/* Getting Started */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-serif text-foreground">Getting Started</h2>
            </div>
            <p className="text-muted-foreground font-sans leading-relaxed">
              RxDecode uses advanced Gemini AI technology to analyze prescription images and provide detailed medicine information. 
              Whether you upload a prescription photo or search for a specific medicine, you'll get comprehensive insights about 
              dosage, usage, side effects, and safety precautions.
            </p>
          </section>

          {/* Upload Feature */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-serif text-foreground">Upload Prescription</h2>
            </div>
            <div className="space-y-3 text-muted-foreground font-sans leading-relaxed">
              <p>To upload a prescription:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Navigate to the Generate page</li>
                <li>Select the "Upload Prescription" tab</li>
                <li>Take a clear, well-lit photo of your prescription</li>
                <li>Click "Upload" and select your image</li>
                <li>Click "Process Image" to extract medicine information</li>
              </ol>
              <p className="mt-4">
                Our AI will extract text from your prescription using OCR (Optical Character Recognition) 
                and analyze the medicines listed to provide detailed information about each one.
              </p>
            </div>
          </section>

          {/* Search Feature */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-serif text-foreground">Search Medicine</h2>
            </div>
            <div className="space-y-3 text-muted-foreground font-sans leading-relaxed">
              <p>To search for a medicine:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Navigate to the Generate page</li>
                <li>Select the "Search Medicine" tab</li>
                <li>Enter the medicine name in the search box</li>
                <li>Click "Search" to get detailed information</li>
              </ol>
              <p className="mt-4">
                You'll receive comprehensive details including the medicine's uses, dosage information, 
                side effects, precautions, and interactions with other medications.
              </p>
            </div>
          </section>

          {/* Privacy & Safety */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-serif text-foreground">Privacy & Safety</h2>
            </div>
            <div className="space-y-3 text-muted-foreground font-sans leading-relaxed">
              <p>
                <strong>Privacy:</strong> Your uploaded prescriptions and search queries are processed securely. 
                We do not store your prescription images permanently.
              </p>
              <p>
                <strong>Disclaimer:</strong> RxDecode provides educational information only and is not a substitute 
                for professional medical advice. Always consult with your healthcare provider before taking any 
                medication or making changes to your treatment plan.
              </p>
              <p>
                <strong>Accuracy:</strong> While we use advanced AI technology powered by Google Gemini, the information 
                provided should be verified with a healthcare professional. RxDecode is designed to help you understand 
                your prescriptions better, not to replace medical consultation.
              </p>
            </div>
          </section>

          {/* Technology */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-3xl font-serif text-foreground">Technology</h2>
            </div>
            <p className="text-muted-foreground font-sans leading-relaxed">
              RxDecode is powered by Google's Gemini AI, one of the most advanced large language models available. 
              Our system combines OCR technology for text extraction with AI-powered analysis to provide accurate, 
              comprehensive medicine information in an easy-to-understand format.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Docs;
