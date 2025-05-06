import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Camera, Loader, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { processImage } from '../services/ocrService';

const PrescriptionUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
    },
    maxFiles: 1,
  });
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };
  
  const handleProcess = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const extractedText = await processImage(file);
      
      // Store the results in session storage for the results page
      sessionStorage.setItem('ocrText', JSON.stringify(extractedText));
      sessionStorage.setItem('imagePreview', preview || '');
      
      // Navigate to results page
      navigate('/results');
    } catch (err) {
      setError('Error processing the image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCameraCapture = () => {
    // This would normally open the device camera
    // For this implementation, we'll just trigger the file input
    const fileInput = document.getElementById('prescription-upload');
    if (fileInput) {
      fileInput.click();
    }
  };
  
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
        {!preview ? (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            <input
              {...getInputProps()}
              id="prescription-upload"
              data-testid="prescription-upload"
            />
            <Upload
              className={`mb-4 h-12 w-12 ${
                isDragActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            />
            {isDragActive ? (
              <p className="text-lg font-medium text-primary-600">
                Drop your prescription image here
              </p>
            ) : (
              <>
                <p className="mb-2 text-lg font-medium text-gray-700">
                  Drag & drop your prescription image here
                </p>
                <p className="mb-4 text-sm text-gray-500">
                  or click to select a file from your device
                </p>
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="btn btn-outline flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take a photo</span>
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Prescription preview"
                className="mx-auto h-auto max-h-64 w-auto rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute -right-2 -top-2 rounded-full bg-error-100 p-1 text-error-600 hover:bg-error-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center">
              <p className="mb-2 text-sm font-medium text-gray-700">
                {file?.name}
              </p>
              <p className="text-xs text-gray-500">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 rounded-lg bg-error-50 p-3 text-sm text-error-600">
            {error}
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!file || isLoading}
            onClick={handleProcess}
            className="btn btn-primary min-w-40"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Analyze Prescription'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUploader;