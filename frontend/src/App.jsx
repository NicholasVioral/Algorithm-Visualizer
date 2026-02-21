import { useState } from "react";
import LandingPage from "./LandingPage";
import AlgorithmVisualizer from "./AlgorithmVisualizer";
import NewVisualizer from "./NewVisualizer";
import CodeExplainer from "./CodeExplainer";
import './App.css';

function App() {
  // 'landing' | 'setup' | 'ai-explainer' | 'visualize'
  const [currentView, setCurrentView] = useState('landing');
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
    setTimeout(() => {
      const algorithmSelect = document.querySelector('select[value="' + algorithm + '"]');
      if (algorithmSelect) {
        algorithmSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (currentView === 'landing') {
    return <LandingPage onNavigate={setCurrentView} />;
  }

  if (currentView === 'visualize') {
    return (
      <NewVisualizer
        data={visualizationData}
        onBack={handleBackToSetup}
      />
    );
  }

  return (
    <div className="app-container">
      <div className="view-toggle">
        <button
          className={`toggle-btn ${currentView === 'setup' ? 'active' : ''}`}
          onClick={() => setCurrentView('setup')}
        >
          📊 Manual Setup
        </button>
        <button
          className={`toggle-btn ${currentView === 'ai-explainer' ? 'active' : ''}`}
          onClick={() => setCurrentView('ai-explainer')}
        >
          🤖 AI Code Analyzer
        </button>
        <button
          className="toggle-btn home-btn"
          onClick={() => setCurrentView('landing')}
        >
          ← Home
        </button>
      </div>

      {currentView === 'setup' && (
        <AlgorithmVisualizer
          onStartVisualization={handleStartVisualization}
          preselectedAlgorithm={selectedAlgorithm}
        />
      )}
      {currentView === 'ai-explainer' && (
        <CodeExplainer onAlgorithmDetected={handleAlgorithmDetected} />
      )}
    </div>
  );
}

export default App;
