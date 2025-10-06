import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UploadForm from '@/components/upload/UploadForm';
import ExtractedTextDisplay from '@/components/upload/ExtractedTextDisplay';
import MedicineInfoDisplay from '@/components/upload/MedicineInfoDisplay';
import { useUploadProcessor } from '@/hooks/useUploadProcessor';
import SearchForm from '@/components/search/SearchForm';
import MedicineInfoCard from '@/components/search/MedicineInfoCard';
import DisclaimerCard from '@/components/search/DisclaimerCard';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/contexts/AuthContext';

const Generate = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const {
    selectedFile,
    preview,
    isProcessing,
    extractedText,
    medicineInfo: uploadMedicineInfo,
    processingStep,
    handleFileSelect,
    handleRemoveFile,
    processImage
  } = useUploadProcessor();

  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    medicineInfo: searchMedicineInfo,
    handleSearch
  } = useSearch();

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-foreground">
            Generate <span className="italic">Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground font-sans">
            Upload a prescription or search for medicine information
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="font-sans">Upload Prescription</TabsTrigger>
            <TabsTrigger value="search" className="font-sans">Search Medicine</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
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
            <MedicineInfoDisplay medicineInfo={uploadMedicineInfo} />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearching={isSearching}
              onSubmit={handleSearch}
            />
            {searchMedicineInfo && (
              <div className="space-y-6 animate-fade-in">
                <MedicineInfoCard medicineInfo={searchMedicineInfo} />
                <DisclaimerCard />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Generate;
