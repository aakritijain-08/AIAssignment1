// Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import ChatHistory from './ChatHistory';
import './Chatbot.css';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [file, setFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleUploadPDF = async () => {
    if (!file) return;

    // Add user's file upload to chat history
    setChatHistory([...chatHistory, { role: 'user', content: `User uploaded PDF: ${file.name}` }]);

    // Send the PDF file to the server for processing
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }

    // Clear the file input
    setFile(null);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '' && !file) return;

    // Add user message or file to chat history
    const userMessage = file ? `User uploaded file: ${file.name}` : userInput;
    setChatHistory([...chatHistory, { role: 'user', content: userMessage }]);

    // If a file is uploaded, you can handle it here, e.g., send it to the server or process it in some way

    // Send user message to OpenAI API
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: userMessage,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `Bearer openai-API-Key`,
          },
        }
      );

      const botReply = response.data.choices[0].text.trim();

      // Add bot reply to chat history with a delay for a more interactive feel
      setTimeout(() => {
        setChatHistory([...chatHistory, { role: 'bot', content: botReply }]);
      }, 500);
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
    }

    // Clear user input and file
    setUserInput('');
    setFile(null);
  };

  return (
    <div className="chatbot-container">
      {/* Display the ChatHistory component here */}
      <ChatHistory chatHistory={chatHistory} />

      <div className="user-input">
        <div className="file-input">
          <input type="file" onChange={handleFileChange} />
          {file && <span>{file.name}</span>}
          <button onClick={handleUploadPDF}>Upload PDF</button>
        </div>

        <input
          type="text"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="Type your message..."
        />

        {/* Add a separate button for sending a message */}
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
