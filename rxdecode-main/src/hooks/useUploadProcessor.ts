
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

  const identifyMedicinesFromText = async (text: string): Promise<string[]> => {
    console.log('Identifying medicines from text:', text);
    
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
              text: `Analyze the following prescription text and identify ONLY the medicine names. Extract medicine names that appear to be actual pharmaceutical drugs or medications. Ignore dosage instructions, timings, doctor names, patient information, and other non-medicine text.

Text to analyze:
"${text}"

Please respond with ONLY the medicine names, one per line, without any additional text, numbers, or formatting. If no medicines are found, respond with "NO_MEDICINES_FOUND".`
            }]
          }]
        })
      });

      if (geminiResponse.ok) {
        const geminiResult = await geminiResponse.json();
        const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (responseText.trim() === 'NO_MEDICINES_FOUND') {
          return [];
        }
        
        const medicines = responseText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.includes(':') && !line.includes('mg') && !line.includes('ml'))
          .slice(0, 6); // Limit to 6 medicines
        
        console.log('Identified medicines:', medicines);
        return medicines;
      }
      
      return [];
    } catch (error) {
      console.error('Error identifying medicines:', error);
      return [];
    }
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
              text: `Provide medical information for the medicine "${medicineName}" in the following exact format:

Usage: [What this medicine is used for - be specific about conditions and therapeutic purposes]
Dosage: [Typical adult dosage with frequency and amount]
Side Effects: [List common side effects that patients should be aware of]
Precautions: [Important warnings, contraindications, and safety measures]

Please provide accurate, detailed medical information without using asterisks, bold formatting, or bullet points. Use clear, concise sentences. If the exact medicine is not found, provide information for the closest match or state clearly that the specific medicine information is not available.`
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
          usage: info.usage || 'Information not available - consult your healthcare provider',
          dosage: info.dosage || 'Consult your doctor for proper dosage information',
          sideEffects: info.sideEffects || 'Consult your doctor for comprehensive side effects information',
          precautions: info.precautions || 'Take only as prescribed by your healthcare provider'
        };
      }

      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information - please consult your healthcare provider',
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
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image first',
        variant: 'destructive',
      });
      return;
    }

    // Rate limiting check
    const rateLimitKey = 'rxdecode_upload_limit';
    const rateLimitData = localStorage.getItem(rateLimitKey);
    const now = Date.now();
    
    if (rateLimitData) {
      const { count, resetTime } = JSON.parse(rateLimitData);
      if (now < resetTime) {
        if (count >= 5) {
          toast({
            title: 'Rate limit reached',
            description: 'Please wait before processing another image',
            variant: 'destructive',
          });
          return;
        }
        localStorage.setItem(rateLimitKey, JSON.stringify({ count: count + 1, resetTime }));
      } else {
        localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, resetTime: now + 60000 }));
      }
    } else {
      localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, resetTime: now + 60000 }));
    }

    setIsProcessing(true);
    setProcessingStep('Analyzing image...');

    try {
      setProcessingStep('Extracting text from prescription...');
      const text = await extractTextWithVisionAPI(selectedFile);
      
      setExtractedText(text);
      console.log('Extracted text:', text);

      setProcessingStep('Identifying medicines from text...');
      const medicineNames = await identifyMedicinesFromText(text);
      console.log('Identified medicines:', medicineNames);

      if (medicineNames.length === 0) {
        toast({
          title: "No medicines found",
          description: "Could not identify any medicines in the prescription. Please try with a clearer image.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      setProcessingStep('Fetching medicine information...');
      const medicineInfoPromises = medicineNames.map(name => fetchMedicineInfo(name));
      const results = await Promise.all(medicineInfoPromises);
      
      setMedicineInfo(results);
      setProcessingStep('Complete!');

      toast({
        title: "Analysis Complete!",
        description: `Found information for ${results.length} medicine(s)`,
      });

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing failed",
        description: "Failed to process the prescription. Please try again with a clearer image.",
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
