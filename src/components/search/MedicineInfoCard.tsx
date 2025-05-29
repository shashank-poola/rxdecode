
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
          <span className="text-xl font-bold">{medicineInfo.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-rxdecode-purple">
          <h4 className="font-bold text-rxdecode-purple mb-2 text-lg">Usage</h4>
          <p className="text-gray-800 font-medium leading-relaxed">{medicineInfo.usage}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-rxdecode-coral">
          <h4 className="font-bold text-rxdecode-coral mb-2 text-lg">Dosage</h4>
          <p className="text-gray-800 font-medium leading-relaxed">{medicineInfo.dosage}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-rxdecode-yellow">
          <h4 className="font-bold text-rxdecode-yellow mb-2 text-lg">Side Effects</h4>
          <p className="text-gray-800 font-medium leading-relaxed">{medicineInfo.sideEffects}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-rxdecode-blue">
          <h4 className="font-bold text-rxdecode-blue mb-2 text-lg">Precautions</h4>
          <p className="text-gray-800 font-medium leading-relaxed">{medicineInfo.precautions}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineInfoCard;
