import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, Info, AlertCircle, 
  Clock, Shield, Pill, CheckCircle 
} from 'lucide-react';
import { cn } from '../utils/cn';

interface Medicine {
  name: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  precautions: string[];
}

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [expanded, setExpanded] = useState(false);

  const tabs = [
    { id: 'info', label: 'Information', icon: <Info className="h-4 w-4" /> },
    { id: 'dosage', label: 'Dosage', icon: <Clock className="h-4 w-4" /> },
    { id: 'side-effects', label: 'Side Effects', icon: <AlertCircle className="h-4 w-4" /> },
    { id: 'precautions', label: 'Precautions', icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary-100 p-2">
            <Pill className="h-5 w-5 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center space-x-1 pb-2 pt-1 text-sm font-medium',
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="py-4">
          {activeTab === 'info' && (
            <div>
              <p className="text-gray-700">
                {expanded 
                  ? medicine.description 
                  : `${medicine.description.substring(0, 150)}...`}
              </p>
            </div>
          )}

          {activeTab === 'dosage' && (
            <div>
              <p className="text-gray-700">{medicine.dosage}</p>
            </div>
          )}

          {activeTab === 'side-effects' && (
            <div>
              <ul className="space-y-2">
                {medicine.sideEffects.map((effect, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="mt-0.5 text-warning-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700">{effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'precautions' && (
            <div>
              <ul className="space-y-2">
                {medicine.precautions.map((precaution, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="mt-0.5 text-secondary-500">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700">{precaution}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;