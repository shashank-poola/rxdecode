
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExtractedTextDisplayProps {
  extractedText: string;
}

const ExtractedTextDisplay = ({ extractedText }: ExtractedTextDisplayProps) => {
  if (!extractedText) return null;

  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Extracted Text</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm text-gray-700">
            {extractedText}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtractedTextDisplay;
