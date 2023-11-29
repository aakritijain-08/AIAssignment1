# AIAssignment1
# Chatbot with PDF Upload and OpenAI Embeddings

## Overview

This project is a React-based web application that incorporates a chatbot using the OpenAI API. Users can upload PDF files, and the application will parse the PDF, make a call to the OpenAI Embeddings API, and store the response in an Excel file.

## Features

- Chatbot Interface: Users can interact with the chatbot to obtain information or ask questions.
- PDF Upload: Users can upload PDF files, and the application will parse the text content.
- OpenAI Embeddings API: The parsed text is sent to the OpenAI Embeddings API to obtain embeddings.
- Excel Storage: The embeddings received from the API are stored in an Excel file for further analysis.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Usage

1. Start the React development server:

   ```bash
   npm start
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

2. Upload a PDF file using the provided interface and interact with the chatbot.

### Configuration

1. Open `src/config.js` and replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key.

```javascript
// src/config.js

const config = {
  openaiApiKey: 'YOUR_OPENAI_API_KEY',
};

export default config;
```

## Dependencies

- [React](https://reactjs.org/)
- [pdfjs-dist](https://github.com/mozilla/pdf.js)
- [axios](https://github.com/axios/axios)
- [exceljs](https://github.com/exceljs/exceljs)

Link to video : https://drive.google.com/drive/folders/1R79CMBLOJVWa6SfZzhgjKUYqBHg_6SZ2?usp=drive_link

