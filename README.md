# 🩺 Rxdecode: Empowering Informed Healthcare Decisions

![Rxdecode](www.rxdecode.shasha.ink)

**Rxdecode** simplifies the understanding of prescription medicines through a **user-friendly web app**. Users can upload handwritten or printed prescription images, and our system **automatically extracts medicine names** using **OCR (Optical Character Recognition)**.

We break down complex medical information into clear, simple language.

---

## ✅ Features

- 🔍 **Prescription Upload** – Take a photo or upload your prescription easily.
- 🧠 **OCR-Powered Text Extraction** – Built using **Tesseract.js** for accurate extraction of medicine names.
- 💊 **Real-Time Medicine Info** – Sourced from reliable medical APIs:
  - Medicine details
  - Dosage instructions
  - Possible side effects
  - Usage precautions
- 🔐 **Privacy & Ethics Focused** – Your data remains private; we do **not** offer medical advice.

---

## 🚀 Built With

| **Tech Stack**     | **Description**                      |
|--------------------|--------------------------------------|
| Frontend           | React.js + Tailwind CSS              |
| Backend            | Express.js (Node.js)                 |
| OCR Engine         | Tesseract.js                         |
| API Integration    | External Medicine Info APIs          |
| Fonts              | Bricolage Grotesque & Space Grotesk  |

---

Everything is focused on **simplicity** and **ease of use**, ensuring an **excellent user experience** across devices.

---

## 🖼️ How It Works

1️⃣ **Upload your prescription** – snap a photo or upload a scanned copy.  
2️⃣ **OCR engine extracts** medicine names from the image.  
3️⃣ **API fetches** detailed information about each medicine.  
4️⃣ **Clear, simple results** are displayed instantly.

---

## ⚙️ Getting Started

Clone the repository:

```bash
git clone https://github.com/yourusername/rxdecode.git
cd rxdecode

# Install all dependencies
npm install

# For frontend
cd client
npm start

# For backend
cd server
npm run dev
