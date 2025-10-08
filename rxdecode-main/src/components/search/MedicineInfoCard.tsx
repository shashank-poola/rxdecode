
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
    <Card className="animate-fade-in border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Pill className="h-6 w-6" />
          <span className="text-2xl font-serif">{medicineInfo.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <h4 className="font-serif text-xl">Usage</h4>
          <p className="text-muted-foreground font-sans leading-relaxed">{medicineInfo.usage}</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-serif text-xl">Dosage</h4>
          <p className="text-muted-foreground font-sans leading-relaxed">{medicineInfo.dosage}</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-serif text-xl">Side Effects</h4>
          <p className="text-muted-foreground font-sans leading-relaxed">{medicineInfo.sideEffects}</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-serif text-xl">Precautions</h4>
          <p className="text-muted-foreground font-sans leading-relaxed">{medicineInfo.precautions}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineInfoCard;
