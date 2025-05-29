
import { useState, useRef } from 'react';
import { Upload as UploadIcon, Camera, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Tesseract from 'tesseract.js';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
}

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo[]>([]);
  const [processingStep, setProcessingStep] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setExtractedText('');
      setMedicineInfo([]);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const extractMedicineNames = (text: string): string[] => {
    // Simple medicine name extraction logic
    const words = text.split(/\s+/);
    const medicineKeywords = ['tablet', 'capsule', 'syrup', 'injection', 'drops', 'cream', 'ointment'];
    const potentialMedicines: string[] = [];
    
    words.forEach((word, index) => {
      if (medicineKeywords.some(keyword => word.toLowerCase().includes(keyword))) {
        if (index > 0) {
          potentialMedicines.push(words[index - 1]);
        }
      }
      // Also look for common medicine patterns (capitalized words)
      if (word.length > 3 && /^[A-Z]/.test(word)) {
        potentialMedicines.push(word);
      }
    });
    
    return [...new Set(potentialMedicines)].slice(0, 5); // Return unique medicines, max 5
  };

  const fetchMedicineInfo = async (medicineName: string): Promise<MedicineInfo> => {
    console.log(`Fetching info for: ${medicineName}`);
    
    try {
      // Try RapidAPI first
      const rapidApiUrl = `https://myhealthbox.p.rapidapi.com/search/fulltext?q=${encodeURIComponent(medicineName)}&c=us&l=en&f=name&limit=1&from=0`;
      const rapidApiOptions = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'd25a28fce6msh5f140cc61d7557fp1e5287jsnfd21dc470137',
          'x-rapidapi-host': 'myhealthbox.p.rapidapi.com'
        }
      };

      const rapidApiResponse = await fetch(rapidApiUrl, rapidApiOptions);
      
      if (rapidApiResponse.ok) {
        const rapidApiResult = await rapidApiResponse.json();
        console.log('RapidAPI result:', rapidApiResult);
        
        if (rapidApiResult && rapidApiResult.length > 0) {
          const medicine = rapidApiResult[0];
          return {
            name: medicine.name || medicineName,
            usage: medicine.indication || 'Information not available',
            dosage: medicine.dosage || 'Consult your doctor for proper dosage',
            sideEffects: medicine.side_effects || 'Consult your doctor for side effects',
            precautions: medicine.precautions || 'Take as prescribed by your doctor'
          };
        }
      }

      // Fallback to Gemini API
      const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=AIzaSyDMBRYoVda27hquQS-UTb5WuQgEwSz0_rs';
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a medical information assistant. Provide the following details for the medicine "${medicineName}" in a structured format:
              - Name: [Medicine name]
              - Use: [What it's used for]
              - Dosage: [Typical dosage information]
              - Side Effects: [Common side effects]
              - Precautions: [Important precautions]
              
              Keep the information clear, concise, and avoid medical jargon. If the medicine is not found, provide general guidance.`
            }]
          }]
        })
      });

      if (geminiResponse.ok) {
        const geminiResult = await geminiResponse.json();
        const text = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Parse the Gemini response
        const lines = text.split('\n').filter(line => line.trim());
        const info: Partial<MedicineInfo> = { name: medicineName };
        
        lines.forEach(line => {
          if (line.includes('Use:') || line.includes('Usage:')) {
            info.usage = line.split(':')[1]?.trim() || '';
          } else if (line.includes('Dosage:')) {
            info.dosage = line.split(':')[1]?.trim() || '';
          } else if (line.includes('Side Effects:')) {
            info.sideEffects = line.split(':')[1]?.trim() || '';
          } else if (line.includes('Precautions:')) {
            info.precautions = line.split(':')[1]?.trim() || '';
          }
        });

        return {
          name: info.name || medicineName,
          usage: info.usage || 'Information not available',
          dosage: info.dosage || 'Consult your doctor for proper dosage',
          sideEffects: info.sideEffects || 'Consult your doctor for side effects',
          precautions: info.precautions || 'Take as prescribed by your doctor'
        };
      }

      // Fallback response
      return {
        name: medicineName,
        usage: 'Medicine information not available in our database',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider'
      };

    } catch (error) {
      console.error('Error fetching medicine info:', error);
      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider'
      };
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingStep('Analyzing image...');

    try {
      // Step 1: OCR Text Extraction
      setProcessingStep('Extracting text from prescription...');
      const result = await Tesseract.recognize(selectedFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProcessingStep(`Processing... ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const text = result.data.text;
      setExtractedText(text);
      console.log('Extracted text:', text);

      // Step 2: Extract Medicine Names
      setProcessingStep('Identifying medicines...');
      const medicineNames = extractMedicineNames(text);
      console.log('Found medicines:', medicineNames);

      if (medicineNames.length === 0) {
        toast({
          title: "No medicines found",
          description: "Could not identify any medicines in the prescription. Please try with a clearer image.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Step 3: Fetch Medicine Information
      setProcessingStep('Fetching medicine information...');
      const medicineInfoPromises = medicineNames.map(name => fetchMedicineInfo(name));
      const results = await Promise.all(medicineInfoPromises);
      
      setMedicineInfo(results);
      setProcessingStep('Complete!');

      toast({
        title: "Success!",
        description: `Found information for ${results.length} medicine(s)`,
      });

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing failed",
        description: "Failed to process the prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-bricolage mb-4 bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral bg-clip-text text-transparent">
            Upload Prescription
          </h1>
          <p className="text-lg text-gray-600">
            Upload a clear image of your prescription and get detailed medicine information
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>Upload Prescription Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rxdecode-purple transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Prescription preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        processImage();
                      }}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral hover:from-rxdecode-purple/90 hover:to-rxdecode-coral/90"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {processingStep}
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Analyze Prescription
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreview(null);
                        setExtractedText('');
                        setMedicineInfo([]);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drop your prescription image here
                    </p>
                    <p className="text-gray-500">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Supports JPG, PNG, and other image formats
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extracted Text */}
        {extractedText && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Extracted Text</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {extractedText}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medicine Information */}
        {medicineInfo.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-bricolage text-center">
              Medicine Information
            </h2>
            {medicineInfo.map((medicine, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-rxdecode-green" />
                    <span>{medicine.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-rxdecode-purple mb-2">Usage</h4>
                    <p className="text-gray-700">{medicine.usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-rxdecode-coral mb-2">Dosage</h4>
                    <p className="text-gray-700">{medicine.dosage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-rxdecode-yellow mb-2">Side Effects</h4>
                    <p className="text-gray-700">{medicine.sideEffects}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-rxdecode-blue mb-2">Precautions</h4>
                    <p className="text-gray-700">{medicine.precautions}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Important Disclaimer
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      This information is for educational purposes only. Always consult your healthcare provider 
                      before making any changes to your medication regimen. This system does not provide medical advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
