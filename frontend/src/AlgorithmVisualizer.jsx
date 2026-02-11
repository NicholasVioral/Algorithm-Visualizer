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
  twosum: {
    title: "Two Sum",
    description: "Two Sum finds two numbers in an array that add up to a target value. It uses a hash map to store previously seen numbers and their indices. For each number, it calculates the complement (target - current) and checks if it exists in the map. This allows finding the pair in a single pass through the array.",
    complexity: "Time: O(n) | Space: O(n)"
  },
  maxsubarray: {
    title: "Maximum Subarray (Kadane's)",
    description: "Kadane's Algorithm finds the contiguous subarray with the maximum sum. At each position, it decides whether to extend the current subarray or start a new one by comparing the current element with the sum of current element plus previous sum. It tracks both the current sum and the global maximum.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  validparentheses: {
    title: "Valid Parentheses",
    description: "Valid Parentheses checks if brackets are properly matched using a stack. When encountering an opening bracket, push it onto the stack. For closing brackets, check if the stack's top has the matching opening bracket and pop it. The string is valid if the stack is empty at the end.",
    complexity: "Time: O(n) | Space: O(n)"
  },
  longestsubstring: {
    title: "Longest Substring Without Repeating Characters",
    description: "This problem uses the sliding window technique with a hash set. Expand the window by moving the right pointer and add characters to the set. When a duplicate is found, shrink the window from the left until the duplicate is removed. Track the maximum window size throughout.",
    complexity: "Time: O(n) | Space: O(min(n, m)) where m is charset size"
  },
  coinchange: {
    title: "Coin Change",
    description: "Coin Change finds the minimum number of coins needed to make a target amount using dynamic programming. Build a DP array where dp[i] represents the minimum coins for amount i. For each amount, try all coin denominations and take the minimum of (dp[amount - coin] + 1).",
    complexity: "Time: O(amount × coins) | Space: O(amount)"
  },
  reverselist: {
    title: "Reverse Linked List",
    description: "Reverse Linked List iteratively reverses the direction of pointers in a singly linked list. Use three pointers: previous (initially null), current (head), and next. For each node, save the next node, reverse the current node's pointer to previous, then advance all three pointers.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  mergeintervals: {
    title: "Merge Intervals",
    description: "Merge Intervals combines overlapping intervals by first sorting them by start time. Then iterate through sorted intervals: if the current interval overlaps with the last merged interval (current start ≤ last end), merge them by updating the end. Otherwise, add the current interval to the result.",
    complexity: "Time: O(n log n) | Space: O(n)"
  },
  productexceptself: {
    title: "Product of Array Except Self",
    description: "Product of Array Except Self calculates products without division using prefix and suffix products. First pass: build prefix products (product of all elements to the left). Second pass: build suffix products (product of all elements to the right) and multiply with prefix to get the final result.",
    complexity: "Time: O(n) | Space: O(1) excluding output array"
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
  },
  'two-pointers': {
    title: "Two Pointers",
    description: "Two Pointers technique uses two pointers that traverse the array from different positions or directions. Common patterns include: converging pointers (start and end moving toward each other), same-direction pointers (both moving forward at different speeds), or opposite-direction pointers. This technique is often used for array problems, palindromes, and pair-finding problems.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  'sliding-window': {
    title: "Sliding Window",
    description: "Sliding Window maintains a window (subarray/substring) that slides through the array. It uses two pointers (left and right) to define the window boundaries. The window expands by moving right pointer and shrinks by moving left pointer based on conditions. This technique efficiently solves subarray/substring problems by avoiding recalculation of the entire window each time.",
    complexity: "Time: O(n) | Space: O(k) where k is window size"
  },
  'fast-slow-pointers': {
    title: "Fast & Slow Pointers (Floyd's Cycle)",
    description: "Floyd's Cycle Detection uses two pointers moving at different speeds through a linked list or sequence. The slow pointer moves one step at a time while the fast pointer moves two steps. If there's a cycle, they will eventually meet. This technique is also used to find middle elements, detect cycles, and find cycle start positions.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  'kadane': {
    title: "Kadane's Algorithm (Max Subarray)",
    description: "Kadane's Algorithm finds the maximum sum of a contiguous subarray in linear time. It maintains a running sum (currentSum) and tracks the maximum sum seen so far. At each element, it decides whether to extend the current subarray or start a new one by taking the maximum of (current element) vs (current element + previous sum).",
    complexity: "Time: O(n) | Space: O(1)"
  },
  'topological-sort': {
    title: "Topological Sort",
    description: "Topological Sort orders vertices in a directed acyclic graph (DAG) such that for every directed edge u→v, vertex u comes before v. Kahn's algorithm uses in-degrees: start with nodes having in-degree 0, process them, reduce in-degrees of neighbors, and repeat. Commonly used for task scheduling, course prerequisites, and dependency resolution.",
    complexity: "Time: O(V + E) | Space: O(V)"
  },
  'union-find': {
    title: "Union Find (Disjoint Set)",
    description: "Union Find efficiently manages disjoint sets with two main operations: Find (determine which set an element belongs to) and Union (merge two sets). Path compression optimizes Find by flattening the tree structure, and union by rank keeps trees balanced. Used for connected components, cycle detection, and network connectivity problems.",
    complexity: "Time: O(α(n)) amortized per operation | Space: O(n)"
  },
  'knapsack': {
    title: "0/1 Knapsack (DP)",
    description: "0/1 Knapsack solves the problem of selecting items with given weights and values to maximize total value without exceeding capacity. Each item can be taken or not (0/1 choice). Uses dynamic programming with a 2D table where dp[i][w] represents maximum value using first i items with capacity w. For each item, choose max of (taking it) or (skipping it).",
    complexity: "Time: O(n × W) | Space: O(n × W) or O(W) optimized"
  },
  'lis': {
    title: "Longest Increasing Subsequence",
    description: "Longest Increasing Subsequence (LIS) finds the length of the longest subsequence where elements are in increasing order. The DP approach uses dp[i] to store LIS length ending at index i, checking all previous elements. A more efficient approach uses binary search with a tails array, replacing elements to maintain the smallest possible tail values.",
    complexity: "Time: O(n²) DP or O(n log n) binary search | Space: O(n)"
  },
  'monotonic-stack': {
    title: "Monotonic Stack",
    description: "Monotonic Stack maintains elements in monotonically increasing or decreasing order. When adding a new element, it pops elements that violate the monotonic property. This technique efficiently solves 'next greater/smaller element' problems, stock span, histogram areas, and temperature problems by processing each element once.",
    complexity: "Time: O(n) | Space: O(n)"
  },
  'backtracking': {
    title: "Backtracking",
    description: "Backtracking explores all possible solutions by incrementally building candidates and abandoning them ('backtracking') when they cannot lead to a valid solution. It follows a 'choose-explore-unchoose' pattern: make a choice, recursively explore that path, then undo the choice (backtrack) to try other options. Used for permutations, combinations, N-Queens, Sudoku, and constraint satisfaction problems.",
    complexity: "Time: Varies (often exponential) | Space: O(depth of recursion)"
  },
  'prefix-sum': {
    title: "Prefix Sum",
    description: "Prefix Sum creates an array where each index stores the cumulative sum of all elements up to that index. This preprocessing enables O(1) range sum queries: sum(l, r) = prefix[r] - prefix[l-1]. Often combined with hash maps to solve subarray sum problems efficiently. Used for range queries, subarray sums, and 2D matrix sums.",
    complexity: "Time: O(n) preprocessing, O(1) per query | Space: O(n)"
  }
};

// Algorithm Functions
const generateBubbleSortSteps = (arr) => {
  const steps = [{
    array: [...arr],
    comparing: [],
    swapped: false,
    description: 'Initial array - Starting bubble sort',
    variables: {},
    operations: { comparisons: 0, swaps: 0 },
    phase: 'Starting',
    insight: 'Bubble sort repeatedly compares adjacent elements and swaps them if they are in the wrong order.'
  }];
  const n = arr.length;
  let totalComparisons = 0;
  let totalSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      totalComparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: false,
        description: `Comparing ${arr[j]} and ${arr[j + 1]} (Pass ${i + 1})`,
        variables: { i, j, 'n-i-1': n - i - 1 },
        operations: { comparisons: totalComparisons, swaps: totalSwaps },
        phase: `Pass ${i + 1} of ${n - 1}`,
        insight: j === n - i - 2 ? `Largest element in unsorted portion will "bubble" to position ${n - i - 1}` : 'Comparing adjacent elements'
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        totalSwaps++;
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: true,
          description: `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}`,
          variables: { i, j, 'n-i-1': n - i - 1 },
          operations: { comparisons: totalComparisons, swaps: totalSwaps },
          phase: `Pass ${i + 1} of ${n - 1}`,
          insight: 'Larger element moves right (towards the end)'
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: false,
    description: `Sorted! Completed in ${totalComparisons} comparisons and ${totalSwaps} swaps`,
    variables: {},
    operations: { comparisons: totalComparisons, swaps: totalSwaps },
    phase: 'Complete',
    insight: `Bubble sort made ${n - 1} passes through the array. Time complexity: O(n²)`
  });
  return steps;
};

const generateInsertionSortSteps = (arr) => {
  const steps = [{
    array: [...arr],
    sorted: [],
    current: -1,
    description: 'Starting Insertion Sort - Building sorted array one element at a time',
    variables: {},
    operations: { comparisons: 0, shifts: 0 },
    phase: 'Starting',
    insight: 'Insertion sort builds a sorted array by inserting each element into its correct position in the sorted portion'
  }];
  let totalComparisons = 0;
  let totalShifts = 0;

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      current: i,
      description: `Pick element ${key} at index ${i} to insert into sorted portion`,
      variables: { i, 'key': key, j, 'sorted size': i },
      operations: { comparisons: totalComparisons, shifts: totalShifts },
      phase: `Inserting element ${i} of ${arr.length}`,
      insight: `First ${i} elements are sorted. Now inserting ${key} into its correct position by shifting larger elements.`
    });

    let shifted = false;
    while (j >= 0 && arr[j] > key) {
      totalComparisons++;
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        current: i,
        comparing: [j, j + 1],
        description: `${arr[j]} > ${key}, shift ${arr[j]} right`,
        variables: { i, 'key': key, j, 'comparing': arr[j] },
        operations: { comparisons: totalComparisons, shifts: totalShifts },
        phase: `Inserting element ${i} of ${arr.length}`,
        insight: `Element ${arr[j]} is larger than ${key}, so shift it right to make space`
      });

      arr[j + 1] = arr[j];
      totalShifts++;
      j--;
      shifted = true;
    }

    if (j >= 0) totalComparisons++; // Final comparison that broke the loop

    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      current: j + 1,
      description: `Inserted ${key} at index ${j + 1}${shifted ? ' after shifting' : ''}`,
      variables: { i, 'key': key, 'final position': j + 1 },
      operations: { comparisons: totalComparisons, shifts: totalShifts },
      phase: `Inserting element ${i} of ${arr.length}`,
      insight: shifted
        ? `${key} inserted at position ${j + 1}. Elements shifted right to make room. Sorted portion grows!`
        : `${key} was already in correct position! No shifting needed.`
    });
  }

  steps.push({
    array: [...arr],
    sorted: Array.from({ length: arr.length }, (_, idx) => idx),
    current: -1,
    description: `Sorted! Total: ${totalComparisons} comparisons, ${totalShifts} shifts`,
    variables: { 'total elements': arr.length },
    operations: { comparisons: totalComparisons, shifts: totalShifts },
    phase: 'Complete',
    insight: `Insertion sort efficient for small or nearly-sorted arrays! Time: O(n²) worst case, O(n) best case (already sorted)`
  });
  return steps;
};

const generateSelectionSortSteps = (arr) => {
  const steps = [{
    array: [...arr],
    sorted: [],
    current: -1,
    minIdx: -1,
    description: 'Starting Selection Sort - Finding minimum elements',
    variables: {},
    operations: { comparisons: 0, swaps: 0 },
    phase: 'Starting',
    insight: 'Selection sort divides the array into sorted and unsorted regions, repeatedly finding the minimum from unsorted portion'
  }];
  const n = arr.length;
  let totalComparisons = 0;
  let totalSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      current: i,
      minIdx: i,
      description: `Position ${i}: Search for minimum in unsorted portion`,
      variables: { i, minIdx, 'sorted count': i, 'remaining': n - i },
      operations: { comparisons: totalComparisons, swaps: totalSwaps },
      phase: `Round ${i + 1} of ${n - 1}`,
      insight: `First ${i} elements are sorted. Finding minimum from remaining ${n - i} elements.`
    });

    for (let j = i + 1; j < n; j++) {
      totalComparisons++;
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        current: i,
        comparing: [minIdx, j],
        minIdx,
        description: `Comparing: ${arr[minIdx]} vs ${arr[j]}`,
        variables: { i, j, minIdx, 'min value': arr[minIdx] },
        operations: { comparisons: totalComparisons, swaps: totalSwaps },
        phase: `Round ${i + 1} of ${n - 1}`,
        insight: `Searching for minimum. Current minimum is ${arr[minIdx]} at index ${minIdx}`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          current: i,
          minIdx,
          description: `Found new minimum: ${arr[minIdx]} at index ${minIdx}`,
          variables: { i, j, minIdx, 'min value': arr[minIdx] },
          operations: { comparisons: totalComparisons, swaps: totalSwaps },
          phase: `Round ${i + 1} of ${n - 1}`,
          insight: `Updated minimum! ${arr[minIdx]} is smaller than previous minimum`
        });
      }
    }

    if (minIdx !== i) {
      const temp1 = arr[i];
      const temp2 = arr[minIdx];
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      totalSwaps++;
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        current: i,
        minIdx: -1,
        description: `Swapped ${temp2} (from index ${minIdx}) with ${temp1} (from index ${i})`,
        variables: { i, minIdx, 'swapped': temp2 },
        operations: { comparisons: totalComparisons, swaps: totalSwaps },
        phase: `Round ${i + 1} of ${n - 1}`,
        insight: `Minimum element ${temp2} moved to sorted position ${i}. Sorted region grows!`
      });
    } else {
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        current: i,
        minIdx: -1,
        description: `Element ${arr[i]} already in correct position`,
        variables: { i, 'sorted count': i + 1 },
        operations: { comparisons: totalComparisons, swaps: totalSwaps },
        phase: `Round ${i + 1} of ${n - 1}`,
        insight: `No swap needed! Element was already the minimum.`
      });
    }
  }

  steps.push({
    array: [...arr],
    sorted: Array.from({ length: arr.length }, (_, idx) => idx),
    current: -1,
    minIdx: -1,
    description: `Sorted! Completed with ${totalComparisons} comparisons and ${totalSwaps} swaps`,
    variables: { 'total elements': n },
    operations: { comparisons: totalComparisons, swaps: totalSwaps },
    phase: 'Complete',
    insight: `Selection sort always performs n(n-1)/2 comparisons but minimizes swaps. Time: O(n²), Swaps: O(n)`
  });
  return steps;
};

