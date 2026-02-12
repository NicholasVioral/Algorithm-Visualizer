import React, { useState } from "react";
import AlgorithmVisualizer from "./AlgorithmVisualizer";
import NewVisualizer from "./NewVisualizer";
import CodeExplainer from "./CodeExplainer";
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('setup'); // 'setup', 'visualize', or 'ai-explainer'
  const [visualizationData, setVisualizationData] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const handleStartVisualization = (data) => {
    setVisualizationData(data);
    setCurrentView('visualize');
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
    setVisualizationData(null);
  };

  const handleAlgorithmDetected = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCurrentView('setup');
    // Scroll to algorithm selector if needed
    setTimeout(() => {
      const algorithmSelect = document.querySelector('select[value="' + algorithm + '"]');
      if (algorithmSelect) {
        algorithmSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <>
      {currentView === 'setup' && (
        <div className="app-container">
          <div className="view-toggle">
            <button
              className="toggle-btn active"
              onClick={() => setCurrentView('setup')}
            >
              📊 Manual Setup
            </button>
            <button
              className="toggle-btn"
              onClick={() => setCurrentView('ai-explainer')}
            >
              🤖 AI Code Analyzer
            </button>
          </div>
          <AlgorithmVisualizer
            onStartVisualization={handleStartVisualization}
            preselectedAlgorithm={selectedAlgorithm}
          />
        </div>
      )}
      {currentView === 'ai-explainer' && (
        <div className="app-container">
          <div className="view-toggle">
            <button
              className="toggle-btn"
              onClick={() => setCurrentView('setup')}
            >
              📊 Manual Setup
            </button>
            <button
              className="toggle-btn active"
              onClick={() => setCurrentView('ai-explainer')}
            >
              🤖 AI Code Analyzer
            </button>
          </div>
          <CodeExplainer onAlgorithmDetected={handleAlgorithmDetected} />
        </div>
      )}
      {currentView === 'visualize' && (
        <NewVisualizer
          data={visualizationData}
          onBack={handleBackToSetup}
        />
      )}
    </>
  );
}

export default App;
