
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
  alternatives?: string;
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
    console.log('Extracting medicines from text:', text);
    
    const lines = text.split('\n');
    const medicineNames: string[] = [];
    
    // Common medicine prefixes and patterns
    const medicinePrefixes = ['TAB', 'CAP', 'SYR', 'INJ', 'TABLET', 'CAPSULE', 'SYRUP', 'INJECTION'];
    const commonWords = ['MG', 'ML', 'MORNING', 'NIGHT', 'FOOD', 'DAYS', 'AFTER', 'BEFORE', 'TIMES', 'DAILY', 'TWICE', 'THRICE', 'BD', 'TDS', 'QDS', 'OD', 'STAT'];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.length < 3) return;
      
      // Pattern 1: Lines starting with numbers (prescription items)
      const numberedPattern = /^\d+[\.\)]\s*(.+)/i;
      const numberedMatch = trimmedLine.match(numberedPattern);
      if (numberedMatch) {
        const content = numberedMatch[1].trim();
        const extractedMedicine = extractMedicineFromContent(content, medicinePrefixes, commonWords);
        if (extractedMedicine) {
          medicineNames.push(extractedMedicine);
        }
        return;
      }
      
      // Pattern 2: Lines containing medicine prefixes
      const hasMedicinePrefix = medicinePrefixes.some(prefix => 
        trimmedLine.toUpperCase().includes(prefix + '.') || 
        trimmedLine.toUpperCase().includes(prefix + ' ')
      );
      
      if (hasMedicinePrefix) {
        const extractedMedicine = extractMedicineFromContent(trimmedLine, medicinePrefixes, commonWords);
        if (extractedMedicine) {
          medicineNames.push(extractedMedicine);
        }
        return;
      }
      
      // Pattern 3: Lines that look like medicine names (capitalized words)
      const words = trimmedLine.split(/\s+/);
      const potentialMedicine = words.find(word => {
        const cleanWord = word.replace(/[^\w]/g, '').toUpperCase();
        return cleanWord.length >= 4 && 
               cleanWord.length <= 20 && 
               /^[A-Z]/.test(cleanWord) && 
               !commonWords.includes(cleanWord) &&
               !medicinePrefixes.includes(cleanWord);
      });
      
      if (potentialMedicine) {
        const cleanMedicine = potentialMedicine.replace(/[^\w]/g, '').toUpperCase();
        if (cleanMedicine.length >= 4) {
          medicineNames.push(cleanMedicine);
        }
      }
    });
    
    // Remove duplicates and filter out invalid names
    const uniqueMedicines = [...new Set(medicineNames)]
      .filter(name => {
        const upperName = name.toUpperCase();
        return name.length >= 3 && 
               name.length <= 25 &&
               !commonWords.includes(upperName) &&
               !medicinePrefixes.includes(upperName) &&
               !/^\d+$/.test(name) && // Not just numbers
               /[A-Za-z]/.test(name); // Contains at least one letter
      })
      .slice(0, 8); // Limit to 8 medicines
    
    console.log('Extracted medicine names:', uniqueMedicines);
    return uniqueMedicines;
  };

  const extractMedicineFromContent = (content: string, prefixes: string[], commonWords: string[]): string | null => {
    // Remove common prefixes and dosage information
    let cleanContent = content;
    
    // Remove medicine type prefixes
    prefixes.forEach(prefix => {
      const prefixPattern = new RegExp(`\\b${prefix}\\.?\\s*`, 'gi');
      cleanContent = cleanContent.replace(prefixPattern, '');
    });
    
    // Extract the first meaningful word that looks like a medicine name
    const words = cleanContent.split(/[\s\-\.\,\(\)]+/);
    
    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '').toUpperCase();
      
      if (cleanWord.length >= 4 && 
          cleanWord.length <= 20 && 
          !commonWords.includes(cleanWord) &&
          !prefixes.includes(cleanWord) &&
          /^[A-Z]/.test(cleanWord) &&
          !/^\d+$/.test(cleanWord)) {
        return cleanWord;
      }
    }
    
    return null;
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
Alternatives: [List 2-3 alternative medicines with similar effects]

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
          } else if (cleanLine.startsWith('Alternatives:')) {
            info.alternatives = cleanText(cleanLine.replace('Alternatives:', '').trim());
          }
        });

        return {
          name: info.name || medicineName,
          usage: info.usage || 'Information not available',
          dosage: info.dosage || 'Consult your doctor for proper dosage',
          sideEffects: info.sideEffects || 'Consult your doctor for side effects',
          precautions: info.precautions || 'Take as prescribed by your doctor',
          alternatives: info.alternatives || 'Consult your doctor for alternative medicines'
        };
      }

      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information from Gemini',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider',
        alternatives: 'Consult your doctor for alternative medicines'
      };

    } catch (error) {
      console.error('Error fetching medicine info:', error);
      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider',
        alternatives: 'Consult your doctor for alternative medicines'
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
