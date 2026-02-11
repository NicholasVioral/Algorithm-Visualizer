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
  }, [isPlaying, currentStep, steps.length]);

  const currentState = steps[currentStep] || {};

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

      {/* Input Display */}
      {data?.inputData && (
        <div className="input-display">
          <h3>📥 Input Data</h3>
          <div className="input-content">
            {data.inputData.type === 'array' && (
              <div className="input-item">
                <span className="input-label">Array:</span>
                <span className="input-value">[{data.inputData.value}]</span>
              </div>
            )}
            {data.inputData.type === 'array-search' && (
              <>
                <div className="input-item">
                  <span className="input-label">Array:</span>
                  <span className="input-value">[{data.inputData.array}]</span>
                </div>
                <div className="input-item">
                  <span className="input-label">Target:</span>
                  <span className="input-value target-highlight">{data.inputData.target}</span>
                </div>
              </>
            )}
            {data.inputData.type === 'graph' && (
              <>
                <div className="input-item">
                  <span className="input-label">Edges:</span>
                  <span className="input-value">{data.inputData.edges}</span>
                </div>
                <div className="input-item">
                  <span className="input-label">Start Node:</span>
                  <span className="input-value target-highlight">{data.inputData.startNode}</span>
                </div>
              </>
            )}
            {data.inputData.type === 'number' && (
              <div className="input-item">
                <span className="input-label">N:</span>
                <span className="input-value target-highlight">{data.inputData.value}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Split */}
      <div className="viz-content">

        {/* LEFT SIDE - What's Happening */}
        <div className="viz-explanation">
          {/* Steps Summary */}
          <div className="explanation-card steps-summary">
            <h2>📝 Steps Summary</h2>
            <div className="steps-list">
              {steps.slice(0, currentStep + 1).map((step, index) => (
                <div
                  key={index}
                  className={`step-item ${index === currentStep ? 'current-step' : 'completed-step'}`}
                >
                  <span className="step-number">{index + 1}</span>
                  <span className="step-description">
                    {index === currentStep ? '▶ ' : '✓ '}
                    {step.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

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

                  // Binary Search pointers
                  const isLeft = currentState.left !== undefined && currentState.left === index;
                  const isRight = currentState.right !== undefined && currentState.right === index;
                  const isMid = currentState.mid !== undefined && currentState.mid === index && currentState.mid !== -1;

                  // Determine which label to show
                  let showLabel = false;
                  let labelText = '';
                  let labelClass = '';

                  if (isMid) {
                    showLabel = true;
                    labelText = 'MID';
                    labelClass = 'label-mid';
                  } else if (isLeft) {
                    showLabel = true;
                    labelText = 'LEFT';
                    labelClass = 'label-left';
                  } else if (isRight) {
                    showLabel = true;
                    labelText = 'RIGHT';
                    labelClass = 'label-right';
                  } else if (isComparing) {
                    showLabel = true;
                    labelText = isFirst ? 'FIRST' : 'SECOND';
                    labelClass = currentState.swapped ? 'label-red' : 'label-yellow';
                  }

                  return (
                    <div key={index} className="bar-wrapper">
                      {/* Arrow and Label */}
                      {showLabel && (
                        <div className="bar-indicator">
                          <div className="arrow">▼</div>
                          <div className={`label ${labelClass}`}>
                            {labelText}
                            <div className="label-value">{value}</div>
                          </div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`array-bar ${
                          isMid ? 'bar-mid' :
                          isLeft ? 'bar-left' :
                          isRight ? 'bar-right' :
                          isComparing ? (currentState.swapped ? 'bar-swapping' : 'bar-comparing') :
                          'bar-normal'
                        }`}
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

          {/* Graph Visualization (for BFS/DFS/Dijkstra algorithms) */}
          {currentState.graph && (
            <div className="graph-display">
              <svg className="graph-svg" viewBox="0 0 800 600">
                {/* Calculate node positions in hierarchical tree layout */}
                {(() => {
                  const nodes = Object.keys(currentState.graph).map(n => parseInt(n)).sort((a, b) => a - b);
                  const nodePositions = {};
                  const levelHeight = 120;
                  const startY = 80;

                  // Organize nodes into levels (tree-like structure)
                  // Level 0: node 0
                  // Level 1: nodes 1, 2
                  // Level 2: nodes 3, 4, 5, 6
                  // etc.
                  const levels = [];
                  let currentLevel = 0;
                  let nodesInCurrentLevel = 1;
                  let nodeIndex = 0;

                  while (nodeIndex < nodes.length) {
                    const levelNodes = [];
                    for (let i = 0; i < nodesInCurrentLevel && nodeIndex < nodes.length; i++) {
                      levelNodes.push(nodes[nodeIndex]);
                      nodeIndex++;
                    }
                    levels.push(levelNodes);
                    currentLevel++;
                    nodesInCurrentLevel *= 2; // Each level has twice as many nodes
                  }

                  // Position nodes in each level
                  levels.forEach((levelNodes, levelIndex) => {
                    const levelY = startY + (levelIndex * levelHeight);
                    const levelWidth = 700;
                    const nodeSpacing = levelWidth / (levelNodes.length + 1);

                    levelNodes.forEach((node, nodeIdx) => {
                      nodePositions[node] = {
                        x: 50 + nodeSpacing * (nodeIdx + 1),
                        y: levelY
                      };
                    });
                  });

                  // Draw edges first (so they appear behind nodes)
                  const edges = [];
                  const drawnEdges = new Set();

                  nodes.forEach(node => {
                    const neighbors = currentState.graph[node] || [];
                    neighbors.forEach(neighbor => {
                      const neighborNode = typeof neighbor === 'object' ? neighbor.node : neighbor;
                      const edgeKey = [node, neighborNode].sort().join('-');

                      if (!drawnEdges.has(edgeKey) && nodePositions[neighborNode]) {
                        drawnEdges.add(edgeKey);
                        const isTraversed = currentState.visited &&
                          (currentState.visited.has(node) && currentState.visited.has(neighborNode));
                        const isCurrent = (currentState.current === node &&
                          ((currentState.queue && currentState.queue.includes(neighborNode)) ||
                           (currentState.stack && currentState.stack.includes(neighborNode)))) ||
                          (currentState.current === neighborNode &&
                          ((currentState.queue && currentState.queue.includes(node)) ||
                           (currentState.stack && currentState.stack.includes(node))));

                        edges.push(
                          <g key={edgeKey}>
                            <line
                              x1={nodePositions[node].x}
                              y1={nodePositions[node].y}
                              x2={nodePositions[neighborNode].x}
                              y2={nodePositions[neighborNode].y}
                              className={`graph-edge ${isTraversed ? 'edge-traversed' : isCurrent ? 'edge-current' : 'edge-default'}`}
                              strokeWidth="4"
                            />
                            {/* Edge weight for Dijkstra */}
                            {typeof neighbor === 'object' && neighbor.weight && (
                              <text
                                x={(nodePositions[node].x + nodePositions[neighborNode].x) / 2}
                                y={(nodePositions[node].y + nodePositions[neighborNode].y) / 2}
                                className="edge-weight"
                                textAnchor="middle"
                                dy="-5"
                              >
                                {neighbor.weight}
                              </text>
                            )}
                          </g>
                        );
                      }
                    });
                  });

                  return (
                    <>
                      {edges}
                      {/* Draw nodes */}
                      {nodes.map(node => {
                        const pos = nodePositions[node];
                        const isVisited = currentState.visited && currentState.visited.has(node);
                        const isCurrent = currentState.current === node;
                        const inQueue = currentState.queue && currentState.queue.includes(node);
                        const inStack = currentState.stack && currentState.stack.includes(node);

                        const nodeClass = isCurrent ? 'node-current' :
                                        isVisited ? 'node-visited' :
                                        (inQueue || inStack) ? 'node-queued' :
                                        'node-unvisited';

                        return (
                          <g key={node}>
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r="35"
                              className={`svg-graph-node ${nodeClass}`}
                            />
                            <text
                              x={pos.x}
                              y={pos.y}
                              className="node-text"
                              textAnchor="middle"
                              dy="0.35em"
                            >
                              {node}
                            </text>
                            {/* Distance label for Dijkstra */}
                            {currentState.distances && currentState.distances[node] !== undefined && (
                              <text
                                x={pos.x}
                                y={pos.y + 55}
                                className="distance-label"
                                textAnchor="middle"
                              >
                                d: {currentState.distances[node] === Infinity ? '∞' : currentState.distances[node]}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              {/* Legend */}
              <div className="graph-legend">
                <div className="legend-item">
                  <div className="legend-dot legend-unvisited"></div>
                  <span>Unvisited</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-queued"></div>
                  <span>Queued/Stacked</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-current"></div>
                  <span>Current</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-visited"></div>
                  <span>Visited</span>
                </div>
              </div>

              {/* Queue/Stack Display */}
              {(currentState.queue || currentState.stack) && (
                <div className="data-structure-display">
                  <h3>{currentState.queue ? 'Queue (FIFO)' : 'Stack (LIFO)'}</h3>
                  <div className="ds-items">
                    {(currentState.queue || currentState.stack).length === 0 ? (
                      <div className="ds-empty">Empty</div>
                    ) : (
                      (currentState.queue || currentState.stack).map((node, idx) => (
                        <div key={idx} className="ds-item">
                          {node}
                          {currentState.queue && idx === 0 && <span className="ds-arrow">← Front</span>}
                          {currentState.stack && idx === (currentState.stack.length - 1) && <span className="ds-arrow">← Top</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tree Visualization (for BST algorithms) */}
          {currentState.tree && (
            <div className="tree-display">
              <svg className="tree-svg" viewBox="0 0 800 600">
                {(() => {
                  // Helper function to calculate tree positions
                  const calculatePositions = (node, depth = 0, left = 0, right = 800) => {
                    if (!node) return [];

                    const positions = [];
                    const x = (left + right) / 2;
                    const y = 80 + depth * 100;

                    positions.push({ node, x, y, depth });

                    const mid = (left + right) / 2;
                    if (node.left) {
                      positions.push(...calculatePositions(node.left, depth + 1, left, mid));
                    }
                    if (node.right) {
                      positions.push(...calculatePositions(node.right, depth + 1, mid, right));
                    }

                    return positions;
                  };

                  const positions = calculatePositions(currentState.tree);
                  const edges = [];

                  // Draw edges
                  positions.forEach(({ node, x, y }) => {
                    if (node.left) {
                      const leftPos = positions.find(p => p.node === node.left);
                      if (leftPos) {
                        const isInPath = currentState.path &&
                          currentState.path.includes(node.val) &&
                          currentState.path.includes(leftPos.node.val);
                        edges.push(
                          <line
                            key={`${node.val}-left`}
                            x1={x}
                            y1={y}
                            x2={leftPos.x}
                            y2={leftPos.y}
                            className={`tree-edge ${isInPath ? 'edge-in-path' : 'edge-default'}`}
                            strokeWidth="3"
                          />
                        );
                      }
                    }
                    if (node.right) {
                      const rightPos = positions.find(p => p.node === node.right);
                      if (rightPos) {
                        const isInPath = currentState.path &&
                          currentState.path.includes(node.val) &&
                          currentState.path.includes(rightPos.node.val);
                        edges.push(
                          <line
                            key={`${node.val}-right`}
                            x1={x}
                            y1={y}
                            x2={rightPos.x}
                            y2={rightPos.y}
                            className={`tree-edge ${isInPath ? 'edge-in-path' : 'edge-default'}`}
                            strokeWidth="3"
                          />
                        );
                      }
                    }
                  });

                  return (
                    <>
                      {edges}
                      {positions.map(({ node, x, y }) => {
                        const isInserting = currentState.inserting === node.val;
                        const isSearching = currentState.searching === node.val || currentState.current === node.val;
                        const isInPath = currentState.path && currentState.path.includes(node.val);
                        const isFound = currentState.found && currentState.current === node.val;

                        const nodeClass = isFound ? 'tree-node-found' :
                                        isInserting || isSearching ? 'tree-node-current' :
                                        isInPath ? 'tree-node-path' :
                                        'tree-node-normal';

                        return (
                          <g key={node.val}>
                            <circle
                              cx={x}
                              cy={y}
                              r="30"
                              className={`svg-tree-node ${nodeClass}`}
                            />
                            <text
                              x={x}
                              y={y}
                              className="tree-node-text"
                              textAnchor="middle"
                              dy="0.35em"
                            >
                              {node.val}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              {/* Tree Legend */}
              <div className="tree-legend">
                <div className="legend-item">
                  <div className="legend-dot legend-tree-normal"></div>
                  <span>Normal Node</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-tree-path"></div>
                  <span>In Path</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-tree-current"></div>
                  <span>Current</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-tree-found"></div>
                  <span>Found/Inserted</span>
                </div>
              </div>
            </div>
          )}

          {/* Call Stack Visualization (for Recursion/Fibonacci) */}
          {currentState.callStack && (
            <div className="callstack-display">
              <h2>📚 Call Stack</h2>
              <div className="callstack-container">
                {currentState.callStack.length === 0 ? (
                  <div className="callstack-empty">Empty Stack</div>
                ) : (
                  currentState.callStack.map((call, index) => (
                    <div
                      key={index}
                      className={`callstack-frame ${call.returning ? 'frame-returning' : 'frame-active'}`}
                      style={{ marginLeft: `${call.depth * 20}px` }}
                    >
                      <div className="frame-header">
                        <span className="frame-function">{call.function}</span>
                        {call.returning && (
                          <span className="frame-return">→ {call.result}</span>
                        )}
                      </div>
                      <div className="frame-depth">Depth: {call.depth}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="callstack-info">
                <span className="info-label">Stack Size:</span>
                <span className="info-value">{currentState.callStack.length}</span>
              </div>
            </div>
          )}

          {/* DP Array Visualization (for Fibonacci DP, Coin Change, etc.) */}
          {currentState.dp && (
            <div className="dp-display">
              <h2>📊 DP Array</h2>
              <div className="dp-container">
                {currentState.dp.map((value, index) => (
                  <div key={index} className="dp-cell-wrapper">
                    <div
                      className={`dp-cell ${
                        index === currentState.current ? 'cell-current' :
                        value !== -1 && value !== Infinity ? 'cell-computed' :
                        'cell-empty'
                      }`}
                    >
                      {value === -1 || value === Infinity ? '∞' : value}
                    </div>
                    <div className="dp-index">dp[{index}]</div>
                  </div>
                ))}
              </div>
              <div className="dp-legend">
                <div className="legend-item">
                  <div className="legend-dot cell-empty"></div>
                  <span>Not Computed</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot cell-current"></div>
                  <span>Computing</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot cell-computed"></div>
                  <span>Computed</span>
                </div>
              </div>
            </div>
          )}

          {/* DP Array Visualization (for Coin Change) */}
          {currentState.dpArray && (
            <div className="dp-display">
              <h2>📊 DP Array (Minimum Coins)</h2>
              <div className="dp-container">
                {currentState.dpArray.map((value, index) => (
                  <div key={index} className="dp-cell-wrapper">
                    <div
                      className={`dp-cell ${
                        index === currentState.currentAmount ? 'cell-current' :
                        value !== Infinity ? 'cell-computed' :
                        'cell-empty'
                      }`}
                    >
                      {value === Infinity ? '∞' : value}
                    </div>
                    <div className="dp-index">dp[{index}]</div>
                  </div>
                ))}
              </div>
              {currentState.currentCoin && (
                <div className="coin-trying">
                  <span>Trying coin: <strong>{currentState.currentCoin}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Tower of Hanoi Visualization */}
          {currentState.towers && (
            <div className="hanoi-display">
              <h2>🗼 Tower of Hanoi</h2>
              <div className="hanoi-container">
                {['A', 'B', 'C'].map(tower => (
                  <div key={tower} className="tower-wrapper">
                    <div className="tower-label">Tower {tower}</div>
                    <div className="tower-pole">
                      <div className="pole"></div>
                      <div className="disks-container">
                        {currentState.towers[tower].length === 0 ? (
                          <div className="no-disks">Empty</div>
                        ) : (
                          currentState.towers[tower].map((disk, index) => (
                            <div
                              key={index}
                              className={`disk disk-size-${disk} ${
                                currentState.move &&
                                ((currentState.move.from === tower && index === currentState.towers[tower].length - 1) ||
                                 (currentState.move.to === tower && index === currentState.towers[tower].length - 1))
                                  ? 'disk-moving'
                                  : ''
                              }`}
                              style={{ width: `${disk * 30 + 40}px` }}
                            >
                              {disk}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="tower-base"></div>
                    </div>
                  </div>
                ))}
              </div>
              {currentState.move && (
                <div className="hanoi-move-info">
                  <span className="move-arrow">➜</span>
                  Moving disk <strong>{currentState.move.disk}</strong> from{' '}
                  <strong>{currentState.move.from}</strong> to{' '}
                  <strong>{currentState.move.to}</strong>
                </div>
              )}
            </div>
          )}

          {/* Hash Map Visualization (for Two Sum, etc.) */}
          {currentState.hashMap !== undefined && (
            <div className="hashmap-display">
              <h2>🗂️ Hash Map</h2>
              <div className="hashmap-container">
                {Object.keys(currentState.hashMap).length === 0 ? (
                  <div className="hashmap-empty">Empty Hash Map</div>
                ) : (
                  <div className="hashmap-entries">
                    {Object.entries(currentState.hashMap).map(([key, value]) => (
                      <div
                        key={key}
                        className={`hashmap-entry ${
                          currentState.complement !== undefined && parseInt(key) === currentState.complement
                            ? 'entry-highlight'
                            : ''
                        }`}
                      >
                        <div className="entry-key">{key}</div>
                        <div className="entry-arrow">→</div>
                        <div className="entry-value">index {value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {currentState.complement !== undefined && (
                <div className="hashmap-search">
                  <span className="search-label">Looking for:</span>
                  <span className="search-value">{currentState.complement}</span>
                  <span className="search-result">
                    {currentState.complement in currentState.hashMap ? (
                      <span className="found">✓ Found at index {currentState.hashMap[currentState.complement]}</span>
                    ) : (
                      <span className="not-found">✗ Not in map</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Product Array Visualization (for Product of Array Except Self) */}
          {currentState.prefixProducts && currentState.suffixProducts && (
            <div className="product-array-display">
              <h2>🔢 Product of Array Except Self</h2>

              {/* Original Array */}
              <div className="product-section">
                <h3>Original Array:</h3>
                <div className="product-row">
                  {currentState.array.map((value, index) => (
                    <div key={index} className={`product-cell ${index === currentState.currentIndex ? 'cell-current' : ''}`}>
                      <div className="cell-value">{value}</div>
                      <div className="cell-index">[{index}]</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prefix Products */}
              <div className="product-section">
                <h3>Prefix Products (left to right):</h3>
                <div className="product-row">
                  {currentState.prefixProducts.map((value, index) => (
                    <div key={index} className={`product-cell cell-prefix ${index === currentState.currentIndex ? 'cell-current' : ''}`}>
                      <div className="cell-value">{value}</div>
                      <div className="cell-index">[{index}]</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suffix Products */}
              <div className="product-section">
                <h3>Suffix Products (right to left):</h3>
                <div className="product-row">
                  {currentState.suffixProducts.map((value, index) => (
                    <div key={index} className={`product-cell cell-suffix ${index === currentState.currentIndex ? 'cell-current' : ''}`}>
                      <div className="cell-value">{value}</div>
                      <div className="cell-index">[{index}]</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="product-section">
                <h3>Result (prefix × suffix):</h3>
                <div className="product-row">
                  {currentState.result.map((value, index) => (
                    <div key={index} className={`product-cell cell-result ${index === currentState.currentIndex ? 'cell-current' : value !== 1 ? 'cell-computed' : ''}`}>
                      <div className="cell-value">{value}</div>
                      <div className="cell-index">[{index}]</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Merge Intervals Visualization */}
          {currentState.intervals && currentState.merged !== undefined && (
            <div className="intervals-display">
              <h2>📅 Merge Intervals</h2>

              {/* Original Intervals */}
              <div className="intervals-section">
                <h3>Original Intervals:</h3>
                <div className="timeline">
                  {currentState.intervals.map((interval, index) => {
                    const start = interval[0];
                    const end = interval[1];
                    const width = end - start;
                    const isCurrent = index === currentState.currentIndex;

                    return (
                      <div key={index} className="timeline-row">
                        <div className="interval-label">[{start}, {end}]</div>
                        <div className="interval-track">
                          <div
                            className={`interval-bar interval-original ${isCurrent ? 'interval-current' : ''}`}
                            style={{
                              left: `${start * 4}%`,
                              width: `${width * 4}%`,
                              maxWidth: '90%'
                            }}
                          >
                            <span className="interval-text">{start}-{end}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Merged Intervals */}
              {currentState.merged.length > 0 && (
                <div className="intervals-section">
                  <h3>Merged Intervals ({currentState.merged.length}):</h3>
                  <div className="timeline">
                    {currentState.merged.map((interval, index) => {
                      const start = interval[0];
                      const end = interval[1];
                      const width = end - start;
                      const isLastMerged = index === currentState.lastMergedIndex;

                      return (
                        <div key={index} className="timeline-row">
                          <div className="interval-label">[{start}, {end}]</div>
                          <div className="interval-track">
                            <div
                              className={`interval-bar interval-merged ${isLastMerged ? 'interval-active' : ''} ${currentState.merged_into && isLastMerged ? 'interval-merged-animation' : ''}`}
                              style={{
                                left: `${start * 4}%`,
                                width: `${width * 4}%`,
                                maxWidth: '90%'
                              }}
                            >
                              <span className="interval-text">{start}-{end}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stack Visualization (for Valid Parentheses) */}
          {currentState.string && currentState.stack !== undefined && (
            <div className="stack-display">
              <h2>📚 Stack</h2>
              <div className="stack-container">
                {currentState.stack.length === 0 ? (
                  <div className="stack-empty">Empty Stack</div>
                ) : (
                  <div className="stack-items">
                    {currentState.stack.map((char, index) => (
                      <div
                        key={index}
                        className={`stack-item ${index === currentState.stack.length - 1 ? 'stack-top' : ''}`}
                      >
                        {char}
                        {index === currentState.stack.length - 1 && <span className="stack-label">← Top</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="string-display-paren">
                <h3>Input String:</h3>
                <div className="string-chars">
                  {currentState.string.split('').map((char, index) => (
                    <div
                      key={index}
                      className={`string-char ${
                        index === currentState.currentIndex ? 'char-current' :
                        index < currentState.currentIndex ? 'char-processed' :
                        'char-unprocessed'
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>
              {currentState.action && (
                <div className={`stack-action action-${currentState.action}`}>
                  {currentState.action === 'push' && `⬆️ Pushing '${currentState.currentChar}'`}
                  {currentState.action === 'pop' && `⬇️ Popping '${currentState.matched}' to match '${currentState.currentChar}'`}
                  {currentState.action === 'invalid' && `❌ Invalid! Cannot match '${currentState.currentChar}'`}
                </div>
              )}
            </div>
          )}

          {/* String Sliding Window Visualization (for Longest Substring) */}
          {currentState.string && currentState.windowStart !== undefined && (
            <div className="sliding-window-display">
              <h2>🪟 Sliding Window</h2>
              <div className="string-display-window">
                <div className="string-chars">
                  {currentState.string.split('').map((char, index) => (
                    <div
                      key={index}
                      className={`string-char ${
                        index >= currentState.windowStart && index <= currentState.windowEnd ? 'char-in-window' :
                        index === currentState.currentIndex ? 'char-current' :
                        index < currentState.currentIndex ? 'char-processed' :
                        'char-unprocessed'
                      }`}
                    >
                      <div className="char-value">{char}</div>
                      <div className="char-index">{index}</div>
                    </div>
                  ))}
                </div>
                <div className="window-info">
                  <div className="window-bounds">
                    <span>Left: <strong>{currentState.windowStart}</strong></span>
                    <span>Right: <strong>{currentState.windowEnd >= 0 ? currentState.windowEnd : 'N/A'}</strong></span>
                    <span>Size: <strong>{currentState.windowEnd >= currentState.windowStart ? currentState.windowEnd - currentState.windowStart + 1 : 0}</strong></span>
                  </div>
                  {currentState.maxLength !== undefined && (
                    <div className="max-length">
                      Max Length: <strong>{currentState.maxLength}</strong>
                    </div>
                  )}
                </div>
              </div>
              {currentState.charSet && currentState.charSet.size > 0 && (
                <div className="charset-display">
                  <h3>Characters in Window:</h3>
                  <div className="charset-items">
                    {Array.from(currentState.charSet).map((char, idx) => (
                      <div key={idx} className="charset-item">{char}</div>
                    ))}
                  </div>
                </div>
              )}
              {currentState.duplicate && (
                <div className="window-action">
                  ⚠️ Duplicate '{currentState.duplicate}' found - contracting window
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
