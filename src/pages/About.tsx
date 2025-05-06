import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, AlertTriangle, HeartHandshake } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
          About Rxdecode
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-700">
          Our mission is to empower patients with clear, accessible information
          about their medications, helping them make informed healthcare decisions.
        </p>
      </motion.div>

      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mb-4 text-gray-700">
            Rxdecode was created to bridge the gap between medical professionals and
            patients by decoding complex prescription information into clear,
            actionable insights.
          </p>
          <p className="mb-4 text-gray-700">
            We believe that understanding your medication is a fundamental right
            and an essential component of proper healthcare. Our platform leverages
            modern technology to make this information accessible to everyone.
          </p>
          <p className="text-gray-700">
            By providing comprehensive, easy-to-understand medication information,
            we aim to improve medication adherence, reduce adverse effects, and
            empower patients to take control of their health journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl bg-primary-50 p-8"
        >
          <h2 className="mb-6 text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary-100 p-2">
                <BookOpen className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold">Upload & Extract</h3>
                <p className="text-gray-700">
                  Upload your prescription image, and our OCR technology extracts
                  medicine names automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-secondary-100 p-2">
                <HeartHandshake className="h-5 w-5 text-secondary-500" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold">Process & Analyze</h3>
                <p className="text-gray-700">
                  Our system processes the extracted data and fetches
                  comprehensive information from trusted medical databases.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-success-100 p-2">
                <Shield className="h-5 w-5 text-success-500" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold">Learn & Understand</h3>
                <p className="text-gray-700">
                  Review detailed information about your medication, including
                  dosage, side effects, and precautions in simple language.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 rounded-xl bg-orange-50 p-8"
      >
        <div className="flex items-center space-x-4">
          <AlertTriangle className="h-8 w-8 text-warning-500" />
          <h2 className="text-2xl font-bold text-gray-900">Disclaimer</h2>
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-gray-700">
            Rxdecode is designed for informational purposes only. The information
            provided by our platform should not be considered medical advice.
          </p>
          <p className="text-gray-700">
            Always consult with a qualified healthcare professional before making
            any decisions about your medications or treatment plans. Your doctor
            or pharmacist is the best resource for personalized medical advice.
          </p>
          <p className="text-gray-700">
            While we strive to provide accurate and up-to-date information, we
            cannot guarantee that all information is complete or accurate. Users
            should verify any information provided by Rxdecode with their
            healthcare providers.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;