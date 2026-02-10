import React, { useState, useEffect } from 'react';
import './NewVisualizer.css';

const NewVisualizer = ({ data, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Use data from props
  const steps = data?.steps || [];
  const algorithmName = data?.algorithmName || 'Algorithm';
  const algorithm = data?.algorithm || 'bubble';

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const currentState = steps[currentStep];

  if (!data || steps.length === 0) {
    return (
      <div className="new-visualizer">
        <div className="viz-header">
          <h1>No Visualization Data</h1>
          <p>Please go back and generate a visualization</p>
        </div>
        {onBack && (
          <button className="control-btn" onClick={onBack}>← Back to Setup</button>
        )}
      </div>
    );
  }

  return (
    <div className="new-visualizer">
      {/* Back Button */}
      {onBack && (
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Setup
        </button>
      )}

      {/* Header */}
      <div className="viz-header">
        <h1>{algorithmName} - Step by Step</h1>
        <p>Step {currentStep + 1} of {steps.length}</p>
      </div>

      {/* Main Content Split */}
      <div className="viz-content">

        {/* LEFT SIDE - What's Happening */}
        <div className="viz-explanation">
          <div className="explanation-card">
            <h2>📋 Current Action</h2>
            <div className="action-description">
              {currentState.description}
            </div>
          </div>

          {/* Phase */}
          {currentState.phase && (
            <div className="explanation-card">
              <h2>🎯 Phase</h2>
              <div className="detail-item">
                <span className="detail-value phase-badge">
                  {currentState.phase}
                </span>
              </div>
            </div>
          )}

          {/* Variables */}
          {currentState.variables && Object.keys(currentState.variables).length > 0 && (
            <div className="explanation-card">
              <h2>📊 Variables</h2>
              <div className="variables-grid">
                {Object.entries(currentState.variables).map(([key, value]) => (
                  <div key={key} className="var-item">
                    <span className="var-name">{key}:</span>
                    <span className="var-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operations */}
          {currentState.operations && Object.keys(currentState.operations).length > 0 && (
            <div className="explanation-card">
              <h2>🔢 Operations</h2>
              <div className="variables-grid">
                {Object.entries(currentState.operations).map(([key, value]) => (
                  <div key={key} className="var-item">
                    <span className="var-name">{key}:</span>
                    <span className="var-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insight */}
          {currentState.insight && (
            <div className="explanation-card insight-card">
              <h2>💡 Key Insight</h2>
              <div className="insight-text">
                {currentState.insight}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Visual Array */}
        <div className="viz-display">
          <h2>Visual Representation</h2>

          {/* Array Visualization (for sorting/searching algorithms) */}
          {currentState.array && (
            <>
              <div className="array-display">
                {currentState.array.map((value, index) => {
                  const isComparing = currentState.comparing && currentState.comparing.includes(index);
                  const isFirst = currentState.comparing && currentState.comparing[0] === index;
                  const isSecond = currentState.comparing && currentState.comparing[1] === index;

                  return (
                    <div key={index} className="bar-wrapper">
                      {/* Arrow and Label */}
                      {isComparing && (
                        <div className="bar-indicator">
                          <div className="arrow">▼</div>
                          <div className={`label ${currentState.swapped ? 'label-red' : 'label-yellow'}`}>
                            {isFirst ? 'FIRST' : 'SECOND'}
                            <div className="label-value">{value}</div>
                          </div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`array-bar ${isComparing ? (currentState.swapped ? 'bar-swapping' : 'bar-comparing') : 'bar-normal'}`}
                        style={{ height: `${value * 4}px` }}
                      >
                        <span className="bar-value">{value}</span>
                      </div>

                      {/* Index */}
                      <div className="bar-index">[{index}]</div>
                    </div>
                  );
                })}
              </div>

              {/* Visual Connection */}
              {currentState.comparing && currentState.comparing.length >= 2 && (
                <div className="comparison-line">
                  <div className="line-label">
                    {currentState.array[currentState.comparing[0]]}
                    {currentState.swapped ? ' > ' : ' vs '}
                    {currentState.array[currentState.comparing[1]]}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Graph Visualization (for BFS/DFS algorithms) */}
          {currentState.graph && (
            <div className="graph-display">
              <div className="graph-container">
                {Object.keys(currentState.graph).map(node => {
                  const nodeNum = parseInt(node);
                  const isVisited = currentState.visited && currentState.visited.has(nodeNum);
                  const isCurrent = currentState.current === nodeNum;
                  const inQueue = currentState.queue && currentState.queue.includes(nodeNum);
                  const inStack = currentState.stack && currentState.stack.includes(nodeNum);

                  return (
                    <div key={node} className="graph-node-wrapper">
                      <div
                        className={`graph-node ${
                          isCurrent ? 'node-current' :
                          isVisited ? 'node-visited' :
                          (inQueue || inStack) ? 'node-queued' :
                          'node-unvisited'
                        }`}
                      >
                        {node}
                      </div>
                      {isCurrent && <div className="node-label">CURRENT</div>}
                      {isVisited && !isCurrent && <div className="node-label node-label-visited">VISITED</div>}
                      {(inQueue || inStack) && !isCurrent && !isVisited && (
                        <div className="node-label node-label-queued">
                          {inQueue ? 'IN QUEUE' : 'IN STACK'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Queue/Stack Display */}
              {(currentState.queue || currentState.stack) && (
                <div className="data-structure-display">
                  <h3>{currentState.queue ? 'Queue' : 'Stack'}</h3>
                  <div className="ds-items">
                    {(currentState.queue || currentState.stack).map((node, idx) => (
                      <div key={idx} className="ds-item">
                        {node}
                      </div>
                    ))}
                    {((currentState.queue && currentState.queue.length === 0) ||
                      (currentState.stack && currentState.stack.length === 0)) && (
                      <div className="ds-empty">Empty</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="viz-controls">
        <button
          className="control-btn"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          ← Previous
        </button>

        <button
          className="control-btn control-btn-play"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          className="control-btn"
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next →
        </button>

        <button
          className="control-btn"
          onClick={() => setCurrentStep(0)}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

export default NewVisualizer;
