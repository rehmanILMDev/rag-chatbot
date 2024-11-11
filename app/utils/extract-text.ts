const pdf = require('pdf-parse');
const fs = require('fs');

export async function extractTextFromPDF(filePath: any) {
  const data = await fs.promises.readFile(filePath);
  const pdfData = await pdf(data);
  return pdfData.text;  // Extracted text
}
