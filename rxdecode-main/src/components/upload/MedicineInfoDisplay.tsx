
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
    <div className="space-y-8">
      <h2 className="text-3xl font-serif text-center text-foreground">
        Medicine Information
      </h2>
      {medicineInfo.map((medicine, index) => (
        <MedicineInfoCard 
          key={index} 
          medicineInfo={medicine} 
        />
      ))}
      
      <Card className="border-border bg-muted">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="text-sm font-serif font-medium">
                Important Disclaimer
              </p>
              <p className="text-sm text-muted-foreground font-sans mt-2">
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
