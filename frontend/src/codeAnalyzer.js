// Weighted, data-driven algorithm detection.
//
// Each algorithm defines a list of weighted signals: [weight, RegExp]. The code
// is scored against every algorithm and the highest score wins. This replaces the
// old first-match-wins approach, which mis-classified overlapping names (e.g.
// "merge intervals" matched Merge Sort) and returned keys the visualizer didn't
// recognize.
//
// Signal weight conventions:
//   10  explicit name mention ("bubble sort", "twoSum", "kadane")
//   6-7 strong structural signature
//   4-5 supporting structural pattern
//   2-3 keyword / weak hint
// `anti` signals subtract from the score to break ties between look-alikes.
//
// Every `key` matches an <option value> in the frontend AlgorithmVisualizer so the
// "Visualize This Algorithm" button always lands on a real visualizer.

export const ALGORITHMS = [
  // ---------- Sorting ----------
  {
    key: 'bubble',
    name: 'Bubble Sort',
    explanation:
      'This appears to be **Bubble Sort** - it repeatedly compares adjacent elements and swaps them if they are in the wrong order, "bubbling" the largest value to the end each pass. Time complexity: O(n²).',
    signals: [
      [10, /\bbubble[\s_]*sort\b/i],
      [6, /\w*\[\s*j\s*\]\s*[><]=?\s*\w*\[\s*j\s*\+\s*1\s*\]/],
      [5, /\bswapped\b/i],
      [4, /for[\s\S]{0,80}for[\s\S]{0,100}swap/i],
      [3, /n\s*-\s*i\s*-\s*1/],
    ],
    anti: [[8, /\bpivot\b|\bpartition\b|\bmerge[\s_]*sort\b/i]],
  },
  {
    key: 'insertion',
    name: 'Insertion Sort',
    explanation:
      'This looks like **Insertion Sort** - it builds a sorted portion one element at a time by shifting larger elements right and inserting each key into place. Time complexity: O(n²).',
    signals: [
      [10, /\binsertion[\s_]*sort\b/i],
      [6, /\bkey\s*=\s*\w+\[\s*i\s*\]/],
      [6, /while\s+j\s*>=?\s*0\s+and\s+\w+\[\s*j\s*\]\s*[><]/i],
      [3, /\bshift/i],
    ],
  },
  {
    key: 'selection',
    name: 'Selection Sort',
    explanation:
      'This appears to be **Selection Sort** - each pass finds the minimum of the unsorted region and swaps it into the next sorted position. Time complexity: O(n²).',
    signals: [
      [10, /\bselection[\s_]*sort\b/i],
      [6, /min[_]?(idx|index|pos)\s*=/i],
      [3, /\bminimum\b/i],
    ],
  },
  {
    key: 'merge',
    name: 'Merge Sort',
    explanation:
      'This looks like **Merge Sort** - a divide-and-conquer sort that recursively splits the array in half and merges the sorted halves. Time complexity: O(n log n).',
    signals: [
      [10, /\bmerge[\s_]*sort\b/i],
      [7, /def\s+merge_sort|function\s+mergesort|mergeSort\s*\(/i],
      [4, /\bmid\b\s*=[\s\S]{0,30}\/\/?\s*2/],
      [4, /\[\s*:\s*mid\s*\]|\[\s*mid\s*:\s*\]|slice\(\s*0?,?\s*mid/i],
      [3, /divide[\s-]*and[\s-]*conquer|divide.*conquer/i],
    ],
    anti: [[8, /\binterval\b|overlap|\.next\b/i]],
  },
  {
    key: 'quick',
    name: 'Quick Sort',
    explanation:
      'This appears to be **Quick Sort** - a divide-and-conquer sort that partitions elements around a pivot, then recurses on each side. Time complexity: O(n log n) average.',
    signals: [
      [10, /\bquick[\s_]*sort\b/i],
      [7, /\bpivot\b/i],
      [6, /\bpartition\b/i],
      [3, /\b(low|lo)\b[\s\S]{0,40}\b(high|hi)\b/i],
    ],
  },
  {
    key: 'heap',
    name: 'Heap Sort',
    explanation:
      'This looks like **Heap Sort** - it builds a heap and repeatedly extracts the max/min to produce sorted output. Time complexity: O(n log n).',
    signals: [
      [10, /\bheap[\s_]*sort\b/i],
      [7, /\bheapify\b/i],
      [4, /heappush|heappop|heapq/i],
      [2, /\bheap\b/i],
    ],
  },

  // ---------- Search ----------
  {
    key: 'binary',
    name: 'Binary Search',
    explanation:
      'This appears to be **Binary Search** - it repeatedly halves a sorted search space by comparing the target to the middle element. Time complexity: O(log n).',
    signals: [
      [10, /\bbinary[\s_]*search\b/i],
      [6, /\bmid\b\s*=\s*\(?\s*(lo|low|left|l)\b[\s\S]{0,15}\+[\s\S]{0,15}(hi|high|right|r)\b/i],
      [6, /while\s+(lo|low|left|l)\b\s*<=\s*(hi|high|right|r)\b/i],
      [3, /mid\s*[-+]\s*1/],
    ],
    anti: [[8, /\bpivot\b|\bpartition\b/i]],
  },
  {
    key: 'linear',
    name: 'Linear Search',
    explanation:
      'This looks like **Linear Search** - it scans each element in sequence until the target is found. Time complexity: O(n).',
    signals: [
      [10, /\blinear\s*search\b|\bsequential\s*search\b/i],
      [4, /for[\s\S]{0,50}if\s+\w+\[[^\]]*\]\s*==\s*(target|key|x)\b[\s\S]{0,40}return/i],
    ],
  },

  // ---------- Graph ----------
  {
    key: 'bfs',
    name: 'Breadth-First Search (BFS)',
    explanation:
      'This appears to be **Breadth-First Search (BFS)** - it explores a graph level by level using a FIFO queue. Time complexity: O(V + E).',
    signals: [
      [10, /\bbfs\b|breadth[\s-]*first/i],
      [6, /(deque|queue)[\s\S]{0,80}(popleft|dequeue|\.shift\(\))/i],
      [3, /\bqueue\b/i],
      [2, /\blevel\b/i],
    ],
    anti: [[6, /\bstack\b|\bdfs\b/i]],
  },
  {
    key: 'dfs',
    name: 'Depth-First Search (DFS)',
    explanation:
      'This looks like **Depth-First Search (DFS)** - it explores as far as possible along each branch before backtracking, using recursion or a stack. Time complexity: O(V + E).',
    signals: [
      [10, /\bdfs\b|depth[\s-]*first/i],
      [6, /def\s+dfs|function\s+dfs/i],
      [5, /\bstack\b[\s\S]{0,80}\.pop\(\)/i],
      [3, /\bvisited\b/i],
    ],
    anti: [[6, /\bqueue\b|popleft/i]],
  },
  {
    key: 'dijkstra',
    name: "Dijkstra's Algorithm",
    explanation:
      "This appears to be **Dijkstra's Algorithm** - it finds shortest paths from a source in a weighted graph using a priority queue of tentative distances. Time complexity: O((V + E) log V).",
    signals: [
      [10, /\bdijkstra\b/i],
      [6, /heapq|priority\s*queue|priorityqueue|min[_]?heap/i],
      [5, /\bdist(ance)?\b[\s\S]{0,40}(inf|infinity|float\(\s*['"]inf)/i],
      [4, /shortest\s*path/i],
    ],
  },
  {
    key: 'number-of-islands',
    name: 'Number of Islands',
    explanation:
      'This looks like **Number of Islands** - it counts connected components of land cells in a grid using DFS/BFS flood fill. Time complexity: O(rows × cols).',
    signals: [
      [10, /number\s*of\s*islands|num[\s_]*islands/i],
      [6, /grid\[[^\]]*\]\[[^\]]*\]\s*==\s*['"]1['"]/],
      [4, /islands?\s*\+=?\s*1/i],
    ],
  },
  {
    key: 'course-schedule',
    name: 'Course Schedule (Topological Sort)',
    explanation:
      'This appears to be **Course Schedule** - it detects whether a dependency graph can be completed via topological sort / cycle detection. Time complexity: O(V + E).',
    signals: [
      [10, /course\s*schedule|can[_]?finish/i],
      [6, /in[_]?degree|topolog/i],
      [4, /prerequisit/i],
    ],
  },
  {
    key: 'clone-graph',
    name: 'Clone Graph',
    explanation:
      'This looks like **Clone Graph** - it deep-copies a graph by mapping each node to its clone while traversing neighbors. Time complexity: O(V + E).',
    signals: [
      [10, /clone\s*graph|cloneGraph/i],
      [5, /neighbors?\b/i],
      [3, /\bNode\s*\(/],
    ],
  },

  // ---------- Trees ----------
  {
    key: 'invert-tree',
    name: 'Invert Binary Tree',
    explanation:
      'This appears to be **Invert Binary Tree** - it mirrors a tree by swapping the left and right child of every node. Time complexity: O(n).',
    signals: [
      [10, /invert.*tree|invertTree/i],
      [6, /root\.left\s*,\s*root\.right\s*=\s*root\.right\s*,\s*root\.left/i],
    ],
  },
  {
    key: 'max-depth-tree',
    name: 'Maximum Depth of Binary Tree',
    explanation:
      'This looks like **Maximum Depth of Binary Tree** - it returns the longest root-to-leaf path length via recursion. Time complexity: O(n).',
    signals: [
      [10, /max[_\s]*depth|maxDepth/i],
      [5, /1\s*\+\s*max\s*\(/],
    ],
  },
  {
    key: 'level-order',
    name: 'Binary Tree Level Order Traversal',
    explanation:
      'This appears to be **Level Order Traversal** - a BFS over a tree that groups nodes by depth using a queue. Time complexity: O(n).',
    signals: [
      [10, /level[_\s]*order|levelOrder/i],
      [5, /queue[\s\S]{0,120}\blevel\b/i],
    ],
  },
  {
    key: 'validate-bst',
    name: 'Validate Binary Search Tree',
    explanation:
      'This looks like **Validate BST** - it verifies BST ordering by carrying a valid (min, max) range down the recursion. Time complexity: O(n).',
    signals: [
      [10, /valid.*bst|isValidBST|validate.*bst/i],
      [4, /\b(low|min)[_\s]*val\b[\s\S]{0,40}\b(high|max)[_\s]*val\b/i],
    ],
  },
  {
    key: 'same-tree',
    name: 'Same Tree',
    explanation:
      'This appears to be **Same Tree** - it checks whether two binary trees are structurally identical with equal values. Time complexity: O(n).',
    signals: [[10, /same\s*tree|isSameTree/i]],
  },

  // ---------- Dynamic Programming ----------
  {
    key: 'fibonacci',
    name: 'Fibonacci (Recursion)',
    explanation:
      'This looks like **Fibonacci (Recursion)** - it computes F(n) = F(n-1) + F(n-2) with plain recursion. Time complexity: O(2ⁿ) without memoization.',
    signals: [
      [9, /\bfibonacci\b|\bfib\b/i],
      [5, /return\s+fib\w*\(\s*n\s*-\s*1\s*\)\s*\+\s*fib/i],
    ],
    anti: [[7, /dp\s*\[|memo|@?lru_cache|tabulat/i]],
  },
  {
    key: 'fibonacci-dp',
    name: 'Fibonacci (Dynamic Programming)',
    explanation:
      'This appears to be **Fibonacci (DP)** - it computes F(n) bottom-up (or memoized) to avoid recomputation. Time complexity: O(n).',
    signals: [
      [6, /\bfibonacci\b|\bfib\b/i],
      [7, /dp\s*\[|memo|@?lru_cache|tabulat/i],
    ],
  },
  {
    key: 'coin-change',
    name: 'Coin Change',
    explanation:
      'This looks like **Coin Change** - a DP that finds the fewest coins summing to a target amount. Time complexity: O(amount × coins).',
    signals: [
      [10, /coin\s*change|coinChange/i],
      [6, /\bcoins?\b[\s\S]{0,60}\bamount\b/i],
      [4, /dp\s*\[\s*amount\s*\]|min\s*\(\s*dp/i],
    ],
  },
  {
    key: 'climbing-stairs',
    name: 'Climbing Stairs',
    explanation:
      'This appears to be **Climbing Stairs** - a DP where ways(i) = ways(i-1) + ways(i-2). Time complexity: O(n).',
    signals: [
      [10, /climb.*stairs|climbStairs/i],
      [4, /dp\s*\[\s*i\s*\]\s*=\s*dp\s*\[\s*i\s*-\s*1\s*\]\s*\+\s*dp\s*\[\s*i\s*-\s*2\s*\]/],
    ],
  },
  {
    key: 'house-robber',
    name: 'House Robber',
    explanation:
      'This looks like **House Robber** - a DP choosing the max sum of non-adjacent elements. Time complexity: O(n).',
    signals: [
      [10, /house\s*robber|\brob\b/i],
      [4, /max\s*\([\s\S]{0,40}(rob|dp\s*\[\s*i\s*-\s*2\s*\])/i],
    ],
  },
  {
    key: 'longest-common-subsequence',
    name: 'Longest Common Subsequence',
    explanation:
      'This appears to be **Longest Common Subsequence** - a 2-D DP over two strings. Time complexity: O(m × n).',
    signals: [[10, /longest\s*common\s*subsequence|\blcs\b/i]],
  },
  {
    key: 'longest-increasing-subsequence',
    name: 'Longest Increasing Subsequence',
    explanation:
      'This looks like **Longest Increasing Subsequence** - DP (or patience sorting) for the longest strictly increasing subsequence. Time complexity: O(n log n).',
    signals: [[10, /longest\s*increasing\s*subsequence|\blis\b/i]],
  },
  {
    key: 'word-break',
    name: 'Word Break',
    explanation:
      'This appears to be **Word Break** - a DP testing whether a string can be segmented into dictionary words. Time complexity: O(n² × m).',
    signals: [
      [10, /word\s*break|wordBreak/i],
      [4, /word[_]?dict|dictionary/i],
    ],
  },
  {
    key: 'unique-paths',
    name: 'Unique Paths',
    explanation:
      'This looks like **Unique Paths** - grid DP counting paths from top-left to bottom-right. Time complexity: O(m × n).',
    signals: [[10, /unique\s*paths|uniquePaths/i]],
  },
  {
    key: 'jump-game',
    name: 'Jump Game',
    explanation:
      'This appears to be **Jump Game** - a greedy check of whether the last index is reachable. Time complexity: O(n).',
    signals: [[10, /jump\s*game|canJump/i]],
  },

  // ---------- Arrays & Strings ----------
  {
    key: 'two-sum',
    name: 'Two Sum',
    explanation:
      'This looks like **Two Sum** - it finds two indices whose values sum to a target using a hash map of complements. Time complexity: O(n).',
    signals: [
      [10, /two\s*sum|twoSum/i],
      [6, /target\s*-\s*\w+[\s\S]{0,60}(seen|hash|map|dict|complement)/i],
      [4, /\bcomplement\b/i],
    ],
  },
  {
    key: '3sum',
    name: '3Sum',
    explanation:
      'This appears to be **3Sum** - it sorts the array and uses two pointers to find triplets summing to zero. Time complexity: O(n²).',
    signals: [
      [10, /\b3\s*sum\b|three\s*sum|threeSum/i],
      [5, /\btriplet/i],
      [4, /sort\s*\(\s*\)[\s\S]{0,140}(left|l|lo)\b[\s\S]{0,40}(right|r|hi)\b/i],
    ],
  },
  {
    key: 'container-most-water',
    name: 'Container With Most Water',
    explanation:
      'This looks like **Container With Most Water** - two pointers converge from the ends, tracking the max area. Time complexity: O(n).',
    signals: [[10, /container.*water|maxArea/i]],
  },
  {
    key: 'maximum-subarray',
    name: "Maximum Subarray (Kadane's)",
    explanation:
      "This appears to be **Maximum Subarray (Kadane's Algorithm)** - it tracks the best running sum to find the max contiguous subarray. Time complexity: O(n).",
    signals: [
      [10, /max(imum)?\s*subarray|kadane/i],
      [6, /max[_]?(so[_]?far|current|ending|cur)\b/i],
      [4, /max\s*\(\s*\w+\[\s*i\s*\]\s*,/],
    ],
  },
  {
    key: 'maximum-product-subarray',
    name: 'Maximum Product Subarray',
    explanation:
      'This looks like **Maximum Product Subarray** - it tracks running max and min products (to handle negatives). Time complexity: O(n).',
    signals: [[10, /max(imum)?\s*product\s*subarray|maxProduct/i]],
  },
  {
    key: 'product-except-self',
    name: 'Product of Array Except Self',
    explanation:
      'This appears to be **Product of Array Except Self** - it builds prefix and suffix products without division. Time complexity: O(n).',
    signals: [
      [10, /product.*except.*self|productExceptSelf/i],
      [4, /prefix[\s\S]{0,60}suffix|left[\s\S]{0,60}right/i],
    ],
  },
  {
    key: 'contains-duplicate',
    name: 'Contains Duplicate',
    explanation:
      'This looks like **Contains Duplicate** - it checks for repeats using a set. Time complexity: O(n).',
    signals: [
      [10, /contains?\s*duplicate|containsDuplicate/i],
      [4, /len\s*\(\s*set\s*\(|new\s+Set\s*\(/],
    ],
  },
  {
    key: 'group-anagrams',
    name: 'Group Anagrams',
    explanation:
      'This appears to be **Group Anagrams** - it buckets words by a canonical (sorted or count) key. Time complexity: O(n × k log k).',
    signals: [
      [10, /group\s*anagrams|groupAnagrams/i],
      [4, /sorted\s*\(\s*\w+\s*\)|defaultdict/i],
    ],
  },
  {
    key: 'valid-anagram',
    name: 'Valid Anagram',
    explanation:
      'This looks like **Valid Anagram** - it checks two strings have identical character counts. Time complexity: O(n).',
    signals: [[10, /valid\s*anagram|isAnagram/i]],
  },
  {
    key: 'valid-parentheses',
    name: 'Valid Parentheses',
    explanation:
      'This appears to be **Valid Parentheses** - it uses a stack to match opening and closing brackets. Time complexity: O(n).',
    signals: [
      [10, /valid\s*parenthes|valid\s*brackets?/i],
      [6, /\bstack\b[\s\S]{0,80}(mapping|pairs|match|\}|\)|\])/i],
      [3, /\bstack\b[\s\S]{0,60}(paren|bracket)/i],
    ],
  },
  {
    key: 'valid-palindrome',
    name: 'Valid Palindrome',
    explanation:
      'This looks like **Valid Palindrome** - two pointers move inward comparing characters. Time complexity: O(n).',
    signals: [
      [10, /valid\s*palindrome|isPalindrome/i],
      [4, /is\s*alnum|isalnum|left[\s\S]{0,40}right[\s\S]{0,20}==/i],
    ],
  },
  {
    key: 'longest-substring',
    name: 'Longest Substring Without Repeating Characters',
    explanation:
      'This appears to be **Longest Substring Without Repeating Characters** - a sliding window tracks the current unique-character window. Time complexity: O(n).',
    signals: [
      [10, /longest\s*substring/i],
      [5, /sliding\s*window/i],
      [4, /char[_\s]*set|\bwindow\b[\s\S]{0,40}(left|start)/i],
    ],
  },
  {
    key: 'merge-intervals',
    name: 'Merge Intervals',
    explanation:
      'This looks like **Merge Intervals** - it sorts by start then merges overlapping intervals. Time complexity: O(n log n).',
    signals: [
      [10, /merge\s*intervals|mergeIntervals/i],
      [6, /intervals?\s*\.\s*sort|sort[\s\S]{0,40}interval/i],
      [4, /\boverlap|\[\s*1\s*\]\s*[<>]=?\s*\w+\[\s*0\s*\]/i],
    ],
  },
  {
    key: 'insert-interval',
    name: 'Insert Interval',
    explanation:
      'This appears to be **Insert Interval** - it inserts a new interval into a sorted list and merges overlaps. Time complexity: O(n).',
    signals: [[10, /insert\s*interval|insertInterval/i]],
  },
  {
    key: 'meeting-rooms',
    name: 'Meeting Rooms',
    explanation:
      'This looks like **Meeting Rooms** - it sorts intervals to check for (or count) overlapping meetings. Time complexity: O(n log n).',
    signals: [[10, /meeting\s*rooms?\b/i]],
  },

  // ---------- Linked Lists ----------
  {
    key: 'reverse-list',
    name: 'Reverse Linked List',
    explanation:
      'This appears to be **Reverse Linked List** - it re-points each node to its predecessor with prev/curr/next pointers. Time complexity: O(n).',
    signals: [
      [10, /reverse.*(linked)?\s*list|reverseList/i],
      [6, /\bprev\b[\s\S]{0,60}\bnext\b[\s\S]{0,60}\bcurr/i],
      [3, /prev\s*=\s*(none|null)/i],
    ],
  },
  {
    key: 'merge-two-lists',
    name: 'Merge Two Sorted Lists',
    explanation:
      'This looks like **Merge Two Sorted Lists** - it splices two sorted linked lists into one. Time complexity: O(n + m).',
    signals: [[10, /merge\s*two\s*(sorted\s*)?lists|mergeTwoLists/i]],
  },
  {
    key: 'detect-cycle',
    name: 'Linked List Cycle',
    explanation:
      "This appears to be **Linked List Cycle** - Floyd's fast/slow pointers detect a loop. Time complexity: O(n).",
    signals: [
      [10, /detect.*cycle|hasCycle|linked.*list.*cycle/i],
      [6, /\bslow\b[\s\S]{0,40}\bfast\b|fast\s*=\s*fast\.next\.next/i],
    ],
  },
  {
    key: 'remove-nth',
    name: 'Remove Nth Node From End',
    explanation:
      'This looks like **Remove Nth Node From End** - two pointers spaced n apart find the node to unlink. Time complexity: O(n).',
    signals: [[10, /remove.*nth|removeNth/i]],
  },
  {
    key: 'reorder-list',
    name: 'Reorder List',
    explanation:
      'This appears to be **Reorder List** - it splits, reverses the second half, then interleaves the halves. Time complexity: O(n).',
    signals: [[10, /reorder\s*list|reorderList/i]],
  },
  {
    key: 'merge-k-lists',
    name: 'Merge k Sorted Lists',
    explanation:
      'This looks like **Merge k Sorted Lists** - it merges k lists, typically with a min-heap. Time complexity: O(N log k).',
    signals: [[10, /merge\s*k\s*(sorted\s*)?lists|mergeKLists/i]],
  },

  // ---------- Recursion ----------
  {
    key: 'recursion',
    name: 'Factorial (Recursion)',
    explanation:
      'This appears to be **Factorial** - a classic recursion where n! = n × (n-1)!. Time complexity: O(n).',
    signals: [
      [9, /\bfactorial\b/i],
      [5, /return\s+n\s*\*\s*\w+\(\s*n\s*-\s*1\s*\)/i],
    ],
  },
  {
    key: 'tower-hanoi',
    name: 'Tower of Hanoi',
    explanation:
      'This looks like **Tower of Hanoi** - a recursive puzzle moving a stack of disks between pegs. Time complexity: O(2ⁿ).',
    signals: [[10, /tower.*hanoi|\bhanoi\b/i]],
  },
];

/**
 * Score `code` against every algorithm and return the best match.
 * @param {string} code
 * @returns {{ key: string|null, name: string|null, confidence: number, explanation: string, alternatives: Array<{key:string,name:string,score:number}> }}
 */
export function detectAlgorithm(code) {
  if (!code || !code.trim()) {
    return {
      key: null,
      name: null,
      confidence: 0,
      explanation: 'No code provided. Paste some code to analyze.',
      alternatives: [],
    };
  }

  const scored = [];
  for (const algo of ALGORITHMS) {
    let score = 0;
    let definitive = false;
    let hits = 0;

    for (const [weight, pattern] of algo.signals) {
      if (pattern.test(code)) {
        score += weight;
        hits += 1;
        if (weight >= 9) definitive = true;
      }
    }
    for (const [weight, pattern] of algo.anti || []) {
      if (pattern.test(code)) score -= weight;
    }

    if (score > 0) scored.push({ key: algo.key, name: algo.name, score, definitive, hits, explanation: algo.explanation });
  }

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      key: null,
      name: null,
      confidence: 0,
      explanation:
        'Could not confidently identify the algorithm. Try using standard names/variables (e.g. `pivot`, `mid`, `dp`) or add a comment naming it.',
      alternatives: [],
    };
  }

  const best = scored[0];
  const runnerUp = scored[1];
  const margin = best.score - (runnerUp ? runnerUp.score : 0);

  return {
    key: best.key,
    name: best.name,
    confidence: computeConfidence(best, margin),
    explanation: best.explanation,
    alternatives: scored.slice(1, 4).map(({ key, name, score }) => ({ key, name, score })),
  };
}

// Map a raw score + margin over the runner-up into a 0-99 confidence percentage.
function computeConfidence(best, margin) {
  // Diminishing-returns curve: more evidence -> higher confidence, but never a fake 100%.
  let c = Math.round((100 * best.score) / (best.score + 6));

  // An explicit name match is strong evidence on its own.
  if (best.definitive) c = Math.max(c, 88);

  // A close runner-up means the detection is genuinely ambiguous.
  if (!best.definitive) {
    if (margin <= 2) c = Math.min(c, 50);
    else if (margin <= 5) c = Math.min(c, 72);
  }

  return Math.max(10, Math.min(99, c));
}
