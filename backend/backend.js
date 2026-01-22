import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// FIX: Add CORS middleware
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { code } = req.body;

  // Use a better model for code explanation
  const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/Salesforce/codegen-350M-multi';

  try {
    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        // FIX: Proper template literal syntax
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // FIX: Proper template literal syntax
        inputs: `Explain this code step by step:\n\n${code}\n\nEXPLANATION:\n`
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));