
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

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const { toast } = useToast();

  const cleanText = (text: string): string => {
    // Remove asterisks and clean up text
    return text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove any remaining asterisks
      .replace(/#+\s*/g, '') // Remove markdown headers
      .trim();
  };

  const searchMedicine = async (medicineName: string): Promise<MedicineInfo> => {
    console.log(`Searching for: ${medicineName}`);
    
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
Alternatives: [List 2-3 alternative medicines of the same therapeutic class with brief descriptions]

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
          alternatives: info.alternatives || 'Consult your doctor for alternative medicine options'
        };
      }

      // Fallback response if Gemini fails
      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information from Gemini',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider',
        alternatives: 'Consult your doctor for alternative medicine options'
      };

    } catch (error) {
      console.error('Error searching medicine:', error);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a medicine name",
        description: "Enter the name of the medicine you want to search for",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const result = await searchMedicine(searchQuery.trim());
      setMedicineInfo(result);
      
      toast({
        title: "Search completed",
        description: `Found information for ${result.name}`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not fetch medicine information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    medicineInfo,
    handleSearch
  };
};
