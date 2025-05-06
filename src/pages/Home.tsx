import React from 'react';
import { motion } from 'framer-motion';
import { SearchCheck, Upload, ShieldCheck, HeartPulse } from 'lucide-react';
import PrescriptionUploader from '../components/PrescriptionUploader';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                Empowering Informed{' '}
                <span className="text-primary-600">Healthcare</span> Decisions
              </h1>
              <p className="mb-8 text-lg text-gray-700">
                Simplifying understanding of prescription medicines through our
                user-friendly platform. Upload your prescription and get
                comprehensive information instantly.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#upload-section"
                  className="btn btn-primary"
                >
                  Upload Prescription
                </a>
                <a
                  href="#features"
                  className="btn btn-outline"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-md lg:mx-0"
            >
              <div className="relative rounded-2xl bg-white p-6 shadow-xl">
                <div className="absolute -right-3 -top-3 rounded-full bg-primary-600 p-3 text-white shadow-lg">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">
                  Medicine Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-green-100 p-1">
                      <ShieldCheck className="h-4 w-4 text-success-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Detailed medicine information
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-blue-100 p-1">
                      <ShieldCheck className="h-4 w-4 text-primary-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Dosage instructions and precautions
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-orange-100 p-1">
                      <ShieldCheck className="h-4 w-4 text-warning-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Possible side effects and interactions
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload-section" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Decode Your Prescription
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
                Upload a photo of your prescription and our OCR technology will
                extract medicine names and provide you with comprehensive information.
              </p>
            </motion.div>
            <PrescriptionUploader />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-16 text-3xl font-bold text-gray-900 sm:text-4xl">
              Key Features
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="mb-4 rounded-full bg-primary-100 p-3 inline-flex">
                <Upload className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Prescription Upload</h3>
              <p className="text-gray-600">
                Just take a photo and upload your prescription for instant analysis.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="mb-4 rounded-full bg-secondary-100 p-3 inline-flex">
                <SearchCheck className="h-6 w-6 text-secondary-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">OCR-Powered Extraction</h3>
              <p className="text-gray-600">
                Advanced text extraction built using Tesseract.js technology.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="mb-4 rounded-full bg-accent-100 p-3 inline-flex">
                <HeartPulse className="h-6 w-6 text-accent-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Real-Time Medicine Info</h3>
              <p className="text-gray-600">
                Sourced from reliable medical APIs for accurate information.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="card"
            >
              <div className="mb-4 rounded-full bg-success-100 p-3 inline-flex">
                <ShieldCheck className="h-6 w-6 text-success-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Privacy & Ethics Focused</h3>
              <p className="text-gray-600">
                Your data stays private; we don't offer medical advice.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;