const generateHeapSortSteps = (arr) => {
  let totalSwaps = 0;
  let totalHeapifies = 0;
  const n = arr.length;

  const steps = [{
    array: [...arr],
    comparing: [],
    heapSize: n,
    description: 'Starting Heap Sort',
    variables: { 'array length': n, 'heap size': n },
    operations: { swaps: 0, heapifies: 0 },
    phase: 'Initialize',
    insight: 'Heap sort first builds a max heap where parent nodes are larger than children, then repeatedly extracts the maximum element.'
  }];

  const heapify = (heapSize, i) => {
    totalHeapifies++;
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize && arr[left] > arr[largest]) largest = left;
    if (right < heapSize && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      totalSwaps++;
      const temp1 = arr[i];
      const temp2 = arr[largest];

      steps.push({
        array: [...arr],
        comparing: [i, largest],
        swapped: true,
        heapSize,
        description: `Swap ${temp1} with ${temp2} to maintain max heap property`,
        variables: { parent: i, child: largest, 'parent value': temp1, 'child value': temp2, 'heap size': heapSize },
        operations: { swaps: totalSwaps, heapifies: totalHeapifies },
        phase: 'Building Heap',
        insight: `Child ${temp2} is larger than parent ${temp1}, so swap them to maintain max heap property (parent ≥ children).`
      });

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(heapSize, largest);
    }
  };

  // Build max heap
  steps.push({
    array: [...arr],
    comparing: [],
    heapSize: n,
    description: 'Building max heap from bottom up',
    variables: { 'heap size': n, 'starting from': Math.floor(n / 2) - 1 },
    operations: { swaps: totalSwaps, heapifies: totalHeapifies },
    phase: 'Build Heap Phase',
    insight: 'Start from last non-leaf node and heapify each subtree. This ensures max heap property throughout the tree.'
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      comparing: [i],
      heapSize: n,
      description: `Heapify subtree rooted at index ${i} (value: ${arr[i]})`,
      variables: { 'heapifying': i, value: arr[i], 'heap size': n },
      operations: { swaps: totalSwaps, heapifies: totalHeapifies },
      phase: 'Build Heap Phase',
      insight: `Check if node ${arr[i]} at index ${i} is larger than its children. If not, swap with largest child.`
    });
    heapify(n, i);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    heapSize: n,
    description: 'Max heap built! Root has largest element',
    variables: { 'max element': arr[0], 'heap size': n },
    operations: { swaps: totalSwaps, heapifies: totalHeapifies },
    phase: 'Heap Built',
    insight: `Heap is complete! The root (${arr[0]}) is the maximum element. Now extract it repeatedly to sort.`
  });

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    totalSwaps++;
    const maxElement = arr[0];

    steps.push({
      array: [...arr],
      comparing: [0, i],
      swapped: true,
      heapSize: i + 1,
      description: `Extract max ${maxElement}, swap with last element ${arr[i]}`,
      variables: { max: maxElement, 'last element': arr[i], 'heap size': i + 1, 'sorted count': n - i },
      operations: { swaps: totalSwaps, heapifies: totalHeapifies },
      phase: `Extracting (${n - i}/${n})`,
      insight: `Root ${maxElement} is the maximum. Swap it to end of array (sorted position), then restore heap property.`
    });

    [arr[0], arr[i]] = [arr[i], arr[0]];

    steps.push({
      array: [...arr],
      comparing: [0],
      heapSize: i,
      description: `Restore heap property with reduced heap size ${i}`,
      variables: { 'heap size': i, 'sorted elements': n - i },
      operations: { swaps: totalSwaps, heapifies: totalHeapifies },
      phase: `Extracting (${n - i}/${n})`,
      insight: `New root might violate heap property. Heapify to restore it, then repeat extraction.`
    });

    heapify(i, 0);
  }

  steps.push({
    array: [...arr],
    comparing: [],
    heapSize: 0,
    description: 'Heap Sort complete!',
    variables: { 'total elements': n },
    operations: { swaps: totalSwaps, heapifies: totalHeapifies },
    phase: 'Complete',
    insight: `Sorted ${n} elements with ${totalSwaps} swaps. Time: O(n log n) always, Space: O(1). Great for consistent performance!`
  });

  return steps;
};

const generateLinearSearchSteps = (arr, target) => {
  const steps = [{
    array: [...arr],
    comparing: [],
    current: -1,
    found: false,
    description: `Starting linear search for ${target}`,
    variables: { target, 'array length': arr.length },
    operations: { comparisons: 0 },
    phase: 'Initialize',
    insight: 'Linear search checks each element sequentially from left to right until the target is found or we reach the end.'
  }];

  let comparisons = 0;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;

    steps.push({
      array: [...arr],
      comparing: [i],
      current: i,
      found: false,
      description: `Checking element at index ${i}: Is ${arr[i]} equal to ${target}?`,
      variables: { target, 'current index': i, 'current value': arr[i] },
      operations: { comparisons },
      phase: `Searching (${i + 1}/${arr.length})`,
      insight: arr[i] === target ?
        `Found it! ${arr[i]} matches our target ${target}.` :
        `${arr[i]} ≠ ${target}, continue searching...`
    });

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        comparing: [i],
        current: i,
        found: true,
        description: `Found ${target} at index ${i}!`,
        variables: { target, 'found at': i },
        operations: { comparisons },
        phase: 'Complete - Found',
        insight: `Success! Found target in ${comparisons} comparison(s). Best case: O(1), Worst case: O(n), Average: O(n/2).`
      });
      return steps;
    }
  }

  steps.push({
    array: [...arr],
    comparing: [],
    current: -1,
    found: false,
    description: `${target} not found in array`,
    variables: { target, 'elements checked': arr.length },
    operations: { comparisons },
    phase: 'Complete - Not Found',
    insight: `Target not found after checking all ${arr.length} elements. Time complexity: O(n) where n is array length.`
  });
  return steps;
};

const generateMergeSortSteps = (arr) => {
  let totalComparisons = 0;
  let totalMerges = 0;
  let divideCount = 0;

  const steps = [{
    array: [...arr],
    comparing: [],
    description: 'Starting Merge Sort',
    variables: { 'array length': arr.length },
    operations: { comparisons: 0, merges: 0, divides: 0 },
    phase: 'Initialize',
    insight: 'Merge sort uses divide-and-conquer: recursively divide array in half, sort each half, then merge them back together.'
  }];

  const merge = (left, right, start) => {
    totalMerges++;
    const result = [];
    let i = 0, j = 0;

    steps.push({
      array: [...arr],
      comparing: [],
      description: `Merging two sorted subarrays of size ${left.length} and ${right.length}`,
      variables: { 'left size': left.length, 'right size': right.length },
      operations: { comparisons: totalComparisons, merges: totalMerges, divides: divideCount },
      phase: `Merging ${totalMerges}`,
      insight: `Merging combines two sorted arrays into one. We compare elements and take the smaller one each time.`
    });

    while (i < left.length && j < right.length) {
      totalComparisons++;

      if (left[i] <= right[j]) {
        result.push(left[i]);
        steps.push({
          array: [...arr],
          comparing: [],
          description: `Take ${left[i]} from left subarray (${left[i]} ≤ ${right[j]})`,
          variables: { 'comparing': `${left[i]} vs ${right[j]}`, 'chose': left[i] },
          operations: { comparisons: totalComparisons, merges: totalMerges, divides: divideCount },
          phase: `Merging ${totalMerges}`,
          insight: `${left[i]} ≤ ${right[j]}, so take from left. This maintains sorted order.`
        });
        i++;
      } else {
        result.push(right[j]);
        steps.push({
          array: [...arr],
          comparing: [],
          description: `Take ${right[j]} from right subarray (${right[j]} < ${left[i]})`,
          variables: { 'comparing': `${left[i]} vs ${right[j]}`, 'chose': right[j] },
          operations: { comparisons: totalComparisons, merges: totalMerges, divides: divideCount },
          phase: `Merging ${totalMerges}`,
          insight: `${right[j]} < ${left[i]}, so take from right. This maintains sorted order.`
        });
        j++;
      }
    }

    const finalResult = result.concat(left.slice(i)).concat(right.slice(j));

    for (let k = 0; k < finalResult.length; k++) {
      arr[start + k] = finalResult[k];
    }

    steps.push({
      array: [...arr],
      comparing: Array.from({ length: finalResult.length }, (_, idx) => start + idx),
      description: `Merged into sorted subarray: [${finalResult.join(', ')}]`,
      variables: { 'merged size': finalResult.length },
      operations: { comparisons: totalComparisons, merges: totalMerges, divides: divideCount },
      phase: `Merge ${totalMerges} Complete`,
      insight: `Subarray is now sorted and merged back into the main array.`
    });

    return finalResult;
  };

  const mergeSortHelper = (array, start = 0) => {
    if (array.length <= 1) return array;

    divideCount++;
    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);

    steps.push({
      array: [...arr],
      comparing: Array.from({ length: array.length }, (_, i) => start + i),
      description: `Divide array at position ${start + mid} into [${left.join(', ')}] and [${right.join(', ')}]`,
      variables: { 'divide #': divideCount, 'left size': left.length, 'right size': right.length },
      operations: { comparisons: totalComparisons, merges: totalMerges, divides: divideCount },
      phase: `Dividing ${divideCount}`,
      insight: `Split array in half. Each half will be sorted independently, then merged.`
    });

    const sortedLeft = mergeSortHelper(left, start);
    const sortedRight = mergeSortHelper(right, start + mid);
    return merge(sortedLeft, sortedRight, start);
  };

  mergeSortHelper([...arr]);

  steps.push({
    array: [...arr],
    comparing: [],
    description: `Merge Sort complete!`,
    variables: { 'total elements': arr.length },
    operations: { comparisons: totalComparisons, merges: totalMerges, divides: divideCount },
    phase: 'Complete',
    insight: `Sorted ${arr.length} elements with ${totalComparisons} comparisons and ${totalMerges} merges. Time complexity: O(n log n) always, Space: O(n).`
  });

  return steps;
};

