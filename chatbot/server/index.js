const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const ExcelJS = require('exceljs');
const app = express();
const port = 3001;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('req>>>>>', req);
  console.log('res>>>>>', res);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Extract text from the uploaded PDF (you may need a PDF parsing library)
  const pdfText = await parsePDF(req.file.buffer);
  console.log('pdfText>>>>>',pdfText);

  // Send the extracted text to the OpenAI Embeddings API
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: pdfText,
        model: 'text-embedding-ada-002',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer openai-API-Key`,
        },
      }
    );
    console.log('OpenAI Embeddings API response:', response);

    const embeddings = response.data.embeddings;

    // Save the embeddings to an Excel file
    saveEmbeddingsToExcel(embeddings);

    // Send a success response to the client
    res.json({ message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error sending request to OpenAI Embeddings API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const pdf = require('pdf-parse');

const parsePDF = async (pdfBuffer) => {
  const data = await pdf(pdfBuffer);
  return data.text;
};

// Function to save embeddings to an Excel file
const saveEmbeddingsToExcel = (response) => {
  if (!response || !response.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
    console.error('Invalid or missing response data');
    return;
  }

  const responseData = response.data.data[0];

  if (!responseData || !Array.isArray(responseData.embedding)) {
    console.error('Invalid or missing embeddings data');
    return;
  }

  const embeddings = responseData.embedding;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Embeddings');

  // Add headers
  worksheet.addRow(['Embedding']);

  // Add data
  embeddings.forEach((embedding) => {
    worksheet.addRow([embedding]);
  });

  // Save the workbook to a file
  const filePath = 'embeddings.xlsx';
  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log('Embeddings saved to Excel file:', filePath);
    })
    .catch((error) => {
      console.error('Error saving embeddings to Excel file:', error);
    });
};


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
