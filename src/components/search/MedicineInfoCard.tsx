
import { Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MedicineInfo {
  name: string;
  usage: string;
  dosage: string;
  sideEffects: string;
  precautions: string;
}

interface MedicineInfoCardProps {
  medicineInfo: MedicineInfo;
}

const MedicineInfoCard = ({ medicineInfo }: MedicineInfoCardProps) => {
  return (
    <Card className="animate-fade-in">
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
  );
};

export default MedicineInfoCard;
