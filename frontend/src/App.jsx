import React, { useState } from "react";
import AlgorithmVisualizer from "./AlgorithmVisualizer";
import NewVisualizer from "./NewVisualizer";

function App() {
  const [currentView, setCurrentView] = useState('setup'); // 'setup' or 'visualize'
  const [visualizationData, setVisualizationData] = useState(null);

  const handleStartVisualization = (data) => {
    setVisualizationData(data);
    setCurrentView('visualize');
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
    setVisualizationData(null);
  };

  return (
    <>
      {currentView === 'setup' ? (
        <AlgorithmVisualizer onStartVisualization={handleStartVisualization} />
      ) : (
        <NewVisualizer
          data={visualizationData}
          onBack={handleBackToSetup}
        />
      )}
    </>
  );
}

export default App;
