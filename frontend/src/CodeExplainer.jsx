import React, { useState } from 'react';
import { detectAlgorithm } from './codeAnalyzer';
import './CodeExplainer.css';

const CodeExplainer = ({ onAlgorithmDetected }) => {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [suggestedAlgorithm, setSuggestedAlgorithm] = useState(null);
  const [algorithmName, setAlgorithmName] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
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
    setAlgorithmName('');
    setConfidence(null);
    setAlternatives([]);

    try {
      // Detection runs entirely in the browser; no backend needed.
      const result = detectAlgorithm(code);

      setExplanation(result.explanation || 'Analysis complete');
      setSuggestedAlgorithm(result.key);
      setAlgorithmName(result.name || result.key || '');
      setConfidence(typeof result.confidence === 'number' ? result.confidence : null);
      setAlternatives(Array.isArray(result.alternatives) ? result.alternatives : []);
    } catch (err) {
      setError(err.message || 'Failed to analyze code');
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
                  {algorithmName || suggestedAlgorithm}
                </div>

                {confidence !== null && (
                  <div className="confidence-meter">
                    <div className="confidence-labels">
                      <span>Confidence</span>
                      <span>{confidence}%</span>
                    </div>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${confidence}%`,
                          background:
                            confidence >= 75
                              ? '#22c55e'
                              : confidence >= 50
                              ? '#eab308'
                              : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                )}

                {alternatives.length > 0 && (
                  <div className="alternatives">
                    <span className="alternatives-label">Other possibilities:</span>
                    <div className="alternatives-list">
                      {alternatives.map((alt) => (
                        <span key={alt.key} className="alternative-chip">
                          {alt.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
