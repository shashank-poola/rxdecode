
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
  alternatives: string;
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
    
    console.log('Analyzing text for medicine names:', text);
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      console.log(`Line ${index}: "${trimmedLine}"`);
      
      // Pattern 1: Look for numbered lists (1. Medicine, 2. Medicine, etc.)
      const numberedPattern = /^\d+\.\s*(.+)/;
      const numberedMatch = trimmedLine.match(numberedPattern);
      
      if (numberedMatch) {
        const medicineText = numberedMatch[1].trim();
        console.log(`Found numbered medicine: "${medicineText}"`);
        
        // Extract medicine name from various formats
        const medicinePatterns = [
          // Pattern: TAB. MEDICINENAME or CAP. MEDICINENAME
          /(?:TAB\.|CAP\.|SYR\.|INJ\.)\s*([A-Z][A-Z0-9\s]+?)(?:\s+\d+|\s*$)/i,
          // Pattern: Medicine name at start
          /^([A-Z][A-Z0-9\s]+?)(?:\s+\d+|\s+mg|\s+ml|\s*$)/i,
          // Pattern: Any word with 3+ characters
          /([A-Z][A-Z0-9]{2,})/i
        ];
        
        for (const pattern of medicinePatterns) {
          const match = medicineText.match(pattern);
          if (match && match[1]) {
            const medicineName = match[1].trim().toUpperCase();
            if (medicineName.length > 2 && !['TAB', 'CAP', 'SYR', 'INJ', 'MG', 'ML'].includes(medicineName)) {
              medicineNames.push(medicineName);
              console.log(`Extracted medicine: "${medicineName}"`);
              break;
            }
          }
        }
      }
      
      // Pattern 2: Look for medicine formats without numbers
      const medicineFormats = [
        /(?:TAB\.|CAP\.|SYR\.|INJ\.)\s*([A-Z][A-Z0-9\s]+?)(?:\s+\d+|\s*$)/i,
        /^([A-Z][A-Z0-9\s]{3,})(?:\s+\d+mg|\s+\d+ml|\s*$)/i
      ];
      
      for (const pattern of medicineFormats) {
        const match = trimmedLine.match(pattern);
        if (match && match[1]) {
          const medicineName = match[1].trim().toUpperCase();
          if (medicineName.length > 2 && !['TAB', 'CAP', 'SYR', 'INJ', 'MG', 'ML', 'MORNING', 'NIGHT', 'FOOD', 'DAYS'].includes(medicineName)) {
            medicineNames.push(medicineName);
            console.log(`Extracted medicine (no number): "${medicineName}"`);
          }
        }
      }
    });
    
    // Remove duplicates and filter
    const uniqueNames = [...new Set(medicineNames)];
    const filteredNames = uniqueNames.filter(name => 
      name.length > 2 && 
      !['TAB', 'CAP', 'SYR', 'INJ', 'MG', 'ML', 'MORNING', 'NIGHT', 'FOOD', 'DAYS', 'BEFORE', 'AFTER'].includes(name)
    );
    
    console.log('Final extracted medicines:', filteredNames);
    return filteredNames.slice(0, 8); // Increased limit to 8
  };

  const cleanText = (text: string): string => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#+\s*/g, '')
      .trim();
  };

  const fetchMedicineInfo = async (medicineName: string): Promise<MedicineInfo> => {
    console.log(`Fetching comprehensive info for: ${medicineName}`);
    
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
              text: `Provide comprehensive medical information for the medicine "${medicineName}" in the following exact format:

Usage: [What this medicine is used for - be specific about conditions, symptoms, and therapeutic purposes]
Dosage: [Typical adult dosage with frequency, amount, and duration - include pediatric dosage if applicable]
Side Effects: [List common and serious side effects that patients should be aware of]
Precautions: [Important warnings, contraindications, and safety measures]
Alternatives: [List 2-3 alternative medicines of the same therapeutic class with brief descriptions]

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
          } else if (cleanLine.startsWith('Alternatives:')) {
            info.alternatives = cleanText(cleanLine.replace('Alternatives:', '').trim());
          }
        });

        return {
          name: info.name || medicineName,
          usage: info.usage || 'Information not available - consult your healthcare provider',
          dosage: info.dosage || 'Consult your doctor for proper dosage information',
          sideEffects: info.sideEffects || 'Consult your doctor for comprehensive side effects information',
          precautions: info.precautions || 'Take only as prescribed by your healthcare provider',
          alternatives: info.alternatives || 'Consult your doctor for alternative medicine options'
        };
      }

      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information - please consult your healthcare provider',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider',
        alternatives: 'Consult your doctor for alternative medicine options'
      };

    } catch (error) {
      console.error('Error fetching medicine info:', error);
      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider',
        alternatives: 'Consult your doctor for alternative medicine options'
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

      setProcessingStep('Identifying medicines from prescription...');
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

      setProcessingStep('Fetching comprehensive medicine information...');
      const medicineInfoPromises = medicineNames.map(name => fetchMedicineInfo(name));
      const results = await Promise.all(medicineInfoPromises);
      
      setMedicineInfo(results);
      setProcessingStep('Complete!');

      toast({
        title: "Analysis Complete!",
        description: `Found comprehensive information for ${results.length} medicine(s)`,
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
