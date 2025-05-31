
import UploadForm from '@/components/upload/UploadForm';
import ExtractedTextDisplay from '@/components/upload/ExtractedTextDisplay';
import MedicineInfoDisplay from '@/components/upload/MedicineInfoDisplay';
import { useUploadProcessor } from '@/hooks/useUploadProcessor';

const Upload = () => {
  const {
    selectedFile,
    preview,
    isProcessing,
    extractedText,
    medicineInfo,
    processingStep,
    handleFileSelect,
    handleRemoveFile,
    processImage
  } = useUploadProcessor();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-bricolage mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Upload Prescription
          </h1>
          <p className="text-lg text-gray-600">
            Upload a clear image of your prescription and get detailed medicine information
          </p>
        </div>

        <UploadForm
          selectedFile={selectedFile}
          preview={preview}
          isProcessing={isProcessing}
          processingStep={processingStep}
          onFileSelect={handleFileSelect}
          onProcessImage={processImage}
          onRemoveFile={handleRemoveFile}
        />

        <ExtractedTextDisplay extractedText={extractedText} />

        <MedicineInfoDisplay medicineInfo={medicineInfo} />
      </div>
    </div>
  );
};

export default Upload;