const generateQuickSortSteps = (arr) => {
  let totalComparisons = 0;
  let totalSwaps = 0;
  let partitionCount = 0;

  const steps = [{
    array: [...arr],
    comparing: [],
    pivot: -1,
    description: 'Starting Quick Sort',
    variables: { 'array length': arr.length },
    operations: { comparisons: 0, swaps: 0, partitions: 0 },
    phase: 'Initialize',
    insight: 'Quick sort uses divide-and-conquer: pick a pivot, partition around it, then recursively sort both sides.'
  }];

  const partition = (low, high) => {
    partitionCount++;
    const pivot = arr[high];
    const pivotValue = pivot;

    steps.push({
      array: [...arr],
      comparing: [high],
      pivot: high,
      description: `Select pivot: ${pivot} at index ${high}`,
      variables: { pivot: pivotValue, low, high, 'partition #': partitionCount },
      operations: { comparisons: totalComparisons, swaps: totalSwaps, partitions: partitionCount },
      phase: `Partitioning ${partitionCount}`,
      insight: `Pivot ${pivot} will be placed in its final sorted position. All elements < ${pivot} go left, all ≥ ${pivot} go right.`
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      totalComparisons++;

      steps.push({
        array: [...arr],
        comparing: [j, high],
        pivot: high,
        description: `Compare ${arr[j]} with pivot ${pivot}`,
        variables: { pivot: pivotValue, i, j, 'arr[j]': arr[j] },
        operations: { comparisons: totalComparisons, swaps: totalSwaps, partitions: partitionCount },
        phase: `Partitioning ${partitionCount}`,
        insight: arr[j] < pivot ?
          `${arr[j]} < ${pivot}, so swap it to the left side` :
          `${arr[j]} ≥ ${pivot}, keep it on the right side`
      });

      if (arr[j] < pivot) {
        i++;
        totalSwaps++;
        const temp1 = arr[i];
        const temp2 = arr[j];
        [arr[i], arr[j]] = [arr[j], arr[i]];

        steps.push({
          array: [...arr],
          comparing: [i, j],
          swapped: true,
          pivot: high,
          description: `Swapped ${temp2} with ${temp1}`,
          variables: { pivot: pivotValue, i, j },
          operations: { comparisons: totalComparisons, swaps: totalSwaps, partitions: partitionCount },
          phase: `Partitioning ${partitionCount}`,
          insight: `Moved ${temp2} to left partition (elements < pivot).`
        });
      }
    }

    totalSwaps++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    steps.push({
      array: [...arr],
      comparing: [i + 1],
      swapped: true,
      pivot: i + 1,
      description: `Placed pivot ${pivotValue} in correct position at index ${i + 1}`,
      variables: { 'pivot position': i + 1, pivot: pivotValue },
      operations: { comparisons: totalComparisons, swaps: totalSwaps, partitions: partitionCount },
      phase: `Partition ${partitionCount} Complete`,
      insight: `Pivot ${pivotValue} is now in its final sorted position. Left side has elements < ${pivotValue}, right side has elements ≥ ${pivotValue}.`
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

  steps.push({
    array: [...arr],
    comparing: [],
    pivot: -1,
    description: `Quick Sort complete!`,
    variables: { 'total elements': arr.length },
    operations: { comparisons: totalComparisons, swaps: totalSwaps, partitions: partitionCount },
    phase: 'Complete',
    insight: `Sorted ${arr.length} elements with ${totalComparisons} comparisons and ${totalSwaps} swaps. Average time: O(n log n), Worst case: O(n²).`
  });

  return steps;
};

const generateBinarySearchSteps = (arr, target) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const steps = [{
    array: sorted,
    comparing: [],
    left: 0,
    right: sorted.length - 1,
    mid: -1,
    description: `Binary search for ${target} in sorted array`,
    variables: { target, 'array size': sorted.length },
    operations: { comparisons: 0, steps: 0 },
    phase: 'Starting',
    insight: 'Binary search works on sorted arrays, eliminating half the search space each step'
  }];

  let left = 0;
  let right = sorted.length - 1;
  let totalComparisons = 0;
  let searchSteps = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    searchSteps++;
    const searchSpaceSize = right - left + 1;

    steps.push({
      array: sorted,
      comparing: [mid],
      left,
      right,
      mid,
      description: `Checking middle element at index ${mid}: ${sorted[mid]}`,
      variables: { left, right, mid, 'search space': searchSpaceSize },
      operations: { comparisons: totalComparisons, steps: searchSteps },
      phase: `Step ${searchSteps}`,
      insight: `Search space reduced to ${searchSpaceSize} elements. Middle element divides the space in half.`
    });

    totalComparisons++;

    if (sorted[mid] === target) {
      steps.push({
        array: sorted,
        comparing: [mid],
        left,
        right,
        mid,
        found: true,
        description: `✓ Found ${target} at index ${mid}!`,
        variables: { left, right, mid, target },
        operations: { comparisons: totalComparisons, steps: searchSteps },
        phase: 'Found',
        insight: `Binary search found the target in ${searchSteps} steps! Time complexity: O(log n) - Much faster than linear O(n)!`
      });
      return steps;
    }

    if (sorted[mid] < target) {
      left = mid + 1;
      steps.push({
        array: sorted,
        comparing: [],
        left,
        right,
        mid,
        description: `${sorted[mid]} < ${target}, eliminating left half. Search right →`,
        variables: { left, right, mid, 'eliminated': mid + 1 },
        operations: { comparisons: totalComparisons, steps: searchSteps },
        phase: `Step ${searchSteps}`,
        insight: `Target is larger, so it must be in the right half. Left half is eliminated!`
      });
    } else {
      right = mid - 1;
      steps.push({
        array: sorted,
        comparing: [],
        left,
        right,
        mid,
        description: `${sorted[mid]} > ${target}, eliminating right half. Search left ←`,
        variables: { left, right, mid, 'eliminated': sorted.length - mid },
        operations: { comparisons: totalComparisons, steps: searchSteps },
        phase: `Step ${searchSteps}`,
        insight: `Target is smaller, so it must be in the left half. Right half is eliminated!`
      });
    }
  }

  steps.push({
    array: sorted,
    comparing: [],
    left,
    right,
    mid: -1,
    found: false,
    description: `✗ ${target} not found in array after ${searchSteps} steps`,
    variables: { left, right, target },
    operations: { comparisons: totalComparisons, steps: searchSteps },
    phase: 'Not Found',
    insight: `Search space exhausted. Target does not exist in the array. Still only took ${searchSteps} steps!`
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

  const steps = [{
    graph,
    queue: [parseInt(start)],
    visited: new Set(),
    current: null,
    description: 'Initialize BFS with start node',
    variables: { 'start node': parseInt(start) },
    operations: { 'nodes visited': 0, 'edges traversed': 0 },
    phase: 'Starting',
    insight: 'BFS explores graph level by level using a queue. We start by adding the initial node to the queue.'
  }];

  const visited = new Set();
  const queue = [parseInt(start)];
  let nodesVisited = 0;
  let edgesTraversed = 0;

  while (queue.length > 0) {
    const current = queue.shift();

    if (visited.has(current)) continue;

    visited.add(current);
    nodesVisited++;

    steps.push({
      graph,
      queue: [...queue],
      visited: new Set(visited),
      current,
      description: `Visit node ${current}`,
      variables: { 'current node': current, 'queue size': queue.length, 'visited count': visited.size },
      operations: { 'nodes visited': nodesVisited, 'edges traversed': edgesTraversed },
      phase: `Visiting node ${current}`,
      insight: `Processing node ${current}. BFS visits all neighbors at current level before moving deeper. Queue ensures level-by-level exploration.`
    });

    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      edgesTraversed++;
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
        steps.push({
          graph,
          queue: [...queue],
          visited: new Set(visited),
          current,
          description: `Add node ${neighbor} to queue`,
          variables: { 'current node': current, 'adding': neighbor, 'queue size': queue.length, 'visited count': visited.size },
          operations: { 'nodes visited': nodesVisited, 'edges traversed': edgesTraversed },
          phase: `Exploring neighbors of ${current}`,
          insight: `Found unvisited neighbor ${neighbor}. Adding to back of queue to visit later. This ensures breadth-first order.`
        });
      }
    }
  }

  steps.push({
    graph,
    queue: [],
    visited,
    current: null,
    description: 'BFS complete!',
    variables: { 'total nodes': visited.size },
    operations: { 'nodes visited': nodesVisited, 'edges traversed': edgesTraversed },
    phase: 'Complete',
    insight: `BFS visited all ${nodesVisited} reachable nodes level by level. Time complexity: O(V + E) where V is vertices and E is edges.`
  });

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

  const steps = [{
    graph,
    stack: [parseInt(start)],
    visited: new Set(),
    current: null,
    description: 'Initialize DFS with start node',
    variables: { 'start node': parseInt(start) },
    operations: { 'nodes visited': 0, 'edges traversed': 0 },
    phase: 'Starting',
    insight: 'DFS explores as deep as possible along each branch using a stack. We start by pushing the initial node onto the stack.'
  }];

  const visited = new Set();
  const stack = [parseInt(start)];
  let nodesVisited = 0;
  let edgesTraversed = 0;

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;

    visited.add(current);
    nodesVisited++;

    steps.push({
      graph,
      stack: [...stack],
      visited: new Set(visited),
      current,
      description: `Visit node ${current}`,
      variables: { 'current node': current, 'stack size': stack.length, 'visited count': visited.size },
      operations: { 'nodes visited': nodesVisited, 'edges traversed': edgesTraversed },
      phase: `Visiting node ${current}`,
      insight: `Processing node ${current}. DFS goes deep first before backtracking. Stack (LIFO) ensures we explore deepest unvisited neighbor first.`
    });

    const neighbors = (graph[current] || []).reverse();
    for (const neighbor of neighbors) {
      edgesTraversed++;
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        steps.push({
          graph,
          stack: [...stack],
          visited: new Set(visited),
          current,
          description: `Push node ${neighbor} to stack`,
          variables: { 'current node': current, 'pushing': neighbor, 'stack size': stack.length, 'visited count': visited.size },
          operations: { 'nodes visited': nodesVisited, 'edges traversed': edgesTraversed },
          phase: `Exploring neighbors of ${current}`,
          insight: `Found unvisited neighbor ${neighbor}. Pushing to top of stack to visit next. This ensures depth-first exploration.`
        });
      }
    }
  }

  steps.push({
    graph,
    stack: [],
    visited,
    current: null,
    description: 'DFS complete!',
    variables: { 'total nodes': visited.size },
    operations: { 'nodes visited': nodesVisited, 'edges traversed': edgesTraversed },
    phase: 'Complete',
    insight: `DFS visited all ${nodesVisited} reachable nodes by exploring each branch fully before backtracking. Time complexity: O(V + E).`
  });

  return steps;
};

