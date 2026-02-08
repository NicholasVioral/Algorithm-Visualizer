import React, { useState, useEffect } from 'react';
import './AlgorithmVisualizer.css';
import { detectAlgorithm } from "./algorithmDetector";

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

// Algorithm Summaries
const algorithmSummaries = {
  bubble: {
    title: "Bubble Sort",
    description: "Bubble Sort repeatedly steps through the array, compares adjacent elements, and swaps them if they're in the wrong order. The algorithm continues passing through the array until no more swaps are needed. Larger elements 'bubble' to the end with each pass.",
    complexity: "Time: O(n²) | Space: O(1)"
  },
  merge: {
    title: "Merge Sort",
    description: "Merge Sort uses a divide-and-conquer approach. It recursively divides the array into halves until each subarray has one element, then merges these subarrays back together in sorted order. The merging process compares elements from each subarray and places them in the correct order.",
    complexity: "Time: O(n log n) | Space: O(n)"
  },
  quick: {
    title: "Quick Sort",
    description: "Quick Sort selects a 'pivot' element and partitions the array so that elements smaller than the pivot come before it and larger elements come after. It then recursively applies this process to the subarrays on either side of the pivot until the entire array is sorted.",
    complexity: "Time: O(n log n) avg, O(n²) worst | Space: O(log n)"
  },
  insertion: {
    title: "Insertion Sort",
    description: "Insertion Sort builds the sorted array one element at a time. It takes each element from the unsorted portion and inserts it into its correct position in the sorted portion by shifting larger elements to the right. This process continues until all elements are sorted.",
    complexity: "Time: O(n²) | Space: O(1)"
  },
  selection: {
    title: "Selection Sort",
    description: "Selection Sort divides the array into sorted and unsorted portions. It repeatedly finds the minimum element from the unsorted portion and swaps it with the first unsorted element, growing the sorted portion by one element each iteration.",
    complexity: "Time: O(n²) | Space: O(1)"
  },
  heap: {
    title: "Heap Sort",
    description: "Heap Sort first builds a max heap from the array, then repeatedly extracts the maximum element (root) and places it at the end of the array. After each extraction, it maintains the heap property by 'heapifying' the remaining elements.",
    complexity: "Time: O(n log n) | Space: O(1)"
  },
  binary: {
    title: "Binary Search",
    description: "Binary Search efficiently finds a target value in a sorted array by repeatedly dividing the search interval in half. It uses two pointers (left and right) to track the search space, calculates the middle position, and compares the middle element with the target. Based on the comparison, it eliminates half of the remaining elements.",
    complexity: "Time: O(log n) | Space: O(1)"
  },
  linear: {
    title: "Linear Search",
    description: "Linear Search sequentially checks each element in the array from start to finish until it finds the target value or reaches the end. It's simple but inefficient for large datasets, as it may need to check every element.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  bfs: {
    title: "Breadth-First Search (BFS)",
    description: "BFS explores a graph level by level, visiting all neighbors of a node before moving to the next level. It uses a queue to track which nodes to visit next. Starting from the initial node, it marks nodes as visited, adds their unvisited neighbors to the queue, and continues until all reachable nodes are explored.",
    complexity: "Time: O(V + E) | Space: O(V)"
  },
  dfs: {
    title: "Depth-First Search (DFS)",
    description: "DFS explores a graph by going as deep as possible along each branch before backtracking. It uses a stack (or recursion) to track the path. Starting from the initial node, it marks nodes as visited, pushes unvisited neighbors onto the stack, and continues exploring until all reachable nodes are visited.",
    complexity: "Time: O(V + E) | Space: O(V)"
  },
  dijkstra: {
    title: "Dijkstra's Algorithm",
    description: "Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It maintains a set of unvisited nodes and their tentative distances, always selecting the node with the smallest distance to visit next. It updates distances to neighbors and repeats until all nodes are visited.",
    complexity: "Time: O((V + E) log V) | Space: O(V)"
  },
  bellmanford: {
    title: "Bellman-Ford Algorithm",
    description: "Bellman-Ford finds the shortest path from a source to all other vertices in a weighted graph. Unlike Dijkstra's algorithm, it can handle negative edge weights. The algorithm relaxes all edges V-1 times (or K times with constraints), updating distances when a shorter path is found. It's commonly used in problems with limited steps or negative weights.",
    complexity: "Time: O(V × E) | Space: O(V)"
  },
  'bst-insert': {
    title: "Binary Search Tree - Insert",
    description: "BST Insert adds a new value to a binary search tree while maintaining the BST property: left children are smaller, right children are larger. Starting at the root, it compares the value with each node and traverses left or right accordingly until finding an empty spot to insert the new node.",
    complexity: "Time: O(log n) avg, O(n) worst | Space: O(1)"
  },
  'bst-search': {
    title: "Binary Search Tree - Search",
    description: "BST Search finds a value in a binary search tree by leveraging the BST property. Starting at the root, it compares the target with the current node. If the target is smaller, it searches the left subtree; if larger, the right subtree. This continues until the value is found or a null node is reached.",
    complexity: "Time: O(log n) avg, O(n) worst | Space: O(1)"
  },
  recursion: {
    title: "Recursion - Factorial",
    description: "This visualization shows how recursive function calls work using factorial as an example. Each function call is placed on the call stack, and when a base case is reached (n ≤ 1), the functions begin returning values. Each return pops a frame off the stack and passes the result back to the caller, demonstrating the unwinding of recursive calls.",
    complexity: "Time: O(n) | Space: O(n) for call stack"
  },
  fibonacci: {
    title: "Fibonacci - Recursion",
    description: "The recursive Fibonacci shows how fib(n) = fib(n-1) + fib(n-2) creates a tree of function calls. Each call branches into two more calls until reaching base cases (n=0 or n=1). This visualization demonstrates the exponential growth of recursive calls and why simple recursion is inefficient for Fibonacci.",
    complexity: "Time: O(2ⁿ) | Space: O(n) for call stack"
  },
  'fibonacci-dp': {
    title: "Fibonacci - Dynamic Programming",
    description: "Dynamic Programming Fibonacci builds up the solution from the bottom up, storing previously calculated values in a table (memoization). Instead of recalculating fib(n-1) and fib(n-2) multiple times, it stores each result once and reuses it, reducing exponential time to linear time.",
    complexity: "Time: O(n) | Space: O(n)"
  },
  'tower-hanoi': {
    title: "Tower of Hanoi",
    description: "Tower of Hanoi is a classic recursion problem with three pegs and n disks. The goal is to move all disks from the source peg to the destination peg, using the auxiliary peg, while never placing a larger disk on a smaller one. The recursive solution moves n-1 disks to auxiliary, moves the largest disk to destination, then moves n-1 disks from auxiliary to destination.",
    complexity: "Time: O(2ⁿ) | Space: O(n) for call stack"
  }
};

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

