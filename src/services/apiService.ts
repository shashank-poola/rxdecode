// This is a mock service that simulates API calls to a medicine information database
// In a real application, this would connect to an actual API

interface Medicine {
  name: string;
  description: string;
  dosage: string;
  sideEffects: string[];
  precautions: string[];
}

const mockMedicineData: Record<string, Medicine> = {
  paracetamol: {
    name: 'Paracetamol',
    description: 'Paracetamol (acetaminophen) is a pain reliever and fever reducer. It is used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers. It relieves pain in mild arthritis but has no effect on the underlying inflammation and swelling of the joint.',
    dosage: 'The recommended dose for adults is 1-2 tablets (500-1000 mg) every 4-6 hours as needed, with a maximum of 4 grams (8 tablets) in a 24-hour period.',
    sideEffects: [
      'Nausea and vomiting',
      'Stomach pain',
      'Loss of appetite',
      'Headache',
      'Rash or itching',
    ],
    precautions: [
      'Do not exceed the recommended dose',
      'Avoid alcohol while taking this medication',
      'Consult a doctor if you have liver disease',
      'Not recommended for long-term pain management without medical supervision',
      'Keep out of reach of children',
    ],
  },
  amoxicillin: {
    name: 'Amoxicillin',
    description: 'Amoxicillin is a penicillin antibiotic that fights bacteria in the body. It is used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
    dosage: 'For adults and children weighing 40 kg or more, the recommended dose is 250-500 mg every 8 hours or 500-875 mg every 12 hours, depending on the severity of the infection.',
    sideEffects: [
      'Diarrhea',
      'Stomach upset',
      'Headache',
      'Vaginal itching or discharge',
      'Rash, itching, or hives',
    ],
    precautions: [
      'Tell your doctor if you are allergic to penicillin',
      'Complete the full course of treatment, even if symptoms improve',
      'May reduce the effectiveness of birth control pills',
      'Take with food to reduce stomach upset',
      'Call your doctor if you develop severe diarrhea',
    ],
  },
  ibuprofen: {
    name: 'Ibuprofen',
    description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID). It works by reducing hormones that cause inflammation and pain in the body. It is used to reduce fever and treat pain or inflammation caused by many conditions such as headache, toothache, back pain, arthritis, menstrual cramps, or minor injury.',
    dosage: 'The recommended dose for adults is 200-400 mg every 4-6 hours as needed, with a maximum of 1,200 mg in a 24-hour period unless directed by a doctor.',
    sideEffects: [
      'Upset stomach',
      'Mild heartburn',
      'Nausea, vomiting',
      'Bloating, gas, diarrhea, constipation',
      'Dizziness, headache',
    ],
    precautions: [
      'Take with food or milk to prevent stomach upset',
      'Avoid alcohol and tobacco',
      'Not recommended for people with heart conditions or high blood pressure',
      'Stop taking and seek medical attention if you experience chest pain, shortness of breath, or slurred speech',
      'Avoid taking other NSAIDs at the same time',
    ],
  },
};

// Fallback medicine data for any medicine not in our mock database
const fallbackMedicine: Medicine = {
  name: 'Generic Medicine',
  description: 'This medication is used to treat various conditions. Detailed information about this specific medication is not available in our database. Please consult your healthcare provider or pharmacist for more detailed information.',
  dosage: 'Take as directed by your healthcare provider. Follow all directions on your prescription label.',
  sideEffects: [
    'Common side effects may include nausea, headache, or dizziness',
    'Contact your doctor if you experience severe side effects',
    'This is not a complete list of possible side effects',
  ],
  precautions: [
    'Tell your doctor about any medical conditions and allergies you have',
    'Inform your doctor about all other medications you are taking',
    'Follow dosage instructions carefully',
    'Keep all medications away from children',
    'Store properly as indicated on the label',
  ],
};

export const getMedicineInfo = async (medicineName: string): Promise<Medicine> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Normalize the medicine name to lowercase for matching
  const normalizedName = medicineName.toLowerCase();
  
  // Find the medicine in our mock database or use the fallback
  // In a real application, this would make an API call to a medication database
  for (const key in mockMedicineData) {
    if (normalizedName.includes(key)) {
      return mockMedicineData[key];
    }
  }
  
  // If no matching medicine was found, return the fallback with the provided name
  return {
    ...fallbackMedicine,
    name: medicineName,
  };
};