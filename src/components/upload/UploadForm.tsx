
import { useRef } from 'react';
import { Upload as UploadIcon, Camera, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface UploadFormProps {
  selectedFile: File | null;
  preview: string | null;
  isProcessing: boolean;
  processingStep: string;
  onFileSelect: (file: File) => void;
  onProcessImage: () => void;
  onRemoveFile: () => void;
}

const UploadForm = ({
  selectedFile,
  preview,
  isProcessing,
  processingStep,
  onFileSelect,
  onProcessImage,
  onRemoveFile
}: UploadFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UploadIcon className="h-5 w-5" />
          <span>Upload Prescription Image</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Prescription preview"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
              />
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProcessImage();
                  }}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {processingStep}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Analyze Prescription
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile();
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drop your prescription image here
                </p>
                <p className="text-gray-500">
                  or click to browse files
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Supports JPG, PNG, and other image formats
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
