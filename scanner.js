import { createWorker } from 'tesseract.js';

(async () => {
  const worker = await createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const result = await worker.recognize('images/RF.jpg');

  // Store the recognized text in a variable
  const recognizedText = result.data.text;

  const scannedText = recognizedText;

  // Extract data starting from "Code Subject"
  const extractedData = scannedText.match(/Code Subject[\s\S]*/);
  const relevantData = extractedData ? extractedData[0] : '';

  // Replace incorrect characters
  const cleanedData = relevantData.replace(/{/g, '1').replace(/§/g, 'S').replace(/~{2}/g, '~~').replace(/¥/g, 'T').replace(/~~/g, '').replace(/|/g, '').replace(/!/g, '').replace(/=/g, '');

// Split the raw data into rows
const rows = cleanedData.trim().split('\n');

// Extract header and remove non-alphanumeric characters
const header = rows[0].replace(/[^a-zA-Z\s]/g, '').split(/\s+/);

// Initialize an array to store the structured data
const structuredData = [];

// Process each row of data
for (let i = 1; i < rows.length; i++) {
  const values = rows[i].split(/\s+/);

  // Create an object with header as keys and corresponding values
  const rowData = header.reduce((obj, key, index) => {
    obj[key] = values[index];
    return obj;
  }, {});

  // Add specific subject code to Subject
  if (rowData['Subject']) {
    const subjectCodeMatch = rowData['Subject'].match(/\b\d{4}\b/);
    rowData['SubjectCode'] = subjectCodeMatch ? subjectCodeMatch[0] : null;
  }

  // Add the row data to the structured data array
  structuredData.push(rowData);
}

// Filter subjects based on units having ".0"
const filteredSubjects = structuredData.filter(subject => subject['Units'] && subject['Units'].includes('.0'));

// Log the filtered subjects
console.log(filteredSubjects);
})();
