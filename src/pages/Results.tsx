import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, AlertCircle, Info, Clock, Shield, ArrowLeft,
  Download, Copy, CheckCircle, Search
} from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import { getMedicineInfo } from '../services/apiService';
import { cn } from '../utils/cn';

interface Medicine {
  name: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  precautions: string[];
}

const Results: React.FC = () => {
  const [ocrText, setOcrText] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [medicineList, setMedicineList] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve data from session storage
    const storedOcrText = sessionStorage.getItem('ocrText');
    const storedImagePreview = sessionStorage.getItem('imagePreview');
    
    if (!storedOcrText) {
      // Redirect back to home if no data
      navigate('/');
      return;
    }
    
    const parsedText = JSON.parse(storedOcrText);
    setOcrText(parsedText);
    
    if (storedImagePreview) {
      setImagePreview(storedImagePreview);
    }
    
    // Extract medicine names from OCR text
    // In a real app, this would involve NLP or pattern matching to identify medicine names
    // For this demo, we'll simulate medicine extraction by splitting text and filtering
    const extractMedicines = () => {
      const lines = parsedText.split('\n').filter(line => line.trim() !== '');
      // Filter out lines that appear to be medicine names (simple simulation)
      const potentialMedicines = lines.filter(line => 
        line.length > 3 && 
        line.length < 30 && 
        !line.match(/^[0-9\s]+$/) && // Not just numbers
        !line.match(/^(Dr|Mr|Mrs|Miss|Patient|Name|Address|Date|Tel|Phone)/i) // Not likely header info
      ).slice(0, 3); // Limit to 3 for demo purposes
      
      return potentialMedicines.length > 0 
        ? potentialMedicines 
        : ['Paracetamol', 'Amoxicillin', 'Ibuprofen']; // Fallback to sample medicines if none found
    };
    
    const medicines = extractMedicines();
    setMedicineList(medicines);
    
    // Fetch medicine information for each identified medicine
    const fetchMedicineInfo = async () => {
      setIsLoading(true);
      try {
        const medicineData = await Promise.all(
          medicines.map(name => getMedicineInfo(name))
        );
        setMedicines(medicineData);
      } catch (error) {
        console.error('Error fetching medicine info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicineInfo();
  }, [navigate]);

  const copyOcrText = () => {
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ocrText && medicines.length === 0) {
    return (
      <div className="container mx-auto flex h-64 items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">No prescription data found.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-gray-600 hover:text-primary-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to Home</span>
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
          Prescription Analysis
        </h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - OCR Results */}
          <div className="lg:col-span-1">
            <div className="card h-full">
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Search className="mr-2 h-5 w-5 text-primary-600" />
                OCR Results
              </h2>
              
              {imagePreview && (
                <div className="mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded prescription" 
                    className="mx-auto h-auto max-h-40 w-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              <div className="relative mb-4 rounded-lg bg-gray-50 p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {ocrText || 'No text extracted.'}
                </pre>
                <div className="absolute right-2 top-2 flex space-x-2">
                  <button 
                    onClick={copyOcrText}
                    className="rounded-full bg-white p-1.5 text-gray-500 shadow-sm hover:bg-gray-100 hover:text-primary-600"
                    title="Copy text"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-success-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium">Identified Medicines</h3>
                <ul className="list-inside list-disc space-y-1">
                  {medicineList.map((medicine, index) => (
                    <li key={index} className="text-gray-700">
                      {medicine}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Column - Medicine Information */}
          <div className="lg:col-span-2">
            <h2 className="mb-4 flex items-center text-xl font-semibold">
              <Pill className="mr-2 h-5 w-5 text-primary-600" />
              Medicine Information
            </h2>
            
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600"></div>
                  <p className="text-gray-600">Fetching medicine information...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {medicines.map((medicine, index) => (
                  <MedicineCard key={index} medicine={medicine} />
                ))}
              </div>
            )}

            <div className="mt-8 rounded-lg bg-warning-50 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning-500" />
                <div>
                  <h3 className="mb-1 text-sm font-medium text-warning-800">
                    Important Disclaimer
                  </h3>
                  <p className="text-sm text-warning-700">
                    This information is for educational purposes only. Always consult 
                    with a qualified healthcare professional before making any decisions 
                    about your medications or treatment plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;