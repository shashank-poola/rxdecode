import { createWorker } from 'tesseract.js';

export const processImage = async (imageFile: File): Promise<string> => {
  try {
    // Create worker
    const worker = await createWorker('eng');
    
    // Process the image
    const { data: { text } } = await worker.recognize(imageFile);
    
    // Terminate worker
    await worker.terminate();
    
    return text;
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to process image');
  }
};