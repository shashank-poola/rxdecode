
import { useState } from 'react';
import { Search as SearchIcon, Loader2, Pill, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const { toast } = useToast();

  const searchMedicine = async (medicineName: string): Promise<MedicineInfo> => {
    console.log(`Searching for: ${medicineName}`);
    
    try {
      // Use Gemini API for medicine search
      const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDMBRYoVda27hquQS-UTb5WuQgEwSz0_rs';
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

Please provide accurate, concise medical information. If the medicine is not found or you're unsure, clearly state that and provide general guidance about consulting healthcare providers.`
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
          const cleanLine = line.trim();
          if (cleanLine.startsWith('Usage:')) {
            info.usage = cleanLine.replace('Usage:', '').trim();
          } else if (cleanLine.startsWith('Dosage:')) {
            info.dosage = cleanLine.replace('Dosage:', '').trim();
          } else if (cleanLine.startsWith('Side Effects:')) {
            info.sideEffects = cleanLine.replace('Side Effects:', '').trim();
          } else if (cleanLine.startsWith('Precautions:')) {
            info.precautions = cleanLine.replace('Precautions:', '').trim();
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
      console.error('Error searching medicine:', error);
      return {
        name: medicineName,
        usage: 'Unable to fetch medicine information',
        dosage: 'Please consult your doctor for proper dosage',
        sideEffects: 'Please consult your doctor for side effects',
        precautions: 'Take only as prescribed by your healthcare provider'
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-bricolage mb-4 bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral bg-clip-text text-transparent">
            Search Medicine
          </h1>
          <p className="text-lg text-gray-600">
            Enter a medicine name to get detailed information about usage, dosage, and precautions
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pill className="h-5 w-5" />
              <span>Medicine Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter medicine name (e.g., Paracetamol, Aspirin, Amoxicillin)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg"
                  disabled={isSearching}
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral hover:from-rxdecode-purple/90 hover:to-rxdecode-coral/90 px-6"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Popular searches: Paracetamol, Aspirin, Ibuprofen, Amoxicillin, Omeprazole</p>
            </div>
          </CardContent>
        </Card>

        {/* Medicine Information */}
        {medicineInfo && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Pill className="h-5 w-5 text-rxdecode-green" />
                  <span>{medicineInfo.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-rxdecode-purple mb-2">Usage</h4>
                  <p className="text-gray-700">{medicineInfo.usage}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-rxdecode-coral mb-2">Dosage</h4>
                  <p className="text-gray-700">{medicineInfo.dosage}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-rxdecode-yellow mb-2">Side Effects</h4>
                  <p className="text-gray-700">{medicineInfo.sideEffects}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-rxdecode-blue mb-2">Precautions</h4>
                  <p className="text-gray-700">{medicineInfo.precautions}</p>
                </div>
              </CardContent>
            </Card>
            
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
                      before taking any medication. This system does not provide medical advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold font-bricolage mb-4 text-gray-800">
              Search Tips
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rxdecode-purple rounded-full"></div>
                <span>Use the generic name of the medicine for better results</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rxdecode-coral rounded-full"></div>
                <span>Check the spelling if no results are found</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rxdecode-green rounded-full"></div>
                <span>Try alternative names or brand names</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rxdecode-blue rounded-full"></div>
                <span>Always verify information with your healthcare provider</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Search;