const generateInsertionSortSteps = (arr) => {
  const steps = [{ array: [...arr], sorted: [], current: -1, description: 'Initial array' }];
  
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    
    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      current: i,
      description: `Select element ${key} to insert`
    });
    
    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        current: i,
        comparing: [j, j + 1],
        description: `Shift ${arr[j]} to the right`
      });
      
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      current: j + 1,
      description: `Insert ${key} at correct position`
    });
  }
  
  steps.push({ array: [...arr], sorted: Array.from({ length: arr.length }, (_, idx) => idx), current: -1, description: 'Sorted!' });
  return steps;
};

const generateSelectionSortSteps = (arr) => {
  const steps = [{ array: [...arr], sorted: [], current: -1, minIdx: -1, description: 'Initial array' }];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      current: i,
      minIdx: i,
      description: `Start finding minimum from index ${i}`
    });
    
    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        current: i,
        comparing: [minIdx, j],
        minIdx,
        description: `Comparing ${arr[minIdx]} and ${arr[j]}`
      });
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          current: i,
          minIdx,
          description: `New minimum: ${arr[minIdx]}`
        });
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        current: i,
        minIdx: -1,
        description: `Swapped ${arr[minIdx]} with ${arr[i]}`
      });
    }
  }
  
  steps.push({ array: [...arr], sorted: Array.from({ length: arr.length }, (_, idx) => idx), current: -1, minIdx: -1, description: 'Sorted!' });
  return steps;
};

