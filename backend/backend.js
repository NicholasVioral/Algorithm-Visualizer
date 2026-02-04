import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  // Use the NEW router endpoint
  const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/Salesforce/codegen-350M-mono';

  try {
    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `Explain this code step by step:\n\n${code}\n\nExplanation:`
      })
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error('HF ERROR:', rawText);
      return res.status(response.status).json({
        error: 'Hugging Face error',
        details: rawText
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.json({ generated_text: rawText });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));