
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DisclaimerCard = () => {
  return (
    <Card className="border-border bg-muted">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="text-sm font-serif font-medium">
              Important Disclaimer
            </p>
            <p className="text-sm text-muted-foreground font-sans mt-2">
              This information is for educational purposes only. Always consult your healthcare provider 
              before taking any medication. This system does not provide medical advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisclaimerCard;