const generateDijkstraSteps = (edges, start) => {
  const graph = {};
  const distances = {};
  const allNodes = new Set();
  let totalUpdates = 0;
  let nodesVisited = 0;

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
    description: `Initialize Dijkstra's algorithm from node ${start}`,
    variables: { 'start node': parseInt(start), 'total nodes': allNodes.size },
    operations: { 'nodes visited': 0, 'distance updates': 0 },
    phase: 'Initialize',
    insight: `Dijkstra finds shortest paths from source to all nodes. Start node has distance 0, all others start at infinity.`
  }];

  const visited = new Set();
  const unvisited = Array.from(allNodes);

  while (unvisited.length > 0) {
    // Find unvisited node with minimum distance
    let current = unvisited.reduce((min, node) =>
      !visited.has(node) && distances[node] < distances[min] ? node : min
    );

    if (distances[current] === Infinity) break;

    nodesVisited++;
    visited.add(current);

    steps.push({
      graph,
      distances: { ...distances },
      visited: new Set(visited),
      current,
      description: `Visit node ${current} with shortest distance ${distances[current]}`,
      variables: {
        'current node': current,
        'current distance': distances[current],
        'unvisited count': unvisited.length - 1
      },
      operations: { 'nodes visited': nodesVisited, 'distance updates': totalUpdates },
      phase: `Visiting (${nodesVisited}/${allNodes.size})`,
      insight: `Node ${current} has the shortest distance (${distances[current]}) among unvisited nodes. This distance is now finalized.`
    });

    const neighbors = graph[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (!visited.has(neighbor)) {
        const oldDist = distances[neighbor];
        const newDist = distances[current] + weight;

        if (newDist < distances[neighbor]) {
          totalUpdates++;
          distances[neighbor] = newDist;

          steps.push({
            graph,
            distances: { ...distances },
            visited: new Set(visited),
            current,
            updating: neighbor,
            description: `Update node ${neighbor}: ${oldDist === Infinity ? '∞' : oldDist} → ${newDist}`,
            variables: {
              'updating': neighbor,
              'old distance': oldDist === Infinity ? '∞' : oldDist,
              'new distance': newDist,
              'edge weight': weight
            },
            operations: { 'nodes visited': nodesVisited, 'distance updates': totalUpdates },
            phase: `Visiting (${nodesVisited}/${allNodes.size})`,
            insight: `Path through node ${current} is shorter! Distance to ${neighbor} improved from ${oldDist === Infinity ? '∞' : oldDist} to ${newDist}.`
          });
        } else {
          steps.push({
            graph,
            distances: { ...distances },
            visited: new Set(visited),
            current,
            checking: neighbor,
            description: `Check node ${neighbor}: Current path (${oldDist}) is better than ${newDist}`,
            variables: {
              'checking': neighbor,
              'current distance': oldDist,
              'path via ${current}': newDist
            },
            operations: { 'nodes visited': nodesVisited, 'distance updates': totalUpdates },
            phase: `Visiting (${nodesVisited}/${allNodes.size})`,
            insight: `Path through ${current} (${newDist}) is not better than existing path (${oldDist}). Keep current distance.`
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
    description: 'Dijkstra complete! All shortest paths found.',
    variables: { 'total nodes': allNodes.size },
    operations: { 'nodes visited': nodesVisited, 'distance updates': totalUpdates },
    phase: 'Complete',
    insight: `Found shortest paths from node ${start} to all reachable nodes with ${totalUpdates} distance updates. Time: O((V + E) log V) with priority queue.`
  });

  return steps;
};

const generateRecursionSteps = (n) => {
  let totalCalls = 0;
  const steps = [{
    callStack: [],
    description: `Starting factorial computation for ${n}`,
    variables: { n, 'calls made': 0 },
    operations: { 'function calls': 0, 'multiplications': 0 },
    phase: 'Initialize',
    insight: `Factorial uses recursion: f(n) = n × f(n-1), with base case f(0) = f(1) = 1. Each call adds to the call stack.`
  }];
  const callStack = [];
  let multiplications = 0;

  const factorial = (num, depth = 0) => {
    totalCalls++;
    callStack.push({ function: `factorial(${num})`, depth, returning: false });

    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Call factorial(${num}) - depth ${depth}`,
      variables: { 'computing': num, depth, 'stack size': callStack.length },
      operations: { 'function calls': totalCalls, 'multiplications': multiplications },
      phase: `Diving Down`,
      insight: `Push factorial(${num}) onto call stack. Need to compute factorial(${num - 1}) first before we can calculate ${num} × factorial(${num - 1}).`
    });

    if (num <= 1) {
      callStack[callStack.length - 1].returning = true;
      callStack[callStack.length - 1].result = 1;

      steps.push({
        callStack: callStack.map(c => ({ ...c })),
        description: `Base case reached: factorial(${num}) = 1`,
        variables: { 'base case': num, result: 1, 'stack size': callStack.length },
        operations: { 'function calls': totalCalls, 'multiplications': multiplications },
        phase: `Base Case`,
        insight: `Factorial of ${num} is 1 (base case). Now start returning up the call stack, multiplying as we go.`
      });

      callStack.pop();

      steps.push({
        callStack: callStack.map(c => ({ ...c })),
        description: `Return 1 from factorial(${num})`,
        variables: { returned: 1, 'stack size': callStack.length },
        operations: { 'function calls': totalCalls, 'multiplications': multiplications },
        phase: `Returning Up`,
        insight: `Pop factorial(${num}) from stack, return 1 to caller.`
      });

      return 1;
    }

    const result = num * factorial(num - 1, depth + 1);
    multiplications++;

    callStack[callStack.length - 1].returning = true;
    callStack[callStack.length - 1].result = result;

    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Compute factorial(${num}) = ${num} × ${result / num} = ${result}`,
      variables: { num, 'factorial(num-1)': result / num, result, 'stack size': callStack.length },
      operations: { 'function calls': totalCalls, 'multiplications': multiplications },
      phase: `Computing Result`,
      insight: `Got factorial(${num - 1}) = ${result / num} from recursive call. Multiply: ${num} × ${result / num} = ${result}.`
    });

    callStack.pop();

    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Return ${result} from factorial(${num})`,
      variables: { returned: result, 'to': num + 1, 'stack size': callStack.length },
      operations: { 'function calls': totalCalls, 'multiplications': multiplications },
      phase: `Returning Up`,
      insight: `Pop factorial(${num}) from stack, return ${result} to ${num === n ? 'main' : `factorial(${num + 1})`}.`
    });

    return result;
  };

  const finalResult = factorial(n);

  steps.push({
    callStack: [],
    description: `Factorial computation complete: ${n}! = ${finalResult}`,
    variables: { n, result: finalResult },
    operations: { 'function calls': totalCalls, 'multiplications': multiplications },
    phase: 'Complete',
    insight: `Computed ${n}! = ${finalResult} using ${totalCalls} function calls and ${multiplications} multiplications. Time: O(n), Space: O(n) for call stack.`
  });

  return steps;
};

const generateBSTInsertSteps = (arr) => {
  let totalComparisons = 0;
  let totalInsertions = 0;

  const steps = [{
    tree: null,
    inserting: null,
    description: 'Starting BST construction',
    variables: { 'elements to insert': arr.length },
    operations: { comparisons: 0, insertions: 0 },
    phase: 'Initialize',
    insight: `Binary Search Tree maintains order: left children < parent < right children. This enables O(log n) search on balanced trees.`
  }];

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
      totalInsertions++;

      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        inserting: val,
        path: [...path],
        description: `Insert ${val} at this position`,
        variables: { inserting: val, 'path length': path.length, 'tree size': totalInsertions },
        operations: { comparisons: totalComparisons, insertions: totalInsertions },
        phase: `Inserting (${totalInsertions}/${arr.length})`,
        insight: `Found empty spot! Insert ${val} as a new leaf node. Path taken: ${path.length === 0 ? 'root' : path.join(' → ')}.`
      });

      return new TreeNode(val);
    }

    totalComparisons++;

    steps.push({
      tree: JSON.parse(JSON.stringify(root)),
      inserting: val,
      path: [...path, node.val],
      description: `Compare ${val} with ${node.val}: ${val < node.val ? `${val} < ${node.val}` : `${val} ≥ ${node.val}`}`,
      variables: {
        inserting: val,
        'current node': node.val,
        'going': val < node.val ? 'left' : 'right',
        'depth': path.length
      },
      operations: { comparisons: totalComparisons, insertions: totalInsertions },
      phase: `Inserting (${totalInsertions}/${arr.length})`,
      insight: `${val} ${val < node.val ? '<' : '≥'} ${node.val}, so go ${val < node.val ? 'left' : 'right'}. BST property ensures smaller values go left, larger go right.`
    });

    if (val < node.val) {
      node.left = insert(node.left, val, [...path, node.val]);
    } else {
      node.right = insert(node.right, val, [...path, node.val]);
    }

    return node;
  };

  arr.forEach((val, idx) => {
    root = insert(root, val);

    steps.push({
      tree: JSON.parse(JSON.stringify(root)),
      inserting: null,
      path: [],
      description: `Inserted ${val} successfully`,
      variables: { 'just inserted': val, 'tree size': totalInsertions, remaining: arr.length - idx - 1 },
      operations: { comparisons: totalComparisons, insertions: totalInsertions },
      phase: `Progress (${idx + 1}/${arr.length})`,
      insight: `${val} is now part of the tree. ${arr.length - idx - 1} element(s) remaining to insert.`
    });
  });

  steps.push({
    tree: JSON.parse(JSON.stringify(root)),
    inserting: null,
    path: [],
    description: 'BST construction complete!',
    variables: { 'total nodes': totalInsertions },
    operations: { comparisons: totalComparisons, insertions: totalInsertions },
    phase: 'Complete',
    insight: `Built BST with ${totalInsertions} nodes using ${totalComparisons} comparisons. Average insert: O(log n), Worst case (skewed tree): O(n).`
  });

  return steps;
};

const generateBSTSearchSteps = (arr, target) => {
  let totalComparisons = 0;
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
    description: `Starting search for ${target} in BST`,
    variables: { target, 'tree size': arr.length },
    operations: { comparisons: 0 },
    phase: 'Initialize',
    insight: `BST search is efficient: compare with current node, then go left if target is smaller, right if larger. O(log n) on balanced trees.`
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
        description: `Reached empty node - ${val} not found`,
        variables: { target: val, 'path length': path.length, 'nodes checked': totalComparisons },
        operations: { comparisons: totalComparisons },
        phase: 'Not Found',
        insight: `Reached a null node following the BST path. ${val} is not in the tree. Checked ${totalComparisons} node(s).`
      });
      return false;
    }

    totalComparisons++;

    steps.push({
      tree: JSON.parse(JSON.stringify(root)),
      searching: val,
      current: node.val,
      path: [...path, node.val],
      description: `Compare ${val} with ${node.val}`,
      variables: { target: val, 'current node': node.val, depth: path.length },
      operations: { comparisons: totalComparisons },
      phase: 'Searching',
      insight: `At node ${node.val}. ${val === node.val ? 'Match found!' : val < node.val ? `${val} < ${node.val}, go left` : `${val} > ${node.val}, go right`}`
    });

    if (node.val === val) {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: node.val,
        path: [...path, node.val],
        found: true,
        description: `Found ${val}!`,
        variables: { target: val, 'found at': node.val, 'path length': path.length + 1 },
        operations: { comparisons: totalComparisons },
        phase: 'Found',
        insight: `Success! Found ${val} in ${totalComparisons} comparison(s). Path: ${[...path, node.val].join(' → ')}.`
      });
      return true;
    }

    if (val < node.val) {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: node.val,
        path: [...path, node.val],
        description: `${val} < ${node.val}, searching left subtree`,
        variables: { target: val, 'current node': node.val, direction: 'left' },
        operations: { comparisons: totalComparisons },
        phase: 'Searching',
        insight: `${val} is less than ${node.val}, so it must be in the left subtree (if it exists).`
      });
      return search(node.left, val, [...path, node.val]);
    } else {
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        searching: val,
        current: node.val,
        path: [...path, node.val],
        description: `${val} > ${node.val}, searching right subtree`,
        variables: { target: val, 'current node': node.val, direction: 'right' },
        operations: { comparisons: totalComparisons },
        phase: 'Searching',
        insight: `${val} is greater than ${node.val}, so it must be in the right subtree (if it exists).`
      });
      return search(node.right, val, [...path, node.val]);
    }
  };

  search(root, target);
  return steps;
};

const generateFibonacciSteps = (n) => {
  const callStack = [];
  let callCount = 0;

  const steps = [{
    callStack: [],
    description: `Starting Fibonacci computation for fib(${n})`,
    variables: { n, 'calls made': 0 },
    operations: { 'function calls': 0, additions: 0 },
    phase: 'Initialize',
    insight: `Fibonacci: fib(n) = fib(n-1) + fib(n-2), base cases: fib(0)=0, fib(1)=1. Recursive approach is inefficient due to repeated calculations.`
  }];

  let additions = 0;

  const fibonacci = (num, depth = 0) => {
    callCount++;
    if (callCount > 50) return 0; // Limit calls for visualization

    callStack.push({ function: `fib(${num})`, depth, returning: false });

    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `Call fib(${num}) at depth ${depth}`,
      variables: { computing: num, depth, 'stack size': callStack.length },
      operations: { 'function calls': callCount, additions },
      phase: `Diving`,
      insight: `Need to compute fib(${num}). ${num <= 1 ? 'This is a base case!' : `Must compute fib(${num - 1}) and fib(${num - 2}) first.`}`
    });

    if (num <= 1) {
      callStack[callStack.length - 1].returning = true;
      callStack[callStack.length - 1].result = num;

      steps.push({
        callStack: callStack.map(c => ({ ...c })),
        description: `Base case reached: fib(${num}) = ${num}`,
        variables: { 'base case': num, result: num, 'stack size': callStack.length },
        operations: { 'function calls': callCount, additions },
        phase: `Base Case`,
        insight: `Fibonacci base case: fib(${num}) = ${num}. Return this value up the call chain.`
      });

      callStack.pop();
      return num;
    }

    const result1 = fibonacci(num - 1, depth + 1);
    const result2 = fibonacci(num - 2, depth + 1);
    const result = result1 + result2;
    additions++;

    callStack[callStack.length - 1].returning = true;
    callStack[callStack.length - 1].result = result;

    steps.push({
      callStack: callStack.map(c => ({ ...c })),
      description: `fib(${num}) = fib(${num-1}) + fib(${num-2}) = ${result1} + ${result2} = ${result}`,
      variables: { num, 'fib(n-1)': result1, 'fib(n-2)': result2, result },
      operations: { 'function calls': callCount, additions },
      phase: `Computing`,
      insight: `Got results from recursive calls: ${result1} + ${result2} = ${result}. Notice we may have recalculated same values multiple times!`
    });

    callStack.pop();
    return result;
  };

  const finalResult = fibonacci(n);

  steps.push({
    callStack: [],
    description: `Fibonacci complete: fib(${n}) = ${finalResult}`,
    variables: { n, result: finalResult },
    operations: { 'function calls': callCount, additions },
    phase: 'Complete',
    insight: `Computed fib(${n}) = ${finalResult} using ${callCount} function calls. This is inefficient! Time: O(2^n). Use DP for O(n).`
  });

  return steps;
};

const generateFibonacciDPSteps = (n) => {
  const dp = new Array(n + 1).fill(-1);
  let calculations = 0;

  const steps = [{
    dp: [...dp],
    current: 0,
    description: `Starting Fibonacci with Dynamic Programming for fib(${n})`,
    variables: { n, 'array size': n + 1 },
    operations: { calculations: 0 },
    phase: 'Initialize',
    insight: `Dynamic Programming avoids redundant calculations by storing results. Build solution bottom-up from fib(0) to fib(${n}).`
  }];

  dp[0] = 0;
  dp[1] = 1;

  steps.push({
    dp: [...dp],
    current: 1,
    description: `Set base cases: fib(0) = 0, fib(1) = 1`,
    variables: { 'fib(0)': 0, 'fib(1)': 1 },
    operations: { calculations: 0 },
    phase: 'Base Cases',
    insight: `Base cases are the foundation. Every Fibonacci number builds on these two values.`
  });

  for (let i = 2; i <= n; i++) {
    steps.push({
      dp: [...dp],
      current: i,
      description: `Computing fib(${i}) from stored values`,
      variables: { i, 'fib(i-1)': dp[i-1], 'fib(i-2)': dp[i-2], 'computing': `fib(${i})` },
      operations: { calculations },
      phase: `Computing (${i}/${n})`,
      insight: `Look up fib(${i-1})=${dp[i-1]} and fib(${i-2})=${dp[i-2]} from array. No recursion needed - values already computed!`
    });

    calculations++;
    dp[i] = dp[i - 1] + dp[i - 2];

    steps.push({
      dp: [...dp],
      current: i,
      description: `fib(${i}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
      variables: { i, 'fib(i-1)': dp[i-1], 'fib(i-2)': dp[i-2], result: dp[i] },
      operations: { calculations },
      phase: `Computing (${i}/${n})`,
      insight: `Calculated fib(${i}) = ${dp[i]} in constant time using stored values. Store it for future use.`
    });
  }

  steps.push({
    dp: [...dp],
    current: n,
    description: `Fibonacci DP complete: fib(${n}) = ${dp[n]}`,
    variables: { n, result: dp[n] },
    operations: { calculations },
    phase: 'Complete',
    insight: `Computed fib(${n}) = ${dp[n]} with only ${calculations} calculations (vs O(2^n) for naive recursion). Time: O(n), Space: O(n). Much better!`
  });

  return steps;
};

const generateTowerHanoiSteps = (n) => {
  const towers = {
    A: Array.from({ length: n }, (_, i) => n - i),
    B: [],
    C: []
  };

  let totalMoves = 0;
  let functionCalls = 0;

  const steps = [{
    towers: JSON.parse(JSON.stringify(towers)),
    callStack: [],
    description: `Starting Tower of Hanoi with ${n} disks`,
    variables: { 'total disks': n, 'from': 'A', 'to': 'C', 'auxiliary': 'B' },
    operations: { moves: 0, 'function calls': 0 },
    phase: 'Initialize',
    insight: `Tower of Hanoi: Move all disks from rod A to rod C using rod B. Rules: (1) Move one disk at a time, (2) Larger disk can't go on smaller disk.`
  }];

  const callStack = [];

  const hanoi = (disks, from, to, aux, depth = 0) => {
    if (disks === 0) return;

    functionCalls++;
    callStack.push({ function: `hanoi(${disks}, ${from}, ${to}, ${aux})`, depth });

    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      callStack: callStack.map(c => ({ ...c })),
      description: `Plan: Move ${disks} disk(s) from ${from} to ${to} using ${aux}`,
      variables: { disks, from, to, auxiliary: aux, depth, 'stack size': callStack.length },
      operations: { moves: totalMoves, 'function calls': functionCalls },
      phase: `Planning (depth ${depth})`,
      insight: `To move ${disks} disk(s) from ${from} to ${to}: (1) Move ${disks-1} disks to ${aux}, (2) Move largest to ${to}, (3) Move ${disks-1} from ${aux} to ${to}.`
    });

    // Move n-1 disks from source to auxiliary
    hanoi(disks - 1, from, aux, to, depth + 1);

    // Move the largest disk
    const disk = towers[from].pop();
    towers[to].push(disk);
    totalMoves++;

    steps.push({
      towers: JSON.parse(JSON.stringify(towers)),
      callStack: callStack.map(c => ({ ...c })),
      move: { disk, from, to },
      description: `Move disk ${disk} from rod ${from} to rod ${to}`,
      variables: { 'disk moved': disk, from, to, 'move #': totalMoves, depth },
      operations: { moves: totalMoves, 'function calls': functionCalls },
      phase: `Moving (${totalMoves}/${Math.pow(2, n) - 1})`,
      insight: `Moved disk ${disk} from ${from} to ${to}. This is move ${totalMoves} out of ${Math.pow(2, n) - 1} total moves needed.`
    });

    // Move n-1 disks from auxiliary to destination
    hanoi(disks - 1, aux, to, from, depth + 1);

    callStack.pop();
  };

  hanoi(n, 'A', 'C', 'B');

  steps.push({
    towers: JSON.parse(JSON.stringify(towers)),
    callStack: [],
    description: 'Tower of Hanoi complete!',
    variables: { 'total disks': n, 'final position': 'C' },
    operations: { moves: totalMoves, 'function calls': functionCalls },
    phase: 'Complete',
    insight: `Solved Tower of Hanoi with ${totalMoves} moves (minimum possible: 2^${n} - 1 = ${Math.pow(2, n) - 1}). Time complexity: O(2^n).`
  });

  return steps;
};

const generateTwoSumSteps = (arr, target) => {
  const steps = [{
    array: arr,
    hashMap: {},
    currentIndex: -1,
    comparing: [],
    description: `Finding two numbers that sum to ${target}`,
    variables: { target, 'array length': arr.length },
    operations: { 'hash lookups': 0, 'hash inserts': 0 },
    phase: 'Initialize',
    insight: 'Two Sum uses a hash map to store seen numbers. For each number, we check if its complement (target - num) exists in the map.'
  }];

  const hashMap = {};
  let hashLookups = 0;
  let hashInserts = 0;

  for (let i = 0; i < arr.length; i++) {
    const currentValue = arr[i];
    const complement = target - currentValue;
    hashLookups++;

    // Check if complement exists in hash map
    steps.push({
      array: arr,
      hashMap: { ...hashMap },
      currentIndex: i,
      comparing: [i],
      complement,
      description: `Check if ${complement} (${target} - ${currentValue}) exists in hash map`,
      variables: {
        'current index': i,
        'current value': currentValue,
        'complement': complement,
        'in map?': complement in hashMap ? 'YES' : 'NO'
      },
      operations: { 'hash lookups': hashLookups, 'hash inserts': hashInserts },
      phase: `Searching (${i + 1}/${arr.length})`,
      insight: `Looking for ${complement} in hash map. Current map: {${Object.entries(hashMap).map(([k, v]) => `${k}:${v}`).join(', ')}}`
    });

    if (complement in hashMap) {
      // Found the answer!
      const complementIndex = hashMap[complement];

      steps.push({
        array: arr,
        hashMap: { ...hashMap },
        currentIndex: i,
        comparing: [i, complementIndex],
        found: true,
        result: [complementIndex, i],
        description: `✓ Found! ${arr[complementIndex]} + ${currentValue} = ${target}`,
        variables: {
          'index 1': complementIndex,
          'value 1': arr[complementIndex],
          'index 2': i,
          'value 2': currentValue,
          'sum': arr[complementIndex] + currentValue
        },
        operations: { 'hash lookups': hashLookups, 'hash inserts': hashInserts },
        phase: 'Found',
        insight: `Solution found at indices [${complementIndex}, ${i}]. Hash map enabled O(n) time complexity by storing previously seen values.`
      });

      return steps;
    }

    // Add current value to hash map
    hashMap[currentValue] = i;
    hashInserts++;

    steps.push({
      array: arr,
      hashMap: { ...hashMap },
      currentIndex: i,
      comparing: [],
      description: `Add ${currentValue} → ${i} to hash map`,
      variables: {
        'added': `${currentValue} → index ${i}`,
        'map size': Object.keys(hashMap).length
      },
      operations: { 'hash lookups': hashLookups, 'hash inserts': hashInserts },
      phase: `Searching (${i + 1}/${arr.length})`,
      insight: `Complement ${complement} not found. Store ${currentValue} at index ${i} for future lookups.`
    });
  }

  // No solution found
  steps.push({
    array: arr,
    hashMap: { ...hashMap },
    currentIndex: -1,
    comparing: [],
    found: false,
    description: `No two numbers sum to ${target}`,
    variables: { target, 'checked': arr.length },
    operations: { 'hash lookups': hashLookups, 'hash inserts': hashInserts },
    phase: 'No Solution',
    insight: `Checked all ${arr.length} numbers. No pair adds up to ${target}.`
  });

  return steps;
};

const generateMaxSubarraySteps = (arr) => {
  const steps = [{
    array: arr,
    currentIndex: -1,
    comparing: [],
    description: 'Starting Maximum Subarray (Kadane\'s Algorithm)',
    variables: { 'array length': arr.length },
    operations: { iterations: 0 },
    phase: 'Initialize',
    insight: 'Kadane\'s algorithm finds the contiguous subarray with maximum sum in O(n) time by tracking current sum and global max.'
  }];

  let maxSum = arr[0];
  let currentSum = arr[0];
  let maxStart = 0;
  let maxEnd = 0;
  let currentStart = 0;

  steps.push({
    array: arr,
    currentIndex: 0,
    comparing: [0],
    currentSum,
    maxSum,
    subarrayRange: [maxStart, maxEnd],
    description: `Initialize: maxSum = ${maxSum}, currentSum = ${currentSum}`,
    variables: { currentSum, maxSum, 'start': 0, 'end': 0 },
    operations: { iterations: 0 },
    phase: 'Initialize',
    insight: `Start with first element ${arr[0]} as both current and max sum.`
  });

  for (let i = 1; i < arr.length; i++) {
    const prevSum = currentSum;

    if (currentSum + arr[i] > arr[i]) {
      currentSum = currentSum + arr[i];
    } else {
      currentSum = arr[i];
      currentStart = i;
    }

    steps.push({
      array: arr,
      currentIndex: i,
      comparing: [i],
      currentSum,
      maxSum,
      subarrayRange: [maxStart, maxEnd],
      description: `At ${arr[i]}: extend (${prevSum + arr[i]}) vs restart (${arr[i]})`,
      variables: {
        'current value': arr[i],
        'extend sum': prevSum + arr[i],
        'start new': arr[i],
        'decision': currentSum === arr[i] ? 'RESTART' : 'EXTEND',
        currentSum,
        maxSum
      },
      operations: { iterations: i },
      phase: `Iterating (${i + 1}/${arr.length})`,
      insight: currentSum === arr[i] ?
        `Starting new subarray from index ${i}` :
        `Extending current subarray`
    });

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = currentStart;
      maxEnd = i;

      steps.push({
        array: arr,
        currentIndex: i,
        comparing: Array.from({ length: maxEnd - maxStart + 1 }, (_, idx) => maxStart + idx),
        currentSum,
        maxSum,
        subarrayRange: [maxStart, maxEnd],
        found: true,
        description: `✓ New max: ${maxSum}`,
        variables: {
          maxSum,
          'subarray': `[${maxStart}..${maxEnd}]`
        },
        operations: { iterations: i },
        phase: `New Max`,
        insight: `New max subarray at indices [${maxStart}..${maxEnd}]`
      });
    }
  }

  steps.push({
    array: arr,
    currentIndex: -1,
    comparing: Array.from({ length: maxEnd - maxStart + 1 }, (_, idx) => maxStart + idx),
    currentSum,
    maxSum,
    subarrayRange: [maxStart, maxEnd],
    found: true,
    description: `Complete! Max sum = ${maxSum}`,
    variables: {
      maxSum,
      'subarray': `[${maxStart}..${maxEnd}]`
    },
    operations: { iterations: arr.length - 1 },
    phase: 'Complete',
    insight: `Maximum subarray sum ${maxSum}. Time: O(n), Space: O(1).`
  });

  return steps;
};

const generateValidParenthesesSteps = (str) => {
  const steps = [{
    string: str,
    stack: [],
    currentIndex: -1,
    description: `Checking if "${str}" has valid parentheses`,
    variables: { 'string length': str.length, 'stack size': 0 },
    operations: { 'pushes': 0, 'pops': 0 },
    phase: 'Initialize',
    insight: 'Use a stack to match opening brackets with closing brackets. Push opening brackets, pop and match closing brackets.'
  }];

  const stack = [];
  const brackets = { '(': ')', '[': ']', '{': '}' };
  const closingBrackets = { ')': '(', ']': '[', '}': '{' };
  let pushes = 0, pops = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char in brackets) {
      // Opening bracket
      stack.push(char);
      pushes++;

      steps.push({
        string: str,
        stack: [...stack],
        currentIndex: i,
        currentChar: char,
        action: 'push',
        description: `Push '${char}' onto stack`,
        variables: { 'current': char, 'stack size': stack.length },
        operations: { pushes, pops },
        phase: `Processing (${i + 1}/${str.length})`,
        insight: `Opening bracket '${char}' pushed. Waiting for matching '${brackets[char]}'`
      });
    } else if (char in closingBrackets) {
      // Closing bracket
      const expected = closingBrackets[char];

      if (stack.length === 0 || stack[stack.length - 1] !== expected) {
        // Invalid!
        steps.push({
          string: str,
          stack: [...stack],
          currentIndex: i,
          currentChar: char,
          action: 'invalid',
          valid: false,
          description: `✗ Invalid! '${char}' has no matching opening bracket`,
          variables: { 'current': char, 'expected': expected, 'stack top': stack.length > 0 ? stack[stack.length - 1] : 'empty' },
          operations: { pushes, pops },
          phase: 'Invalid',
          insight: `Cannot match '${char}'. Stack is ${stack.length === 0 ? 'empty' : `missing '${expected}'`}`
        });

        return steps;
      }

      const popped = stack.pop();
      pops++;

      steps.push({
        string: str,
        stack: [...stack],
        currentIndex: i,
        currentChar: char,
        action: 'pop',
        matched: popped,
        description: `Pop '${popped}' to match '${char}'`,
        variables: { 'current': char, 'matched': popped, 'stack size': stack.length },
        operations: { pushes, pops },
        phase: `Processing (${i + 1}/${str.length})`,
        insight: `Closing bracket '${char}' matched with opening bracket '${popped}'`
      });
    }
  }

  // Check if stack is empty
  const isValid = stack.length === 0;

  steps.push({
    string: str,
    stack: [...stack],
    currentIndex: -1,
    valid: isValid,
    description: isValid ? `✓ Valid! All brackets matched` : `✗ Invalid! ${stack.length} unmatched opening bracket(s)`,
    variables: { 'stack size': stack.length, 'valid': isValid ? 'YES' : 'NO' },
    operations: { pushes, pops },
    phase: isValid ? 'Valid' : 'Invalid',
    insight: isValid ?
      `All brackets properly matched. Time: O(n), Space: O(n)` :
      `Unmatched opening brackets remain: ${stack.join(', ')}`
  });

  return steps;
};

