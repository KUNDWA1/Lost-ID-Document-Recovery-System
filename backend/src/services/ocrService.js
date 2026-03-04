const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    return text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    return null;
  }
};

const extractDocumentInfo = (ocrText) => {
  const info = {
    name: null,
    documentNumber: null,
    rawText: ocrText
  };

  // Extract ID number patterns (adjust regex for Rwanda ID format)
  const idPattern = /\b\d{16}\b/g;
  const idMatch = ocrText.match(idPattern);
  if (idMatch) info.documentNumber = idMatch[0];

  // Extract name (basic pattern - can be improved)
  const namePattern = /Name[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/i;
  const nameMatch = ocrText.match(namePattern);
  if (nameMatch) info.name = nameMatch[1];

  return info;
};

module.exports = { extractTextFromImage, extractDocumentInfo };
