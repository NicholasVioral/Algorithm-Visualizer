// Algorithm Detection Module
// Analyzes code snippets to identify which algorithm is being used

const algorithmPatterns = {
  bubble: {
    name: "Bubble Sort",
    key: "bubble",
    patterns: [
      /for\s*\([^)]*\)\s*{[\s\S]*for\s*\([^)]*\)\s*{[\s\S]*if\s*\([^[]*\[[^\]]*\]\s*>\s*[^[]*\[[^\]]*\]\s*\)/i,
      /bubble/i,
      /swap.*adjacent/i,
      /\[j\]\s*>\s*\[j\s*\+\s*1\]/,
      /\[j\s*\+\s*1\]\s*\]/,
      /for.*for/s,
      /arr\[j\].*arr\[j.*1\]/,
      /length\s*-\s*i\s*-\s*1/,
    ],
    keywords: ["swap", "adjacent", "bubble", "compare", "sort"],
    weight: {
      nestedLoops: 3,
      adjacentComparison: 5,
      swap: 2,
      bubbleKeyword: 4
    }
  },
  
  merge: {
    name: "Merge Sort",
    key: "merge",
    patterns: [
      /merge/i,
      /divide.*conquer/i,
      /midpoint|mid\s*=/i,
      /merge\s*\(/i,
      /left.*right/i,
      /\.slice\(/,
      /Math\.floor.*\/\s*2/,
      /length\s*<=\s*1/,
    ],
    keywords: ["merge", "divide", "conquer", "mid", "split", "sort"],
    weight: {
      mergeKeyword: 5,
      divideConquer: 4,
      midpoint: 3,
      leftRight: 2
    }
  },
  
  quick: {
    name: "Quick Sort",
    key: "quick",
    patterns: [
      /pivot/i,
      /partition/i,
      /quick/i,
      /pivot\s*=/i,
      /arr\[.*\]\s*<\s*pivot/,
      /arr\[high\]|arr\[low\]/,
      /partition\s*\(/i,
    ],
    keywords: ["pivot", "partition", "quick", "sort"],
    weight: {
      pivotKeyword: 5,
      partitionKeyword: 5,
      quickKeyword: 4
    }
  },
  
  insertion: {
    name: "Insertion Sort",
    key: "insertion",
    patterns: [
      /insertion/i,
      /key\s*=.*\[i\]/i,
      /while.*>=.*0.*&&/i,
      /insert/i,
    ],
    keywords: ["insert", "key", "shift", "sorted"],
    weight: {
      insertionKeyword: 5,
      keyPattern: 4,
      whileShift: 3
    }
  },
  
  selection: {
    name: "Selection Sort",
    key: "selection",
    patterns: [
      /selection/i,
      /min.*index|minimum/i,
      /find.*min/i,
    ],
    keywords: ["selection", "minimum", "min", "select"],
    weight: {
      selectionKeyword: 5,
      minimumPattern: 4,
      findMin: 3
    }
  },
  
  heap: {
    name: "Heap Sort",
    key: "heap",
    patterns: [
      /heap/i,
      /heapify/i,
      /max.*heap|min.*heap/i,
      /parent|left.*child|right.*child/i,
    ],
    keywords: ["heap", "heapify", "parent", "child"],
    weight: {
      heapKeyword: 5,
      heapifyKeyword: 5,
      treeStructure: 3
    }
  },
  
  binary: {
    name: "Binary Search",
    key: "binary",
    patterns: [
      /binary.*search/i,
      /left.*right.*mid/i,
      /while.*left.*<=.*right/i,
      /mid\s*=.*\(left\s*\+\s*right\)\s*\/\s*2/i,
      /\(left\s*\+\s*right\)\s*\/\s*2/,
      /left\s*=\s*mid\s*\+\s*1/,
      /right\s*=\s*mid\s*-\s*1/,
      /arr\[mid\]/,
    ],
    keywords: ["binary", "search", "left", "right", "mid", "half", "target"],
    weight: {
      binaryKeyword: 5,
      leftRightMid: 4,
      whileLeftRight: 4,
      midCalculation: 5
    }
  },
  
  linear: {
    name: "Linear Search",
    key: "linear",
    patterns: [
      /linear.*search/i,
      /for.*length.*if.*==.*target/i,
      /sequential.*search/i,
    ],
    keywords: ["linear", "sequential", "search", "target"],
    weight: {
      linearKeyword: 5,
      sequentialSearch: 3,
      simpleLoop: 2
    }
  },
  
  bfs: {
    name: "Breadth-First Search",
    key: "bfs",
    patterns: [
      /bfs|breadth/i,
      /queue/i,
      /enqueue|dequeue/i,
      /level.*order/i,
    ],
    keywords: ["bfs", "breadth", "queue", "level", "enqueue", "dequeue"],
    weight: {
      bfsKeyword: 5,
      queueKeyword: 4,
      levelOrder: 3
    }
  },
  
  dfs: {
    name: "Depth-First Search",
    key: "dfs",
    patterns: [
      /dfs|depth/i,
      /stack/i,
      /recursive.*visit/i,
      /depth.*first/i,
    ],
    keywords: ["dfs", "depth", "stack", "recursive", "backtrack"],
    weight: {
      dfsKeyword: 5,
      stackKeyword: 4,
      recursivePattern: 3
    }
  },
  
  dijkstra: {
    name: "Dijkstra's Algorithm",
    key: "dijkstra",
    patterns: [
      /dijkstra/i,
      /shortest.*path/i,
      /distance.*weight/i,
      /priority.*queue/i,
    ],
    keywords: ["dijkstra", "shortest", "path", "distance", "weight", "priority"],
    weight: {
      dijkstraKeyword: 5,
      shortestPath: 4,
      priorityQueue: 4
    }
  },
  
  "bst-insert": {
    name: "BST Insert",
    key: "bst-insert",
    patterns: [
      /bst.*insert|binary.*search.*tree.*insert/i,
      /insert.*tree/i,
      /node\.left|node\.right/i,
      /new.*node/i,
    ],
    keywords: ["bst", "insert", "tree", "node", "left", "right"],
    weight: {
      bstInsertKeyword: 5,
      treeStructure: 3,
      newNode: 3
    }
  },
  
  "bst-search": {
    name: "BST Search",
    key: "bst-search",
    patterns: [
      /bst.*search|binary.*search.*tree.*search/i,
      /search.*tree/i,
      /node\.val|node\.data/i,
    ],
    keywords: ["bst", "search", "tree", "node", "find"],
    weight: {
      bstSearchKeyword: 5,
      treeSearch: 4
    }
  },
  
  recursion: {
    name: "Recursion (Factorial)",
    key: "recursion",
    patterns: [
      /factorial/i,
      /return.*n.*\*.*factorial/i,
      /base.*case/i,
      /n\s*<=\s*1/i,
    ],
    keywords: ["factorial", "recursive", "base", "case"],
    weight: {
      factorialKeyword: 5,
      recursiveCall: 4,
      baseCase: 3
    }
  },
  
  fibonacci: {
    name: "Fibonacci (Recursive)",
    key: "fibonacci",
    patterns: [
      /fibonacci|fib\(/i,
      /fib\(n\s*-\s*1\).*\+.*fib\(n\s*-\s*2\)/i,
      /n\s*<=\s*1.*return.*n/i,
    ],
    keywords: ["fibonacci", "fib", "recursive"],
    weight: {
      fibonacciKeyword: 5,
      fibPattern: 5,
      baseCase: 3
    }
  },
  
  "fibonacci-dp": {
    name: "Fibonacci (Dynamic Programming)",
    key: "fibonacci-dp",
    patterns: [
      /fibonacci.*dp|fib.*memo/i,
      /memo|cache|dp/i,
      /\[i\s*-\s*1\].*\+.*\[i\s*-\s*2\]/i,
    ],
    keywords: ["fibonacci", "dp", "memoization", "cache", "table"],
    weight: {
      fibonacciDPKeyword: 5,
      memoization: 5,
      dpPattern: 4
    }
  },
  
  "tower-hanoi": {
    name: "Tower of Hanoi",
    key: "tower-hanoi",
    patterns: [
      /hanoi|tower/i,
      /source.*destination.*auxiliary/i,
      /move.*disk/i,
      /n\s*-\s*1.*disks/i,
    ],
    keywords: ["hanoi", "tower", "disk", "peg", "move", "auxiliary"],
    weight: {
      hanoiKeyword: 5,
      diskMovement: 4,
      recursiveHanoi: 4
    }
  }
};

/**
 * Detects which algorithm is present in the given code
 * @param {string} code - The code snippet to analyze
 * @returns {object} - Detection result with algorithm name, key, confidence, and explanation
 */
export function detectAlgorithm(code) {
  if (!code || code.trim().length === 0) {
    return {
      name: "No code provided",
      algorithmKey: null,
      confidence: 0,
      explanation: "Please paste some code to analyze."
    };
  }

  const scores = {};
  const matches = {};

  // Analyze each algorithm
  for (const [algoKey, algo] of Object.entries(algorithmPatterns)) {
    let score = 0;
    const foundPatterns = [];

    // Check patterns - give more weight to pattern matches
    algo.patterns.forEach((pattern, idx) => {
      if (pattern.test(code)) {
        score += 5; // Increased from 3
        foundPatterns.push(`Pattern ${idx + 1}`);
      }
    });

    // Check keywords
    const lowerCode = code.toLowerCase();
    algo.keywords.forEach(keyword => {
      if (lowerCode.includes(keyword.toLowerCase())) {
        score += 2;
        foundPatterns.push(`Keyword: "${keyword}"`);
      }
    });

    // Store results
    if (score > 0) {
      scores[algoKey] = score;
      matches[algoKey] = foundPatterns;
    }
  }

  // Find best match
  const sortedAlgos = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sortedAlgos.length === 0) {
    return {
      name: "Unknown Algorithm",
      algorithmKey: null,
      confidence: 0,
      explanation: "Could not identify a known algorithm pattern. Try adding comments or using standard algorithm variable names."
    };
  }

  const [bestAlgoKey, bestScore] = sortedAlgos[0];
  const bestAlgo = algorithmPatterns[bestAlgoKey];

  // Calculate confidence (0-100%) - improved formula
  // Give credit for having multiple strong matches
  const patternScore = bestScore;
  const maxPatternScore = (bestAlgo.patterns.length * 5) + (bestAlgo.keywords.length * 2);
  
  // Calculate base confidence
  let confidence = Math.min(100, Math.round((patternScore / maxPatternScore) * 150));
  
  // Bonus: if we have 4+ matches, boost confidence
  const matchCount = matches[bestAlgoKey].length;
  if (matchCount >= 4) {
    confidence = Math.min(100, confidence + 15);
  } else if (matchCount >= 3) {
    confidence = Math.min(100, confidence + 10);
  }
  
  // Cap minimum confidence at 50% if we have strong pattern matches
  if (matchCount >= 3 && confidence < 50) {
    confidence = 50;
  }

  // Generate explanation
  const foundMatches = matches[bestAlgoKey];
  const explanation = foundMatches.length > 0
    ? `Found ${foundMatches.length} matches: ${foundMatches.slice(0, 3).join(", ")}${foundMatches.length > 3 ? "..." : ""}`
    : "Detected based on code structure";

  // Show runner-up if close
  let runnerUpText = "";
  if (sortedAlgos.length > 1) {
    const [runnerUpKey, runnerUpScore] = sortedAlgos[1];
    const scoreDiff = bestScore - runnerUpScore;
    if (scoreDiff < 5) { // Changed from 3
      runnerUpText = ` (Also similar to: ${algorithmPatterns[runnerUpKey].name})`;
    }
  }

  return {
    name: bestAlgo.name,
    algorithmKey: bestAlgo.key,
    confidence: confidence,
    explanation: explanation + runnerUpText,
    allMatches: sortedAlgos.slice(0, 3).map(([key, score]) => ({
      name: algorithmPatterns[key].name,
      key: key,
      score: score
    }))
  };
}

// Export for testing
export { algorithmPatterns };