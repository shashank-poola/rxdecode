
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
              
              Name: ${medicineName}
              Use: [What it's used for]
              Dosage: [Typical dosage information]
              Side Effects: [Common side effects]
              Precautions: [Important precautions]
              
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
