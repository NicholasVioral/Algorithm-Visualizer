import React, { useState } from 'react';
import './CodeExplainer.css';

const CodeExplainer = ({ onAlgorithmDetected }) => {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [suggestedAlgorithm, setSuggestedAlgorithm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setExplanation('');
    setSuggestedAlgorithm(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze code');
      }

      setExplanation(data.explanation || 'Analysis complete');
      setSuggestedAlgorithm(data.suggestedAlgorithm);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseAlgorithm = () => {
    if (suggestedAlgorithm && onAlgorithmDetected) {
      onAlgorithmDetected(suggestedAlgorithm);
    }
  };

  const exampleCode = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`;

  return (
    <div className="code-explainer">
      <div className="explainer-header">
        <h2>🤖 AI Code Analyzer</h2>
        <p>Paste your code and let AI explain it and suggest which algorithm to visualize!</p>
      </div>

      <div className="explainer-content">
        <div className="code-input-section">
          <div className="section-header">
            <label htmlFor="code-input">Your Code:</label>
            <button
              className="example-btn"
              onClick={() => setCode(exampleCode)}
              disabled={loading}
            >
              Load Example
            </button>
          </div>
          <textarea
            id="code-input"
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your algorithm code here..."
            rows={12}
            disabled={loading}
          />
          <button
            className="analyze-btn"
            onClick={analyzeCode}
            disabled={loading || !code.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              '✨ Analyze with AI'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {(explanation || suggestedAlgorithm) && (
          <div className="results-section">
            {suggestedAlgorithm && (
              <div className="algorithm-suggestion">
                <h3>🎯 Detected Algorithm</h3>
                <div className="algorithm-badge">
                  {suggestedAlgorithm}
                </div>
                <button
                  className="use-algorithm-btn"
                  onClick={handleUseAlgorithm}
                >
                  Visualize This Algorithm →
                </button>
              </div>
            )}

            {explanation && (
              <div className="explanation-section">
                <h3>📝 AI Explanation</h3>
                <div className="explanation-text">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !explanation && !error && (
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <p>Paste your algorithm code above and click "Analyze with AI" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExplainer;
