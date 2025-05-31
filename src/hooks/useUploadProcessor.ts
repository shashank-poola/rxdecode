
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
}

export const useUploadProcessor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo[]>([]);
  const [processingStep, setProcessingStep] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setExtractedText('');
    setMedicineInfo([]);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setExtractedText('');
    setMedicineInfo([]);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
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
    const lines = text.split('\n');
    const medicineNames: string[] = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim().toUpperCase();
      
      if (/^\d+\)/.test(trimmedLine)) {
        const parts = trimmedLine.split(')');
        if (parts.length > 1) {
          const medicinePart = parts[1].trim();
          const medicineMatch = medicinePart.match(/^(TAB\.|CAP\.|SYR\.|INJ\.)\s*([A-Z]+)/);
          if (medicineMatch && medicineMatch[2]) {
            medicineNames.push(medicineMatch[2]);
          }
        }
      }
      
      if (trimmedLine.includes('TAB.') || trimmedLine.includes('CAP.') || trimmedLine.includes('SYR.')) {
        const medicineMatch = trimmedLine.match(/(TAB\.|CAP\.|SYR\.)\s*([A-Z][A-Z0-9]+)/);
        if (medicineMatch && medicineMatch[2]) {
          medicineNames.push(medicineMatch[2]);
        }
      }
    });
    
    const filteredNames = [...new Set(medicineNames)].filter(name => 
      name.length > 2 && 
      !['TAB', 'CAP', 'SYR', 'INJ', 'MG', 'ML', 'MORNING', 'NIGHT', 'FOOD', 'DAYS'].includes(name)
    );
    
    return filteredNames.slice(0, 5);
  };

  const cleanText = (text: string): string => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#+\s*/g, '')
      .trim();
  };

  const fetchMedicineInfo = async (medicineName: string): Promise<MedicineInfo> => {
    console.log(`Fetching info for: ${medicineName}`);
    
    try {
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
      setProcessingStep('Extracting text from prescription...');
      const text = await extractTextWithVisionAPI(selectedFile);
      
      setExtractedText(text);
      console.log('Extracted text:', text);

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

  return {
    selectedFile,
    preview,
    isProcessing,
    extractedText,
    medicineInfo,
    processingStep,
    handleFileSelect,
    handleRemoveFile,
    processImage
  };
};
