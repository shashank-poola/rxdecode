
import { useState, useRef } from 'react';
import { Upload as UploadIcon, Camera, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import MedicineInfoCard from '@/components/search/MedicineInfoCard';

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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const extractTextWithVisionAPI = async (file: File): Promise<string> => {
    try {
      const base64Image = await convertFileToBase64(file);
      
      const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAaOzhceAvQA8bbq5BXTU9guRDMsORIfiw`;
      
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      };

      const response = await fetch(visionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.responses && result.responses[0] && result.responses[0].textAnnotations) {
        return result.responses[0].textAnnotations[0].description || '';
      }
      
      return '';
    } catch (error) {
      console.error('Error with Vision API:', error);
      throw error;
    }
  };

  const extractMedicineNames = (text: string): string[] => {
    // Improved medicine name extraction logic
    const lines = text.split('\n');
    const medicineNames: string[] = [];
    
    // Look for medicine patterns in prescription
    lines.forEach(line => {
      const trimmedLine = line.trim().toUpperCase();
      
      // Look for lines that start with numbers (medicine list)
      if (/^\d+\)/.test(trimmedLine)) {
        // Extract medicine name after the number
        const parts = trimmedLine.split(')');
        if (parts.length > 1) {
          const medicinePart = parts[1].trim();
          // Extract the first word which is usually the medicine name
          const medicineMatch = medicinePart.match(/^(TAB\.|CAP\.|SYR\.|INJ\.)\s*([A-Z]+)/);
          if (medicineMatch && medicineMatch[2]) {
            medicineNames.push(medicineMatch[2]);
          }
        }
      }
      
      // Look for common medicine prefixes
      if (trimmedLine.includes('TAB.') || trimmedLine.includes('CAP.') || trimmedLine.includes('SYR.')) {
        const medicineMatch = trimmedLine.match(/(TAB\.|CAP\.|SYR\.)\s*([A-Z][A-Z0-9]+)/);
        if (medicineMatch && medicineMatch[2]) {
          medicineNames.push(medicineMatch[2]);
        }
      }
    });
    
    // Remove duplicates and filter out obvious non-medicine words
    const filteredNames = [...new Set(medicineNames)].filter(name => 
      name.length > 2 && 
      !['TAB', 'CAP', 'SYR', 'INJ', 'MG', 'ML', 'MORNING', 'NIGHT', 'FOOD', 'DAYS'].includes(name)
    );
    
    return filteredNames.slice(0, 5); // Max 5 medicines
  };

  const cleanText = (text: string): string => {
    // Remove asterisks and clean up text
    return text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove any remaining asterisks
      .replace(/#+\s*/g, '') // Remove markdown headers
      .trim();
  };

  const fetchMedicineInfo = async (medicineName: string): Promise<MedicineInfo> => {
    console.log(`Fetching info for: ${medicineName}`);
    
    try {
      // Use Gemini 2.0 Flash API for medicine search
      const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyABoWpR4-zZ4OY6hcCpGKZtwHLmchygxAY';
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Provide detailed medical information for the medicine "${medicineName}" in the following exact format:

Usage: [What this medicine is used for - be specific about conditions it treats]
Dosage: [Typical dosage information for adults - include frequency and amount]
Side Effects: [List common side effects]
Precautions: [Important warnings and precautions]

Please provide accurate, concise medical information without using asterisks or bold formatting. If the medicine is not found or you're unsure, clearly state that and provide general guidance about consulting healthcare providers.`
            }]
          }]
        })
      });

      if (geminiResponse.ok) {
        const geminiResult = await geminiResponse.json();
        const text = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Parse the Gemini response and clean text
        const lines = text.split('\n').filter(line => line.trim());
        const info: Partial<MedicineInfo> = { name: medicineName };
        
        lines.forEach(line => {
          const cleanLine = cleanText(line.trim());
          if (cleanLine.startsWith('Usage:')) {
            info.usage = cleanText(cleanLine.replace('Usage:', '').trim());
          } else if (cleanLine.startsWith('Dosage:')) {
            info.dosage = cleanText(cleanLine.replace('Dosage:', '').trim());
          } else if (cleanLine.startsWith('Side Effects:')) {
            info.sideEffects = cleanText(cleanLine.replace('Side Effects:', '').trim());
          } else if (cleanLine.startsWith('Precautions:')) {
            info.precautions = cleanText(cleanLine.replace('Precautions:', '').trim());
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

      // Fallback response if Gemini fails
      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information from Gemini',
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
      // Step 1: OCR Text Extraction using Google Cloud Vision API
      setProcessingStep('Extracting text from prescription using Google Vision API...');
      const text = await extractTextWithVisionAPI(selectedFile);
      
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

      // Step 3: Fetch Medicine Information using Gemini API
      setProcessingStep('Fetching medicine information from Gemini AI...');
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
          <h1 className="text-4xl font-bold font-bricolage mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
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
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer"
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
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
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
            <h2 className="text-2xl font-bold font-bricolage text-center text-blue-800">
              Medicine Information
            </h2>
            {medicineInfo.map((medicine, index) => (
              <MedicineInfoCard 
                key={index} 
                medicineInfo={medicine} 
              />
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
