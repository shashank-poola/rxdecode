import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, Brain, AlertTriangle } from 'lucide-react';
import { searchMedicineWithAI } from '../services/aiService';

const AiSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiResponse = await searchMedicineWithAI(query);
      setResult(aiResponse);
    } catch (err) {
      setError('Failed to get AI-powered information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
          AI-Powered Medicine Search
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
          Get instant, AI-generated information about any medicine. Our AI assistant
          provides accurate, easy-to-understand details about medications.
        </p>
      </motion.div>

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter medicine name..."
              className="w-full rounded-lg border-gray-300 px-4 py-3 pr-12 focus:border-primary-500 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 hover:text-primary-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-error-50 p-4 text-error-600">
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center">
              <Brain className="mr-2 h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold">AI Response</h2>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{result}</p>
            </div>
          </motion.div>
        )}

        <div className="mt-8 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-warning-500" />
            This AI-generated information is for reference only. Always consult
            healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiSearch;