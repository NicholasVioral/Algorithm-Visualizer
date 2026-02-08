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
      /length\s*-\s*i\s*-\s*1|len\(.*\)\s*-\s*i\s*-\s*1/,
      /for.*in\s+range|for.*\(let/i,
      /arr\[.*\],\s*arr\[.*\]\s*=\s*arr\[.*\],\s*arr\[.*\]/,
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
      /left.*right.*mid|l.*r.*m/i,
      /while.*left.*<=.*right|while.*l.*<=.*r/i,
      /mid\s*=.*\(left\s*\+\s*right\)\s*\/\/\s*2|mid\s*=.*\(left\s*\+\s*right\)\s*\/\s*2/i,
      /\(left\s*\+\s*right\)\s*\/\/\s*2|\(left\s*\+\s*right\)\s*\/\s*2/,
      /left\s*=\s*mid\s*\+\s*1|l\s*=\s*m\s*\+\s*1/i,
      /right\s*=\s*mid\s*-\s*1|r\s*=\s*m\s*-\s*1/i,
      /arr\[mid\]|arr\[m\]/,
      /Math\.floor|int\(|\/\//,
      /\(l\s*\+\s*r\)\s*\/\/\s*2|m\s*=.*\/\//,
      /l,\s*r\s*=|l\s*=.*r\s*=/,
      // Binary search on answer space patterns
      /while.*<=.*:.*=.*\/\/.*2.*for.*in/s,
      /min\(.*\)|max\(.*\).*while.*<=.*\/\//s,
    ],
    keywords: ["binary", "search", "left", "right", "mid", "half", "target", "l", "r", "m"],
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
      /visited/i,
      /\.append\(|\.push\(/,
      /\.popleft\(\)|\.shift\(\)/,
      /from\s+collections\s+import\s+deque/i,
      /deque\(/i,
      /while.*\.length\s*>\s*0|while.*len\(.*\)\s*>\s*0/i,
      /for.*in.*\[.*\]|for.*of.*\[.*\]/i,
      /neighbor/i,
      // Structural patterns (variable-name agnostic)
      /new\s+Set\(\)/,
      /const.*=\s*\[\];.*\.push\(.*\).*\.shift\(\)/s,
      /\.has\(.*\).*\.add\(/s,
      /while.*length.*shift\(\)/s,
      /for.*of.*\[.*\].*if.*!.*\.has/s,
    ],
    keywords: ["bfs", "breadth", "queue", "level", "enqueue", "dequeue", "visited", "neighbor", "graph", "deque"],
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
      /visited/i,
      /\.push\(|\.pop\(/,
      /graph\[.*\]|graph\(.*\)/,
      /for.*in.*graph|for.*of.*graph/i,
      /neighbor/i,
      /visited\.add|visited\[.*\]\s*=\s*true/i,
      /if.*not.*visited|if.*!visited/i,
      /def\s+dfs|function\s+dfs/i,
      /visited\s*=\s*set\(\)|visited\s*=\s*{}/i,
      // Structural patterns (variable-name agnostic)
      /new\s+Set\(\)/,
      /\.add\(.*\).*\.push\(.*\).*\.pop\(\)/s,
      /for.*of.*\[.*\].*if.*!.*\.has.*\.push/s,
      /while.*\.length.*\.pop\(\)/s,
    ],
    keywords: ["dfs", "depth", "stack", "recursive", "backtrack", "visited", "neighbor", "graph"],
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
      /distance.*weight|dist.*weight/i,
      /priority.*queue/i,
      /heapq|heap/i,
      /heappush.*heappop|heappop.*heappush/i,
      /import.*heapq|from.*heapq/i,
      /dist.*=.*inf|distance.*=.*inf/i,
      /dist\[.*\].*=.*0|distance\[.*\].*=.*0/i,
      /while.*heap|while.*pq|while.*queue/i,
      /heappop|heappush/i,
      /for.*neighbors|for.*edges/i,
      /new_dist.*=.*dist.*\+.*weight|val.*\+.*val2/i,
      /minHeap|min_heap|pq/i,
      /defaultdict.*list.*heapq/s,
      /heappop.*visit|heappop.*visited/s,
      /if.*in.*visit.*continue/i,
      /visit\.add|visited\.add/i,
      /max\(t,.*val\)|max.*time/i,
      /edges\[.*\]\.append/i,
    ],
    keywords: ["dijkstra", "shortest", "path", "distance", "weight", "priority", "heap", "heapq", "dist", "graph", "minHeap", "visit", "edges"],
    weight: {
      dijkstraKeyword: 5,
      shortestPath: 4,
      priorityQueue: 4
    }
  },

  bellmanford: {
    name: "Bellman-Ford Algorithm",
    key: "bellmanford",
    patterns: [
      /bellman.*ford|bellman-ford/i,
      /for.*in.*range.*for.*in.*edges/s,
      /for.*k.*for.*flights|for.*i.*for.*edges/s,
      /prices.*=.*inf|dist.*=.*inf/i,
      /\.copy\(\).*for.*in/i,
      /prices\[src\].*=.*0|dist\[start\].*=.*0/i,
      /if.*prices.*\+.*<.*prices|if.*dist.*\+.*<.*dist/s,
      /tmpPrices|temp.*dist/i,
      /relaxation|relax/i,
    ],
    keywords: ["bellman", "ford", "shortest", "path", "relax", "edges", "flights", "prices", "dist", "negative"],
    weight: {
      bellmanKeyword: 5,
      relaxation: 4,
      iterativePattern: 4
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
      /return.*n.*\*.*factorial|return.*factorial.*\*.*n/i,
      /base.*case/i,
      /n\s*<=\s*1|n\s*==\s*1|n\s*<\s*2/i,
      /if.*n.*1.*return|if.*n.*==.*0.*return/i,
      /def\s+factorial|function\s+factorial/i,
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
      /fib\(n\s*-\s*1\).*\+.*fib\(n\s*-\s*2\)|fib\(n\s*-\s*2\).*\+.*fib\(n\s*-\s*1\)/i,
      /n\s*<=\s*1.*return.*n|if.*n.*<=.*1/i,
      /return.*fib.*fib/i,
      /def\s+fib|function\s+fib/i,
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
 * Analyzes code structure to detect algorithm patterns regardless of variable names
 * @param {string} code - The code to analyze
 * @returns {object} - Structural signatures found
 */
function analyzeStructuralSignatures(code) {
  const signatures = {
    bfsSignature: false,
    dfsSignature: false,
    sortingSignature: false,
    binarySearchSignature: false,
    dijkstraSignature: false
  };

  // BFS Signature: Set + Array + while + shift + push pattern
  // Pattern: create set, create array, while loop with shift(), for-of with has() check
  const bfsPattern1 = /new\s+Set\(\).*\[\].*while.*\.shift\(\)/s;
  const bfsPattern2 = /\.shift\(\).*for.*of.*\.has\(/s;
  const bfsPattern3 = /\.add\(.*\).*\.push\(.*\).*while.*\.shift/s;
  
  if ((bfsPattern1.test(code) || bfsPattern2.test(code)) && bfsPattern3.test(code)) {
    signatures.bfsSignature = true;
  }

  // DFS Signature: Recursive call pattern OR stack with pop
  const dfsPattern1 = /function.*\{.*for.*of.*if.*function.*\(/s; // Recursive
  const dfsPattern2 = /def.*:.*for.*in.*if.*def.*\(/s; // Recursive Python
  const dfsPattern3 = /\.push\(.*\).*while.*\.pop\(\)/s; // Iterative with stack
  
  if (dfsPattern1.test(code) || dfsPattern2.test(code) || dfsPattern3.test(code)) {
    signatures.dfsSignature = true;
  }

  // Dijkstra Signature: heapq + while + heappop + visited set
  const dijkstraPattern1 = /heapq.*heappop.*visit/s;
  const dijkstraPattern2 = /minHeap.*heappop.*visit.*heappush/s;
  const dijkstraPattern3 = /heappush.*heappop.*while.*visit/s;
  const dijkstraPattern4 = /heapq.*while.*if.*in.*visit.*continue/s;
  
  if (dijkstraPattern1.test(code) || dijkstraPattern2.test(code) || 
      dijkstraPattern3.test(code) || dijkstraPattern4.test(code)) {
    signatures.dijkstraSignature = true;
  }

  // Sorting signature: nested loops with comparison and swap
  const sortPattern = /for.*for.*if.*\[.*\].*[<>].*\[.*\]/s;
  if (sortPattern.test(code)) {
    signatures.sortingSignature = true;
  }

  // Binary search signature: while with left/right and mid calculation
  const binaryPattern1 = /(left|start|low|l).*?=.*?0.*(right|end|high|r).*while.*(left|start|low|l).*<=.*(right|end|high|r).*mid|m/s;
  const binaryPattern2 = /while.*(l|left).*<=.*(r|right).*\(l.*\+.*r\).*\/\/.*2/s;
  const binaryPattern3 = /(l|left)\s*=.*(m|mid).*\+.*1.*(r|right)\s*=.*(m|mid).*-.*1/s;
  if (binaryPattern1.test(code) || (binaryPattern2.test(code) && binaryPattern3.test(code))) {
    signatures.binarySearchSignature = true;
  }

  return signatures;
}

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

  // First, analyze structural signatures
  const structuralSigs = analyzeStructuralSignatures(code);

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

    // Bonus: Structural signature match (big boost!)
    if (algoKey === 'bfs' && structuralSigs.bfsSignature) {
      score += 15;
      foundPatterns.push("BFS structural signature");
    }
    if (algoKey === 'dfs' && structuralSigs.dfsSignature) {
      score += 15;
      foundPatterns.push("DFS structural signature");
    }
    if (algoKey === 'dijkstra' && structuralSigs.dijkstraSignature) {
      score += 15;
      foundPatterns.push("Dijkstra structural signature");
    }
    if (['bubble', 'insertion', 'selection'].includes(algoKey) && structuralSigs.sortingSignature) {
      score += 10;
      foundPatterns.push("Sorting structural signature");
    }
    if (algoKey === 'binary' && structuralSigs.binarySearchSignature) {
      score += 15;
      foundPatterns.push("Binary search structural signature");
    }

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