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

  // Use the Hugging Face model for code analysis
  const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/Salesforce/codegen-350M-mono';

  try {
    // Enhanced prompt to get better algorithm detection and explanation
    const prompt = `Analyze this code and identify:
1. What algorithm or data structure is being used
2. Time and space complexity
3. Step-by-step explanation

Code:
${code}

Analysis:`;

    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false
        }
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
      return res.json({
        explanation: rawText,
        success: true
      });
    }

    // Extract the generated text
    const explanation = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

    // Simple algorithm detection based on keywords in the explanation
    const detectedAlgorithm = detectAlgorithmFromExplanation(explanation || '', code);

    res.json({
      explanation,
      suggestedAlgorithm: detectedAlgorithm,
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch model', details: err.message });
  }
});

// Helper function to detect algorithm from AI explanation and code
function detectAlgorithmFromExplanation(explanation, code) {
  const text = (explanation + ' ' + code).toLowerCase();

  const algorithms = {
    'bubble': ['bubble sort', 'adjacent swap', 'bubble'],
    'merge': ['merge sort', 'divide and conquer', 'merge', 'mergesort'],
    'quick': ['quick sort', 'quicksort', 'pivot', 'partition'],
    'insertion': ['insertion sort', 'insert'],
    'selection': ['selection sort', 'select minimum'],
    'heap': ['heap sort', 'heapify', 'heap'],
    'binary': ['binary search', 'binary', 'divide search'],
    'linear': ['linear search', 'sequential search'],
    'bfs': ['breadth first', 'bfs', 'queue', 'level order'],
    'dfs': ['depth first', 'dfs', 'stack'],
    'dijkstra': ['dijkstra', 'shortest path', 'priority queue'],
    'twosum': ['two sum', 'twosum', 'pair sum'],
    'reverselist': ['reverse linked list', 'reverse list'],
    'validparentheses': ['valid parentheses', 'balanced brackets'],
    'longestsubstring': ['longest substring', 'sliding window'],
    'maxsubarray': ['maximum subarray', 'kadane'],
  };

  for (const [key, keywords] of Object.entries(algorithms)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return key;
    }
  }

  return null; // No algorithm detected
}

app.listen(5000, () => console.log('Server running on port 5000'));