
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MedicineInfoCard from '@/components/search/MedicineInfoCard';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
}

interface MedicineInfoDisplayProps {
  medicineInfo: MedicineInfo[];
}

const MedicineInfoDisplay = ({ medicineInfo }: MedicineInfoDisplayProps) => {
  if (medicineInfo.length === 0) return null;

  return (
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
  );
};

export default MedicineInfoDisplay;
