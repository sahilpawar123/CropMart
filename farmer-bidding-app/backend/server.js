// backend/server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const OLLAMA_API_URL = 'http://localhost:11434/api/chat';

// A new endpoint to handle chat history
app.post('/api/chat', async (req, res) => {
  // The frontend will send the entire conversation history
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    // Send the conversation history to Ollama
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama3", // Or your preferred model
        messages: messages, // Send the whole chat history for context
        stream: false,
      }),
    });

    const data = await response.json();
    
    // Send Ollama's new message back to the React app
    res.json({ response: data.message });

  } catch (error) {
    console.error('Error contacting Ollama:', error);
    res.status(500).json({ error: 'Failed to get a response from the AI' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});