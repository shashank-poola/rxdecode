
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DisclaimerCard = () => {
  return (
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
  );
};

export default DisclaimerCard;
