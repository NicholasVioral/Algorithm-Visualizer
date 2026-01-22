import React, { useState } from 'react';
import { Play, Code, Eye, Lightbulb } from 'lucide-react';
import './CodeExplainer.css';

export default function CodeExplainer() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [visualization, setVisualization] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze!');
      return;
    }

    setLoading(true);
    setExplanation('');
    setVisualization('');

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      
      // Handle Hugging Face response format
      let text = '';
      if (Array.isArray(data)) {
        text = data[0]?.generated_text || '';
      } else if (typeof data === 'string') {
        text = data;
      } else if (data.generated_text) {
        text = data.generated_text;
      }

      const expMatch = text.match(/EXPLANATION:([\s\S]*?)(?=VISUALIZATION:|$)/);
      const vizMatch = text.match(/VISUALIZATION:([\s\S]*)/);

      setExplanation(expMatch ? expMatch[1].trim() : text || 'No explanation available');
      setVisualization(vizMatch ? vizMatch[1].trim() : 'No visualization available');
    } catch (err) {
      console.error(err);
      setExplanation('Error analyzing code. Please try again.');
      setVisualization('');
    } finally {
      setLoading(false);
    }
  };

  // FIX: Example codes should be STRINGS, not function objects
  const exampleCodes = [
    {
      name: 'Bubble Sort',
      code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`
    },
    {
      name: 'Fibonacci',
      code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`
    },
    {
      name: 'Binary Search',
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
    }
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container">
      <div className="maxWidth">
        <div className="header">
          <div className="headerFlex">
            <Code size={40} color="#4f46e5" />
            <h1 className="title">Code Explainer & Visualizer</h1>
          </div>
          <p className="subtitle">
            Paste your code and get instant explanations with visual representations
          </p>
        </div>

        <div className={isMobile ? "grid" : "gridMd"}>
          <div className="card">
            <div className="cardHeader">
              <h2 className="cardTitle">
                <Code size={20} color="#4f46e5" />
                Enter Your Code
              </h2>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="textarea"
            />

            <div className="exampleSection">
              <p className="exampleLabel">Try an example:</p>
              <div className="exampleButtons">
                {exampleCodes.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCode(example.code)}
                    className="exampleButton"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={analyzeCode}
              disabled={loading}
              className={`analyzeButton ${loading ? "analyzeButtonDisabled" : ""}`}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Analyze Code
                </>
              )}
            </button>
          </div>

          <div className="rightColumn">
            <div className="card">
              <h2 className="cardTitle">
                <Lightbulb size={20} color="#f59e0b" />
                Explanation
              </h2>
              <div className="contentBox">
                {explanation ? (
                  <p className="contentText">{explanation}</p>
                ) : (
                  <p className="placeholder">
                    Your code explanation will appear here...
                  </p>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="cardTitle">
                <Eye size={20} color="#10b981" />
                Visualization
              </h2>
              <div className="contentBox">
                {visualization ? (
                  <pre className="preText">{visualization}</pre>
                ) : (
                  <p className="placeholder">
                    Your code visualization will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}