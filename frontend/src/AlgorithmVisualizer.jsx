import React, { useState, useEffect } from 'react';
import './AlgorithmVisualizer.css';

// Icon Components
const PlayIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RotateCcwIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Algorithm Functions
const generateBubbleSortSteps = (arr) => {
  const steps = [{ array: [...arr], comparing: [], swapped: false, description: 'Initial array' }];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: false,
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`
      });
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: true,
          description: `Swapped ${arr[j + 1]} and ${arr[j]}`
        });
      }
    }
  }
  
  steps.push({ array: [...arr], comparing: [], swapped: false, description: 'Sorted!' });
  return steps;
};

const generateMergeSortSteps = (arr) => {
  const steps = [{ array: [...arr], highlight: [], description: 'Initial array' }];
  
  const merge = (left, right) => {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  };
  
  const mergeSortHelper = (array, start = 0) => {
    if (array.length <= 1) return array;
    
    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);
    
    steps.push({
      array: [...arr],
      highlight: Array.from({ length: array.length }, (_, i) => start + i),
      description: `Dividing array at position ${start + mid}`
    });
    
    const sortedLeft = mergeSortHelper(left, start);
    const sortedRight = mergeSortHelper(right, start + mid);
    const merged = merge(sortedLeft, sortedRight);
    
    for (let i = 0; i < merged.length; i++) {
      arr[start + i] = merged[i];
    }
    
    steps.push({
      array: [...arr],
      highlight: Array.from({ length: merged.length }, (_, i) => start + i),
      description: `Merged segments`
    });
    
    return merged;
  };
  
  mergeSortHelper([...arr]);
  steps.push({ array: [...arr], highlight: [], description: 'Sorted!' });
  return steps;
};

const generateQuickSortSteps = (arr) => {
  const steps = [{ array: [...arr], pivot: -1, highlight: [], description: 'Initial array' }];
  
  const partition = (low, high) => {
    const pivot = arr[high];
    steps.push({
      array: [...arr],
      pivot: high,
      highlight: Array.from({ length: high - low + 1 }, (_, i) => low + i),
      description: `Pivot: ${pivot}`
    });
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: [...arr],
          pivot: high,
          highlight: [i, j],
          description: `Swapped ${arr[i]} and ${arr[j]}`
        });
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      pivot: i + 1,
      highlight: [i + 1, high],
      description: `Placed pivot in correct position`
    });
    
    return i + 1;
  };
  
  const quickSortHelper = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  };
  
  quickSortHelper(0, arr.length - 1);
  steps.push({ array: [...arr], pivot: -1, highlight: [], description: 'Sorted!' });
  return steps;
};

const generateBinarySearchSteps = (arr, target) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps = [{ array: sorted, left: 0, right: sorted.length - 1, mid: -1, description: 'Searching for ' + target }];
  
  let left = 0;
  let right = sorted.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({
      array: sorted,
      left,
      right,
      mid,
      description: `Checking middle element: ${sorted[mid]}`
    });
    
    if (sorted[mid] === target) {
      steps.push({
        array: sorted,
        left,
        right,
        mid,
        found: true,
        description: `Found ${target} at index ${mid}!`
      });
      return steps;
    }
    
    if (sorted[mid] < target) {
      left = mid + 1;
      steps.push({
        array: sorted,
        left,
        right,
        mid,
        description: `${sorted[mid]} < ${target}, search right half`
      });
    } else {
      right = mid - 1;
      steps.push({
        array: sorted,
        left,
        right,
        mid,
        description: `${sorted[mid]} > ${target}, search left half`
      });
    }
  }
  
  steps.push({
    array: sorted,
    left,
    right,
    mid: -1,
    found: false,
    description: `${target} not found in array`
  });
  return steps;
};

const generateBFSSteps = (edges, start) => {
  const graph = {};
  edges.forEach(edge => {
    const [from, to] = edge.split('-').map(Number);
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push(to);
    graph[to].push(from);
  });

  const steps = [{ graph, queue: [parseInt(start)], visited: new Set(), current: null, description: 'Initialize BFS with start node' }];
  const visited = new Set();
  const queue = [parseInt(start)];

  while (queue.length > 0) {
    const current = queue.shift();
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    steps.push({
      graph,
      queue: [...queue],
      visited: new Set(visited),
      current,
      description: `Visit node ${current}`
    });

    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
        steps.push({
          graph,
          queue: [...queue],
          visited: new Set(visited),
          current,
          description: `Add node ${neighbor} to queue`
        });
      }
    }
  }

  steps.push({ graph, queue: [], visited, current: null, description: 'BFS complete!' });
  return steps;
};

const generateDFSSteps = (edges, start) => {
  const graph = {};
  edges.forEach(edge => {
    const [from, to] = edge.split('-').map(Number);
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push(to);
    graph[to].push(from);
  });

  const steps = [{ graph, stack: [parseInt(start)], visited: new Set(), current: null, description: 'Initialize DFS with start node' }];
  const visited = new Set();
  const stack = [parseInt(start)];

  while (stack.length > 0) {
    const current = stack.pop();
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    steps.push({
      graph,
      stack: [...stack],
      visited: new Set(visited),
      current,
      description: `Visit node ${current}`
    });

    const neighbors = (graph[current] || []).reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push({
          graph,
          stack: [...stack],
          visited: new Set(visited),
          current,
          description: `Push node ${neighbor} to stack`
        });
      }
    }
  }

  steps.push({ graph, stack: [], visited, current: null, description: 'DFS complete!' });
  return steps;
};

const generateRecursionSteps = (n) => {
  const steps = [{ callStack: [], description: `Computing factorial(${n})` }];
  const callStack = [];
  
  const factorial = (num, depth = 0) => {
    callStack.push({ function: `factorial(${num})`, depth, returning: false });
    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Call factorial(${num})`
    });
    
    if (num <= 1) {
      callStack[callStack.length - 1].returning = true;
      callStack[callStack.length - 1].result = 1;
      steps.push({
        callStack: callStack.map(c => ({ ...c })),
        description: `Base case: factorial(${num}) = 1`
      });
      callStack.pop();
      steps.push({
        callStack: callStack.map(c => ({ ...c })),
        description: `Return 1 from factorial(${num})`
      });
      return 1;
    }
    
    const result = num * factorial(num - 1, depth + 1);
    
    callStack[callStack.length - 1].returning = true;
    callStack[callStack.length - 1].result = result;
    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `factorial(${num}) = ${num} × factorial(${num - 1}) = ${result}`
    });
    
    callStack.pop();
    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Return ${result} from factorial(${num})`
    });
    
    return result;
  };
  
  factorial(n);
  const finalResult = Math.floor(Math.exp(n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n)));
  steps.push({ callStack: [], description: `Result: factorial(${n})` });
  return steps;
};

// Main Component
const AlgorithmVisualizer = () => {
  const [algorithm, setAlgorithm] = useState('bubble');
  const [input, setInput] = useState('64, 34, 25, 12, 22, 11, 90');
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [graphInput, setGraphInput] = useState('0-1, 0-2, 1-3, 1-4, 2-5');
  const [startNode, setStartNode] = useState('0');
  const [targetNode, setTargetNode] = useState('25');

  const handleVisualize = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    
    let newSteps = [];
    
    if (algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'quick') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (algorithm === 'bubble') newSteps = generateBubbleSortSteps(arr);
      else if (algorithm === 'merge') newSteps = generateMergeSortSteps(arr);
      else if (algorithm === 'quick') newSteps = generateQuickSortSteps(arr);
    } else if (algorithm === 'binary') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const target = parseInt(targetNode);
      newSteps = generateBinarySearchSteps(arr, target);
    } else if (algorithm === 'bfs') {
      const edges = graphInput.split(',').map(s => s.trim());
      newSteps = generateBFSSteps(edges, startNode);
    } else if (algorithm === 'dfs') {
      const edges = graphInput.split(',').map(s => s.trim());
      newSteps = generateDFSSteps(edges, startNode);
    } else if (algorithm === 'recursion') {
      const n = parseInt(startNode) || 5;
      newSteps = generateRecursionSteps(n);
    }
    
    setSteps(newSteps);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const renderArrayVisualization = (step) => {
    return (
      <div className="array-container">
        {step.array.map((value, index) => {
          let colorClass = 'bar-blue';
          if (step.comparing?.includes(index)) {
            colorClass = step.swapped ? 'bar-red' : 'bar-yellow';
          } else if (step.highlight?.includes(index)) {
            colorClass = 'bar-purple';
          } else if (step.pivot === index) {
            colorClass = 'bar-green';
          } else if (step.mid === index) {
            colorClass = step.found ? 'bar-green' : 'bar-yellow';
          } else if (algorithm === 'binary' && index >= step.left && index <= step.right) {
            colorClass = 'bar-blue-light';
          }
          
          return (
            <div
              key={index}
              className={`array-bar ${colorClass}`}
              style={{ height: `${value * 3 + 40}px` }}
            >
              {value}
            </div>
          );
        })}
      </div>
    );
  };

  const renderGraphVisualization = (step) => {
    const allNodes = new Set();
    Object.keys(step.graph).forEach(node => {
      allNodes.add(parseInt(node));
      step.graph[node].forEach(n => allNodes.add(n));
    });

    const nodeArray = Array.from(allNodes);
    
    return (
      <>
        <div className="graph-container">
          {nodeArray.map((node, i) => {
            const angle = (i / nodeArray.length) * 2 * Math.PI;
            const x = 50 + 35 * Math.cos(angle);
            const y = 50 + 35 * Math.sin(angle);
            
            let colorClass = 'node-gray';
            if (step.current === node) colorClass = 'node-yellow';
            else if (step.visited.has(node)) colorClass = 'node-green';
            else if (step.queue?.includes(node) || step.stack?.includes(node)) colorClass = 'node-blue';
            
            return (
              <div
                key={node}
                className={`graph-node ${colorClass}`}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {node}
              </div>
            );
          })}
        </div>
        <div className="graph-info">
          <strong>{algorithm === 'bfs' ? 'Queue' : 'Stack'}:</strong>
          <span>[{(step.queue || step.stack || []).join(', ')}]</span>
        </div>
      </>
    );
  };

  const renderRecursionVisualization = (step) => {
    return (
      <div className="call-stack-container">
        {step.callStack.map((call, index) => (
          <div
            key={index}
            className={`call-stack-item ${call.returning ? 'call-stack-returning' : 'call-stack-active'}`}
            style={{ marginLeft: `${call.depth * 20}px` }}
          >
            <div className="call-function">{call.function}</div>
            {call.returning && <div className="call-result">→ returns {call.result}</div>}
          </div>
        ))}
      </div>
    );
  };

  const renderVisualization = () => {
    if (steps.length === 0) return null;
    const step = steps[currentStep];

    if (algorithm === 'bubble' || algorithm === 'merge' || algorithm === 'quick' || algorithm === 'binary') {
      return renderArrayVisualization(step);
    } else if (algorithm === 'bfs' || algorithm === 'dfs') {
      return renderGraphVisualization(step);
    } else if (algorithm === 'recursion') {
      return renderRecursionVisualization(step);
    }
  };

  const isArrayAlgorithm = ['bubble', 'merge', 'quick', 'binary'].includes(algorithm);
  const isGraphAlgorithm = ['bfs', 'dfs'].includes(algorithm);
  const isRecursionAlgorithm = algorithm === 'recursion';

  return (
    <div className="app-container">
      <div className="header">
        <h1>Algorithm Visualizer</h1>
        <p className="header-subtitle">Watch algorithms come to life step by step</p>
      </div>

      <div className="content">
        <div className="form-group">
          <label className="form-label" htmlFor="algorithm-select">Choose Algorithm</label>
          <select
            id="algorithm-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="input-field"
          >
            <optgroup label="Sorting Algorithms">
              <option value="bubble">Bubble Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </optgroup>
            <optgroup label="Search Algorithms">
              <option value="binary">Binary Search</option>
            </optgroup>
            <optgroup label="Graph Traversal">
              <option value="bfs">Breadth-First Search (BFS)</option>
              <option value="dfs">Depth-First Search (DFS)</option>
            </optgroup>
            <optgroup label="Recursion">
              <option value="recursion">Factorial (Call Stack)</option>
            </optgroup>
          </select>
        </div>

        {isArrayAlgorithm && (
          <div className="form-group">
            <label className="form-label" htmlFor="array-input">
              Input Array (comma-separated)
            </label>
            <input
              id="array-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="e.g., 64, 34, 25, 12, 22"
            />
          </div>
        )}

        {algorithm === 'binary' && (
          <div className="form-group">
            <label className="form-label" htmlFor="target-input">Target Value</label>
            <input
              id="target-input"
              type="text"
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="input-field"
              placeholder="e.g., 25"
            />
          </div>
        )}

        {isGraphAlgorithm && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="graph-input">
                Graph Edges (format: 0-1, 0-2, 1-3)
              </label>
              <input
                id="graph-input"
                type="text"
                value={graphInput}
                onChange={(e) => setGraphInput(e.target.value)}
                className="input-field"
                placeholder="e.g., 0-1, 0-2, 1-3, 1-4, 2-5"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="start-node">Start Node</label>
              <input
                id="start-node"
                type="text"
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                className="input-field"
                placeholder="e.g., 0"
              />
            </div>
          </>
        )}

        {isRecursionAlgorithm && (
          <div className="form-group">
            <label className="form-label" htmlFor="recursion-input">
              Number (for factorial)
            </label>
            <input
              id="recursion-input"
              type="text"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="input-field"
              placeholder="e.g., 5"
            />
          </div>
        )}

        <button onClick={handleVisualize} className="btn-primary">
          Generate Visualization
        </button>

        {steps.length > 0 && (
          <>
            <div className="visualization-container">
              {renderVisualization()}
            </div>

            <div className="description-box">
              <p className="description-text">{steps[currentStep]?.description}</p>
            </div>

            <div className="controls-container">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="control-btn"
              >
                <ChevronLeftIcon />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="control-btn control-btn-primary"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="control-btn"
              >
                <ChevronRightIcon />
              </button>

              <button
                onClick={() => {
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className="control-btn"
              >
                <RotateCcwIcon />
              </button>

              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max={steps.length - 1}
                  value={currentStep}
                  onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                  className="slider"
                />
              </div>

              <span className="step-counter">
                Step {currentStep + 1} / {steps.length}
              </span>
            </div>

            <div className="speed-control">
              <label className="speed-label">Speed:</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="slider"
                style={{ width: '200px' }}
              />
              <span className="speed-value">{speed}ms</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;