const generateLongestSubstringSteps = (str) => {
  const steps = [{
    string: str,
    windowStart: 0,
    windowEnd: -1,
    charSet: new Set(),
    maxLength: 0,
    description: `Finding longest substring without repeating characters in "${str}"`,
    variables: { 'string length': str.length, 'max length': 0 },
    operations: { 'expansions': 0, 'contractions': 0 },
    phase: 'Initialize',
    insight: 'Use sliding window: expand right to include characters, contract left when duplicate found.'
  }];

  let left = 0;
  let maxLength = 0;
  let maxStart = 0;
  let maxEnd = -1;
  const charSet = new Set();
  let expansions = 0, contractions = 0;

  for (let right = 0; right < str.length; right++) {
    const char = str[right];
    expansions++;

    // Shrink window while duplicate exists
    while (charSet.has(char)) {
      const leftChar = str[left];
      charSet.delete(leftChar);
      contractions++;

      steps.push({
        string: str,
        windowStart: left,
        windowEnd: right - 1,
        currentIndex: right,
        charSet: new Set(charSet),
        maxLength,
        duplicate: char,
        action: 'contract',
        description: `Remove '${leftChar}' from window (duplicate '${char}' found)`,
        variables: {
          'window': `[${left}..${right - 1}]`,
          'removing': leftChar,
          'duplicate': char,
          'window size': right - left
        },
        operations: { expansions, contractions },
        phase: `Contracting`,
        insight: `Shrinking window from left to remove duplicate '${char}'`
      });

      left++;
    }

    // Add current character
    charSet.add(char);

    steps.push({
      string: str,
      windowStart: left,
      windowEnd: right,
      currentIndex: right,
      charSet: new Set(charSet),
      maxLength,
      action: 'expand',
      description: `Add '${char}' to window`,
      variables: {
        'window': `[${left}..${right}]`,
        'added': char,
        'window size': right - left + 1,
        'chars in window': Array.from(charSet).join(', ')
      },
      operations: { expansions, contractions },
      phase: `Expanding (${right + 1}/${str.length})`,
      insight: `Window now contains: ${str.substring(left, right + 1)}`
    });

    // Update max if current window is longer
    if (right - left + 1 > maxLength) {
      maxLength = right - left + 1;
      maxStart = left;
      maxEnd = right;

      steps.push({
        string: str,
        windowStart: left,
        windowEnd: right,
        currentIndex: right,
        charSet: new Set(charSet),
        maxLength,
        found: true,
        description: `✓ New max length: ${maxLength}`,
        variables: {
          'max length': maxLength,
          'substring': str.substring(left, right + 1)
        },
        operations: { expansions, contractions },
        phase: 'New Max',
        insight: `Longest substring so far: "${str.substring(left, right + 1)}"`
      });
    }
  }

  steps.push({
    string: str,
    windowStart: maxStart,
    windowEnd: maxEnd,
    currentIndex: -1,
    charSet: new Set(),
    maxLength,
    found: true,
    description: `Complete! Longest substring length = ${maxLength}`,
    variables: {
      'max length': maxLength,
      'substring': maxLength > 0 ? str.substring(maxStart, maxEnd + 1) : ''
    },
    operations: { expansions, contractions },
    phase: 'Complete',
    insight: `Longest substring: "${maxLength > 0 ? str.substring(maxStart, maxEnd + 1) : ''}". Time: O(n), Space: O(min(n,m))`
  });

  return steps;
};

const generateCoinChangeSteps = (coins, amount) => {
  const steps = [{
    coins,
    amount,
    dpArray: new Array(amount + 1).fill(Infinity),
    currentAmount: -1,
    description: `Finding minimum coins to make amount ${amount} using coins [${coins.join(', ')}]`,
    variables: { 'target amount': amount, 'coins': coins.join(', ') },
    operations: { 'dp updates': 0 },
    phase: 'Initialize',
    insight: 'Build DP array where dp[i] = minimum coins for amount i. dp[0] = 0 (base case).'
  }];

  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  let dpUpdates = 0;

  steps.push({
    coins,
    amount,
    dpArray: [...dp],
    currentAmount: 0,
    description: `Base case: dp[0] = 0 (0 coins needed for amount 0)`,
    variables: { 'dp[0]': 0 },
    operations: { 'dp updates': dpUpdates },
    phase: 'Base Case',
    insight: `Zero coins needed to make amount 0`
  });

  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        const newValue = dp[i - coin] + 1;

        steps.push({
          coins,
          amount,
          dpArray: [...dp],
          currentAmount: i,
          currentCoin: coin,
          comparing: true,
          description: `Try coin ${coin}: dp[${i}] = min(${dp[i] === Infinity ? '∞' : dp[i]}, dp[${i - coin}] + 1 = ${newValue})`,
          variables: {
            'amount': i,
            'coin': coin,
            'dp[i-coin]': dp[i - coin],
            'new value': newValue,
            'current min': dp[i] === Infinity ? '∞' : dp[i]
          },
          operations: { 'dp updates': dpUpdates },
          phase: `Building DP (${i}/${amount})`,
          insight: `If we use coin ${coin}, we need ${newValue} coins total`
        });

        if (newValue < dp[i]) {
          dp[i] = newValue;
          dpUpdates++;

          steps.push({
            coins,
            amount,
            dpArray: [...dp],
            currentAmount: i,
            currentCoin: coin,
            updated: true,
            description: `✓ Update dp[${i}] = ${dp[i]}`,
            variables: {
              'dp[i]': dp[i],
              'used coin': coin
            },
            operations: { 'dp updates': dpUpdates },
            phase: `Update`,
            insight: `Found better solution using coin ${coin}`
          });
        }
      }
    }
  }

  const result = dp[amount] === Infinity ? -1 : dp[amount];

  steps.push({
    coins,
    amount,
    dpArray: [...dp],
    currentAmount: -1,
    result,
    description: result === -1 ? `✗ Impossible to make amount ${amount}` : `✓ Minimum coins needed: ${result}`,
    variables: {
      'result': result === -1 ? 'impossible' : result
    },
    operations: { 'dp updates': dpUpdates },
    phase: result === -1 ? 'Impossible' : 'Complete',
    insight: result === -1 ?
      `Cannot make amount ${amount} with given coins` :
      `Minimum ${result} coins needed. Time: O(amount × coins), Space: O(amount)`
  });

  return steps;
};

const generateProductExceptSelfSteps = (arr) => {
  const steps = [{
    array: arr,
    prefixProducts: new Array(arr.length).fill(1),
    suffixProducts: new Array(arr.length).fill(1),
    result: new Array(arr.length).fill(1),
    currentIndex: -1,
    description: `Computing product of array except self for [${arr.join(', ')}]`,
    variables: { 'array length': arr.length },
    operations: { 'multiplications': 0 },
    phase: 'Initialize',
    insight: 'Use prefix and suffix products. For each index: result[i] = prefix[i-1] × suffix[i+1]'
  }];

  const n = arr.length;
  const prefix = new Array(n).fill(1);
  const suffix = new Array(n).fill(1);
  const result = new Array(n).fill(1);
  let multiplications = 0;

  // Build prefix products
  for (let i = 1; i < n; i++) {
    prefix[i] = prefix[i - 1] * arr[i - 1];
    multiplications++;

    steps.push({
      array: arr,
      prefixProducts: [...prefix],
      suffixProducts: [...suffix],
      result: [...result],
      currentIndex: i,
      comparing: [i - 1, i],
      description: `Prefix[${i}] = Prefix[${i - 1}] × arr[${i - 1}] = ${prefix[i - 1]} × ${arr[i - 1]} = ${prefix[i]}`,
      variables: {
        'current index': i,
        'prefix[i-1]': prefix[i - 1],
        'arr[i-1]': arr[i - 1],
        'prefix[i]': prefix[i]
      },
      operations: { multiplications },
      phase: `Building Prefix (${i}/${n - 1})`,
      insight: `Prefix[${i}] stores the product of all elements before index ${i}`
    });
  }

  steps.push({
    array: arr,
    prefixProducts: [...prefix],
    suffixProducts: [...suffix],
    result: [...result],
    currentIndex: -1,
    description: `✓ Prefix products complete`,
    variables: { 'prefix': prefix.join(', ') },
    operations: { multiplications },
    phase: 'Prefix Complete',
    insight: `Prefix array built. Each prefix[i] = product of all elements left of i`
  });

  // Build suffix products
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * arr[i + 1];
    multiplications++;

    steps.push({
      array: arr,
      prefixProducts: [...prefix],
      suffixProducts: [...suffix],
      result: [...result],
      currentIndex: i,
      comparing: [i, i + 1],
      description: `Suffix[${i}] = Suffix[${i + 1}] × arr[${i + 1}] = ${suffix[i + 1]} × ${arr[i + 1]} = ${suffix[i]}`,
      variables: {
        'current index': i,
        'suffix[i+1]': suffix[i + 1],
        'arr[i+1]': arr[i + 1],
        'suffix[i]': suffix[i]
      },
      operations: { multiplications },
      phase: `Building Suffix (${n - 1 - i}/${n - 1})`,
      insight: `Suffix[${i}] stores the product of all elements after index ${i}`
    });
  }

  steps.push({
    array: arr,
    prefixProducts: [...prefix],
    suffixProducts: [...suffix],
    result: [...result],
    currentIndex: -1,
    description: `✓ Suffix products complete`,
    variables: { 'suffix': suffix.join(', ') },
    operations: { multiplications },
    phase: 'Suffix Complete',
    insight: `Suffix array built. Each suffix[i] = product of all elements right of i`
  });

  // Compute final result
  for (let i = 0; i < n; i++) {
    result[i] = prefix[i] * suffix[i];
    multiplications++;

    steps.push({
      array: arr,
      prefixProducts: [...prefix],
      suffixProducts: [...suffix],
      result: [...result],
      currentIndex: i,
      comparing: [i],
      description: `Result[${i}] = Prefix[${i}] × Suffix[${i}] = ${prefix[i]} × ${suffix[i]} = ${result[i]}`,
      variables: {
        'index': i,
        'prefix[i]': prefix[i],
        'suffix[i]': suffix[i],
        'result[i]': result[i]
      },
      operations: { multiplications },
      phase: `Computing Result (${i + 1}/${n})`,
      insight: `Result[${i}] = product of all elements except arr[${i}]`
    });
  }

  steps.push({
    array: arr,
    prefixProducts: [...prefix],
    suffixProducts: [...suffix],
    result: [...result],
    currentIndex: -1,
    found: true,
    description: `✓ Complete! Result: [${result.join(', ')}]`,
    variables: { 'result': result.join(', ') },
    operations: { multiplications },
    phase: 'Complete',
    insight: `Product except self computed. Time: O(n), Space: O(1) excluding output`
  });

  return steps;
};

const generateMergeIntervalsSteps = (intervals) => {
  const steps = [{
    intervals: [...intervals],
    merged: [],
    currentIndex: -1,
    description: `Merging overlapping intervals`,
    variables: { 'total intervals': intervals.length },
    operations: { 'merges': 0 },
    phase: 'Initialize',
    insight: 'Sort intervals by start time, then merge overlapping ones'
  }];

  if (intervals.length === 0) {
    steps.push({
      intervals: [],
      merged: [],
      currentIndex: -1,
      description: `Empty input`,
      variables: {},
      operations: { 'merges': 0 },
      phase: 'Complete',
      insight: 'No intervals to merge'
    });
    return steps;
  }

  // Sort by start time
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let merges = 0;

  steps.push({
    intervals: [...sorted],
    merged: [],
    currentIndex: -1,
    description: `Sorted intervals by start time`,
    variables: { 'sorted': JSON.stringify(sorted) },
    operations: { 'merges': 0 },
    phase: 'Sorted',
    insight: `Sorted: ${sorted.map(i => `[${i[0]},${i[1]}]`).join(', ')}`
  });

  const merged = [sorted[0]];

  steps.push({
    intervals: [...sorted],
    merged: [[...sorted[0]]],
    currentIndex: 0,
    comparing: [0],
    description: `Start with first interval [${sorted[0][0]}, ${sorted[0][1]}]`,
    variables: { 'first interval': `[${sorted[0][0]}, ${sorted[0][1]}]` },
    operations: { 'merges': 0 },
    phase: 'Processing (1/'+sorted.length+')',
    insight: `Initialize merged list with first interval`
  });

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    steps.push({
      intervals: [...sorted],
      merged: merged.map(m => [...m]),
      currentIndex: i,
      comparing: [i],
      lastMergedIndex: merged.length - 1,
      description: `Compare [${current[0]}, ${current[1]}] with last merged [${lastMerged[0]}, ${lastMerged[1]}]`,
      variables: {
        'current': `[${current[0]}, ${current[1]}]`,
        'last merged': `[${lastMerged[0]}, ${lastMerged[1]}]`,
        'overlap?': current[0] <= lastMerged[1] ? 'YES' : 'NO'
      },
      operations: { 'merges': merges },
      phase: `Processing (${i + 1}/${sorted.length})`,
      insight: current[0] <= lastMerged[1] ?
        `${current[0]} ≤ ${lastMerged[1]}: intervals overlap` :
        `${current[0]} > ${lastMerged[1]}: no overlap`
    });

    if (current[0] <= lastMerged[1]) {
      // Overlapping - merge
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
      merges++;

      steps.push({
        intervals: [...sorted],
        merged: merged.map(m => [...m]),
        currentIndex: i,
        comparing: [i],
        lastMergedIndex: merged.length - 1,
        merged_into: true,
        description: `✓ Merge! Update end to ${lastMerged[1]}`,
        variables: {
          'merged interval': `[${lastMerged[0]}, ${lastMerged[1]}]`
        },
        operations: { 'merges': merges },
        phase: 'Merged',
        insight: `Extended last interval to [${lastMerged[0]}, ${lastMerged[1]}]`
      });
    } else {
      // No overlap - add as new interval
      merged.push([...current]);

      steps.push({
        intervals: [...sorted],
        merged: merged.map(m => [...m]),
        currentIndex: i,
        comparing: [i],
        lastMergedIndex: merged.length - 1,
        added_new: true,
        description: `No overlap - add new interval`,
        variables: {
          'added': `[${current[0]}, ${current[1]}]`,
          'merged count': merged.length
        },
        operations: { 'merges': merges },
        phase: 'Added New',
        insight: `Added [${current[0]}, ${current[1]}] as separate interval`
      });
    }
  }

  steps.push({
    intervals: [...sorted],
    merged: merged.map(m => [...m]),
    currentIndex: -1,
    found: true,
    description: `✓ Complete! ${merged.length} merged interval(s)`,
    variables: {
      'original': intervals.length,
      'merged': merged.length,
      'reduced by': intervals.length - merged.length
    },
    operations: { 'merges': merges },
    phase: 'Complete',
    insight: `Merged ${intervals.length} intervals into ${merged.length}. Time: O(n log n), Space: O(n)`
  });

  return steps;
};