const generateHeapSortSteps = (arr) => {
  const steps = [{ array: [...arr], heapSize: arr.length, highlight: [], description: 'Initial array' }];
  const n = arr.length;
  
  const heapify = (heapSize, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < heapSize && arr[left] > arr[largest]) largest = left;
    if (right < heapSize && arr[right] > arr[largest]) largest = right;
    
    if (largest !== i) {
      steps.push({
        array: [...arr],
        heapSize,
        highlight: [i, largest],
        description: `Swap ${arr[i]} with ${arr[largest]} to maintain heap`
      });
      
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(heapSize, largest);
    }
  };
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      heapSize: n,
      highlight: [i],
      description: `Heapify subtree rooted at index ${i}`
    });
    heapify(n, i);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: [...arr],
      heapSize: i + 1,
      highlight: [0, i],
      description: `Swap root ${arr[0]} with last element ${arr[i]}`
    });
    
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    steps.push({
      array: [...arr],
      heapSize: i,
      highlight: [0],
      description: `Heapify root with reduced heap size`
    });
    
    heapify(i, 0);
  }
  
  steps.push({ array: [...arr], heapSize: 0, highlight: [], description: 'Sorted!' });
  return steps;
};

const generateLinearSearchSteps = (arr, target) => {
  const steps = [{ array: [...arr], current: -1, found: false, description: `Searching for ${target}` }];
  
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      current: i,
      found: false,
      description: `Checking index ${i}: ${arr[i]}`
    });
    
    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        current: i,
        found: true,
        description: `Found ${target} at index ${i}!`
      });
      return steps;
    }
  }
  
  steps.push({
    array: [...arr],
    current: -1,
    found: false,
    description: `${target} not found in array`
  });
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

const generateDijkstraSteps = (edges, start) => {
  const graph = {};
  const distances = {};
  const allNodes = new Set();
  
  // Parse weighted edges format: "0-1:5" means edge from 0 to 1 with weight 5
  edges.forEach(edge => {
    const [connection, weight] = edge.split(':');
    const [from, to] = connection.split('-').map(Number);
    const w = parseInt(weight) || 1;
    
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    
    graph[from].push({ node: to, weight: w });
    graph[to].push({ node: from, weight: w });
    
    allNodes.add(from);
    allNodes.add(to);
  });
  
  // Initialize distances
  allNodes.forEach(node => {
    distances[node] = Infinity;
  });
  distances[parseInt(start)] = 0;
  
  const steps = [{
    graph,
    distances: { ...distances },
    visited: new Set(),
    current: null,
    description: `Initialize: Start node ${start} has distance 0, all others infinity`
  }];
  
  const visited = new Set();
  const unvisited = Array.from(allNodes);
  
  while (unvisited.length > 0) {
    // Find unvisited node with minimum distance
    let current = unvisited.reduce((min, node) =>
      !visited.has(node) && distances[node] < distances[min] ? node : min
    );
    
    if (distances[current] === Infinity) break;
    
    visited.add(current);
    steps.push({
      graph,
      distances: { ...distances },
      visited: new Set(visited),
      current,
      description: `Visit node ${current} (distance: ${distances[current]})`
    });
    
    const neighbors = graph[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (!visited.has(neighbor)) {
        const newDist = distances[current] + weight;
        
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          steps.push({
            graph,
            distances: { ...distances },
            visited: new Set(visited),
            current,
            updating: neighbor,
            description: `Update distance to node ${neighbor}: ${newDist}`
          });
        }
      }
    }
    
    unvisited.splice(unvisited.indexOf(current), 1);
  }
  
  steps.push({
    graph,
    distances: { ...distances },
    visited,
    current: null,
    description: 'Dijkstra complete! All shortest distances found.'
  });
  
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

