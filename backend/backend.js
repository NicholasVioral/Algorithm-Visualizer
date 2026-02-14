import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Pattern-based detection (fast and reliable)
    const detectedAlgorithm = detectAlgorithmFromCode(code);
    const explanation = generateExplanation(code, detectedAlgorithm);

    // Return successful response with pattern-based detection
    res.json({
      explanation,
      suggestedAlgorithm: detectedAlgorithm,
      success: true,
      method: 'Pattern-based Detection'
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({
      error: 'Failed to analyze code',
      details: err.message,
      success: false
    });
  }
});

// Pattern-based algorithm detection from code
function detectAlgorithmFromCode(code) {
  const lower = code.toLowerCase();

  // Check for specific algorithm patterns (more flexible matching)
  const patterns = {
    // Sorting algorithms
    bubble: {
      test: (_c, l) =>
        l.includes('bubble') ||
        /\w+\[.*j.*\]\s*[><!]=?\s*\w+\[.*j\s*[\+\-]\s*1.*\]/.test(code) ||
        (l.includes('swap') && /for.*for/.test(l)) ||
        /range.*range.*swap/.test(l)
    },
    merge: {
      test: (_c, l) =>
        l.includes('merge') ||
        l.includes('mergesort') ||
        (l.includes('sort') && (l.includes('divide') || l.includes('conquer') || l.includes('mid'))) ||
        /def\s+merge|function\s+merge/.test(l)
    },
    quick: {
      test: (_c, l) =>
        l.includes('quick') ||
        l.includes('pivot') ||
        l.includes('partition')
    },
    insertion: {
      test: (_c, l) =>
        l.includes('insertion') ||
        (l.includes('sort') && l.includes('insert')) ||
        (l.includes('shift') && l.includes('sort'))
    },
    selection: {
      test: (_c, l) =>
        l.includes('selection') ||
        (l.includes('min') && l.includes('sort') && l.includes('swap'))
    },
    heap: {
      test: (_c, l) =>
        l.includes('heap') ||
        l.includes('heapify')
    },

    // Search algorithms
    binary: {
      test: (_c, l) =>
        l.includes('binary') ||
        (l.includes('search') && (l.includes('left') && l.includes('right') && l.includes('mid'))) ||
        /while.*left.*<=.*right/.test(l)
    },
    linear: {
      test: (_c, l) =>
        l.includes('linear search') ||
        l.includes('sequential search')
    },

    // Graph algorithms
    bfs: {
      test: (_c, l) =>
        l.includes('bfs') ||
        l.includes('breadth') ||
        (l.includes('queue') && (l.includes('level') || l.includes('graph')))
    },
    dfs: {
      test: (_c, l) =>
        l.includes('dfs') ||
        l.includes('depth') ||
        (l.includes('stack') && l.includes('graph'))
    },
    dijkstra: {
      test: (_c, l) =>
        l.includes('dijkstra') ||
        (l.includes('shortest') && l.includes('path')) ||
        l.includes('priority queue')
    },

    // Leetcode problems
    twosum: {
      test: (_c, l) =>
        l.includes('two sum') ||
        l.includes('twosum') ||
        (l.includes('target') && l.includes('complement') && l.includes('hash'))
    },
    reverselist: {
      test: (_c, l) =>
        l.includes('reverse') && (l.includes('list') || l.includes('linked')) ||
        (l.includes('prev') && l.includes('curr') && l.includes('next'))
    },
    validparentheses: {
      test: (_c, l) =>
        (l.includes('valid') || l.includes('balanced')) && (l.includes('paren') || l.includes('bracket')) ||
        (l.includes('stack') && l.includes('bracket'))
    },
    longestsubstring: {
      test: (_c, l) =>
        l.includes('longest') && l.includes('substring') ||
        (l.includes('sliding window') && l.includes('substring'))
    },
    maxsubarray: {
      test: (_c, l) =>
        l.includes('max') && l.includes('subarray') ||
        l.includes('kadane') ||
        (l.includes('max') && l.includes('sum') && l.includes('current'))
    },
    coinchange: {
      test: (_c, l) =>
        l.includes('coin') ||
        (l.includes('change') && l.includes('dp'))
    },
    mergeintervals: {
      test: (_c, l) =>
        l.includes('merge') && l.includes('interval') ||
        (l.includes('overlap') && l.includes('interval'))
    },
    threesum: {
      test: (_c, l) =>
        l.includes('3sum') ||
        l.includes('three sum') ||
        (l.includes('triplet') && l.includes('sum'))
    },
  };

  for (const [algorithm, { test }] of Object.entries(patterns)) {
    if (test(code, lower)) {
      return algorithm;
    }
  }

  return null;
}

// Generate explanation based on detected algorithm
function generateExplanation(_code, algorithm) {
  // Note: code parameter reserved for future use (AI enhancement)
  const explanations = {
    bubble: "This appears to be **Bubble Sort** - an algorithm that repeatedly compares adjacent elements and swaps them if they're in the wrong order. Time complexity: O(n²).",
    merge: "This looks like **Merge Sort** - a divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges them. Time complexity: O(n log n).",
    quick: "This appears to be **Quick Sort** - a divide-and-conquer algorithm using a pivot to partition elements. Time complexity: O(n log n) average.",
    insertion: "This looks like **Insertion Sort** - builds a sorted array one element at a time by inserting each element into its correct position. Time complexity: O(n²).",
    selection: "This appears to be **Selection Sort** - repeatedly finds the minimum element and places it at the beginning. Time complexity: O(n²).",
    heap: "This looks like **Heap Sort** - uses a heap data structure to sort elements. Time complexity: O(n log n).",
    binary: "This appears to be **Binary Search** - efficiently finds a target in a sorted array by dividing the search space in half. Time complexity: O(log n).",
    linear: "This looks like **Linear Search** - checks each element sequentially until finding the target. Time complexity: O(n).",
    bfs: "This appears to be **Breadth-First Search (BFS)** - explores a graph level by level using a queue. Time complexity: O(V + E).",
    dfs: "This looks like **Depth-First Search (DFS)** - explores a graph by going as deep as possible before backtracking. Time complexity: O(V + E).",
    dijkstra: "This appears to be **Dijkstra's Algorithm** - finds the shortest path in a weighted graph. Time complexity: O((V + E) log V).",
    twosum: "This looks like **Two Sum** - finds two numbers that add up to a target using a hash map. Time complexity: O(n).",
    reverselist: "This appears to be **Reverse Linked List** - reverses the pointers in a linked list iteratively. Time complexity: O(n).",
    validparentheses: "This looks like **Valid Parentheses** - checks if brackets are balanced using a stack. Time complexity: O(n).",
    longestsubstring: "This appears to be **Longest Substring Without Repeating Characters** - uses sliding window technique. Time complexity: O(n).",
    maxsubarray: "This looks like **Maximum Subarray (Kadane's Algorithm)** - finds the contiguous subarray with maximum sum. Time complexity: O(n).",
    coinchange: "This appears to be **Coin Change** - uses dynamic programming to find minimum coins needed. Time complexity: O(amount × coins).",
    mergeintervals: "This looks like **Merge Intervals** - merges overlapping intervals after sorting. Time complexity: O(n log n).",
    threesum: "This appears to be **3Sum** - finds triplets that sum to zero using sorting and two pointers. Time complexity: O(n²).",
  };

  if (algorithm && explanations[algorithm]) {
    return explanations[algorithm];
  }

  return "Code analyzed. Try selecting an algorithm manually if detection was unsuccessful.";
}

app.listen(5000, () => console.log('Server running on port 5000'));