// Main Component
const AlgorithmVisualizer = ({ onStartVisualization }) => {
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
    } else if (algorithm === 'twosum') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const target = parseInt(targetNode);
      newSteps = generateTwoSumSteps(arr, target);
    } else if (algorithm === 'maxsubarray') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateMaxSubarraySteps(arr);
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
    } else if (algorithm === 'validparentheses') {
      const str = input.trim();
      newSteps = generateValidParenthesesSteps(str);
    } else if (algorithm === 'longestsubstring') {
      const str = input.trim();
      newSteps = generateLongestSubstringSteps(str);
    } else if (algorithm === 'coinchange') {
      const coins = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const amount = parseInt(targetNode) || 11;
      newSteps = generateCoinChangeSteps(coins, amount);
    } else if (algorithm === 'productexceptself') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateProductExceptSelfSteps(arr);
    } else if (algorithm === 'mergeintervals') {
      // Parse intervals like "1-3, 2-6, 8-10, 15-18"
      const intervals = input.split(',').map(s => {
        const parts = s.trim().split('-');
        return [parseInt(parts[0]), parseInt(parts[1])];
      }).filter(interval => !isNaN(interval[0]) && !isNaN(interval[1]));
      newSteps = generateMergeIntervalsSteps(intervals);
    }

    // If onStartVisualization prop is provided, navigate to new visualizer
    if (onStartVisualization && newSteps.length > 0) {
      // Prepare input data to display
      let inputData = {};

      if (['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap', 'bst-insert', 'maxsubarray', 'productexceptself'].includes(algorithm)) {
        inputData = { type: 'array', value: input };
      } else if (['binary', 'linear', 'bst-search', 'twosum'].includes(algorithm)) {
        inputData = { type: 'array-search', array: input, target: targetNode };
      } else if (['bfs', 'dfs', 'dijkstra'].includes(algorithm)) {
        inputData = { type: 'graph', edges: graphInput, startNode };
      } else if (['recursion', 'fibonacci', 'fibonacci-dp', 'tower-hanoi'].includes(algorithm)) {
        inputData = { type: 'number', value: startNode };
      } else if (['validparentheses', 'longestsubstring'].includes(algorithm)) {
        inputData = { type: 'string', value: input };
      } else if (algorithm === 'coinchange') {
        inputData = { type: 'array-target', array: input, target: targetNode, label: 'Coins / Amount' };
      } else if (algorithm === 'mergeintervals') {
        inputData = { type: 'intervals', value: input };
      }

      onStartVisualization({
        algorithm,
        steps: newSteps,
        algorithmName: algorithmSummaries[algorithm]?.title || algorithm,
        inputData
      });
    } else {
      setSteps(newSteps);
    }
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
          let label = '';
          let showArrow = false;

          // Sorting algorithms
          if (step.comparing?.includes(index)) {
            colorClass = step.swapped ? 'bar-red' : 'bar-yellow';
            // Show the actual value being compared
            if (step.comparing[0] === index) label = `COMPARING: ${value}`;
            if (step.comparing[1] === index) label = `COMPARING: ${value}`;
            showArrow = true;
          } else if (step.highlight?.includes(index)) {
            colorClass = 'bar-purple';
          } else if (step.sorted?.includes(index)) {
            colorClass = 'bar-green';
            label = `✓ ${value} SORTED`;
          } else if (step.pivot === index) {
            colorClass = 'bar-green';
            label = `PIVOT: ${value}`;
          } else if (step.current === index) {
            colorClass = 'bar-yellow';
            label = `CURRENT: ${value}`;
            showArrow = true;
          } else if (step.minIdx === index) {
            colorClass = 'bar-red';
            label = `MIN: ${value}`;
            showArrow = true;
          }

          // Binary search
          if (step.mid === index) {
            colorClass = step.found ? 'bar-green' : 'bar-yellow';
            label = step.found ? `✓ FOUND ${value}!` : `MID: ${value}`;
            showArrow = true;
          } else if (algorithm === 'binary') {
            if (step.left === index) {
              label = `LEFT: ${value}`;
            } else if (step.right === index) {
              label = `RIGHT: ${value}`;
            } else if (index >= step.left && index <= step.right) {
              colorClass = 'bar-blue-light';
            }
          }

          // Linear search
          if (algorithm === 'linear' && step.current === index) {
            colorClass = step.found ? 'bar-green' : 'bar-yellow';
            label = step.found ? `✓ FOUND ${value}!` : `CHECKING: ${value}`;
            showArrow = true;
          }

          return (
            <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {/* Label above bar */}
              {label && (
                <div style={{
                  position: 'absolute',
                  top: '-45px',
                  fontSize: '1rem',
                  fontWeight: '900',
                  color: '#ffffff',
                  background: colorClass === 'bar-red' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
                             colorClass === 'bar-yellow' ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' :
                             colorClass === 'bar-green' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                             'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  border: '3px solid',
                  borderColor: colorClass === 'bar-red' ? '#fca5a5' : colorClass === 'bar-yellow' ? '#fde047' : colorClass === 'bar-green' ? '#6ee7b7' : '#93c5fd',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  boxShadow: `0 0 30px ${colorClass === 'bar-red' ? 'rgba(239, 68, 68, 0.8)' :
                             colorClass === 'bar-yellow' ? 'rgba(251, 191, 36, 0.8)' :
                             colorClass === 'bar-green' ? 'rgba(16, 185, 129, 0.8)' :
                             'rgba(59, 130, 246, 0.8)'}`,
                  zIndex: '10',
                  letterSpacing: '0.5px'
                }}>
                  {label}
                </div>
              )}

              {/* Arrow indicator */}
              {showArrow && (
                <div style={{
                  position: 'absolute',
                  top: '-75px',
                  fontSize: '2.5rem',
                  color: colorClass === 'bar-red' ? '#fca5a5' : colorClass === 'bar-yellow' ? '#fde047' : '#6ee7b7',
                  animation: 'bounce 1s ease-in-out infinite',
                  textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
                  filter: 'drop-shadow(0 0 15px currentColor)',
                  fontWeight: '900'
                }}>
                  ▼
                </div>
              )}

              {/* Bar */}
              <div
                className={`array-bar ${colorClass}`}
                style={{ height: `${value * 3 + 40}px` }}
              >
                {value}
              </div>

              {/* Index label below */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#9ca3af',
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                marginTop: '0.25rem'
              }}>
                [{index}]
              </div>
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

    const nodeArray = Array.from(allNodes).sort((a, b) => a - b);

    // Calculate node positions
    const nodePositions = {};
    nodeArray.forEach((node, i) => {
      const angle = (i / nodeArray.length) * 2 * Math.PI - Math.PI / 2; // Start from top
      nodePositions[node] = {
        x: 50 + 35 * Math.cos(angle),
        y: 50 + 35 * Math.sin(angle)
      };
    });

    return (
      <>
        <div className="graph-container">
          {/* Draw edges first (behind nodes) */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
            {Object.keys(step.graph).map(fromNode => {
              const from = parseInt(fromNode);
              if (!step.graph[from]) return null;

              return step.graph[from].map(toNode => {
                const to = parseInt(toNode);
                // Only draw each edge once (from lower to higher node number)
                if (from >= to) return null;

                const fromPos = nodePositions[from];
                const toPos = nodePositions[to];

                return (
                  <line
                    key={`${from}-${to}`}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke="#60a5fa"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.9"
                    filter="drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))"
                  />
                );
              });
            })}
          </svg>

          {/* Draw nodes on top */}
          {nodeArray.map((node) => {
            const pos = nodePositions[node];

            let colorClass = 'node-gray';
            if (step.current === node) colorClass = 'node-yellow';
            else if (step.visited.has(node)) colorClass = 'node-green';
            else if (step.queue?.includes(node) || step.stack?.includes(node)) colorClass = 'node-blue';

            return (
              <div
                key={node}
                className={`graph-node ${colorClass}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
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

    const nodeArray = Array.from(allNodes).sort((a, b) => a - b);

    // Calculate node positions
    const nodePositions = {};
    nodeArray.forEach((node, i) => {
      const angle = (i / nodeArray.length) * 2 * Math.PI - Math.PI / 2; // Start from top
      nodePositions[node] = {
        x: 50 + 35 * Math.cos(angle),
        y: 50 + 35 * Math.sin(angle)
      };
    });

    return (
      <>
        <div className="graph-container">
          {/* Draw edges with weights */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
            {Object.keys(step.graph).map(fromNode => {
              const from = parseInt(fromNode);
              if (!step.graph[from]) return null;

              return step.graph[from].map(({ node: toNode, weight }) => {
                const to = parseInt(toNode);
                // Only draw each edge once
                if (from >= to) return null;

                const fromPos = nodePositions[from];
                const toPos = nodePositions[to];
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;

                return (
                  <g key={`${from}-${to}`}>
                    <line
                      x1={`${fromPos.x}%`}
                      y1={`${fromPos.y}%`}
                      x2={`${toPos.x}%`}
                      y2={`${toPos.y}%`}
                      stroke="rgba(147, 197, 253, 0.5)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Edge weight label */}
                    <circle
                      cx={`${midX}%`}
                      cy={`${midY}%`}
                      r="14"
                      fill="rgba(251, 191, 36, 0.9)"
                      stroke="rgba(245, 158, 11, 0.8)"
                      strokeWidth="2"
                    />
                    <text
                      x={`${midX}%`}
                      y={`${midY}%`}
                      fill="#000000"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        pointerEvents: 'none'
                      }}
                    >
                      {weight}
                    </text>
                  </g>
                );
              });
            })}
          </svg>

          {/* Draw nodes on top */}
          {nodeArray.map((node) => {
            const pos = nodePositions[node];

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
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div>{node}</div>
                <div style={{ fontSize: '0.7rem' }}>({displayDist})</div>
              </div>
            );
          })}
        </div>
        <div className="graph-info">
          <div>Distances from start node (numbers show shortest path distance)</div>
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

  // Blind 75 problem to visualizer mapping
  const blind75Mapping = {
    // Array
    'two-sum': { algo: 'twosum', category: 'Array', available: true },
    'best-time-stock': { algo: 'maxsubarray', category: 'Array', available: false, note: 'Similar pattern' },
    'contains-duplicate': { algo: 'twosum', category: 'Array', available: false, note: 'Hash set pattern' },
    'product-except-self': { algo: 'productexceptself', category: 'Array', available: true },
    'maximum-subarray': { algo: 'maxsubarray', category: 'Array', available: true },
    'maximum-product-subarray': { algo: 'maxsubarray', category: 'Array', available: false, note: 'Similar DP' },
    'find-min-rotated': { algo: 'binary', category: 'Array', available: false, note: 'Modified binary search' },
    'search-rotated': { algo: 'binary', category: 'Array', available: true },
    '3sum': { algo: null, category: 'Array', available: false },

    // Dynamic Programming
    'climbing-stairs': { algo: 'fibonacci-dp', category: 'Dynamic Programming', available: true },
    'coin-change': { algo: 'coinchange', category: 'Dynamic Programming', available: true },
    'longest-increasing-subsequence': { algo: null, category: 'Dynamic Programming', available: false },
    'longest-common-subsequence': { algo: null, category: 'Dynamic Programming', available: false },
    'word-break': { algo: null, category: 'Dynamic Programming', available: false },
    'combination-sum-iv': { algo: null, category: 'Dynamic Programming', available: false },
    'house-robber': { algo: null, category: 'Dynamic Programming', available: false },
    'house-robber-ii': { algo: null, category: 'Dynamic Programming', available: false },
    'decode-ways': { algo: null, category: 'Dynamic Programming', available: false },
    'unique-paths': { algo: null, category: 'Dynamic Programming', available: false },
    'jump-game': { algo: null, category: 'Dynamic Programming', available: false },

    // Graph
    'clone-graph': { algo: 'bfs', category: 'Graph', available: true },
    'course-schedule': { algo: 'dfs', category: 'Graph', available: true },
    'pacific-atlantic': { algo: 'bfs', category: 'Graph', available: true },
    'number-of-islands': { algo: 'bfs', category: 'Graph', available: true },
    'longest-consecutive': { algo: 'twosum', category: 'Graph', available: false, note: 'Hash set pattern' },
    'graph-valid-tree': { algo: 'dfs', category: 'Graph', available: true },

    // Tree
    'max-depth-tree': { algo: 'bst-insert', category: 'Tree', available: true },
    'same-tree': { algo: 'bst-search', category: 'Tree', available: true },
    'invert-tree': { algo: 'bst-insert', category: 'Tree', available: true },
    'tree-max-path-sum': { algo: 'bst-search', category: 'Tree', available: true },
    'level-order': { algo: 'bfs', category: 'Tree', available: true },
    'serialize-tree': { algo: 'bfs', category: 'Tree', available: true },
    'subtree': { algo: 'bst-search', category: 'Tree', available: true },
    'construct-tree': { algo: 'bst-insert', category: 'Tree', available: true },
    'validate-bst': { algo: 'bst-search', category: 'Tree', available: true },
    'kth-smallest-bst': { algo: 'bst-search', category: 'Tree', available: true },
    'lca-bst': { algo: 'bst-search', category: 'Tree', available: true },

    // String
    'longest-substring': { algo: 'longestsubstring', category: 'String', available: true },
    'longest-repeating': { algo: null, category: 'String', available: false },
    'valid-anagram': { algo: null, category: 'String', available: false },
    'group-anagrams': { algo: null, category: 'String', available: false },
    'valid-parentheses': { algo: 'validparentheses', category: 'String', available: true },
    'valid-palindrome': { algo: null, category: 'String', available: false },
    'longest-palindrome': { algo: null, category: 'String', available: false },
    'palindromic-substrings': { algo: null, category: 'String', available: false },

    // Interval
    'insert-interval': { algo: 'mergeintervals', category: 'Interval', available: false, note: 'Similar to merge intervals' },
    'merge-intervals': { algo: 'mergeintervals', category: 'Interval', available: true },
    'non-overlapping-intervals': { algo: null, category: 'Interval', available: false },
    'meeting-rooms': { algo: null, category: 'Interval', available: false },
    'meeting-rooms-ii': { algo: null, category: 'Interval', available: false },

    // Linked List
    'reverse-list': { algo: null, category: 'Linked List', available: false },
    'detect-cycle': { algo: null, category: 'Linked List', available: false },
    'merge-two-lists': { algo: null, category: 'Linked List', available: false },
    'merge-k-lists': { algo: null, category: 'Linked List', available: false },
    'remove-nth': { algo: null, category: 'Linked List', available: false },
    'reorder-list': { algo: null, category: 'Linked List', available: false },
  };

  const [selectedBlind75, setSelectedBlind75] = useState('');

  const isArrayAlgorithm = ['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap', 'binary', 'linear', 'bst-insert', 'bst-search', 'productexceptself'].includes(algorithm);
  const isGraphAlgorithm = ['bfs', 'dfs', 'dijkstra'].includes(algorithm);
  const isRecursionAlgorithm = ['recursion', 'fibonacci', 'fibonacci-dp', 'tower-hanoi'].includes(algorithm);
  const isStringAlgorithm = ['validparentheses', 'longestsubstring'].includes(algorithm);
  const isCoinChange = algorithm === 'coinchange';
  const isIntervalAlgorithm = algorithm === 'mergeintervals';
  const needsTarget = ['binary', 'linear', 'bst-search', 'twosum', 'coinchange'].includes(algorithm);
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
              <option value="twosum">Two Sum</option>
            </optgroup>
            <optgroup label="String Algorithms">
              <option value="validparentheses">Valid Parentheses</option>
              <option value="longestsubstring">Longest Substring Without Repeating</option>
            </optgroup>
            <optgroup label="Array Patterns">
              <option value="maxsubarray">Maximum Subarray (Kadane's)</option>
              <option value="productexceptself">Product of Array Except Self</option>
            </optgroup>
            <optgroup label="Interval Algorithms">
              <option value="mergeintervals">Merge Intervals</option>
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
              <option value="coinchange">Coin Change</option>
            </optgroup>
          </select>
        </div>

        {/* Algorithm Summary */}
        <div className="algorithm-summary">
          <h3 className="summary-title">{algorithmSummaries[algorithm].title}</h3>
          <p className="summary-description">{algorithmSummaries[algorithm].description}</p>
          <div className="complexity-badges">
            <span className="summary-complexity">{algorithmSummaries[algorithm].complexity}</span>
          </div>
        </div>

        {/* Blind 75 LeetCode Problems Selector */}
        <div className="form-group" style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <label className="form-label" htmlFor="blind75-select" style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600' }}>
            🎯 Blind 75 LeetCode Problems
          </label>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Select a problem to see its visualizer
          </p>
          <select
            id="blind75-select"
            value={selectedBlind75}
            onChange={(e) => {
              const problemKey = e.target.value;
              setSelectedBlind75(problemKey);

              if (problemKey && blind75Mapping[problemKey]) {
                const mapping = blind75Mapping[problemKey];
                if (mapping.available && mapping.algo) {
                  setAlgorithm(mapping.algo);
                  // Scroll to input section
                  setTimeout(() => {
                    const inputSection = document.querySelector('.form-group');
                    inputSection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }, 100);
                }
              }
            }}
            className="input-field"
            style={{
              backgroundColor: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              fontSize: '0.95rem'
            }}
          >
            <option value="">-- Select a Blind 75 Problem --</option>

            <optgroup label="Array (9 problems)">
              <option value="two-sum">✅ Two Sum</option>
              <option value="best-time-stock">🔧 Best Time to Buy and Sell Stock</option>
              <option value="contains-duplicate">📝 Contains Duplicate</option>
              <option value="product-except-self">✅ Product of Array Except Self</option>
              <option value="maximum-subarray">✅ Maximum Subarray (Kadane's)</option>
              <option value="maximum-product-subarray">📝 Maximum Product Subarray</option>
              <option value="find-min-rotated">🔧 Find Minimum in Rotated Sorted Array</option>
              <option value="search-rotated">✅ Search in Rotated Sorted Array</option>
              <option value="3sum">📝 3Sum</option>
            </optgroup>

            <optgroup label="Dynamic Programming (11 problems)">
              <option value="climbing-stairs">✅ Climbing Stairs</option>
              <option value="coin-change">✅ Coin Change</option>
              <option value="longest-increasing-subsequence">📝 Longest Increasing Subsequence</option>
              <option value="longest-common-subsequence">📝 Longest Common Subsequence</option>
              <option value="word-break">📝 Word Break</option>
              <option value="combination-sum-iv">📝 Combination Sum IV</option>
              <option value="house-robber">📝 House Robber</option>
              <option value="house-robber-ii">📝 House Robber II</option>
              <option value="decode-ways">📝 Decode Ways</option>
              <option value="unique-paths">📝 Unique Paths</option>
              <option value="jump-game">📝 Jump Game</option>
            </optgroup>

            <optgroup label="Graph (6 problems)">
              <option value="clone-graph">✅ Clone Graph</option>
              <option value="course-schedule">✅ Course Schedule</option>
              <option value="pacific-atlantic">✅ Pacific Atlantic Water Flow</option>
              <option value="number-of-islands">✅ Number of Islands</option>
              <option value="longest-consecutive">🔧 Longest Consecutive Sequence</option>
              <option value="graph-valid-tree">✅ Graph Valid Tree</option>
            </optgroup>

            <optgroup label="Tree (11 problems)">
              <option value="max-depth-tree">✅ Maximum Depth of Binary Tree</option>
              <option value="same-tree">✅ Same Tree</option>
              <option value="invert-tree">✅ Invert Binary Tree</option>
              <option value="tree-max-path-sum">✅ Binary Tree Maximum Path Sum</option>
              <option value="level-order">✅ Binary Tree Level Order Traversal</option>
              <option value="serialize-tree">✅ Serialize and Deserialize Binary Tree</option>
              <option value="subtree">✅ Subtree of Another Tree</option>
              <option value="construct-tree">✅ Construct Binary Tree from Preorder and Inorder</option>
              <option value="validate-bst">✅ Validate Binary Search Tree</option>
              <option value="kth-smallest-bst">✅ Kth Smallest Element in BST</option>
              <option value="lca-bst">✅ Lowest Common Ancestor of BST</option>
            </optgroup>

            <optgroup label="String (8 problems)">
              <option value="longest-substring">✅ Longest Substring Without Repeating Characters</option>
              <option value="longest-repeating">📝 Longest Repeating Character Replacement</option>
              <option value="valid-anagram">📝 Valid Anagram</option>
              <option value="group-anagrams">📝 Group Anagrams</option>
              <option value="valid-parentheses">✅ Valid Parentheses</option>
              <option value="valid-palindrome">📝 Valid Palindrome</option>
              <option value="longest-palindrome">📝 Longest Palindromic Substring</option>
              <option value="palindromic-substrings">📝 Palindromic Substrings</option>
            </optgroup>

            <optgroup label="Interval (5 problems)">
              <option value="insert-interval">🔧 Insert Interval</option>
              <option value="merge-intervals">✅ Merge Intervals</option>
              <option value="non-overlapping-intervals">📝 Non-overlapping Intervals</option>
              <option value="meeting-rooms">📝 Meeting Rooms</option>
              <option value="meeting-rooms-ii">📝 Meeting Rooms II</option>
            </optgroup>

            <optgroup label="Linked List (6 problems)">
              <option value="reverse-list">📝 Reverse Linked List</option>
              <option value="detect-cycle">📝 Detect Cycle in Linked List</option>
              <option value="merge-two-lists">📝 Merge Two Sorted Lists</option>
              <option value="merge-k-lists">📝 Merge K Sorted Lists</option>
              <option value="remove-nth">📝 Remove Nth Node From End</option>
              <option value="reorder-list">📝 Reorder List</option>
            </optgroup>
          </select>

          {selectedBlind75 && blind75Mapping[selectedBlind75] && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              {blind75Mapping[selectedBlind75].available ? (
                <div style={{ color: '#059669' }}>
                  <strong>✅ Visualizer Available!</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#374151' }}>
                    Using: <strong>{algorithmSummaries[blind75Mapping[selectedBlind75].algo]?.title}</strong>
                    {blind75Mapping[selectedBlind75].note && ` (${blind75Mapping[selectedBlind75].note})`}
                  </p>
                </div>
              ) : (
                <div style={{ color: '#dc2626' }}>
                  <strong>📝 Coming Soon!</strong>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#374151' }}>
                    This visualizer is not yet implemented.
                    {blind75Mapping[selectedBlind75].note && ` Note: ${blind75Mapping[selectedBlind75].note}`}
                  </p>
                </div>
              )}
            </div>
          )}

          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.9)'
          }}>
            <strong>Legend:</strong> ✅ Available | 🔧 Similar Pattern | 📝 To Be Implemented
          </div>
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

        {isStringAlgorithm && (
          <div className="form-group">
            <label className="form-label" htmlFor="string-input">
              {algorithm === 'validparentheses' ? 'Input String (brackets only)' : 'Input String'}
            </label>
            <input
              id="string-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder={algorithm === 'validparentheses' ? "e.g., ({[]})" : "e.g., abcabcbb"}
            />
          </div>
        )}

        {isCoinChange && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="coins-input">
                Coin Denominations (comma-separated)
              </label>
              <input
                id="coins-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-field"
                placeholder="e.g., 1, 2, 5"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="amount-input">Target Amount</label>
              <input
                id="amount-input"
                type="text"
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="input-field"
                placeholder="e.g., 11"
              />
            </div>
          </>
        )}

        {isIntervalAlgorithm && (
          <div className="form-group">
            <label className="form-label" htmlFor="intervals-input">
              Intervals (format: start-end, start-end)
            </label>
            <input
              id="intervals-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="e.g., 1-3, 2-6, 8-10, 15-18"
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
            {/* Phase Indicator */}
            {steps[currentStep]?.phase && (
              <div className="phase-indicator">
                <span className="phase-label">Phase:</span>
                <span className="phase-value">{steps[currentStep].phase}</span>
              </div>
            )}

            {/* Main Description */}
            <div className="description-box">
              <p className="description-text">{steps[currentStep]?.description || ''}</p>
            </div>

            {/* Educational Panels Grid */}
            <div className="educational-grid">
              {/* Variables Tracker */}
              {steps[currentStep]?.variables && Object.keys(steps[currentStep].variables).length > 0 && (
                <div className="edu-panel variables-panel">
                  <h4 className="edu-panel-title">📊 Variables</h4>
                  <div className="variables-grid">
                    {Object.entries(steps[currentStep].variables).map(([key, value]) => (
                      <div key={key} className="variable-item">
                        <span className="variable-name">{key}:</span>
                        <span className="variable-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operations Counter */}
              {steps[currentStep]?.operations && (
                <div className="edu-panel operations-panel">
                  <h4 className="edu-panel-title">🔢 Operations</h4>
                  <div className="operations-grid">
                    {Object.entries(steps[currentStep].operations).map(([key, value]) => (
                      <div key={key} className="operation-item">
                        <span className="operation-name">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <span className="operation-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Legend */}
              {isArrayAlgorithm && (
                <div className="edu-panel legend-panel">
                  <h4 className="edu-panel-title">🎨 Color Guide</h4>
                  <div className="legend-grid">
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' }}></div>
                      <span className="legend-label">Unsorted</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)' }}></div>
                      <span className="legend-label">Comparing</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)' }}></div>
                      <span className="legend-label">Swapping</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(180deg, #34d399 0%, #10b981 100%)' }}></div>
                      <span className="legend-label">Sorted</span>
                    </div>
                    {algorithm === 'quick' && (
                      <div className="legend-item">
                        <div className="legend-color" style={{ background: 'linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)' }}></div>
                        <span className="legend-label">Pivot</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Graph Color Legend */}
              {isGraphAlgorithm && (
                <div className="edu-panel legend-panel">
                  <h4 className="edu-panel-title">🎨 Node Color Guide</h4>
                  <div className="legend-grid">
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }}></div>
                      <span className="legend-label">Unvisited</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}></div>
                      <span className="legend-label">Current Node</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' }}></div>
                      <span className="legend-label">{algorithm === 'bfs' ? 'In Queue' : algorithm === 'dfs' ? 'In Stack' : 'Updating'}</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }}></div>
                      <span className="legend-label">Visited</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Insight */}
              {steps[currentStep]?.insight && (
                <div className="edu-panel insight-panel">
                  <h4 className="edu-panel-title">💡 Key Insight</h4>
                  <p className="insight-text">{steps[currentStep].insight}</p>
                </div>
              )}
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

            {/* Learning Tips */}
            <div className="learning-tips">
              <h4 className="tips-title">💡 Learning Tips</h4>
              <ul className="tips-list">
                <li>Use the <strong>step controls</strong> to go through the algorithm at your own pace</li>
                <li>Watch the <strong>variables panel</strong> to understand loop indices and values</li>
                <li>Check the <strong>operations counter</strong> to see algorithm efficiency in action</li>
                <li>Read the <strong>key insights</strong> at each step to understand the "why" behind each operation</li>
                <li>The <strong>color legend</strong> helps you track what's happening visually</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;