const generateBSTInsertSteps = (arr) => {
  const steps = [{ tree: null, inserting: null, description: 'Empty tree - ready to insert nodes' }];
  
  class TreeNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
    }
  }
  
  let root = null;
  
  const insert = (node, val, path = []) => {
    if (!node) {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        inserting: val,
        path: [...path],
        description: `Insert ${val} here`
      });
      return new TreeNode(val);
    }
    
    steps.push({
      tree: JSON.parse(JSON.stringify(root)),
      inserting: val,
      path: [...path, node.val],
      description: `${val} ${val < node.val ? '<' : '>'} ${node.val}, go ${val < node.val ? 'left' : 'right'}`
    });
    
    if (val < node.val) {
      node.left = insert(node.left, val, [...path, node.val]);
    } else {
      node.right = insert(node.right, val, [...path, node.val]);
    }
    
    return node;
  };
  
  arr.forEach(val => {
    root = insert(root, val);
    steps.push({
      tree: JSON.parse(JSON.stringify(root)),
      inserting: null,
      path: [],
      description: `Inserted ${val}`
    });
  });
  
  steps.push({
    tree: JSON.parse(JSON.stringify(root)),
    inserting: null,
    path: [],
    description: 'BST construction complete!'
  });
  
  return steps;
};

const generateBSTSearchSteps = (arr, target) => {
  const steps = [];
  
  class TreeNode {
    constructor(val) {
      this.val = val;
      this.left = null;
      this.right = null;
    }
  }
  
  // Build tree first
  let root = null;
  const insert = (node, val) => {
    if (!node) return new TreeNode(val);
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  };
  
  arr.forEach(val => {
    root = insert(root, val);
  });
  
  steps.push({
    tree: JSON.parse(JSON.stringify(root)),
    searching: target,
    current: null,
    description: `Searching for ${target} in BST`
  });
  
  // Search
  const search = (node, val, path = []) => {
    if (!node) {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: null,
        path: [...path],
        found: false,
        description: `${val} not found in tree`
      });
      return false;
    }
    
    steps.push({
      tree: JSON.parse(JSON.stringify(root)),
      searching: val,
      current: node.val,
      path: [...path, node.val],
      description: `Check node ${node.val}`
    });
    
    if (node.val === val) {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: node.val,
        path: [...path, node.val],
        found: true,
        description: `Found ${val}!`
      });
      return true;
    }
    
    if (val < node.val) {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: node.val,
        path: [...path, node.val],
        description: `${val} < ${node.val}, search left`
      });
      return search(node.left, val, [...path, node.val]);
    } else {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: node.val,
        path: [...path, node.val],
        description: `${val} > ${node.val}, search right`
      });
      return search(node.right, val, [...path, node.val]);
    }
  };
  
  search(root, target);
  return steps;
};

const generateFibonacciSteps = (n) => {
  const steps = [{ callStack: [], description: `Computing fibonacci(${n})` }];
  const callStack = [];
  let callCount = 0;
  
  const fibonacci = (num, depth = 0) => {
    callCount++;
    if (callCount > 50) return 0; // Limit calls for visualization
    
    callStack.push({ function: `fib(${num})`, depth, returning: false });
    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Call fib(${num})`
    });
    
    if (num <= 1) {
      callStack[callStack.length - 1].returning = true;
      callStack[callStack.length - 1].result = num;
      steps.push({
        callStack: callStack.map(c => ({ ...c })),
        description: `Base case: fib(${num}) = ${num}`
      });
      callStack.pop();
      return num;
    }
    
    const result1 = fibonacci(num - 1, depth + 1);
    const result2 = fibonacci(num - 2, depth + 1);
    const result = result1 + result2;
    
    callStack[callStack.length - 1].returning = true;
    callStack[callStack.length - 1].result = result;
    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `fib(${num}) = fib(${num-1}) + fib(${num-2}) = ${result}`
    });
    
    callStack.pop();
    return result;
  };
  
  fibonacci(n);
  steps.push({ callStack: [], description: `Result: fib(${n})` });
  return steps;
};

const generateFibonacciDPSteps = (n) => {
  const steps = [{ dp: [], current: 0, description: `Computing fibonacci(${n}) with DP` }];
  const dp = new Array(n + 1).fill(-1);
  
  dp[0] = 0;
  dp[1] = 1;
  
  steps.push({
    dp: [...dp],
    current: 0,
    description: `Base cases: fib(0) = 0, fib(1) = 1`
  });
  
  for (let i = 2; i <= n; i++) {
    steps.push({
      dp: [...dp],
      current: i,
      description: `Calculate fib(${i}) = fib(${i-1}) + fib(${i-2})`
    });
    
    dp[i] = dp[i - 1] + dp[i - 2];
    
    steps.push({
      dp: [...dp],
      current: i,
      description: `fib(${i}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`
    });
  }
  
  steps.push({
    dp: [...dp],
    current: n,
    description: `Result: fib(${n}) = ${dp[n]}`
  });
  
  return steps;
};

const generateTowerHanoiSteps = (n) => {
  const steps = [];
  const towers = {
    A: Array.from({ length: n }, (_, i) => n - i),
    B: [],
    C: []
  };
  
  steps.push({
    towers: JSON.parse(JSON.stringify(towers)),
    callStack: [],
    description: `Tower of Hanoi with ${n} disks`
  });
  
  const callStack = [];
  
  const hanoi = (disks, from, to, aux, depth = 0) => {
    if (disks === 0) return;
    
    callStack.push({ function: `hanoi(${disks}, ${from}, ${to}, ${aux})`, depth });
    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      callStack: callStack.map(c => ({ ...c })),
      description: `Move ${disks} disk(s) from ${from} to ${to} using ${aux}`
    });
    
    hanoi(disks - 1, from, aux, to, depth + 1);
    
    const disk = towers[from].pop();
    towers[to].push(disk);
    
    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      callStack: callStack.map(c => ({ ...c })),
      move: { disk, from, to },
      description: `Move disk ${disk} from ${from} to ${to}`
    });
    
    hanoi(disks - 1, aux, to, from, depth + 1);
    
    callStack.pop();
  };
  
  hanoi(n, 'A', 'C', 'B');
  
  steps.push({
    towers: JSON.parse(JSON.stringify(towers)),
    callStack: [],
    description: 'Tower of Hanoi complete!'
  });
  
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
  const [userCode, setUserCode] = useState("");
  const [detected, setDetected] = useState(null);


  const handleDetectAlgorithm = () => {
    const result = detectAlgorithm(userCode);
    setDetected(result);

    // Auto-select algorithm if matched
    if (result.algorithmKey) {
      setAlgorithm(result.algorithmKey);
    }
  };


  // Reset visualization when algorithm changes
  useEffect(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [algorithm]);

  const handleVisualize = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    
    let newSteps = [];
    
    if (['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap'].includes(algorithm)) {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (algorithm === 'bubble') newSteps = generateBubbleSortSteps(arr);
      else if (algorithm === 'merge') newSteps = generateMergeSortSteps(arr);
      else if (algorithm === 'quick') newSteps = generateQuickSortSteps(arr);
      else if (algorithm === 'insertion') newSteps = generateInsertionSortSteps(arr);
      else if (algorithm === 'selection') newSteps = generateSelectionSortSteps(arr);
      else if (algorithm === 'heap') newSteps = generateHeapSortSteps(arr);
    } else if (algorithm === 'binary') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const target = parseInt(targetNode);
      newSteps = generateBinarySearchSteps(arr, target);
    } else if (algorithm === 'linear') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const target = parseInt(targetNode);
      newSteps = generateLinearSearchSteps(arr, target);
    } else if (algorithm === 'bfs') {
      const edges = graphInput.split(',').map(s => s.trim());
      newSteps = generateBFSSteps(edges, startNode);
    } else if (algorithm === 'dfs') {
      const edges = graphInput.split(',').map(s => s.trim());
      newSteps = generateDFSSteps(edges, startNode);
    } else if (algorithm === 'dijkstra') {
      const edges = graphInput.split(',').map(s => s.trim());
      newSteps = generateDijkstraSteps(edges, startNode);
    } else if (algorithm === 'bst-insert') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateBSTInsertSteps(arr);
    } else if (algorithm === 'bst-search') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const target = parseInt(targetNode);
      newSteps = generateBSTSearchSteps(arr, target);
    } else if (algorithm === 'recursion') {
      const n = parseInt(startNode) || 5;
      newSteps = generateRecursionSteps(n);
    } else if (algorithm === 'fibonacci') {
      const n = Math.min(parseInt(startNode) || 5, 8); // Limit to 8 for visualization
      newSteps = generateFibonacciSteps(n);
    } else if (algorithm === 'fibonacci-dp') {
      const n = parseInt(startNode) || 10;
      newSteps = generateFibonacciDPSteps(n);
    } else if (algorithm === 'tower-hanoi') {
      const n = Math.min(parseInt(startNode) || 3, 5); // Limit to 5 disks
      newSteps = generateTowerHanoiSteps(n);
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
    if (!step || !step.array) return null;
    
    return (
      <div className="array-container">
        {step.array.map((value, index) => {
          let colorClass = 'bar-blue';
          
          // Sorting algorithms
          if (step.comparing?.includes(index)) {
            colorClass = step.swapped ? 'bar-red' : 'bar-yellow';
          } else if (step.highlight?.includes(index)) {
            colorClass = 'bar-purple';
          } else if (step.sorted?.includes(index)) {
            colorClass = 'bar-green';
          } else if (step.pivot === index) {
            colorClass = 'bar-green';
          } else if (step.current === index) {
            colorClass = 'bar-yellow';
          } else if (step.minIdx === index) {
            colorClass = 'bar-red';
          }
          
          // Binary search
          if (step.mid === index) {
            colorClass = step.found ? 'bar-green' : 'bar-yellow';
          } else if (algorithm === 'binary' && index >= step.left && index <= step.right) {
            colorClass = 'bar-blue-light';
          }
          
          // Linear search
          if (algorithm === 'linear' && step.current === index) {
            colorClass = step.found ? 'bar-green' : 'bar-yellow';
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
    if (!step || !step.graph) return null;
    
    const allNodes = new Set();
    Object.keys(step.graph).forEach(node => {
      allNodes.add(parseInt(node));
      if (step.graph[node]) {
        step.graph[node].forEach(n => allNodes.add(n));
      }
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
    if (!step || !step.callStack) return null;
    
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

  const renderDijkstraVisualization = (step) => {
    if (!step || !step.graph) return null;
    
    const allNodes = new Set();
    Object.keys(step.graph).forEach(node => {
      allNodes.add(parseInt(node));
      if (step.graph[node]) {
        step.graph[node].forEach(({ node: n }) => allNodes.add(n));
      }
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
            else if (step.updating === node) colorClass = 'node-blue';
            
            const distance = step.distances[node];
            const displayDist = distance === Infinity ? '∞' : distance;
            
            return (
              <div
                key={node}
                className={`graph-node ${colorClass}`}
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div>{node}</div>
                <div style={{ fontSize: '0.7rem' }}>({displayDist})</div>
              </div>
            );
          })}
        </div>
        <div className="graph-info">
          <div>Distances from start node</div>
        </div>
      </>
    );
  };

  const renderBSTVisualization = (step) => {
    if (!step) return null;
    
    const renderTree = (node, x, y, level, offset) => {
      if (!node) return null;
      
      const isInPath = step.path?.includes(node.val);
      const isCurrent = step.current === node.val;
      const isFound = step.found && step.searching === node.val && isCurrent;
      
      let colorClass = 'node-gray';
      if (isFound) colorClass = 'node-green';
      else if (isCurrent) colorClass = 'node-yellow';
      else if (isInPath) colorClass = 'node-blue';
      
      return (
        <div key={`${node.val}-${x}-${y}`}>
          <div
            className={`graph-node ${colorClass}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              position: 'absolute'
            }}
          >
            {node.val}
          </div>
          {node.left && (
            <>
              <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', left: 0, top: 0 }}>
                <line
                  x1={`${x}%`}
                  y1={`${y + 3}%`}
                  x2={`${x - offset}%`}
                  y2={`${y + 12}%`}
                  stroke="#9ca3af"
                  strokeWidth="2"
                />
              </svg>
              {renderTree(node.left, x - offset, y + 15, level + 1, offset / 2)}
            </>
          )}
          {node.right && (
            <>
              <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', left: 0, top: 0 }}>
                <line
                  x1={`${x}%`}
                  y1={`${y + 3}%`}
                  x2={`${x + offset}%`}
                  y2={`${y + 12}%`}
                  stroke="#9ca3af"
                  strokeWidth="2"
                />
              </svg>
              {renderTree(node.right, x + offset, y + 15, level + 1, offset / 2)}
            </>
          )}
        </div>
      );
    };
    
    return (
      <div className="graph-container" style={{ height: '24rem' }}>
        {step.tree ? renderTree(step.tree, 50, 10, 0, 20) : <div style={{ textAlign: 'center', paddingTop: '6rem', color: '#6b7280' }}>Empty Tree</div>}
      </div>
    );
  };

  const renderFibonacciDPVisualization = (step) => {
    if (!step || !step.dp) return null;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {step.dp.map((val, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                background: step.current === index ? '#eab308' : val >= 0 ? '#22c55e' : '#e5e7eb',
                color: val >= 0 ? 'white' : '#6b7280',
                fontWeight: 'bold',
                minWidth: '60px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.75rem' }}>fib({index})</div>
              <div style={{ fontSize: '1.125rem' }}>{val >= 0 ? val : '?'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTowerHanoiVisualization = (step) => {
    if (!step || !step.towers) return null;
    
    const maxDisks = Math.max(
      step.towers.A.length,
      step.towers.B.length,
      step.towers.C.length,
      3
    );
    
    const renderPeg = (pegName, disks) => (
      <div key={pegName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{pegName}</div>
        <div style={{
          width: '8px',
          height: '200px',
          background: '#6b7280',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center'
        }}>
          {disks.map((disk, idx) => (
            <div
              key={`${pegName}-${disk}-${idx}`}
              style={{
                width: `${disk * 30 + 40}px`,
                height: '25px',
                background: `hsl(${disk * 40}, 70%, 50%)`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                border: '2px solid rgba(0,0,0,0.2)',
                marginBottom: '2px'
              }}
            >
              {disk}
            </div>
          ))}
        </div>
        <div style={{ width: '150px', height: '8px', background: '#6b7280', marginTop: '-4px' }} />
      </div>
    );
    
    return (
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', padding: '1rem' }}>
        {renderPeg('A', step.towers.A)}
        {renderPeg('B', step.towers.B)}
        {renderPeg('C', step.towers.C)}
      </div>
    );
  };

  const renderVisualization = () => {
    if (steps.length === 0 || !steps[currentStep]) return null;
    const step = steps[currentStep];

    // Array-based algorithms
    if (['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap', 'binary', 'linear'].includes(algorithm)) {
      if (!step.array) return null;
      return renderArrayVisualization(step);
    } 
    // Graph algorithms
    else if (['bfs', 'dfs'].includes(algorithm)) {
      if (!step.graph) return null;
      return renderGraphVisualization(step);
    }
    // Dijkstra
    else if (algorithm === 'dijkstra') {
      if (!step.graph) return null;
      return renderDijkstraVisualization(step);
    }
    // BST algorithms
    else if (['bst-insert', 'bst-search'].includes(algorithm)) {
      if (!step.tree && step.tree !== null) return null;
      return renderBSTVisualization(step);
    }
    // Recursion-based algorithms
    else if (['recursion', 'fibonacci'].includes(algorithm)) {
      if (!step.callStack) return null;
      return renderRecursionVisualization(step);
    }
    // Fibonacci DP
    else if (algorithm === 'fibonacci-dp') {
      if (!step.dp) return null;
      return renderFibonacciDPVisualization(step);
    }
    // Tower of Hanoi
    else if (algorithm === 'tower-hanoi') {
      if (!step.towers) return null;
      return renderTowerHanoiVisualization(step);
    }
    
    return null;
  };

  const isArrayAlgorithm = ['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap', 'binary', 'linear', 'bst-insert', 'bst-search'].includes(algorithm);
  const isGraphAlgorithm = ['bfs', 'dfs', 'dijkstra'].includes(algorithm);
  const isRecursionAlgorithm = ['recursion', 'fibonacci', 'fibonacci-dp', 'tower-hanoi'].includes(algorithm);
  const needsTarget = ['binary', 'linear', 'bst-search'].includes(algorithm);
  const needsWeightedGraph = algorithm === 'dijkstra';

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
              <option value="insertion">Insertion Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="heap">Heap Sort</option>
            </optgroup>
            <optgroup label="Search Algorithms">
              <option value="binary">Binary Search</option>
              <option value="linear">Linear Search</option>
            </optgroup>
            <optgroup label="Graph Traversal">
              <option value="bfs">Breadth-First Search (BFS)</option>
              <option value="dfs">Depth-First Search (DFS)</option>
              <option value="dijkstra">Dijkstra's Algorithm</option>
            </optgroup>
            <optgroup label="Tree Algorithms">
              <option value="bst-insert">BST Insert</option>
              <option value="bst-search">BST Search</option>
            </optgroup>
            <optgroup label="Recursion & Backtracking">
              <option value="recursion">Factorial (Call Stack)</option>
              <option value="fibonacci">Fibonacci (Recursion)</option>
              <option value="tower-hanoi">Tower of Hanoi</option>
            </optgroup>
            <optgroup label="Dynamic Programming">
              <option value="fibonacci-dp">Fibonacci (DP)</option>
            </optgroup>
          </select>
        </div>

        {/* Algorithm Summary */}
        <div className="algorithm-summary">
          <h3 className="summary-title">{algorithmSummaries[algorithm].title}</h3>
          <p className="summary-description">{algorithmSummaries[algorithm].description}</p>
          <p className="summary-complexity">{algorithmSummaries[algorithm].complexity}</p>
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

        {needsTarget && (
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
                {needsWeightedGraph ? 'Graph Edges with Weights (format: 0-1:5, 0-2:3)' : 'Graph Edges (format: 0-1, 0-2, 1-3)'}
              </label>
              <input
                id="graph-input"
                type="text"
                value={graphInput}
                onChange={(e) => setGraphInput(e.target.value)}
                className="input-field"
                placeholder={needsWeightedGraph ? "e.g., 0-1:5, 0-2:3, 1-3:2" : "e.g., 0-1, 0-2, 1-3, 1-4, 2-5"}
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
              {algorithm === 'tower-hanoi' ? 'Number of Disks (max 5)' : 'Number (n)'}
            </label>
            <input
              id="recursion-input"
              type="text"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="input-field"
              placeholder={algorithm === 'tower-hanoi' ? "e.g., 3" : "e.g., 5"}
            />
          </div>
        )}

        <div className="code-detection-section" style={{ 
          marginBottom: '1.5rem', 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          border: '2px dashed #d1d5db'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.75rem', color: '#374151' }}>
            🔍 Paste Your Code to Detect Algorithm
          </h3>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            rows={8}
            placeholder="Paste your algorithm code here..."
            style={{ 
              width: '100%', 
              fontFamily: 'monospace',
              padding: '0.75rem',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid #d1d5db',
              resize: 'vertical'
            }}
          />
          <button 
            onClick={handleDetectAlgorithm}
            style={{
              marginTop: '0.75rem',
              padding: '0.625rem 1.25rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            Detect Algorithm
          </button>

          {detected && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: detected.confidence > 60 ? '#d1fae5' : '#fef3c7',
              borderRadius: '0.375rem',
              border: `2px solid ${detected.confidence > 60 ? '#6ee7b7' : '#fcd34d'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {detected.confidence > 80 ? '✅' : detected.confidence > 60 ? '✓' : '⚠️'}
                </span>
                <strong style={{ fontSize: '1.125rem', color: '#1f2937' }}>
                  {detected.name}
                </strong>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Confidence:</strong> 
                <span style={{ 
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: detected.confidence > 80 ? '#10b981' : detected.confidence > 60 ? '#f59e0b' : '#ef4444',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  {detected.confidence}%
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic' }}>
                {detected.explanation}
              </div>
              {detected.allMatches && detected.allMatches.length > 1 && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                  <strong>Other possibilities:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    {detected.allMatches.slice(1).map((match, idx) => (
                      <span key={idx} style={{ 
                        display: 'inline-block',
                        marginRight: '0.5rem',
                        marginTop: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        {match.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 👇 THEN THE GENERATE BUTTON */}
        <button onClick={handleVisualize} className="btn-primary">
          Generate Visualization
        </button>

        {steps.length > 0 && (
          <>
            <div className="description-box">
              <p className="description-text">{steps[currentStep]?.description || ''}</p>
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