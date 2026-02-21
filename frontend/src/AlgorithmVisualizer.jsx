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
  containsduplicate: {
    title: "Contains Duplicate",
    description: "Contains Duplicate checks if any value appears at least twice in the array using a hash set. Iterate through the array and check if each element exists in the set. If found, return true. Otherwise, add it to the set and continue. Return false if no duplicates found.",
    complexity: "Time: O(n) | Space: O(n)"
  },
  bestimestock: {
    title: "Best Time to Buy and Sell Stock",
    description: "Find the maximum profit from buying and selling stock once. Track the minimum price seen so far and calculate profit at each price. The maximum profit is the largest difference between current price and minimum price seen before it.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  validanagram: {
    title: "Valid Anagram",
    description: "Valid Anagram checks if two strings are anagrams (contain same characters with same frequencies). Use a hash map to count character frequencies in the first string, then decrement for the second string. If all counts end at zero, they're anagrams.",
    complexity: "Time: O(n) | Space: O(1) - max 26 letters"
  },
  validpalindrome: {
    title: "Valid Palindrome",
    description: "Valid Palindrome uses two pointers starting from both ends of the string, moving inward. Skip non-alphanumeric characters and compare characters case-insensitively. If all characters match, it's a palindrome.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  containermostwater: {
    title: "Container With Most Water",
    description: "Container With Most Water uses two pointers at both ends to find maximum area. Area = min(height[left], height[right]) × (right - left). Move the pointer with smaller height inward, as moving the taller one can't increase area. Track maximum area throughout.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  threesum: {
    title: "3Sum",
    description: "3Sum finds all unique triplets that sum to zero. Sort the array first, then for each element, use two pointers to find pairs that sum to -element. Skip duplicates to ensure unique triplets. This combines sorting with two-pointer technique.",
    complexity: "Time: O(n²) | Space: O(1) excluding output"
  },
  houserobber: {
    title: "House Robber",
    description: "House Robber finds maximum money you can rob without robbing adjacent houses using dynamic programming. At each house, decide to rob it (add to previous non-adjacent) or skip it (keep previous max). The recurrence is: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
    complexity: "Time: O(n) | Space: O(1) with optimization"
  },
  longestincreasing: {
    title: "Longest Increasing Subsequence",
    description: "Longest Increasing Subsequence (LIS) finds the length of the longest strictly increasing subsequence using dynamic programming. For each position, check all previous elements: if smaller, extend that subsequence. dp[i] = max(dp[j] + 1) for all j < i where arr[j] < arr[i].",
    complexity: "Time: O(n²) or O(n log n) | Space: O(n)"
  },
  uniquepaths: {
    title: "Unique Paths",
    description: "Unique Paths counts paths in a grid from top-left to bottom-right (only right/down moves) using dynamic programming. Each cell dp[i][j] = dp[i-1][j] + dp[i][j-1] (sum of paths from top and left). First row and column are all 1s (only one path to reach them).",
    complexity: "Time: O(m × n) | Space: O(m × n)"
  },
  jumpgame: {
    title: "Jump Game",
    description: "Jump Game determines if you can reach the last index using a greedy approach. Track the farthest position reachable. At each position, if reachable, update farthest with max(farthest, i + nums[i]). Return true if farthest reaches or exceeds the last index.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  decodeways: {
    title: "Decode Ways",
    description: "Decode Ways counts ways to decode a string where 1='A', 2='B'...26='Z' using DP. dp[i] counts ways to decode up to position i. Add dp[i-1] if single digit valid (1-9), add dp[i-2] if two digits valid (10-26). Handle edge cases for '0'.",
    complexity: "Time: O(n) | Space: O(n) or O(1)"
  },
  wordbreak: {
    title: "Word Break",
    description: "Word Break determines if a string can be segmented into dictionary words using DP. dp[i] = true if string[0...i] can be segmented. For each position, check all possible words ending at that position. dp[i] = true if dp[i-len] is true and string[i-len...i] is in dictionary.",
    complexity: "Time: O(n² × m) | Space: O(n)"
  },
  maxproductsubarray: {
    title: "Maximum Product Subarray",
    description: "Maximum Product Subarray finds the contiguous subarray with the largest product. Track both max and min products (negative × negative = positive). At each element, consider: element alone, element × maxProduct, element × minProduct. Swap max/min if element is negative.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  findminrotated: {
    title: "Find Minimum in Rotated Sorted Array",
    description: "Find Minimum in Rotated Sorted Array uses modified binary search. Compare mid with right: if mid > right, minimum is in right half; otherwise, minimum is in left half (including mid). The minimum is at the rotation point where arr[i] < arr[i-1].",
    complexity: "Time: O(log n) | Space: O(1)"
  },
  missingnumber: {
    title: "Missing Number",
    description: "Missing Number finds the missing number from 0 to n using mathematical formula or XOR. Math approach: sum(0 to n) - sum(array) = missing number. XOR approach: XOR all indices with all values; result is the missing number (a⊕a=0, order doesn't matter).",
    complexity: "Time: O(n) | Space: O(1)"
  },
  topkfrequent: {
    title: "Top K Frequent Elements",
    description: "Top K Frequent Elements finds the k most frequent elements using a hash map and bucket sort. Count frequencies with hash map, then use bucket sort where bucket[freq] contains all elements with that frequency. Traverse buckets from high to low frequency to get top k elements.",
    complexity: "Time: O(n) | Space: O(n)"
  },
  longestpalindrome: {
    title: "Longest Palindromic Substring",
    description: "Longest Palindromic Substring finds the longest palindrome by expanding around each center. For each position, expand outward while characters match. Check both odd-length palindromes (single center) and even-length palindromes (two centers). Track the longest palindrome found.",
    complexity: "Time: O(n²) | Space: O(1)"
  },
  detectcycle: {
    title: "Detect Cycle in Linked List",
    description: "Floyd's cycle detection uses two pointers — slow (moves 1 step) and fast (moves 2 steps). If there's a cycle, fast will eventually lap slow and they'll meet. If fast reaches null, there is no cycle. This is O(1) space and O(n) time.",
    complexity: "Time: O(n) | Space: O(1)"
  },
  mergetwolists: {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists by comparing the heads of each list and always picking the smaller value. Advance the pointer of whichever list provided the smaller value. When one list is exhausted, append the remainder of the other list.",
    complexity: "Time: O(m + n) | Space: O(1)"
  },
  lcs: {
    title: "Longest Common Subsequence",
    description: "LCS finds the longest subsequence common to two strings using a 2D DP table. dp[i][j] = length of LCS of first i characters of text1 and first j characters of text2. If characters match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    complexity: "Time: O(m × n) | Space: O(m × n)"
  },
  groupanagrams: {
    title: "Group Anagrams",
    description: "Group Anagrams clusters strings that are anagrams of each other by using a sorted version of each string as a hash map key. All strings that sort to the same key are anagrams and belong in the same group.",
    complexity: "Time: O(n × k log k) | Space: O(n × k)"
  },
  nonoverlapping: {
    title: "Non-overlapping Intervals",
    description: "Find the minimum number of intervals to remove so the rest don't overlap. Sort by end time (greedy). Greedily keep intervals that end earliest — when overlap is found, remove the interval with the later end (keep the one ending sooner to leave more room).",
    complexity: "Time: O(n log n) | Space: O(1)"
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

const generateContainsDuplicateSteps = (arr) => {
  const steps = [{
    array: arr,
    seen: new Set(),
    currentIndex: -1,
    comparing: [],
    description: `Checking for duplicates in [${arr.join(', ')}]`,
    variables: { 'array length': arr.length, 'seen size': 0 },
    operations: { 'checks': 0 },
    phase: 'Initialize',
    insight: 'Use a hash set to track seen numbers. If a number is already in the set, we found a duplicate.'
  }];

  const seen = new Set();
  let checks = 0;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    checks++;

    // Check if number is in set
    steps.push({
      array: arr,
      seen: new Set(seen),
      currentIndex: i,
      comparing: [i],
      checking: num,
      description: `Check if ${num} exists in set`,
      variables: {
        'current index': i,
        'current value': num,
        'set size': seen.size,
        'in set?': seen.has(num) ? 'YES - DUPLICATE!' : 'NO'
      },
      operations: { checks },
      phase: `Checking (${i + 1}/${arr.length})`,
      insight: `Looking for ${num} in set: {${Array.from(seen).join(', ')}}`
    });

    if (seen.has(num)) {
      // Found duplicate!
      steps.push({
        array: arr,
        seen: new Set(seen),
        currentIndex: i,
        comparing: [i],
        found: true,
        duplicate: num,
        description: `✗ Duplicate found! ${num} appears more than once`,
        variables: {
          'duplicate': num,
          'index': i
        },
        operations: { checks },
        phase: 'Duplicate Found',
        insight: `${num} was already in the set. Array contains duplicates.`
      });

      return steps;
    }

    // Add to set
    seen.add(num);

    steps.push({
      array: arr,
      seen: new Set(seen),
      currentIndex: i,
      comparing: [],
      description: `Add ${num} to set`,
      variables: {
        'added': num,
        'set size': seen.size
      },
      operations: { checks },
      phase: `Checking (${i + 1}/${arr.length})`,
      insight: `${num} not found. Add to set for future lookups.`
    });
  }

  // No duplicates
  steps.push({
    array: arr,
    seen: new Set(seen),
    currentIndex: -1,
    comparing: [],
    found: false,
    description: `✓ No duplicates found!`,
    variables: {
      'checked': arr.length,
      'unique values': seen.size
    },
    operations: { checks },
    phase: 'Complete',
    insight: `All ${arr.length} values are unique. Time: O(n), Space: O(n)`
  });

  return steps;
};

const generateBestTimeStockSteps = (prices) => {
  const steps = [{
    array: prices,
    currentIndex: -1,
    minPrice: Infinity,
    maxProfit: 0,
    description: `Finding best time to buy and sell stock`,
    variables: { 'prices': prices.length },
    operations: { 'comparisons': 0 },
    phase: 'Initialize',
    insight: 'Track minimum price seen so far. At each price, calculate profit if sold today.'
  }];

  let minPrice = prices[0];
  let maxProfit = 0;
  let buyDay = 0;
  let sellDay = 0;
  let comparisons = 0;

  steps.push({
    array: prices,
    currentIndex: 0,
    comparing: [0],
    minPrice,
    maxProfit,
    buyDay,
    sellDay,
    description: `Initialize: minPrice = ${minPrice}, maxProfit = ${maxProfit}`,
    variables: { minPrice, maxProfit },
    operations: { comparisons },
    phase: 'Initialize',
    insight: `Start with day 0 as potential buy day`
  });

  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];
    const profit = price - minPrice;
    comparisons++;

    steps.push({
      array: prices,
      currentIndex: i,
      comparing: [i, buyDay],
      minPrice,
      maxProfit,
      buyDay,
      sellDay,
      currentProfit: profit,
      description: `Day ${i}: Price = ${price}, Profit if sold = ${profit}`,
      variables: {
        'current price': price,
        'min price': minPrice,
        'profit if sold': profit,
        'max profit': maxProfit
      },
      operations: { comparisons },
      phase: `Day ${i + 1}/${prices.length}`,
      insight: `If bought at ${minPrice} (day ${buyDay}) and sold at ${price} (day ${i}), profit = ${profit}`
    });

    if (profit > maxProfit) {
      maxProfit = profit;
      sellDay = i;

      steps.push({
        array: prices,
        currentIndex: i,
        comparing: [buyDay, i],
        minPrice,
        maxProfit,
        buyDay,
        sellDay,
        found: true,
        description: `✓ New max profit: ${maxProfit}`,
        variables: {
          'max profit': maxProfit,
          'buy day': buyDay,
          'sell day': sellDay
        },
        operations: { comparisons },
        phase: 'New Max',
        insight: `Buy on day ${buyDay} at $${minPrice}, sell on day ${sellDay} at $${price}`
      });
    }

    if (price < minPrice) {
      minPrice = price;
      buyDay = i;

      steps.push({
        array: prices,
        currentIndex: i,
        comparing: [i],
        minPrice,
        maxProfit,
        buyDay,
        sellDay,
        description: `New minimum price: ${minPrice}`,
        variables: { 'min price': minPrice, 'buy day': buyDay },
        operations: { comparisons },
        phase: 'New Min',
        insight: `Day ${i} has lower price. Update potential buy day.`
      });
    }
  }

  steps.push({
    array: prices,
    currentIndex: -1,
    comparing: buyDay !== sellDay ? [buyDay, sellDay] : [],
    minPrice,
    maxProfit,
    buyDay,
    sellDay,
    found: true,
    description: `✓ Max profit: $${maxProfit}`,
    variables: {
      'max profit': maxProfit,
      'buy day': buyDay,
      'sell day': sellDay
    },
    operations: { comparisons },
    phase: 'Complete',
    insight: maxProfit > 0 ?
      `Buy on day ${buyDay} at $${prices[buyDay]}, sell on day ${sellDay} at $${prices[sellDay]}` :
      `No profitable transaction possible. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateValidAnagramSteps = (str1, str2) => {
  const steps = [{
    string1: str1,
    string2: str2,
    charCount: {},
    currentIndex: -1,
    description: `Checking if "${str1}" and "${str2}" are anagrams`,
    variables: { 'length 1': str1.length, 'length 2': str2.length },
    operations: { 'operations': 0 },
    phase: 'Initialize',
    insight: 'Anagrams have the same characters with the same frequencies. Use hash map to count.'
  }];

  if (str1.length !== str2.length) {
    steps.push({
      string1: str1,
      string2: str2,
      charCount: {},
      currentIndex: -1,
      valid: false,
      description: `✗ Different lengths! Not anagrams`,
      variables: { 'length 1': str1.length, 'length 2': str2.length },
      operations: { 'operations': 0 },
      phase: 'Invalid',
      insight: `Strings of different lengths cannot be anagrams`
    });
    return steps;
  }

  const charCount = {};
  let operations = 0;

  // Count characters in first string
  for (let i = 0; i < str1.length; i++) {
    const char = str1[i];
    charCount[char] = (charCount[char] || 0) + 1;
    operations++;

    steps.push({
      string1: str1,
      string2: str2,
      charCount: { ...charCount },
      currentIndex: i,
      phase1: true,
      description: `Count '${char}' in first string`,
      variables: {
        'character': char,
        'count': charCount[char]
      },
      operations: { operations },
      phase: `Counting String 1 (${i + 1}/${str1.length})`,
      insight: `Character '${char}' appears ${charCount[char]} time(s) so far`
    });
  }

  steps.push({
    string1: str1,
    string2: str2,
    charCount: { ...charCount },
    currentIndex: -1,
    description: `Character counts: ${JSON.stringify(charCount)}`,
    variables: { 'unique chars': Object.keys(charCount).length },
    operations: { operations },
    phase: 'Counted String 1',
    insight: `Finished counting first string`
  });

  // Decrement for second string
  for (let i = 0; i < str2.length; i++) {
    const char = str2[i];

    if (!charCount[char]) {
      steps.push({
        string1: str1,
        string2: str2,
        charCount: { ...charCount },
        currentIndex: i,
        phase2: true,
        valid: false,
        description: `✗ Character '${char}' not in first string`,
        variables: { 'character': char },
        operations: { operations },
        phase: 'Not Anagram',
        insight: `'${char}' appears in string2 but not in string1`
      });
      return steps;
    }

    charCount[char]--;
    operations++;

    if (charCount[char] === 0) {
      delete charCount[char];
    }

    steps.push({
      string1: str1,
      string2: str2,
      charCount: { ...charCount },
      currentIndex: i,
      phase2: true,
      description: `Decrement '${char}' count`,
      variables: {
        'character': char,
        'remaining': Object.keys(charCount).length
      },
      operations: { operations },
      phase: `Checking String 2 (${i + 1}/${str2.length})`,
      insight: `Matching '${char}' from string2 with string1`
    });

    if (charCount[char] < 0) {
      steps.push({
        string1: str1,
        string2: str2,
        charCount: { ...charCount },
        currentIndex: i,
        phase2: true,
        valid: false,
        description: `✗ Extra '${char}' in second string`,
        variables: { 'character': char },
        operations: { operations },
        phase: 'Not Anagram',
        insight: `'${char}' appears more in string2 than in string1`
      });
      return steps;
    }
  }

  const isValid = Object.keys(charCount).length === 0;

  steps.push({
    string1: str1,
    string2: str2,
    charCount: { ...charCount },
    currentIndex: -1,
    valid: isValid,
    description: isValid ? `✓ Valid anagram!` : `✗ Not an anagram`,
    variables: {
      'remaining chars': Object.keys(charCount).length,
      'is anagram': isValid ? 'YES' : 'NO'
    },
    operations: { operations },
    phase: isValid ? 'Valid Anagram' : 'Not Anagram',
    insight: isValid ?
      `All characters matched perfectly. Strings are anagrams.` :
      `Character counts don't match. Not anagrams.`
  });

  return steps;
};

const generateValidPalindromeSteps = (str) => {
  // Clean string: remove non-alphanumeric and lowercase
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const steps = [{
    original: str,
    cleaned,
    left: -1,
    right: -1,
    description: `Checking if "${str}" is a valid palindrome`,
    variables: { 'original length': str.length, 'cleaned length': cleaned.length },
    operations: { 'comparisons': 0 },
    phase: 'Initialize',
    insight: 'Remove non-alphanumeric characters, convert to lowercase, use two pointers'
  }];

  steps.push({
    original: str,
    cleaned,
    left: -1,
    right: -1,
    description: `Cleaned string: "${cleaned}"`,
    variables: { 'cleaned': cleaned },
    operations: { 'comparisons': 0 },
    phase: 'Cleaned',
    insight: `After removing special characters: "${cleaned}"`
  });

  let left = 0;
  let right = cleaned.length - 1;
  let comparisons = 0;

  while (left < right) {
    comparisons++;

    steps.push({
      original: str,
      cleaned,
      left,
      right,
      leftChar: cleaned[left],
      rightChar: cleaned[right],
      description: `Compare '${cleaned[left]}' vs '${cleaned[right]}'`,
      variables: {
        'left': left,
        'right': right,
        'left char': cleaned[left],
        'right char': cleaned[right],
        'match?': cleaned[left] === cleaned[right] ? 'YES' : 'NO'
      },
      operations: { comparisons },
      phase: `Comparing`,
      insight: `Pointers at positions ${left} and ${right}`
    });

    if (cleaned[left] !== cleaned[right]) {
      steps.push({
        original: str,
        cleaned,
        left,
        right,
        leftChar: cleaned[left],
        rightChar: cleaned[right],
        valid: false,
        description: `✗ Not a palindrome! '${cleaned[left]}' ≠ '${cleaned[right]}'`,
        variables: {
          'left char': cleaned[left],
          'right char': cleaned[right]
        },
        operations: { comparisons },
        phase: 'Not Palindrome',
        insight: `Characters don't match at positions ${left} and ${right}`
      });
      return steps;
    }

    steps.push({
      original: str,
      cleaned,
      left,
      right,
      leftChar: cleaned[left],
      rightChar: cleaned[right],
      matched: true,
      description: `✓ Match! Moving pointers inward`,
      variables: {
        'matched': `${cleaned[left]} = ${cleaned[right]}`
      },
      operations: { comparisons },
      phase: 'Matched',
      insight: `Characters match, move both pointers`
    });

    left++;
    right--;
  }

  steps.push({
    original: str,
    cleaned,
    left,
    right,
    valid: true,
    description: `✓ Valid palindrome!`,
    variables: {
      'comparisons': comparisons,
      'is palindrome': 'YES'
    },
    operations: { comparisons },
    phase: 'Valid Palindrome',
    insight: `All characters matched. "${str}" is a valid palindrome. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateContainerMostWaterSteps = (heights) => {
  const steps = [{
    array: heights,
    left: -1,
    right: -1,
    maxArea: 0,
    description: `Finding container with most water`,
    variables: { 'heights': heights.length },
    operations: { 'calculations': 0 },
    phase: 'Initialize',
    insight: 'Use two pointers. Area = min(height[left], height[right]) × distance. Move pointer with smaller height.'
  }];

  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;
  let bestLeft = 0;
  let bestRight = heights.length - 1;
  let calculations = 0;

  steps.push({
    array: heights,
    left,
    right,
    maxArea,
    description: `Start with pointers at both ends`,
    variables: { left, right },
    operations: { calculations },
    phase: 'Start',
    insight: `Initial width = ${right - left}`
  });

  while (left < right) {
    const width = right - left;
    const height = Math.min(heights[left], heights[right]);
    const area = width * height;
    calculations++;

    steps.push({
      array: heights,
      left,
      right,
      currentArea: area,
      maxArea,
      description: `Area = min(${heights[left]}, ${heights[right]}) × ${width} = ${area}`,
      variables: {
        'left': left,
        'right': right,
        'width': width,
        'min height': height,
        'area': area,
        'max area': maxArea
      },
      operations: { calculations },
      phase: 'Calculate',
      insight: `Container bounded by heights ${heights[left]} and ${heights[right]}`
    });

    if (area > maxArea) {
      maxArea = area;
      bestLeft = left;
      bestRight = right;

      steps.push({
        array: heights,
        left,
        right,
        currentArea: area,
        maxArea,
        bestLeft,
        bestRight,
        found: true,
        description: `✓ New max area: ${maxArea}`,
        variables: {
          'max area': maxArea,
          'container': `[${bestLeft}, ${bestRight}]`
        },
        operations: { calculations },
        phase: 'New Max',
        insight: `Best container so far: left=${bestLeft}, right=${bestRight}`
      });
    }

    // Move pointer with smaller height
    if (heights[left] < heights[right]) {
      steps.push({
        array: heights,
        left,
        right,
        currentArea: area,
        maxArea,
        moveLeft: true,
        description: `Move left pointer (${heights[left]} < ${heights[right]})`,
        variables: {
          'moving': 'left',
          'reason': `${heights[left]} < ${heights[right]}`
        },
        operations: { calculations },
        phase: 'Move Pointer',
        insight: `Left height is smaller, so moving right pointer can't increase area`
      });
      left++;
    } else {
      steps.push({
        array: heights,
        left,
        right,
        currentArea: area,
        maxArea,
        moveRight: true,
        description: `Move right pointer (${heights[right]} ≤ ${heights[left]})`,
        variables: {
          'moving': 'right',
          'reason': `${heights[right]} ≤ ${heights[left]}`
        },
        operations: { calculations },
        phase: 'Move Pointer',
        insight: `Right height is smaller/equal, so moving left pointer can't increase area`
      });
      right--;
    }
  }

  steps.push({
    array: heights,
    left,
    right,
    maxArea,
    bestLeft,
    bestRight,
    found: true,
    description: `✓ Max area: ${maxArea}`,
    variables: {
      'max area': maxArea,
      'left index': bestLeft,
      'right index': bestRight,
      'width': bestRight - bestLeft,
      'height': Math.min(heights[bestLeft], heights[bestRight])
    },
    operations: { calculations },
    phase: 'Complete',
    insight: `Maximum water: ${maxArea} units. Container from index ${bestLeft} to ${bestRight}. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateThreeSumSteps = (nums) => {
  const steps = [{
    array: nums,
    sorted: [],
    currentIndex: -1,
    description: `Finding all triplets that sum to 0`,
    variables: { 'array length': nums.length },
    operations: { 'iterations': 0 },
    phase: 'Initialize',
    insight: 'Sort array first. For each element, use two pointers to find pairs that sum to -element.'
  }];

  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  let iterations = 0;

  steps.push({
    array: nums,
    sorted: [...sorted],
    currentIndex: -1,
    description: `Sorted array: [${sorted.join(', ')}]`,
    variables: { 'sorted': sorted.join(', ') },
    operations: { iterations },
    phase: 'Sorted',
    insight: `Sorted array to use two-pointer technique`
  });

  for (let i = 0; i < sorted.length - 2; i++) {
    // Skip duplicates
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      steps.push({
        array: nums,
        sorted: [...sorted],
        currentIndex: i,
        description: `Skip duplicate ${sorted[i]}`,
        variables: { 'skipping': sorted[i] },
        operations: { iterations },
        phase: 'Skip Duplicate',
        insight: `Already processed ${sorted[i]} in previous iteration`
      });
      continue;
    }

    const target = -sorted[i];
    let left = i + 1;
    let right = sorted.length - 1;

    steps.push({
      array: nums,
      sorted: [...sorted],
      currentIndex: i,
      left,
      right,
      target,
      description: `Fix ${sorted[i]}, find pairs that sum to ${target}`,
      variables: {
        'i': i,
        'value': sorted[i],
        'target sum': target,
        'left': left,
        'right': right
      },
      operations: { iterations },
      phase: `Outer Loop (${i + 1}/${sorted.length - 2})`,
      insight: `Looking for pairs that sum to ${target} to make total sum = 0`
    });

    while (left < right) {
      iterations++;
      const sum = sorted[left] + sorted[right];

      steps.push({
        array: nums,
        sorted: [...sorted],
        currentIndex: i,
        left,
        right,
        sum,
        target,
        description: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sorted[i] + sum}`,
        variables: {
          'sum': sorted[i] + sum,
          'target': 0,
          'diff': sum - target
        },
        operations: { iterations },
        phase: 'Two Pointer',
        insight: `Checking triplet [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`
      });

      if (sum === target) {
        result.push([sorted[i], sorted[left], sorted[right]]);

        steps.push({
          array: nums,
          sorted: [...sorted],
          currentIndex: i,
          left,
          right,
          found: true,
          triplet: [sorted[i], sorted[left], sorted[right]],
          result: result.map(r => [...r]),
          description: `✓ Found: [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`,
          variables: {
            'triplet': `[${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`,
            'total found': result.length
          },
          operations: { iterations },
          phase: 'Found Triplet',
          insight: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = 0`
        });

        // Skip duplicates
        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;

        left++;
        right--;
      } else if (sum < target) {
        steps.push({
          array: nums,
          sorted: [...sorted],
          currentIndex: i,
          left,
          right,
          sum,
          target,
          moveLeft: true,
          description: `Sum too small (${sum} < ${target}), move left →`,
          operations: { iterations },
          phase: 'Adjust',
          insight: `Need larger sum, increment left pointer`
        });
        left++;
      } else {
        steps.push({
          array: nums,
          sorted: [...sorted],
          currentIndex: i,
          left,
          right,
          sum,
          target,
          moveRight: true,
          description: `Sum too large (${sum} > ${target}), move right ←`,
          operations: { iterations },
          phase: 'Adjust',
          insight: `Need smaller sum, decrement right pointer`
        });
        right--;
      }
    }
  }

  steps.push({
    array: nums,
    sorted: [...sorted],
    currentIndex: -1,
    result: result.map(r => [...r]),
    description: `✓ Found ${result.length} triplet(s)`,
    variables: {
      'total triplets': result.length,
      'triplets': result.map(r => `[${r.join(', ')}]`).join(', ')
    },
    operations: { iterations },
    phase: 'Complete',
    insight: result.length > 0 ?
      `All triplets: ${result.map(r => `[${r.join(', ')}]`).join(', ')}. Time: O(n²), Space: O(1)` :
      `No triplets sum to 0. Time: O(n²), Space: O(1)`
  });

  return steps;
};

const generateHouseRobberSteps = (houses) => {
  const steps = [{
    array: houses,
    dp: [],
    currentIndex: -1,
    description: `Finding maximum money to rob from ${houses.length} houses`,
    variables: { 'houses': houses.length },
    operations: { 'decisions': 0 },
    phase: 'Initialize',
    insight: 'Cannot rob adjacent houses. At each house, choose max(rob this + dp[i-2], skip this = dp[i-1])'
  }];

  const dp = new Array(houses.length).fill(0);
  let decisions = 0;

  if (houses.length === 0) {
    steps.push({
      array: houses,
      dp,
      currentIndex: -1,
      maxMoney: 0,
      description: `No houses to rob`,
      operations: { decisions },
      phase: 'Complete',
      insight: 'Empty input'
    });
    return steps;
  }

  // Base cases
  dp[0] = houses[0];

  steps.push({
    array: houses,
    dp: [...dp],
    currentIndex: 0,
    description: `Base case: dp[0] = ${houses[0]}`,
    variables: { 'dp[0]': houses[0] },
    operations: { decisions },
    phase: 'Base Case',
    insight: `With only house 0, must rob it for $${houses[0]}`
  });

  if (houses.length === 1) {
    steps.push({
      array: houses,
      dp: [...dp],
      currentIndex: -1,
      maxMoney: dp[0],
      description: `✓ Max money: $${dp[0]}`,
      operations: { decisions },
      phase: 'Complete',
      insight: `Only one house, rob it for $${dp[0]}`
    });
    return steps;
  }

  dp[1] = Math.max(houses[0], houses[1]);
  decisions++;

  steps.push({
    array: houses,
    dp: [...dp],
    currentIndex: 1,
    description: `Base case: dp[1] = max(${houses[0]}, ${houses[1]}) = ${dp[1]}`,
    variables: {
      'house 0': houses[0],
      'house 1': houses[1],
      'dp[1]': dp[1]
    },
    operations: { decisions },
    phase: 'Base Case',
    insight: `With houses 0 and 1, choose the more valuable one`
  });

  // Fill DP array
  for (let i = 2; i < houses.length; i++) {
    const robCurrent = houses[i] + dp[i - 2];
    const skipCurrent = dp[i - 1];
    dp[i] = Math.max(robCurrent, skipCurrent);
    decisions++;

    steps.push({
      array: houses,
      dp: [...dp],
      currentIndex: i,
      robCurrent,
      skipCurrent,
      description: `House ${i}: Rob ($${houses[i]} + $${dp[i - 2]} = $${robCurrent}) vs Skip ($${skipCurrent})`,
      variables: {
        'house value': houses[i],
        'rob this': robCurrent,
        'skip this': skipCurrent,
        'decision': dp[i] === robCurrent ? 'ROB' : 'SKIP',
        'dp[i]': dp[i]
      },
      operations: { decisions },
      phase: `House ${i + 1}/${houses.length}`,
      insight: dp[i] === robCurrent ?
        `Rob house ${i} for $${houses[i]}, total = $${dp[i]}` :
        `Skip house ${i}, keep $${dp[i]} from previous`
    });
  }

  steps.push({
    array: houses,
    dp: [...dp],
    currentIndex: -1,
    maxMoney: dp[houses.length - 1],
    found: true,
    description: `✓ Max money: $${dp[houses.length - 1]}`,
    variables: {
      'max money': dp[houses.length - 1],
      'dp array': dp.join(', ')
    },
    operations: { decisions },
    phase: 'Complete',
    insight: `Maximum money that can be robbed: $${dp[houses.length - 1]}. Time: O(n), Space: O(n)`
  });

  return steps;
};

const generateLongestIncreasingSubsequenceSteps = (nums) => {
  const steps = [{
    array: nums,
    dp: [],
    currentIndex: -1,
    description: `Finding longest increasing subsequence in [${nums.join(', ')}]`,
    variables: { 'array length': nums.length },
    operations: { 'comparisons': 0 },
    phase: 'Initialize',
    insight: 'For each element, check all previous smaller elements and extend their subsequences'
  }];

  if (nums.length === 0) {
    steps.push({
      array: nums,
      dp: [],
      maxLength: 0,
      description: 'Empty array',
      phase: 'Complete',
      insight: 'No elements'
    });
    return steps;
  }

  const dp = new Array(nums.length).fill(1);
  let comparisons = 0;
  let maxLength = 1;
  let maxIndex = 0;

  steps.push({
    array: nums,
    dp: [...dp],
    currentIndex: -1,
    description: 'Initialize all dp[i] = 1 (each element is a subsequence of length 1)',
    variables: { 'dp': dp.join(', ') },
    operations: { comparisons },
    phase: 'Initialize',
    insight: 'Every single element forms an LIS of length 1'
  });

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      comparisons++;

      if (nums[j] < nums[i]) {
        const newLength = dp[j] + 1;

        steps.push({
          array: nums,
          dp: [...dp],
          currentIndex: i,
          comparingWith: j,
          comparing: [i, j],
          description: `${nums[j]} < ${nums[i]}: Can extend subsequence`,
          variables: {
            'i': i,
            'j': j,
            'nums[i]': nums[i],
            'nums[j]': nums[j],
            'dp[j]+1': newLength,
            'current dp[i]': dp[i]
          },
          operations: { comparisons },
          phase: `Building (${i}/${nums.length - 1})`,
          insight: `Since ${nums[j]} < ${nums[i]}, we can extend the subsequence ending at j`
        });

        if (newLength > dp[i]) {
          dp[i] = newLength;

          if (dp[i] > maxLength) {
            maxLength = dp[i];
            maxIndex = i;
          }

          steps.push({
            array: nums,
            dp: [...dp],
            currentIndex: i,
            comparingWith: j,
            comparing: [i, j],
            updated: true,
            description: `✓ Update dp[${i}] = ${dp[i]}`,
            variables: {
              'dp[i]': dp[i],
              'max length': maxLength
            },
            operations: { comparisons },
            phase: 'Updated',
            insight: `Found longer subsequence ending at index ${i}`
          });
        }
      }
    }
  }

  steps.push({
    array: nums,
    dp: [...dp],
    currentIndex: -1,
    maxLength,
    maxIndex,
    found: true,
    description: `✓ Longest increasing subsequence length: ${maxLength}`,
    variables: {
      'max length': maxLength,
      'dp array': dp.join(', ')
    },
    operations: { comparisons },
    phase: 'Complete',
    insight: `LIS length = ${maxLength}. Time: O(n²), Space: O(n)`
  });

  return steps;
};

const generateUniquePathsSteps = (m, n) => {
  const steps = [{
    m,
    n,
    grid: [],
    currentRow: -1,
    currentCol: -1,
    description: `Finding unique paths in ${m}×${n} grid`,
    variables: { 'rows': m, 'cols': n },
    operations: { 'cells filled': 0 },
    phase: 'Initialize',
    insight: 'Grid DP: each cell = sum of paths from top and left'
  }];

  const dp = Array(m).fill(0).map(() => Array(n).fill(0));
  let cellsFilled = 0;

  // Initialize first row and column
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  cellsFilled = m + n - 1;

  steps.push({
    m,
    n,
    grid: dp.map(row => [...row]),
    currentRow: -1,
    currentCol: -1,
    description: 'Initialize first row and column to 1',
    variables: { 'cells filled': cellsFilled },
    operations: { 'cells filled': cellsFilled },
    phase: 'Base Cases',
    insight: 'Only one way to reach cells in first row/column (all right or all down)'
  });

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      cellsFilled++;

      steps.push({
        m,
        n,
        grid: dp.map(row => [...row]),
        currentRow: i,
        currentCol: j,
        description: `dp[${i}][${j}] = dp[${i-1}][${j}] + dp[${i}][${j-1}] = ${dp[i-1][j]} + ${dp[i][j-1]} = ${dp[i][j]}`,
        variables: {
          'from top': dp[i-1][j],
          'from left': dp[i][j-1],
          'total': dp[i][j]
        },
        operations: { 'cells filled': cellsFilled },
        phase: `Row ${i+1}/${m}`,
        insight: `Paths to (${i},${j}) = paths from top + paths from left`
      });
    }
  }

  steps.push({
    m,
    n,
    grid: dp.map(row => [...row]),
    currentRow: -1,
    currentCol: -1,
    totalPaths: dp[m-1][n-1],
    found: true,
    description: `✓ Total unique paths: ${dp[m-1][n-1]}`,
    variables: { 'unique paths': dp[m-1][n-1] },
    operations: { 'cells filled': cellsFilled },
    phase: 'Complete',
    insight: `${dp[m-1][n-1]} unique paths from (0,0) to (${m-1},${n-1}). Time: O(m×n), Space: O(m×n)`
  });

  return steps;
};

const generateJumpGameSteps = (nums) => {
  const steps = [{
    array: nums,
    currentIndex: -1,
    farthest: 0,
    description: `Can we jump from index 0 to ${nums.length - 1}?`,
    variables: { 'target': nums.length - 1 },
    operations: { 'jumps checked': 0 },
    phase: 'Initialize',
    insight: 'Track farthest position reachable. Greedy: always jump to maximize reach.'
  }];

  let farthest = 0;
  let jumpsChecked = 0;

  for (let i = 0; i <= farthest && i < nums.length; i++) {
    const reach = i + nums[i];
    jumpsChecked++;

    steps.push({
      array: nums,
      currentIndex: i,
      comparing: [i],
      farthest,
      newReach: reach,
      description: `From index ${i}, can reach index ${reach}`,
      variables: {
        'position': i,
        'jump length': nums[i],
        'can reach': reach,
        'farthest': farthest
      },
      operations: { 'jumps checked': jumpsChecked },
      phase: `Checking (${i+1}/${nums.length})`,
      insight: `From position ${i}, we can jump ${nums[i]} steps forward`
    });

    if (reach > farthest) {
      farthest = reach;

      steps.push({
        array: nums,
        currentIndex: i,
        comparing: [i],
        farthest,
        updated: true,
        description: `✓ Update farthest to ${farthest}`,
        variables: { 'new farthest': farthest },
        operations: { 'jumps checked': jumpsChecked },
        phase: 'Extended Reach',
        insight: `Can now reach up to index ${farthest}`
      });
    }

    if (farthest >= nums.length - 1) {
      steps.push({
        array: nums,
        currentIndex: i,
        farthest,
        canReach: true,
        found: true,
        description: `✓ Can reach the end!`,
        variables: { 'farthest': farthest, 'target': nums.length - 1 },
        operations: { 'jumps checked': jumpsChecked },
        phase: 'Success',
        insight: `Farthest (${farthest}) >= target (${nums.length - 1}). Can reach the end!`
      });
      return steps;
    }
  }

  steps.push({
    array: nums,
    currentIndex: -1,
    farthest,
    canReach: false,
    description: `✗ Cannot reach the end`,
    variables: { 'farthest': farthest, 'target': nums.length - 1 },
    operations: { 'jumps checked': jumpsChecked },
    phase: 'Failed',
    insight: `Stuck at position ${farthest}. Cannot reach ${nums.length - 1}. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateMissingNumberSteps = (nums) => {
  const n = nums.length;
  const steps = [{
    array: nums,
    n,
    currentIndex: -1,
    description: `Finding missing number from 0 to ${n}`,
    variables: { 'n': n, 'array length': nums.length },
    operations: { 'operations': 0 },
    phase: 'Initialize',
    insight: 'Expected sum: n×(n+1)/2. Missing = expected - actual.'
  }];

  const expectedSum = (n * (n + 1)) / 2;
  let actualSum = 0;
  let operations = 0;

  steps.push({
    array: nums,
    n,
    expectedSum,
    description: `Expected sum (0 to ${n}): ${n}×${n+1}/2 = ${expectedSum}`,
    variables: { 'expected sum': expectedSum },
    operations: { operations },
    phase: 'Calculate Expected',
    insight: `Sum of 0 to n = n×(n+1)/2`
  });

  for (let i = 0; i < nums.length; i++) {
    actualSum += nums[i];
    operations++;

    steps.push({
      array: nums,
      n,
      currentIndex: i,
      comparing: [i],
      actualSum,
      expectedSum,
      description: `Add ${nums[i]}, actual sum = ${actualSum}`,
      variables: {
        'current': nums[i],
        'actual sum': actualSum,
        'expected sum': expectedSum
      },
      operations: { operations },
      phase: `Summing (${i+1}/${nums.length})`,
      insight: `Running sum of array elements`
    });
  }

  const missing = expectedSum - actualSum;

  steps.push({
    array: nums,
    n,
    currentIndex: -1,
    actualSum,
    expectedSum,
    missing,
    found: true,
    description: `✓ Missing number: ${expectedSum} - ${actualSum} = ${missing}`,
    variables: {
      'expected': expectedSum,
      'actual': actualSum,
      'missing': missing
    },
    operations: { operations },
    phase: 'Complete',
    insight: `Missing number is ${missing}. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateDecodeWaysSteps = (s) => {
  const steps = [{
    string: s,
    dp: [],
    currentIndex: -1,
    description: `How many ways to decode "${s}"?`,
    variables: { 'string length': s.length },
    operations: { 'decodings': 0 },
    phase: 'Initialize',
    insight: 'DP: dp[i] = ways to decode s[0...i]. Consider 1-digit and 2-digit decodings.'
  }];

  if (s.length === 0 || s[0] === '0') {
    steps.push({
      string: s,
      dp: [],
      ways: 0,
      description: s.length === 0 ? 'Empty string' : 'Cannot start with 0',
      phase: 'Invalid',
      insight: 'Invalid input'
    });
    return steps;
  }

  const dp = new Array(s.length + 1).fill(0);
  dp[0] = 1; // Empty string
  dp[1] = s[0] !== '0' ? 1 : 0;

  steps.push({
    string: s,
    dp: [...dp],
    currentIndex: 0,
    description: `Base cases: dp[0]=1, dp[1]=${dp[1]}`,
    variables: { 'dp[0]': 1, 'dp[1]': dp[1] },
    operations: { 'decodings': 0 },
    phase: 'Base Case',
    insight: 'Empty string has 1 way, first character has 1 way if not 0'
  });

  for (let i = 2; i <= s.length; i++) {
    const oneDigit = parseInt(s[i - 1]);
    const twoDigits = parseInt(s.substring(i - 2, i));

    steps.push({
      string: s,
      dp: [...dp],
      currentIndex: i - 1,
      oneDigit,
      twoDigits,
      description: `Position ${i}: checking "${s[i-1]}" and "${s.substring(i-2, i)}"`,
      variables: {
        'position': i,
        'one digit': oneDigit,
        'two digits': twoDigits,
        'one valid?': oneDigit >= 1 && oneDigit <= 9,
        'two valid?': twoDigits >= 10 && twoDigits <= 26
      },
      operations: { 'decodings': i - 1 },
      phase: `Decoding (${i}/${s.length})`,
      insight: `Check if we can decode as single digit (1-9) or two digits (10-26)`
    });

    // One digit decoding
    if (oneDigit >= 1 && oneDigit <= 9) {
      dp[i] += dp[i - 1];
    }

    // Two digit decoding
    if (twoDigits >= 10 && twoDigits <= 26) {
      dp[i] += dp[i - 2];
    }

    steps.push({
      string: s,
      dp: [...dp],
      currentIndex: i - 1,
      oneDigit,
      twoDigits,
      updated: true,
      description: `dp[${i}] = ${dp[i]} ways`,
      variables: {
        'dp[i]': dp[i],
        'from single': oneDigit >= 1 && oneDigit <= 9 ? dp[i-1] : 0,
        'from double': twoDigits >= 10 && twoDigits <= 26 ? dp[i-2] : 0
      },
      operations: { 'decodings': i - 1 },
      phase: 'Updated',
      insight: `Total ways to decode up to position ${i}: ${dp[i]}`
    });
  }

  steps.push({
    string: s,
    dp: [...dp],
    currentIndex: -1,
    ways: dp[s.length],
    found: true,
    description: `✓ Total ways to decode: ${dp[s.length]}`,
    variables: { 'total ways': dp[s.length] },
    operations: { 'decodings': s.length },
    phase: 'Complete',
    insight: `"${s}" can be decoded ${dp[s.length]} different ways. Time: O(n), Space: O(n)`
  });

  return steps;
};

const generateWordBreakSteps = (s, wordDict) => {
  const steps = [{
    string: s,
    dictionary: wordDict,
    dp: [],
    currentIndex: -1,
    description: `Can "${s}" be segmented using dictionary [${wordDict.join(', ')}]?`,
    variables: { 'string length': s.length, 'dict size': wordDict.length },
    operations: { 'checks': 0 },
    phase: 'Initialize',
    insight: 'DP: dp[i]=true if s[0...i] can be segmented. Check all words ending at each position.'
  }];

  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // Empty string
  let checks = 0;

  steps.push({
    string: s,
    dictionary: wordDict,
    dp: [...dp],
    currentIndex: -1,
    description: 'Base case: dp[0] = true (empty string)',
    variables: { 'dp[0]': true },
    operations: { checks },
    phase: 'Base Case',
    insight: 'Empty string can always be segmented'
  });

  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      const word = s.substring(j, i);
      const inDict = wordSet.has(word);
      checks++;

      if (dp[j] && inDict) {
        dp[i] = true;

        steps.push({
          string: s,
          dictionary: wordDict,
          dp: [...dp],
          currentIndex: i - 1,
          word,
          wordStart: j,
          wordEnd: i - 1,
          found: true,
          description: `✓ Found "${word}" in dictionary, dp[${i}] = true`,
          variables: {
            'word': word,
            'positions': `[${j}...${i-1}]`,
            'dp[j]': dp[j],
            'in dict?': 'YES'
          },
          operations: { checks },
          phase: `Position ${i}/${s.length}`,
          insight: `s[0...${j}] can be segmented AND "${word}" is in dictionary`
        });
        break; // Found valid segmentation up to i
      }
    }

    if (!dp[i]) {
      steps.push({
        string: s,
        dictionary: wordDict,
        dp: [...dp],
        currentIndex: i - 1,
        description: `No valid word ending at position ${i}`,
        variables: { 'dp[i]': false },
        operations: { checks },
        phase: `Position ${i}/${s.length}`,
        insight: `Cannot segment s[0...${i-1}] with dictionary words`
      });
    }
  }

  steps.push({
    string: s,
    dictionary: wordDict,
    dp: [...dp],
    currentIndex: -1,
    canSegment: dp[s.length],
    found: dp[s.length],
    description: dp[s.length] ? `✓ "${s}" can be segmented` : `✗ "${s}" cannot be segmented`,
    variables: { 'can segment?': dp[s.length] ? 'YES' : 'NO' },
    operations: { checks },
    phase: dp[s.length] ? 'Success' : 'Failed',
    insight: dp[s.length] ?
      `String can be broken into dictionary words` :
      `String cannot be fully segmented. Time: O(n² × m), Space: O(n)`
  });

  return steps;
};

const generateMaxProductSubarraySteps = (nums) => {
  const steps = [{
    array: nums,
    currentIndex: -1,
    description: `Finding maximum product subarray in [${nums.join(', ')}]`,
    variables: { 'array length': nums.length },
    operations: { 'iterations': 0 },
    phase: 'Initialize',
    insight: 'Track both max and min products (negative × negative = positive)'
  }];

  let maxProduct = nums[0];
  let currentMax = nums[0];
  let currentMin = nums[0];
  let maxStart = 0;
  let maxEnd = 0;

  steps.push({
    array: nums,
    currentIndex: 0,
    comparing: [0],
    currentMax,
    currentMin,
    maxProduct,
    description: `Initialize: max=${maxProduct}, currentMax=${currentMax}, currentMin=${currentMin}`,
    variables: { maxProduct, currentMax, currentMin },
    operations: { 'iterations': 0 },
    phase: 'Initialize',
    insight: 'Start with first element'
  });

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const tempMax = currentMax;

    // If current number is negative, swap max and min
    const candidates = [num, num * currentMax, num * currentMin];
    currentMax = Math.max(...candidates);
    currentMin = Math.min(num, num * tempMax, num * currentMin);

    steps.push({
      array: nums,
      currentIndex: i,
      comparing: [i],
      currentMax,
      currentMin,
      maxProduct,
      candidates,
      description: `At ${num}: max(${num}, ${num}×${tempMax}, ${num}×${currentMin})`,
      variables: {
        'current': num,
        'candidates': candidates.join(', '),
        'new max': currentMax,
        'new min': currentMin
      },
      operations: { 'iterations': i },
      phase: `Computing (${i+1}/${nums.length})`,
      insight: num < 0 ?
        `Negative number: min can become max!` :
        `Consider: number alone, extend max product, extend min product`
    });

    if (currentMax > maxProduct) {
      maxProduct = currentMax;
      maxEnd = i;

      steps.push({
        array: nums,
        currentIndex: i,
        comparing: [i],
        currentMax,
        currentMin,
        maxProduct,
        found: true,
        description: `✓ New max product: ${maxProduct}`,
        variables: { 'max product': maxProduct },
        operations: { 'iterations': i },
        phase: 'New Max',
        insight: `Best subarray product so far: ${maxProduct}`
      });
    }
  }

  steps.push({
    array: nums,
    currentIndex: -1,
    maxProduct,
    found: true,
    description: `✓ Maximum product: ${maxProduct}`,
    variables: { 'max product': maxProduct },
    operations: { 'iterations': nums.length - 1 },
    phase: 'Complete',
    insight: `Maximum subarray product: ${maxProduct}. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateFindMinRotatedSteps = (nums) => {
  const steps = [{
    array: nums,
    left: -1,
    right: -1,
    mid: -1,
    description: `Finding minimum in rotated sorted array [${nums.join(', ')}]`,
    variables: { 'array length': nums.length },
    operations: { 'iterations': 0 },
    phase: 'Initialize',
    insight: 'Binary search: compare mid with right. If mid > right, minimum is in right half.'
  }];

  let left = 0;
  let right = nums.length - 1;
  let iterations = 0;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    iterations++;

    steps.push({
      array: nums,
      left,
      right,
      mid,
      comparing: [left, mid, right],
      description: `Compare nums[${mid}]=${nums[mid]} with nums[${right}]=${nums[right]}`,
      variables: {
        'left': left,
        'mid': mid,
        'right': right,
        'nums[mid]': nums[mid],
        'nums[right]': nums[right]
      },
      operations: { iterations },
      phase: 'Binary Search',
      insight: `Search space: [${left}...${right}], checking index ${mid}`
    });

    if (nums[mid] > nums[right]) {
      // Minimum is in right half
      left = mid + 1;

      steps.push({
        array: nums,
        left,
        right,
        mid,
        comparing: [left, mid, right],
        moveRight: true,
        description: `${nums[mid]} > ${nums[right]}: search right half`,
        variables: { 'new left': left },
        operations: { iterations },
        phase: 'Search Right',
        insight: `Rotation point (minimum) must be in [${left}...${right}]`
      });
    } else {
      // Minimum is in left half (including mid)
      right = mid;

      steps.push({
        array: nums,
        left,
        right,
        mid,
        comparing: [left, mid, right],
        moveLeft: true,
        description: `${nums[mid]} ≤ ${nums[right]}: search left half`,
        variables: { 'new right': right },
        operations: { iterations },
        phase: 'Search Left',
        insight: `Minimum could be at mid or to its left`
      });
    }
  }

  steps.push({
    array: nums,
    left,
    right,
    mid: left,
    comparing: [left],
    minimum: nums[left],
    found: true,
    description: `✓ Minimum: ${nums[left]} at index ${left}`,
    variables: {
      'minimum': nums[left],
      'index': left
    },
    operations: { iterations },
    phase: 'Complete',
    insight: `Found minimum ${nums[left]}. Time: O(log n), Space: O(1)`
  });

  return steps;
};

const generateReverseListSteps = (arr) => {
  const steps = [{
    list: [...arr],
    prev: null,
    current: 0,
    next: null,
    description: `Reversing linked list [${arr.join(' → ')}]`,
    variables: { 'list length': arr.length },
    operations: { 'pointer updates': 0 },
    phase: 'Initialize',
    insight: 'Use three pointers: prev (null), current (head), and next. Reverse each pointer one by one.'
  }];

  if (arr.length === 0) {
    steps.push({
      list: [],
      prev: null,
      current: null,
      next: null,
      description: 'Empty list - nothing to reverse',
      variables: {},
      operations: { 'pointer updates': 0 },
      phase: 'Complete',
      insight: 'Empty list is already reversed!'
    });
    return steps;
  }

  let prev = null;
  let current = 0;
  let pointerUpdates = 0;

  steps.push({
    list: [...arr],
    prev,
    current,
    next: current < arr.length - 1 ? current + 1 : null,
    description: `Start with prev=null, current=node 0 (${arr[0]})`,
    variables: { prev: 'null', current: 0, 'value': arr[0] },
    operations: { 'pointer updates': 0 },
    phase: 'Setup',
    insight: 'Initialize three pointers to iterate through the list'
  });

  while (current < arr.length) {
    const next = current < arr.length - 1 ? current + 1 : null;

    steps.push({
      list: [...arr],
      prev,
      current,
      next,
      description: `Save next pointer: ${next !== null ? `node ${next}` : 'null'}`,
      variables: {
        prev: prev !== null ? prev : 'null',
        current,
        next: next !== null ? next : 'null'
      },
      operations: { 'pointer updates': pointerUpdates },
      phase: `Reversing (${current + 1}/${arr.length})`,
      insight: 'Save reference to next node before we change the current node\'s pointer'
    });

    // Reverse the pointer
    pointerUpdates++;

    steps.push({
      list: [...arr],
      prev,
      current,
      next,
      reversing: true,
      description: `Reverse pointer: node ${current} now points to ${prev !== null ? `node ${prev}` : 'null'}`,
      variables: {
        'reversing': `${current} → ${prev !== null ? prev : 'null'}`,
        'old direction': `${current} → ${next !== null ? next : 'null'}`
      },
      operations: { 'pointer updates': pointerUpdates },
      phase: `Reversing (${current + 1}/${arr.length})`,
      insight: `Changed node ${current}'s next pointer from ${next !== null ? next : 'null'} to ${prev !== null ? prev : 'null'}`
    });

    // Move pointers forward
    prev = current;
    current = next !== null ? next : arr.length; // Move past end to exit loop

    if (current < arr.length) {
      steps.push({
        list: [...arr],
        prev,
        current,
        next: current < arr.length - 1 ? current + 1 : null,
        description: `Advance pointers: prev=${prev}, current=${current}`,
        variables: {
          'new prev': prev,
          'new current': current,
          'value': arr[current]
        },
        operations: { 'pointer updates': pointerUpdates },
        phase: `Advancing (${current + 1}/${arr.length})`,
        insight: 'Move all pointers one step forward to process next node'
      });
    }
  }

  steps.push({
    list: [...arr].reverse(),
    prev,
    current: null,
    next: null,
    found: true,
    description: `✓ Reversed! New head is node ${prev} (${arr[prev]})`,
    variables: {
      'new head': prev,
      'reversed list': arr.map((_, i) => arr[arr.length - 1 - i]).join(' → ')
    },
    operations: { 'pointer updates': pointerUpdates },
    phase: 'Complete',
    insight: `List reversed with ${pointerUpdates} pointer updates. Time: O(n), Space: O(1)`
  });

  return steps;
};

const generateTopKFrequentSteps = (nums, k) => {
  const steps = [{
    array: nums,
    frequencyMap: {},
    buckets: [],
    result: [],
    k,
    description: `Finding top ${k} frequent elements in [${nums.join(', ')}]`,
    variables: { 'array length': nums.length, k },
    operations: { 'map operations': 0 },
    phase: 'Initialize',
    insight: 'Use hash map to count frequencies, then bucket sort to find top k elements efficiently.'
  }];

  // Count frequencies
  const frequencyMap = {};
  let mapOps = 0;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    mapOps++;

    steps.push({
      array: nums,
      frequencyMap: { ...frequencyMap },
      buckets: [],
      result: [],
      currentIndex: i,
      k,
      description: `Count ${num}: frequency = ${frequencyMap[num]}`,
      variables: {
        'current': num,
        'frequency': frequencyMap[num],
        'map size': Object.keys(frequencyMap).length
      },
      operations: { 'map operations': mapOps },
      phase: `Counting (${i + 1}/${nums.length})`,
      insight: `${num} appears ${frequencyMap[num]} time(s) so far`
    });
  }

  steps.push({
    array: nums,
    frequencyMap: { ...frequencyMap },
    buckets: [],
    result: [],
    k,
    description: `Frequency map complete: ${Object.entries(frequencyMap).map(([k, v]) => `${k}:${v}`).join(', ')}`,
    variables: { 'unique elements': Object.keys(frequencyMap).length },
    operations: { 'map operations': mapOps },
    phase: 'Counting Complete',
    insight: 'Now create buckets where bucket[freq] contains all elements with that frequency'
  });

  // Bucket sort: bucket[i] contains elements with frequency i
  const buckets = Array.from({ length: nums.length + 1 }, () => []);

  for (const [num, freq] of Object.entries(frequencyMap)) {
    buckets[freq].push(parseInt(num));
    mapOps++;

    steps.push({
      array: nums,
      frequencyMap: { ...frequencyMap },
      buckets: buckets.map(b => [...b]),
      result: [],
      k,
      description: `Place ${num} in bucket[${freq}]`,
      variables: {
        'number': num,
        'frequency': freq,
        'bucket': buckets[freq].join(',')
      },
      operations: { 'map operations': mapOps },
      phase: 'Building Buckets',
      insight: `Elements with frequency ${freq}: [${buckets[freq].join(', ')}]`
    });
  }

  steps.push({
    array: nums,
    frequencyMap: { ...frequencyMap },
    buckets: buckets.map(b => [...b]),
    result: [],
    k,
    description: `Buckets created. Now collect top ${k} elements from highest frequencies`,
    variables: { k },
    operations: { 'map operations': mapOps },
    phase: 'Buckets Complete',
    insight: 'Traverse buckets from high to low frequency to get most frequent elements'
  });

  // Collect top k elements
  const result = [];

  for (let freq = buckets.length - 1; freq >= 0 && result.length < k; freq--) {
    if (buckets[freq].length > 0) {
      for (const num of buckets[freq]) {
        if (result.length < k) {
          result.push(num);
          mapOps++;

          steps.push({
            array: nums,
            frequencyMap: { ...frequencyMap },
            buckets: buckets.map(b => [...b]),
            result: [...result],
            k,
            currentFreq: freq,
            description: `Add ${num} (frequency ${freq}) to result`,
            variables: {
              'added': num,
              'frequency': freq,
              'result size': result.length,
              'remaining': k - result.length
            },
            operations: { 'map operations': mapOps },
            phase: `Collecting (${result.length}/${k})`,
            insight: `${num} appears ${freq} times. Added to top ${k} list.`
          });
        }
      }
    }
  }

  steps.push({
    array: nums,
    frequencyMap: { ...frequencyMap },
    buckets: buckets.map(b => [...b]),
    result: [...result],
    k,
    found: true,
    description: `✓ Top ${k} frequent: [${result.join(', ')}]`,
    variables: {
      'result': result.join(', '),
      'frequencies': result.map(n => `${n}:${frequencyMap[n]}`).join(', ')
    },
    operations: { 'map operations': mapOps },
    phase: 'Complete',
    insight: `Found top ${k} elements. Time: O(n), Space: O(n) using bucket sort`
  });

  return steps;
};

const generateLongestPalindromeSteps = (str) => {
  const steps = [{
    string: str,
    center: -1,
    left: -1,
    right: -1,
    longestStart: -1,
    longestEnd: -1,
    longestLength: 0,
    description: `Finding longest palindromic substring in "${str}"`,
    variables: { 'string length': str.length },
    operations: { 'expansions': 0 },
    phase: 'Initialize',
    insight: 'Expand around each possible center. Check both odd-length (single center) and even-length (two centers) palindromes.'
  }];

  if (str.length === 0) {
    steps.push({
      string: '',
      center: -1,
      left: -1,
      right: -1,
      longestStart: -1,
      longestEnd: -1,
      longestLength: 0,
      description: 'Empty string',
      variables: {},
      operations: { 'expansions': 0 },
      phase: 'Complete',
      insight: 'Empty string has no palindromes'
    });
    return steps;
  }

  let longestStart = 0;
  let longestEnd = 0;
  let longestLength = 1;
  let expansions = 0;

  const expandAroundCenter = (left, right, isEven) => {
    const startLeft = left;

    steps.push({
      string: str,
      center: isEven ? -1 : left,
      left,
      right,
      longestStart,
      longestEnd,
      longestLength,
      description: isEven ?
        `Try even-length palindrome centered between '${str[left]}' and '${str[right]}'` :
        `Try odd-length palindrome centered at '${str[left]}'`,
      variables: {
        'center type': isEven ? 'even (two chars)' : 'odd (single char)',
        'left': left,
        'right': right
      },
      operations: { expansions },
      phase: 'New Center',
      insight: isEven ?
        `Check if characters at ${left} and ${right} match` :
        `Expand outward from center character '${str[left]}'`
    });

    while (left >= 0 && right < str.length && str[left] === str[right]) {
      expansions++;

      steps.push({
        string: str,
        center: isEven ? -1 : startLeft,
        left,
        right,
        longestStart,
        longestEnd,
        longestLength,
        expanding: true,
        match: true,
        description: `✓ Match! '${str[left]}' === '${str[right]}', expand outward`,
        variables: {
          'left char': str[left],
          'right char': str[right],
          'palindrome': str.substring(left, right + 1),
          'length': right - left + 1
        },
        operations: { expansions },
        phase: 'Expanding',
        insight: `Found palindrome "${str.substring(left, right + 1)}" of length ${right - left + 1}`
      });

      left--;
      right++;
    }

    // Revert to last valid palindrome
    left++;
    right--;

    if (left <= right) {
      const length = right - left + 1;

      if (length > longestLength) {
        longestLength = length;
        longestStart = left;
        longestEnd = right;

        steps.push({
          string: str,
          center: isEven ? -1 : startLeft,
          left,
          right,
          longestStart,
          longestEnd,
          longestLength,
          found: true,
          description: `✓ New longest! "${str.substring(left, right + 1)}" (length ${length})`,
          variables: {
            'palindrome': str.substring(left, right + 1),
            'length': length,
            'start': left,
            'end': right
          },
          operations: { expansions },
          phase: 'New Longest',
          insight: `Found longer palindrome: "${str.substring(left, right + 1)}"`
        });
      } else {
        steps.push({
          string: str,
          center: isEven ? -1 : startLeft,
          left,
          right,
          longestStart,
          longestEnd,
          longestLength,
          description: `Palindrome "${str.substring(left, right + 1)}" (length ${length}) not longer than current max`,
          variables: {
            'palindrome': str.substring(left, right + 1),
            'length': length,
            'current max': longestLength
          },
          operations: { expansions },
          phase: 'Not Longest',
          insight: `${length} ≤ ${longestLength}, current longest remains`
        });
      }
    }
  };

  // Try each possible center
  for (let i = 0; i < str.length; i++) {
    // Odd length palindromes (single character center)
    expandAroundCenter(i, i, false);

    // Even length palindromes (two character center)
    if (i < str.length - 1) {
      expandAroundCenter(i, i + 1, true);
    }
  }

  steps.push({
    string: str,
    center: -1,
    left: longestStart,
    right: longestEnd,
    longestStart,
    longestEnd,
    longestLength,
    found: true,
    description: `✓ Longest palindrome: "${str.substring(longestStart, longestEnd + 1)}"`,
    variables: {
      'result': str.substring(longestStart, longestEnd + 1),
      'length': longestLength,
      'start': longestStart,
      'end': longestEnd
    },
    operations: { expansions },
    phase: 'Complete',
    insight: `Found longest palindrome "${str.substring(longestStart, longestEnd + 1)}" with ${expansions} expansions. Time: O(n²), Space: O(1)`
  });

  return steps;
};

// Main Component
const AlgorithmVisualizer = ({ onStartVisualization, preselectedAlgorithm }) => {
  const [algorithm, setAlgorithm] = useState(preselectedAlgorithm || 'bubble');
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

  // Update algorithm when preselectedAlgorithm prop changes (from AI detector)
  useEffect(() => {
    if (preselectedAlgorithm) {
      setAlgorithm(preselectedAlgorithm);
    }
  }, [preselectedAlgorithm]);

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

  // ─── Detect Cycle (Floyd's) ───────────────────────────────────────────────
  const generateDetectCycleSteps = (arr, cycleAt) => {
    const steps = [];
    const hasCycle = cycleAt >= 0 && cycleAt < arr.length;
    steps.push({
      list: [...arr],
      slow: 0, fast: 0, cycleAt: hasCycle ? cycleAt : null,
      description: `Linked list: [${arr.join(' → ')}]${hasCycle ? ` with cycle back to index ${cycleAt}` : ' (no cycle)'}`,
      variables: { slow: 0, fast: 0 },
      operations: { steps: 0 },
      phase: 'Initialize',
      insight: 'Floyd\'s algorithm: slow moves 1 step, fast moves 2. If they meet → cycle exists.'
    });
    let slow = 0, fast = 0, stepCount = 0;
    const maxSteps = arr.length * 3 + 5;
    while (stepCount < maxSteps) {
      // advance slow 1 step
      const nextSlow = slow + 1;
      if (!hasCycle && nextSlow >= arr.length) break;
      const slowNext = hasCycle && nextSlow >= arr.length ? cycleAt : nextSlow;
      // advance fast 2 steps
      const f1 = fast + 1;
      const fast1 = hasCycle && f1 >= arr.length ? cycleAt : f1;
      const f2 = fast1 + 1;
      const fastNext = hasCycle && f2 >= arr.length ? cycleAt : f2;
      if (!hasCycle && (f1 >= arr.length || f2 >= arr.length)) break;
      slow = slowNext; fast = fastNext; stepCount++;
      const meeting = slow === fast;
      steps.push({
        list: [...arr], slow, fast, cycleAt: hasCycle ? cycleAt : null,
        description: meeting ? `✓ Slow and fast both at index ${slow} — cycle detected!` : `Slow at ${slow} (${arr[slow]}), fast at ${fast} (${arr[fast]})`,
        variables: { slow, fast, 'slow value': arr[slow], 'fast value': arr[fast] },
        operations: { steps: stepCount },
        phase: meeting ? 'Cycle Found!' : `Step ${stepCount}`,
        insight: meeting ? `Pointers met at index ${slow} — this confirms a cycle.` : `Fast gains on slow. If there\'s a cycle, they must eventually meet.`,
        found: meeting
      });
      if (meeting) return steps;
    }
    steps.push({
      list: [...arr], slow: null, fast: null, cycleAt: null,
      description: '✓ Fast pointer reached end — no cycle detected.',
      variables: {}, operations: { steps: stepCount },
      phase: 'No Cycle', found: true,
      insight: 'Fast pointer reached null. No cycle exists in this linked list.'
    });
    return steps;
  };

  // ─── Merge Two Sorted Lists ───────────────────────────────────────────────
  const generateMergeTwoListsSteps = (arr1, arr2) => {
    const steps = [];
    steps.push({
      list1: [...arr1], list2: [...arr2], merged: [],
      p1: 0, p2: 0,
      description: `Merge list1 [${arr1.join(' → ')}] and list2 [${arr2.join(' → ')}]`,
      variables: { p1: 0, p2: 0 },
      operations: { comparisons: 0 },
      phase: 'Initialize',
      insight: 'Two pointers, one per list. Always pick the smaller head value.'
    });
    const merged = [];
    let p1 = 0, p2 = 0, comps = 0;
    while (p1 < arr1.length && p2 < arr2.length) {
      comps++;
      const pick1 = arr1[p1] <= arr2[p2];
      steps.push({
        list1: [...arr1], list2: [...arr2], merged: [...merged],
        p1, p2, comparing1: pick1 ? p1 : null, comparing2: pick1 ? null : p2,
        description: `Compare ${arr1[p1]} vs ${arr2[p2]} → pick ${pick1 ? arr1[p1] : arr2[p2]} from list${pick1 ? '1' : '2'}`,
        variables: { 'list1[p1]': arr1[p1], 'list2[p2]': arr2[p2] },
        operations: { comparisons: comps },
        phase: 'Comparing',
        insight: `${pick1 ? arr1[p1] : arr2[p2]} is smaller — append to merged list.`
      });
      if (pick1) { merged.push(arr1[p1]); p1++; }
      else { merged.push(arr2[p2]); p2++; }
      steps.push({
        list1: [...arr1], list2: [...arr2], merged: [...merged],
        p1, p2,
        description: `Added to merged. Merged so far: [${merged.join(' → ')}]`,
        variables: { merged: merged.join(' → '), p1, p2 },
        operations: { comparisons: comps },
        phase: 'Appended',
        insight: `Merged list grows. Advance the pointer of the list we took from.`
      });
    }
    while (p1 < arr1.length) { merged.push(arr1[p1]); p1++; }
    while (p2 < arr2.length) { merged.push(arr2[p2]); p2++; }
    steps.push({
      list1: [...arr1], list2: [...arr2], merged: [...merged],
      p1: arr1.length, p2: arr2.length, found: true,
      description: `✓ Merged: [${merged.join(' → ')}]`,
      variables: { result: merged.join(' → ') },
      operations: { comparisons: comps },
      phase: 'Complete',
      insight: `One list exhausted — append remaining nodes from the other list. Done in O(m+n).`
    });
    return steps;
  };

  // ─── Longest Common Subsequence ───────────────────────────────────────────
  const generateLCSSteps = (text1, text2) => {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const steps = [];
    steps.push({
      text1, text2, dp: dp.map(r => [...r]), row: -1, col: -1,
      description: `Find LCS of "${text1}" and "${text2}". Build ${m+1}×${n+1} DP table.`,
      variables: { 'm (text1)': m, 'n (text2)': n },
      operations: { cells: 0 },
      phase: 'Initialize',
      insight: 'dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. Base case: row/col 0 = 0.'
    });
    let cells = 0;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        cells++;
        const match = text1[i - 1] === text2[j - 1];
        dp[i][j] = match ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
        steps.push({
          text1, text2, dp: dp.map(r => [...r]), row: i, col: j,
          match,
          description: match
            ? `"${text1[i-1]}" === "${text2[j-1]}" → dp[${i}][${j}] = dp[${i-1}][${j-1}]+1 = ${dp[i][j]}`
            : `"${text1[i-1]}" ≠ "${text2[j-1]}" → dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`,
          variables: { 'text1[i-1]': text1[i-1], 'text2[j-1]': text2[j-1], [`dp[${i}][${j}]`]: dp[i][j] },
          operations: { cells },
          phase: match ? 'Match!' : 'No Match',
          insight: match ? `Characters match — extend LCS by 1.` : `No match — take the best of skipping one character from either string.`
        });
      }
    }
    steps.push({
      text1, text2, dp: dp.map(r => [...r]), row: m, col: n, found: true,
      description: `✓ LCS length = ${dp[m][n]}`,
      variables: { 'LCS length': dp[m][n] },
      operations: { cells },
      phase: 'Complete',
      insight: `dp[${m}][${n}] = ${dp[m][n]} is the length of the longest common subsequence.`
    });
    return steps;
  };

  // ─── Group Anagrams ───────────────────────────────────────────────────────
  const generateGroupAnagramsSteps = (words) => {
    const steps = [];
    const map = {};
    steps.push({
      words, map: {}, currentIndex: -1,
      description: `Group anagrams from: [${words.join(', ')}]`,
      variables: { 'words count': words.length },
      operations: { processed: 0 },
      phase: 'Initialize',
      insight: 'Sort each word alphabetically to get its canonical key. Words with the same key are anagrams.'
    });
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const key = word.split('').sort().join('');
      if (!map[key]) map[key] = [];
      map[key].push(word);
      steps.push({
        words, map: JSON.parse(JSON.stringify(map)), currentIndex: i, currentKey: key,
        description: `"${word}" sorts to "${key}" → group ["${map[key].join('", "')}"]`,
        variables: { word, 'sorted key': key, 'group size': map[key].length },
        operations: { processed: i + 1 },
        phase: `Processing (${i + 1}/${words.length})`,
        insight: `All words that sort to "${key}" are anagrams of each other.`
      });
    }
    const groups = Object.values(map);
    steps.push({
      words, map: JSON.parse(JSON.stringify(map)), currentIndex: -1, found: true,
      description: `✓ ${groups.length} group(s): ${groups.map(g => '[' + g.join(', ') + ']').join(' | ')}`,
      variables: { groups: groups.length },
      operations: { processed: words.length },
      phase: 'Complete',
      insight: `Grouped ${words.length} words into ${groups.length} anagram groups. Time: O(n·k·log k).`
    });
    return steps;
  };

  // ─── Non-overlapping Intervals ────────────────────────────────────────────
  const generateNonOverlappingSteps = (intervals) => {
    const steps = [];
    const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
    steps.push({
      intervals: sorted, kept: [], removed: [], endTime: -Infinity, currentIndex: -1,
      description: `Sort ${intervals.length} intervals by end time: ${sorted.map(([a,b]) => `[${a},${b}]`).join(', ')}`,
      variables: { 'interval count': sorted.length, 'removed count': 0 },
      operations: { comparisons: 0 },
      phase: 'Sort',
      insight: 'Greedy: sort by end time. Keep intervals that end earliest — they leave the most room for others.'
    });
    const kept = [], removed = [];
    let endTime = -Infinity, comps = 0;
    for (let i = 0; i < sorted.length; i++) {
      const [start, end] = sorted[i];
      comps++;
      const overlaps = start < endTime;
      if (!overlaps) {
        kept.push(sorted[i]);
        endTime = end;
        steps.push({
          intervals: sorted, kept: [...kept], removed: [...removed],
          currentIndex: i, endTime,
          description: `[${start},${end}] starts at ${start} ≥ ${endTime === -Infinity ? '-∞' : endTime} → KEEP. New end = ${end}.`,
          variables: { start, end, 'prev end': endTime === end ? 'updated' : endTime, 'removed': removed.length },
          operations: { comparisons: comps },
          phase: 'Keep',
          insight: `No overlap — keep this interval. Update boundary to ${end}.`
        });
      } else {
        removed.push(sorted[i]);
        steps.push({
          intervals: sorted, kept: [...kept], removed: [...removed],
          currentIndex: i, endTime,
          description: `[${start},${end}] starts at ${start} < ${endTime} → REMOVE (overlaps).`,
          variables: { start, end, 'prev end': endTime, 'removed': removed.length },
          operations: { comparisons: comps },
          phase: 'Remove',
          insight: `Overlaps with previous boundary. Remove this one — the earlier-ending interval is already kept.`
        });
      }
    }
    steps.push({
      intervals: sorted, kept: [...kept], removed: [...removed],
      currentIndex: -1, endTime, found: true,
      description: `✓ Remove ${removed.length} interval(s): ${removed.map(([a,b]) => `[${a},${b}]`).join(', ') || 'none'}`,
      variables: { 'removed count': removed.length, 'kept count': kept.length },
      operations: { comparisons: comps },
      phase: 'Complete',
      insight: `Minimum removals = ${removed.length}. Time: O(n log n) for sort.`
    });
    return steps;
  };

  const generateInsertIntervalSteps = (intervals, toInsert) => {
    const steps = [];
    const result = [];
    let i = 0;
    const n = intervals.length;
    const [newStart, newEnd] = toInsert;
    steps.push({
      intervals, toInsert, result: [], currentIndex: -1, phase: 'Start',
      description: `Insert [${newStart},${newEnd}] into ${n} non-overlapping sorted intervals.`,
      variables: { 'to insert': `[${newStart},${newEnd}]`, 'total intervals': n },
      operations: { comparisons: 0 },
      insight: 'Three phases: add non-overlapping left intervals, merge overlapping ones, add remaining right intervals.'
    });
    // Phase 1: add all intervals that come before new interval
    while (i < n && intervals[i][1] < newStart) {
      result.push(intervals[i]);
      steps.push({
        intervals, toInsert, result: [...result], currentIndex: i, phase: 'Skip Left',
        description: `[${intervals[i][0]},${intervals[i][1]}] ends before ${newStart} → add to result as-is.`,
        variables: { 'interval end': intervals[i][1], 'new start': newStart },
        operations: { comparisons: i + 1 },
        insight: `Interval ends at ${intervals[i][1]} < ${newStart}. No overlap — keep it.`
      });
      i++;
    }
    // Phase 2: merge all overlapping intervals
    let mergedStart = newStart, mergedEnd = newEnd;
    while (i < n && intervals[i][0] <= mergedEnd) {
      mergedStart = Math.min(mergedStart, intervals[i][0]);
      mergedEnd = Math.max(mergedEnd, intervals[i][1]);
      steps.push({
        intervals, toInsert, result: [...result], currentIndex: i, phase: 'Merge',
        mergedSoFar: [mergedStart, mergedEnd],
        description: `[${intervals[i][0]},${intervals[i][1]}] overlaps → merge into [${mergedStart},${mergedEnd}].`,
        variables: { 'merged start': mergedStart, 'merged end': mergedEnd },
        operations: { comparisons: i + 1 },
        insight: `Overlap detected! Expand merged interval to encompass both.`
      });
      i++;
    }
    result.push([mergedStart, mergedEnd]);
    steps.push({
      intervals, toInsert, result: [...result], currentIndex: i, phase: 'Add Merged',
      mergedSoFar: [mergedStart, mergedEnd],
      description: `Add merged interval [${mergedStart},${mergedEnd}] to result.`,
      variables: { 'merged': `[${mergedStart},${mergedEnd}]` },
      operations: { comparisons: i },
      insight: 'All overlapping intervals merged into one.'
    });
    // Phase 3: add remaining
    while (i < n) {
      result.push(intervals[i]);
      steps.push({
        intervals, toInsert, result: [...result], currentIndex: i, phase: 'Add Right',
        description: `[${intervals[i][0]},${intervals[i][1]}] starts after merged end → add as-is.`,
        variables: { 'interval start': intervals[i][0], 'merged end': mergedEnd },
        operations: { comparisons: i + 1 },
        insight: `No overlap with merged interval — append directly.`
      });
      i++;
    }
    steps.push({
      intervals, toInsert, result: [...result], currentIndex: -1, phase: 'Complete', found: true,
      description: `✓ Result: ${result.map(([a, b]) => `[${a},${b}]`).join(', ')}`,
      variables: { 'output count': result.length },
      operations: { comparisons: n },
      insight: `Inserted [${newStart},${newEnd}]. Time: O(n).`
    });
    return steps;
  };

  const generatePalindromicSubstringsSteps = (str) => {
    const steps = [];
    let count = 0;
    const found = [];
    steps.push({
      string: str, center: -1, left: -1, right: -1, count: 0, allPalindromes: [],
      description: `Count palindromic substrings in "${str}" by expanding around each center.`,
      variables: { 'string length': str.length, 'count': 0 },
      operations: { comparisons: 0 },
      insight: 'For each center (n odd centers + n-1 even centers), expand outward while chars match.'
    });
    let comps = 0;
    for (let c = 0; c < 2 * str.length - 1; c++) {
      let left = Math.floor(c / 2);
      let right = left + (c % 2);
      const centerDesc = c % 2 === 0 ? `char '${str[left]}'` : `between '${str[left]}' and '${str[right]}'`;
      while (left >= 0 && right < str.length && str[left] === str[right]) {
        comps++;
        count++;
        found.push(str.slice(left, right + 1));
        steps.push({
          string: str, center: c, left, right, count, allPalindromes: [...found],
          description: `"${str.slice(left, right + 1)}" is palindrome (center ${centerDesc}). Count = ${count}.`,
          variables: { left, right, 'substring': str.slice(left, right + 1), count },
          operations: { comparisons: comps },
          phase: 'Expand',
          insight: `str[${left}]='${str[left]}' === str[${right}]='${str[right]}' → valid palindrome!`
        });
        left--;
        right++;
      }
      if (left !== Math.floor(c / 2) - 1) {
        comps++;
        steps.push({
          string: str, center: c, left: left + 1, right: right - 1, count, allPalindromes: [...found],
          description: left < 0 || right >= str.length
            ? `Expansion stopped (boundary reached).`
            : `str[${left}]='${str[left]}' ≠ str[${right}]='${str[right]}' → stop expanding.`,
          variables: { left: left + 1, right: right - 1, count },
          operations: { comparisons: comps },
          phase: 'Stop',
          insight: 'Mismatch or boundary — move to next center.'
        });
      }
    }
    steps.push({
      string: str, center: -1, left: -1, right: -1, count, allPalindromes: found, found: true,
      description: `✓ Total palindromic substrings: ${count}`,
      variables: { count, 'all found': found.join(', ') },
      operations: { comparisons: comps },
      phase: 'Complete',
      insight: `Time: O(n²). Each expansion is O(n), done for O(n) centers.`
    });
    return steps;
  };

  const generateHouseRobber2Steps = (houses) => {
    const steps = [];
    const n = houses.length;
    if (n === 0) return steps;
    if (n === 1) {
      steps.push({ houses, dp1: [houses[0]], dp2: [houses[0]], currentPass: 1, currentIndex: 0, result: houses[0],
        description: `Only one house. Rob it: ${houses[0]}`, variables: { result: houses[0] }, operations: { comparisons: 0 }, phase: 'Complete', found: true, insight: 'Single house — just take it.' });
      return steps;
    }
    steps.push({
      houses, dp1: [], dp2: [], currentPass: 0, currentIndex: -1, result: null,
      description: `Houses arranged in circle. Run House Robber twice: [0..${n-2}] and [1..${n-1}].`,
      variables: { 'house count': n, strategy: 'two passes' },
      operations: { comparisons: 0 },
      phase: 'Start',
      insight: 'Since houses form a circle, first and last are adjacent. Run DP twice excluding one end each time.'
    });
    // Pass 1: houses[0..n-2]
    const dp1 = new Array(n - 1).fill(0);
    const slice1 = houses.slice(0, n - 1);
    dp1[0] = slice1[0];
    steps.push({
      houses, dp1: [...dp1], dp2: [], currentPass: 1, currentIndex: 0, result: null,
      description: `Pass 1: house 0 only → dp[0] = ${slice1[0]}`,
      variables: { 'dp[0]': slice1[0], 'pass': '1 (skip last house)' },
      operations: { comparisons: 0 },
      phase: 'Pass 1',
      insight: 'Start DP on houses 0 to n-2.'
    });
    if (slice1.length > 1) dp1[1] = Math.max(slice1[0], slice1[1]);
    for (let i = 1; i < slice1.length; i++) {
      if (i === 1) dp1[1] = Math.max(slice1[0], slice1[1]);
      else dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + slice1[i]);
      steps.push({
        houses, dp1: [...dp1], dp2: [], currentPass: 1, currentIndex: i, result: null,
        description: `Pass 1, house ${i}: max(rob=${i >= 2 ? dp1[i-2] + '+'+ slice1[i] : slice1[i]}, skip=${dp1[i-1]}) = ${dp1[i]}`,
        variables: { [`dp[${i}]`]: dp1[i], 'rob this': i >= 2 ? dp1[i - 2] + slice1[i] : slice1[i], 'skip this': dp1[i - 1] },
        operations: { comparisons: i + 1 },
        phase: 'Pass 1',
        insight: `Best rob up to house ${i} = ${dp1[i]}`
      });
    }
    // Pass 2: houses[1..n-1]
    const slice2 = houses.slice(1);
    const dp2 = new Array(n - 1).fill(0);
    dp2[0] = slice2[0];
    steps.push({
      houses, dp1: [...dp1], dp2: [...dp2], currentPass: 2, currentIndex: 1, result: null,
      description: `Pass 2: house 1 only → dp[0] = ${slice2[0]}`,
      variables: { 'dp[0]': slice2[0], 'pass': '2 (skip first house)' },
      operations: { comparisons: slice1.length },
      phase: 'Pass 2',
      insight: 'Now run DP on houses 1 to n-1 (skipping house 0).'
    });
    for (let i = 1; i < slice2.length; i++) {
      if (i === 1) dp2[1] = Math.max(slice2[0], slice2[1]);
      else dp2[i] = Math.max(dp2[i - 1], dp2[i - 2] + slice2[i]);
      steps.push({
        houses, dp1: [...dp1], dp2: [...dp2], currentPass: 2, currentIndex: i + 1, result: null,
        description: `Pass 2, house ${i+1}: max(rob, skip) = ${dp2[i]}`,
        variables: { [`dp[${i}]`]: dp2[i] },
        operations: { comparisons: slice1.length + i + 1 },
        phase: 'Pass 2',
        insight: `Best rob up to house ${i+1} = ${dp2[i]}`
      });
    }
    const res = Math.max(dp1[dp1.length - 1], dp2[dp2.length - 1]);
    steps.push({
      houses, dp1, dp2, currentPass: 3, currentIndex: -1, result: res, found: true,
      description: `✓ max(Pass1=${dp1[dp1.length-1]}, Pass2=${dp2[dp2.length-1]}) = ${res}`,
      variables: { 'pass 1 result': dp1[dp1.length - 1], 'pass 2 result': dp2[dp2.length - 1], 'answer': res },
      operations: { comparisons: slice1.length + slice2.length },
      phase: 'Complete',
      insight: `Answer: ${res}. Time: O(n), Space: O(n).`
    });
    return steps;
  };

  const generateLongRepeatingSteps = (str, k) => {
    const steps = [];
    let left = 0, maxCount = 0, result = 0;
    const counts = {};
    steps.push({
      string: str, left: 0, right: -1, maxCount: 0, charCounts: {}, result: 0,
      description: `Find longest substring with at most ${k} replacements in "${str}".`,
      variables: { k, 'string length': str.length },
      operations: { comparisons: 0 },
      phase: 'Start',
      insight: 'Sliding window: window size - max char freq ≤ k means we can make it uniform with ≤ k replacements.'
    });
    for (let right = 0; right < str.length; right++) {
      const ch = str[right];
      counts[ch] = (counts[ch] || 0) + 1;
      maxCount = Math.max(maxCount, counts[ch]);
      const windowSize = right - left + 1;
      if (windowSize - maxCount > k) {
        counts[str[left]]--;
        left++;
      }
      result = Math.max(result, right - left + 1);
      steps.push({
        string: str, left, right, maxCount, charCounts: { ...counts }, result,
        description: `Window "${str.slice(left, right + 1)}" (size ${right-left+1}): max freq=${maxCount}, replacements needed=${right-left+1-maxCount}`,
        variables: { left, right, 'window': str.slice(left, right + 1), maxCount, k, result },
        operations: { comparisons: right + 1 },
        phase: windowSize - maxCount > k ? 'Shrink' : 'Expand',
        insight: windowSize - maxCount <= k
          ? `${right-left+1} - ${maxCount} = ${right-left+1-maxCount} ≤ ${k} → valid window!`
          : `Window too big: ${windowSize - maxCount} > ${k}. Shrink left.`
      });
    }
    steps.push({
      string: str, left, right: str.length - 1, maxCount, charCounts: counts, result, found: true,
      description: `✓ Longest valid window length: ${result}`,
      variables: { 'answer': result, k },
      operations: { comparisons: str.length },
      phase: 'Complete',
      insight: `Time: O(n). Sliding window with character frequency tracking.`
    });
    return steps;
  };

  const generateMeetingRoomsSteps = (intervals) => {
    const steps = [];
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    steps.push({
      intervals: sorted, sorted: true, currentIndex: -1, hasConflict: false, conflictPair: null,
      description: `Sort ${intervals.length} meetings by start time to detect overlaps.`,
      variables: { 'meeting count': intervals.length },
      operations: { comparisons: 0 },
      phase: 'Sort',
      insight: 'Sort by start. If any meeting starts before the previous one ends → conflict.'
    });
    let hasConflict = false;
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1], curr = sorted[i];
      const overlaps = curr[0] < prev[1];
      if (overlaps) hasConflict = true;
      steps.push({
        intervals: sorted, sorted: true, currentIndex: i, hasConflict,
        conflictPair: overlaps ? [i - 1, i] : null,
        description: overlaps
          ? `CONFLICT: meeting ${i} starts at ${curr[0]} < ${prev[1]} (prev ends). Cannot attend all!`
          : `OK: meeting ${i} starts at ${curr[0]} ≥ ${prev[1]}. No overlap.`,
        variables: { 'prev end': prev[1], 'curr start': curr[0] },
        operations: { comparisons: i },
        phase: overlaps ? 'Conflict' : 'OK',
        insight: overlaps
          ? `[${prev[0]},${prev[1]}] and [${curr[0]},${curr[1]}] overlap!`
          : `Meetings don't overlap — can attend both.`
      });
      if (overlaps) break;
    }
    steps.push({
      intervals: sorted, sorted: true, currentIndex: -1, hasConflict, found: true,
      description: hasConflict
        ? `✗ Cannot attend all meetings (conflicts found).`
        : `✓ Can attend all meetings! No conflicts.`,
      variables: { result: hasConflict ? 'false' : 'true' },
      operations: { comparisons: sorted.length },
      phase: 'Complete',
      insight: `Answer: ${hasConflict ? 'false' : 'true'}. Time: O(n log n).`
    });
    return steps;
  };

  const generateMeetingRooms2Steps = (intervals) => {
    const steps = [];
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    steps.push({
      intervals: sorted, roomCount: 0, ends: [], currentIndex: -1, maxRooms: 0,
      description: `Find minimum meeting rooms needed for ${intervals.length} meetings.`,
      variables: { 'meeting count': intervals.length },
      operations: { comparisons: 0 },
      phase: 'Start',
      insight: 'Sort by start. Track end times in a min-heap: if earliest end ≤ current start, reuse that room.'
    });
    const ends = [];
    let maxRooms = 0;
    for (let i = 0; i < sorted.length; i++) {
      const [start, end] = sorted[i];
      // Simple min-heap simulation: find earliest end
      if (ends.length > 0 && ends[0] <= start) {
        // Reuse room: remove earliest end
        ends.shift();
        ends.push(end);
        ends.sort((a, b) => a - b);
        steps.push({
          intervals: sorted, roomCount: ends.length, ends: [...ends], currentIndex: i, maxRooms,
          description: `Meeting [${start},${end}]: reuse room (prev ended at ${ends[0] || '?'} ≤ ${start}).`,
          variables: { start, end, 'rooms in use': ends.length },
          operations: { comparisons: i + 1 },
          phase: 'Reuse',
          insight: `Room freed up! Reuse it for [${start},${end}].`
        });
      } else {
        ends.push(end);
        ends.sort((a, b) => a - b);
        maxRooms = Math.max(maxRooms, ends.length);
        steps.push({
          intervals: sorted, roomCount: ends.length, ends: [...ends], currentIndex: i, maxRooms,
          description: `Meeting [${start},${end}]: need new room (${ends.length} rooms now active).`,
          variables: { start, end, 'rooms in use': ends.length },
          operations: { comparisons: i + 1 },
          phase: 'New Room',
          insight: `No room free. Open a new room. Total: ${ends.length}.`
        });
      }
    }
    steps.push({
      intervals: sorted, roomCount: ends.length, ends: [...ends], currentIndex: -1, maxRooms, found: true,
      description: `✓ Minimum rooms needed: ${maxRooms}`,
      variables: { 'answer': maxRooms },
      operations: { comparisons: sorted.length },
      phase: 'Complete',
      insight: `${maxRooms} meeting rooms required. Time: O(n log n).`
    });
    return steps;
  };

  const generateRemoveNthSteps = (arr, n) => {
    const steps = [];
    if (arr.length === 0) return steps;
    steps.push({
      list: arr, fast: 0, slow: -1, gap: 0, phase: 'Start',
      description: `Remove ${n}th node from end of linked list [${arr.join(' → ')}].`,
      variables: { n, 'list length': arr.length },
      operations: { comparisons: 0 },
      insight: 'Two pointers: advance fast n+1 steps, then move both until fast reaches end. Slow points to node before target.'
    });
    // Advance fast n+1 steps (using dummy head concept)
    let fast = 0, slow = -1; // slow=-1 means dummy head
    for (let i = 0; i <= n; i++) {
      if (fast < arr.length) {
        steps.push({
          list: arr, fast, slow, gap: i, phase: 'Advance Fast',
          description: `Advance fast to index ${fast}: value=${arr[fast]}. Gap = ${i}/${n+1}.`,
          variables: { fast, slow: slow === -1 ? 'dummy' : slow, gap: i },
          operations: { comparisons: i },
          insight: `Need gap of n+1=${n+1} between slow (dummy) and fast.`
        });
        fast++;
      }
    }
    // Move both
    while (fast < arr.length) {
      slow++;
      steps.push({
        list: arr, fast, slow, gap: n + 1, phase: 'Move Both',
        description: `Move both: fast=${fast} (val=${arr[fast]}), slow=${slow} (val=${arr[slow]}).`,
        variables: { fast, slow, 'fast value': arr[fast], 'slow value': arr[slow] },
        operations: { comparisons: fast + 1 },
        insight: `Maintaining gap of ${n+1}.`
      });
      fast++;
    }
    slow++;
    const target = slow;
    const newList = arr.filter((_, idx) => idx !== target);
    steps.push({
      list: arr, fast: arr.length, slow: target, gap: n + 1, phase: 'Remove', targetIndex: target,
      description: `Remove node at index ${target} (value=${arr[target]}). slow points here.`,
      variables: { 'remove index': target, 'remove value': arr[target] },
      operations: { comparisons: arr.length },
      insight: `slow.next is the ${n}th from end.`
    });
    steps.push({
      list: newList, fast: -1, slow: -1, gap: n + 1, phase: 'Complete', found: true,
      description: `✓ Result: [${newList.join(' → ')}]`,
      variables: { 'removed': arr[target], 'new length': newList.length },
      operations: { comparisons: arr.length },
      insight: `Time: O(n) single pass. Two-pointer gap technique.`
    });
    return steps;
  };

  const generateReorderListSteps = (arr) => {
    const steps = [];
    const n = arr.length;
    steps.push({
      list: arr, phase: 'Start', left: 0, right: n - 1,
      description: `Reorder [${arr.join('→')}] to: first, last, second, second-last, ...`,
      variables: { 'list length': n },
      operations: { comparisons: 0 },
      insight: 'Strategy: find middle, reverse second half, merge two halves alternately.'
    });
    // Find middle
    let slow = 0, fast = 0;
    while (fast < n - 1 && fast + 1 < n - 1) {
      slow++;
      fast += 2;
    }
    const mid = slow;
    steps.push({
      list: arr, phase: 'Find Middle', left: mid, right: n - 1,
      description: `Middle at index ${mid} (value=${arr[mid]}). First half: [0..${mid}], Second half: [${mid+1}..${n-1}].`,
      variables: { 'mid index': mid, 'mid value': arr[mid] },
      operations: { comparisons: mid },
      insight: `Split list at midpoint.`
    });
    // Reverse second half
    const secondHalf = arr.slice(mid + 1).reverse();
    steps.push({
      list: arr, phase: 'Reverse Second Half', left: 0, right: mid,
      secondHalf,
      description: `Reversed second half: [${secondHalf.join('→')}].`,
      variables: { 'second half': secondHalf.join(', ') },
      operations: { comparisons: mid + secondHalf.length },
      insight: `Reversing [${arr.slice(mid+1).join('→')}] → [${secondHalf.join('→')}].`
    });
    // Merge
    const firstHalf = arr.slice(0, mid + 1);
    const result = [];
    let l = 0, r = 0;
    while (l < firstHalf.length || r < secondHalf.length) {
      if (l < firstHalf.length) {
        result.push(firstHalf[l]);
        steps.push({
          list: arr, phase: 'Merge', left: l, right: r, result: [...result], secondHalf,
          description: `Take from first half: ${firstHalf[l]}. Result: [${result.join('→')}]`,
          variables: { 'from first': firstHalf[l], 'result length': result.length },
          operations: { comparisons: mid + secondHalf.length + result.length },
          insight: `Alternating: pick from first half.`
        });
        l++;
      }
      if (r < secondHalf.length) {
        result.push(secondHalf[r]);
        steps.push({
          list: arr, phase: 'Merge', left: l, right: r, result: [...result], secondHalf,
          description: `Take from second half: ${secondHalf[r]}. Result: [${result.join('→')}]`,
          variables: { 'from second': secondHalf[r], 'result length': result.length },
          operations: { comparisons: mid + secondHalf.length + result.length },
          insight: `Alternating: pick from second half (reversed).`
        });
        r++;
      }
    }
    steps.push({
      list: result, phase: 'Complete', left: 0, right: result.length - 1, found: true,
      description: `✓ Reordered: [${result.join('→')}]`,
      variables: { 'result': result.join('→') },
      operations: { comparisons: n },
      insight: `Time: O(n). Three steps: find middle, reverse, merge.`
    });
    return steps;
  };

  const generateCombinationSum4Steps = (nums, target) => {
    const steps = [];
    const dp = new Array(target + 1).fill(0);
    dp[0] = 1;
    steps.push({
      dpArray: [...dp], targetAmt: target, nums, currentTarget: 0, currentNum: -1,
      description: `Count combinations summing to ${target} using nums [${nums.join(', ')}].`,
      variables: { target, 'dp[0]': 1, 'nums': nums.join(', ') },
      operations: { comparisons: 0 },
      phase: 'Init',
      insight: 'dp[i] = number of ways to reach sum i. dp[0]=1 (empty combination). Order matters!'
    });
    for (let t = 1; t <= target; t++) {
      for (const num of nums) {
        if (t >= num) {
          dp[t] += dp[t - num];
          steps.push({
            dpArray: [...dp], targetAmt: target, nums, currentTarget: t, currentNum: num,
            description: `dp[${t}] += dp[${t}-${num}=dp[${t-num}]=${dp[t-num]}] → dp[${t}]=${dp[t]}`,
            variables: { [`dp[${t}]`]: dp[t], [`dp[${t-num}]`]: dp[t - num], num },
            operations: { comparisons: t * nums.length },
            phase: 'Fill',
            insight: `If we use ${num} last, remaining sum is ${t-num} with dp[${t-num}]=${dp[t-num]} ways.`
          });
        }
      }
    }
    steps.push({
      dpArray: [...dp], targetAmt: target, nums, currentTarget: target, currentNum: -1, found: true,
      description: `✓ Combinations summing to ${target}: ${dp[target]}`,
      variables: { 'answer': dp[target] },
      operations: { comparisons: target * nums.length },
      phase: 'Complete',
      insight: `dp[${target}]=${dp[target]}. Time: O(target × n).`
    });
    return steps;
  };

  const generateLongestConsecutiveSteps = (nums) => {
    const steps = [];
    const hashSet = new Set(nums);
    steps.push({
      array: nums, hashSet: [...hashSet], currentNum: null, streak: 0, best: 0,
      description: `Find longest consecutive sequence in [${nums.join(', ')}].`,
      variables: { 'nums count': nums.length, 'set size': hashSet.size },
      operations: { comparisons: 0 },
      phase: 'Build Set',
      insight: 'Build a hash set. For each num, only start counting if num-1 is NOT in set (start of sequence).'
    });
    let best = 0;
    for (const num of nums) {
      if (!hashSet.has(num - 1)) {
        let cur = num, streak = 0;
        steps.push({
          array: nums, hashSet: [...hashSet], currentNum: num, streak: 0, best,
          description: `${num}-1=${num-1} not in set → START sequence from ${num}.`,
          variables: { 'start': num, best },
          operations: { comparisons: 1 },
          phase: 'New Sequence',
          insight: `${num} is the beginning of a consecutive sequence.`
        });
        while (hashSet.has(cur)) {
          streak++;
          steps.push({
            array: nums, hashSet: [...hashSet], currentNum: cur, streak, best,
            description: `${cur} in set → streak = ${streak}. Check ${cur+1}...`,
            variables: { current: cur, streak, best },
            operations: { comparisons: streak + 1 },
            phase: 'Count',
            insight: `Found ${cur} in set. Streak grows to ${streak}.`
          });
          cur++;
        }
        best = Math.max(best, streak);
        steps.push({
          array: nums, hashSet: [...hashSet], currentNum: cur - 1, streak, best,
          description: `${cur} not in set → sequence ends. Best = max(${best}, ${streak}) = ${best}.`,
          variables: { streak, best },
          operations: { comparisons: streak + 2 },
          phase: 'Update Best',
          insight: `Sequence [${num}..${cur-1}] has length ${streak}. Update best.`
        });
      } else {
        steps.push({
          array: nums, hashSet: [...hashSet], currentNum: num, streak: 0, best,
          description: `${num}-1=${num-1} IS in set → skip (not a sequence start).`,
          variables: { num, 'num-1': num - 1, best },
          operations: { comparisons: 1 },
          phase: 'Skip',
          insight: `${num} is in the middle of a sequence — don't count from here.`
        });
      }
    }
    steps.push({
      array: nums, hashSet: [...hashSet], currentNum: null, streak: 0, best, found: true,
      description: `✓ Longest consecutive sequence: ${best}`,
      variables: { answer: best },
      operations: { comparisons: nums.length },
      phase: 'Complete',
      insight: `Time: O(n). Each number is only visited once per sequence.`
    });
    return steps;
  };

  const generateMergeKListsSteps = (listArrays) => {
    const steps = [];
    // Flatten to sorted pairs for visualization
    const lists = listArrays.map((arr, i) => ({ arr: [...arr], ptr: 0, id: i }));
    const merged = [];
    steps.push({
      lists: lists.map(l => ({ ...l })), merged: [], currentStep: 'init',
      description: `Merge ${lists.length} sorted lists using min-heap approach.`,
      variables: { 'list count': lists.length, 'total nodes': lists.reduce((s, l) => s + l.arr.length, 0) },
      operations: { comparisons: 0 },
      phase: 'Start',
      insight: 'Maintain a min-heap of list heads. Repeatedly extract minimum, add to result, push next node of that list.'
    });
    let comps = 0;
    // Simulate: always pick minimum from current heads
    while (true) {
      const active = lists.filter(l => l.ptr < l.arr.length);
      if (active.length === 0) break;
      // Find min
      let minVal = Infinity, minList = null;
      for (const l of active) {
        comps++;
        if (l.arr[l.ptr] < minVal) {
          minVal = l.arr[l.ptr];
          minList = l;
        }
      }
      steps.push({
        lists: lists.map(l => ({ ...l })), merged: [...merged], currentStep: `pick-${minVal}`,
        description: `Heads: [${active.map(l => l.arr[l.ptr]).join(', ')}]. Min = ${minVal} from list ${minList.id}.`,
        variables: { 'min value': minVal, 'from list': minList.id, 'merged so far': merged.join(', ') },
        operations: { comparisons: comps },
        phase: 'Pick Min',
        insight: `Extract ${minVal} from list ${minList.id} into merged result.`
      });
      merged.push(minVal);
      minList.ptr++;
      steps.push({
        lists: lists.map(l => ({ ...l })), merged: [...merged], currentStep: `add-${minVal}`,
        description: `Added ${minVal} to merged. Advance pointer in list ${minList.id}.`,
        variables: { 'merged': merged.join(' → '), 'merged length': merged.length },
        operations: { comparisons: comps },
        phase: 'Add',
        insight: `Merged: [${merged.join(' → ')}]`
      });
    }
    steps.push({
      lists: lists.map(l => ({ ...l })), merged: [...merged], currentStep: 'complete', found: true,
      description: `✓ Merged: [${merged.join(' → ')}]`,
      variables: { 'answer': merged.join(' → '), 'total': merged.length },
      operations: { comparisons: comps },
      phase: 'Complete',
      insight: `Time: O(N log k) where N=total nodes, k=list count.`
    });
    return steps;
  };

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
    } else if (algorithm === 'containsduplicate') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateContainsDuplicateSteps(arr);
    } else if (algorithm === 'besttimestock') {
      const prices = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateBestTimeStockSteps(prices);
    } else if (algorithm === 'validanagram') {
      // Parse two strings separated by comma or use input and targetNode
      const strings = input.includes(',') ? input.split(',').map(s => s.trim()) : [input.trim(), targetNode.trim()];
      newSteps = generateValidAnagramSteps(strings[0] || '', strings[1] || '');
    } else if (algorithm === 'validpalindrome') {
      const str = input.trim();
      newSteps = generateValidPalindromeSteps(str);
    } else if (algorithm === 'containermostwater') {
      const heights = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateContainerMostWaterSteps(heights);
    } else if (algorithm === 'threesum') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateThreeSumSteps(nums);
    } else if (algorithm === 'houserobber') {
      const houses = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateHouseRobberSteps(houses);
    } else if (algorithm === 'longestincreasing') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateLongestIncreasingSubsequenceSteps(nums);
    } else if (algorithm === 'uniquepaths') {
      // Parse m,n from input like "3,7"
      const dims = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const m = dims[0] || 3;
      const n = dims[1] || 7;
      newSteps = generateUniquePathsSteps(m, n);
    } else if (algorithm === 'jumpgame') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateJumpGameSteps(nums);
    } else if (algorithm === 'decodeways') {
      const str = input.trim();
      newSteps = generateDecodeWaysSteps(str);
    } else if (algorithm === 'wordbreak') {
      // Parse string and dictionary like "leetcode|leet,code"
      const parts = input.split('|');
      const str = parts[0]?.trim() || '';
      const dict = parts[1]?.split(',').map(s => s.trim()) || [];
      newSteps = generateWordBreakSteps(str, dict);
    } else if (algorithm === 'maxproductsubarray') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateMaxProductSubarraySteps(nums);
    } else if (algorithm === 'findminrotated') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateFindMinRotatedSteps(nums);
    } else if (algorithm === 'missingnumber') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateMissingNumberSteps(nums);
    } else if (algorithm === 'reverselist') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateReverseListSteps(arr);
    } else if (algorithm === 'topkfrequent') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const k = parseInt(targetNode) || 2;
      newSteps = generateTopKFrequentSteps(nums, k);
    } else if (algorithm === 'longestpalindrome') {
      const str = input.trim();
      newSteps = generateLongestPalindromeSteps(str);
    } else if (algorithm === 'detectcycle') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const cycleAt = parseInt(targetNode);
      newSteps = generateDetectCycleSteps(arr, isNaN(cycleAt) ? -1 : cycleAt);
    } else if (algorithm === 'mergetwolists') {
      const parts = input.split('|');
      const arr1 = (parts[0] || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const arr2 = (parts[1] || '').split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateMergeTwoListsSteps(arr1, arr2);
    } else if (algorithm === 'lcs') {
      const parts = input.split('|');
      const text1 = (parts[0] || 'abcde').trim();
      const text2 = (parts[1] || 'ace').trim();
      newSteps = generateLCSSteps(text1, text2);
    } else if (algorithm === 'groupanagrams') {
      const words = input.split(',').map(s => s.trim()).filter(Boolean);
      newSteps = generateGroupAnagramsSteps(words);
    } else if (algorithm === 'nonoverlapping') {
      const intervals = input.split(',').map(s => {
        const parts = s.trim().split('-');
        return [parseInt(parts[0]), parseInt(parts[1])];
      }).filter(iv => !isNaN(iv[0]) && !isNaN(iv[1]));
      newSteps = generateNonOverlappingSteps(intervals);
    } else if (algorithm === 'insertinterval') {
      const parts = input.split('|');
      const intervals = (parts[0] || '').split(',').map(s => {
        const p = s.trim().split('-');
        return [parseInt(p[0]), parseInt(p[1])];
      }).filter(iv => !isNaN(iv[0]) && !isNaN(iv[1]));
      const ins = (parts[1] || '').trim().split('-');
      const toInsert = [parseInt(ins[0]) || 0, parseInt(ins[1]) || 0];
      newSteps = generateInsertIntervalSteps(intervals, toInsert);
    } else if (algorithm === 'palindromicsubstrings') {
      const str = input.trim();
      newSteps = generatePalindromicSubstringsSteps(str);
    } else if (algorithm === 'houserobber2') {
      const houses = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateHouseRobber2Steps(houses);
    } else if (algorithm === 'longrepeating') {
      const str = input.trim();
      const k = parseInt(targetNode) || 2;
      newSteps = generateLongRepeatingSteps(str, k);
    } else if (algorithm === 'meetingrooms') {
      const intervals = input.split(',').map(s => {
        const p = s.trim().split('-');
        return [parseInt(p[0]), parseInt(p[1])];
      }).filter(iv => !isNaN(iv[0]) && !isNaN(iv[1]));
      newSteps = generateMeetingRoomsSteps(intervals);
    } else if (algorithm === 'meetingroomsii') {
      const intervals = input.split(',').map(s => {
        const p = s.trim().split('-');
        return [parseInt(p[0]), parseInt(p[1])];
      }).filter(iv => !isNaN(iv[0]) && !isNaN(iv[1]));
      newSteps = generateMeetingRooms2Steps(intervals);
    } else if (algorithm === 'removenth') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const nth = parseInt(targetNode) || 1;
      newSteps = generateRemoveNthSteps(arr, nth);
    } else if (algorithm === 'reorderlist') {
      const arr = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateReorderListSteps(arr);
    } else if (algorithm === 'combinationsumiv') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const target = parseInt(targetNode) || 4;
      newSteps = generateCombinationSum4Steps(nums, target);
    } else if (algorithm === 'longestconsecutive') {
      const nums = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      newSteps = generateLongestConsecutiveSteps(nums);
    } else if (algorithm === 'mergeklists') {
      // Parse pipe-separated lists: "1,4,5|1,3,4|2,6"
      const parts = input.split('|');
      const listArrays = parts.map(p => p.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)));
      newSteps = generateMergeKListsSteps(listArrays);
    }

    // If onStartVisualization prop is provided, navigate to new visualizer
    if (onStartVisualization && newSteps.length > 0) {
      // Prepare input data to display
      let inputData = {};

      if (['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap', 'bst-insert', 'maxsubarray', 'productexceptself', 'containsduplicate', 'besttimestock', 'containermostwater', 'threesum', 'houserobber', 'longestincreasing', 'jumpgame', 'maxproductsubarray', 'findminrotated', 'missingnumber', 'reverselist'].includes(algorithm)) {
        inputData = { type: 'array', value: input };
      } else if (['binary', 'linear', 'bst-search', 'twosum', 'topkfrequent'].includes(algorithm)) {
        inputData = { type: 'array-search', array: input, target: targetNode };
      } else if (['bfs', 'dfs', 'dijkstra'].includes(algorithm)) {
        inputData = { type: 'graph', edges: graphInput, startNode };
      } else if (['recursion', 'fibonacci', 'fibonacci-dp', 'tower-hanoi'].includes(algorithm)) {
        inputData = { type: 'number', value: startNode };
      } else if (['validparentheses', 'longestsubstring', 'validpalindrome', 'decodeways', 'longestpalindrome'].includes(algorithm)) {
        inputData = { type: 'string', value: input };
      } else if (algorithm === 'coinchange') {
        inputData = { type: 'array-target', array: input, target: targetNode, label: 'Coins / Amount' };
      } else if (algorithm === 'validanagram') {
        inputData = { type: 'two-strings', value: input, target: targetNode };
      } else if (['mergeintervals', 'nonoverlapping', 'meetingrooms', 'meetingroomsii'].includes(algorithm)) {
        inputData = { type: 'intervals', value: input };
      } else if (algorithm === 'uniquepaths') {
        inputData = { type: 'grid-dimensions', value: input };
      } else if (['wordbreak', 'mergetwolists', 'lcs', 'insertinterval', 'mergeklists'].includes(algorithm)) {
        inputData = { type: 'string-dictionary', value: input };
      } else if (algorithm === 'detectcycle') {
        inputData = { type: 'array-search', array: input, target: targetNode, label: 'List / Cycle-at index (-1 = no cycle)' };
      } else if (['groupanagrams', 'houserobber2', 'reorderlist', 'longestconsecutive'].includes(algorithm)) {
        inputData = { type: 'array', value: input };
      } else if (algorithm === 'palindromicsubstrings') {
        inputData = { type: 'string', value: input };
      } else if (algorithm === 'longrepeating') {
        inputData = { type: 'array-target', array: input, target: targetNode, label: 'String / k (max replacements)' };
      } else if (algorithm === 'removenth') {
        inputData = { type: 'array-search', array: input, target: targetNode, label: 'List / n (from end)' };
      } else if (algorithm === 'combinationsumiv') {
        inputData = { type: 'array-target', array: input, target: targetNode, label: 'Nums / Target' };
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
    'best-time-stock': { algo: 'besttimestock', category: 'Array', available: true },
    'contains-duplicate': { algo: 'containsduplicate', category: 'Array', available: true },
    'product-except-self': { algo: 'productexceptself', category: 'Array', available: true },
    'maximum-subarray': { algo: 'maxsubarray', category: 'Array', available: true },
    'maximum-product-subarray': { algo: 'maxproductsubarray', category: 'Array', available: true },
    'find-min-rotated': { algo: 'findminrotated', category: 'Array', available: true },
    'search-rotated': { algo: 'binary', category: 'Array', available: true },
    '3sum': { algo: 'threesum', category: 'Array', available: true },
    'container-most-water': { algo: 'containermostwater', category: 'Array', available: true },

    // Dynamic Programming
    'climbing-stairs': { algo: 'fibonacci-dp', category: 'Dynamic Programming', available: true },
    'coin-change': { algo: 'coinchange', category: 'Dynamic Programming', available: true },
    'house-robber': { algo: 'houserobber', category: 'Dynamic Programming', available: true },
    'house-robber-ii': { algo: 'houserobber2', category: 'Dynamic Programming', available: true },
    'longest-increasing-subsequence': { algo: 'longestincreasing', category: 'Dynamic Programming', available: true },
    'longest-common-subsequence': { algo: 'lcs', category: 'Dynamic Programming', available: true },
    'word-break': { algo: 'wordbreak', category: 'Dynamic Programming', available: true },
    'combination-sum-iv': { algo: 'combinationsumiv', category: 'Dynamic Programming', available: true },
    'decode-ways': { algo: 'decodeways', category: 'Dynamic Programming', available: true },
    'unique-paths': { algo: 'uniquepaths', category: 'Dynamic Programming', available: true },
    'jump-game': { algo: 'jumpgame', category: 'Dynamic Programming', available: true },

    // Graph
    'clone-graph': { algo: 'bfs', category: 'Graph', available: true },
    'course-schedule': { algo: 'dfs', category: 'Graph', available: true },
    'pacific-atlantic': { algo: 'bfs', category: 'Graph', available: true },
    'number-of-islands': { algo: 'bfs', category: 'Graph', available: true },
    'longest-consecutive': { algo: 'longestconsecutive', category: 'Graph', available: true },
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
    'longest-repeating': { algo: 'longrepeating', category: 'String', available: true },
    'valid-anagram': { algo: 'validanagram', category: 'String', available: true },
    'group-anagrams': { algo: 'groupanagrams', category: 'String', available: true },
    'valid-parentheses': { algo: 'validparentheses', category: 'String', available: true },
    'valid-palindrome': { algo: 'validpalindrome', category: 'String', available: true },
    'longest-palindrome': { algo: 'longestpalindrome', category: 'String', available: true },
    'palindromic-substrings': { algo: 'palindromicsubstrings', category: 'String', available: true },

    // Interval
    'insert-interval': { algo: 'insertinterval', category: 'Interval', available: true },
    'merge-intervals': { algo: 'mergeintervals', category: 'Interval', available: true },
    'non-overlapping-intervals': { algo: 'nonoverlapping', category: 'Interval', available: true },
    'meeting-rooms': { algo: 'meetingrooms', category: 'Interval', available: true },
    'meeting-rooms-ii': { algo: 'meetingroomsii', category: 'Interval', available: true },

    // Linked List
    'reverse-list': { algo: 'reverselist', category: 'Linked List', available: true },
    'detect-cycle': { algo: 'detectcycle', category: 'Linked List', available: true },
    'merge-two-lists': { algo: 'mergetwolists', category: 'Linked List', available: true },
    'merge-k-lists': { algo: null, category: 'Linked List', available: false },
    'remove-nth': { algo: null, category: 'Linked List', available: false },
    'reorder-list': { algo: null, category: 'Linked List', available: false },
  };

  const [selectedBlind75, setSelectedBlind75] = useState('');

  const isArrayAlgorithm = ['bubble', 'merge', 'quick', 'insertion', 'selection', 'heap', 'binary', 'linear', 'bst-insert', 'bst-search', 'productexceptself', 'containsduplicate', 'besttimestock', 'containermostwater', 'threesum', 'houserobber', 'longestincreasing', 'jumpgame', 'maxproductsubarray', 'findminrotated', 'missingnumber', 'reverselist', 'groupanagrams', 'houserobber2', 'reorderlist', 'longestconsecutive', 'removenth', 'combinationsumiv'].includes(algorithm);
  const isGraphAlgorithm = ['bfs', 'dfs', 'dijkstra'].includes(algorithm);
  const isRecursionAlgorithm = ['recursion', 'fibonacci', 'fibonacci-dp', 'tower-hanoi'].includes(algorithm);
  const isStringAlgorithm = ['validparentheses', 'longestsubstring', 'validpalindrome', 'decodeways', 'longestpalindrome', 'palindromicsubstrings', 'longrepeating'].includes(algorithm);
  const isCoinChange = algorithm === 'coinchange';
  const isValidAnagram = algorithm === 'validanagram';
  const isIntervalAlgorithm = ['mergeintervals', 'nonoverlapping', 'meetingrooms', 'meetingroomsii', 'insertinterval'].includes(algorithm);
  const isUniquePaths = algorithm === 'uniquepaths';
  const isWordBreak = algorithm === 'wordbreak';
  const isDetectCycle = algorithm === 'detectcycle';
  const isTwoPartInput = ['mergetwolists', 'lcs', 'mergeklists'].includes(algorithm);
  const needsTarget = ['binary', 'linear', 'bst-search', 'twosum', 'coinchange', 'removenth', 'longrepeating', 'combinationsumiv'].includes(algorithm);
  const needsWeightedGraph = algorithm === 'dijkstra';

  return (
    <div className="visualizer-container">
      <div className="header">
        <h1>Algorithm Visualizer</h1>
        <p className="header-subtitle">Watch algorithms come to life step by step</p>
      </div>

      <div className="content">
        <div className="setup-left">
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
          <div className="complexity-badges">
            <span className="summary-complexity">{algorithmSummaries[algorithm].complexity}</span>
          </div>
        </div>

        {/* Blind 75 LeetCode Problems Selector */}
        <div className="blind75-selector">
          <div className="blind75-header">
            <h3 className="blind75-title">🎯 Blind 75 LeetCode Problems</h3>
            <p className="blind75-subtitle">Select a problem to see its visualizer</p>
          </div>

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
            className="input-field blind75-select"
          >
            <option value="">-- Select a Blind 75 Problem --</option>

            <optgroup label="Array (10 problems)">
              <option value="two-sum">✅ Two Sum</option>
              <option value="best-time-stock">✅ Best Time to Buy and Sell Stock</option>
              <option value="contains-duplicate">✅ Contains Duplicate</option>
              <option value="product-except-self">✅ Product of Array Except Self</option>
              <option value="maximum-subarray">✅ Maximum Subarray (Kadane's)</option>
              <option value="maximum-product-subarray">✅ Maximum Product Subarray</option>
              <option value="find-min-rotated">✅ Find Minimum in Rotated Sorted Array</option>
              <option value="search-rotated">✅ Search in Rotated Sorted Array</option>
              <option value="3sum">✅ 3Sum</option>
              <option value="container-most-water">✅ Container With Most Water</option>
            </optgroup>

            <optgroup label="Dynamic Programming (11 problems)">
              <option value="climbing-stairs">✅ Climbing Stairs</option>
              <option value="coin-change">✅ Coin Change</option>
              <option value="longest-increasing-subsequence">✅ Longest Increasing Subsequence</option>
              <option value="longest-common-subsequence">✅ Longest Common Subsequence</option>
              <option value="word-break">✅ Word Break</option>
              <option value="combination-sum-iv">📝 Combination Sum IV</option>
              <option value="house-robber">✅ House Robber</option>
              <option value="house-robber-ii">🔧 House Robber II</option>
              <option value="decode-ways">✅ Decode Ways</option>
              <option value="unique-paths">✅ Unique Paths</option>
              <option value="jump-game">✅ Jump Game</option>
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
              <option value="valid-anagram">✅ Valid Anagram</option>
              <option value="group-anagrams">✅ Group Anagrams</option>
              <option value="valid-parentheses">✅ Valid Parentheses</option>
              <option value="valid-palindrome">✅ Valid Palindrome</option>
              <option value="longest-palindrome">✅ Longest Palindromic Substring</option>
              <option value="palindromic-substrings">📝 Palindromic Substrings</option>
            </optgroup>

            <optgroup label="Interval (5 problems)">
              <option value="insert-interval">🔧 Insert Interval</option>
              <option value="merge-intervals">✅ Merge Intervals</option>
              <option value="non-overlapping-intervals">✅ Non-overlapping Intervals</option>
              <option value="meeting-rooms">📝 Meeting Rooms</option>
              <option value="meeting-rooms-ii">📝 Meeting Rooms II</option>
            </optgroup>

            <optgroup label="Linked List (6 problems)">
              <option value="reverse-list">✅ Reverse Linked List</option>
              <option value="detect-cycle">✅ Detect Cycle in Linked List</option>
              <option value="merge-two-lists">✅ Merge Two Sorted Lists</option>
              <option value="merge-k-lists">📝 Merge K Sorted Lists</option>
              <option value="remove-nth">📝 Remove Nth Node From End</option>
              <option value="reorder-list">📝 Reorder List</option>
            </optgroup>
          </select>

          {selectedBlind75 && blind75Mapping[selectedBlind75] && (
            <div className="blind75-status">
              {blind75Mapping[selectedBlind75].available ? (
                <div className="status-available">
                  <strong>✅ Visualizer Available!</strong>
                  <p>
                    Using: <strong>{algorithmSummaries[blind75Mapping[selectedBlind75].algo]?.title}</strong>
                    {blind75Mapping[selectedBlind75].note && ` (${blind75Mapping[selectedBlind75].note})`}
                  </p>
                </div>
              ) : (
                <div className="status-unavailable">
                  <strong>📝 Coming Soon!</strong>
                  <p>
                    This visualizer is not yet implemented.
                    {blind75Mapping[selectedBlind75].note && ` Note: ${blind75Mapping[selectedBlind75].note}`}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="blind75-legend">
            <strong>Legend:</strong> ✅ Available | 🔧 Similar Pattern | 📝 To Be Implemented
          </div>
        </div>
        </div>{/* end setup-left */}

        <div className="setup-right">
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

        {isValidAnagram && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="string1-input">
                First String
              </label>
              <input
                id="string1-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-field"
                placeholder="e.g., listen"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="string2-input">Second String</label>
              <input
                id="string2-input"
                type="text"
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="input-field"
                placeholder="e.g., silent"
              />
            </div>
          </>
        )}

        {isUniquePaths && (
          <div className="form-group">
            <label className="form-label" htmlFor="grid-input">
              Grid Dimensions (format: m,n for m×n grid)
            </label>
            <input
              id="grid-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="e.g., 3,7"
            />
          </div>
        )}

        {isWordBreak && (
          <div className="form-group">
            <label className="form-label" htmlFor="wordbreak-input">
              String | Dictionary (format: string|word1,word2,word3)
            </label>
            <input
              id="wordbreak-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="e.g., leetcode|leet,code"
            />
          </div>
        )}

        {isDetectCycle && (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="cycle-list-input">
                Linked List Values (comma-separated)
              </label>
              <input
                id="cycle-list-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-field"
                placeholder="e.g., 3, 2, 0, -4"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cycle-at-input">
                Cycle back to index (-1 for no cycle)
              </label>
              <input
                id="cycle-at-input"
                type="text"
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="input-field"
                placeholder="e.g., 1 (tail connects to index 1) or -1"
              />
            </div>
          </>
        )}

        {isTwoPartInput && (
          <div className="form-group">
            <label className="form-label" htmlFor="twopart-input">
              {algorithm === 'mergetwolists' ? 'List 1 | List 2 (pipe-separated)' : 'Text 1 | Text 2 (pipe-separated)'}
            </label>
            <input
              id="twopart-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder={algorithm === 'mergetwolists' ? 'e.g., 1,2,4|1,3,4' : 'e.g., abcde|ace'}
            />
          </div>
        )}

        <div className="code-detection-section">
          <h3 className="detection-title">
            🔍 Paste Your Code to Detect Algorithm
          </h3>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            rows={8}
            placeholder="Paste your algorithm code here..."
            className="detection-textarea"
          />
          <button
            onClick={handleDetectAlgorithm}
            className="detect-btn"
          >
            Detect Algorithm
          </button>

          {detected && (
            <div className={`detection-result ${detected.confidence > 60 ? 'result-high' : 'result-low'}`}>
              <div className="detection-result-header">
                <span className="detection-icon">
                  {detected.confidence > 80 ? '✅' : detected.confidence > 60 ? '✓' : '⚠️'}
                </span>
                <strong className="detection-name">{detected.name}</strong>
              </div>
              <div className="detection-confidence-row">
                <strong>Confidence:</strong>
                <span className={`confidence-badge ${detected.confidence > 80 ? 'conf-high' : detected.confidence > 60 ? 'conf-medium' : 'conf-low'}`}>
                  {detected.confidence}%
                </span>
              </div>
              <div className="detection-explanation">{detected.explanation}</div>
              {detected.allMatches && detected.allMatches.length > 1 && (
                <div className="detection-others">
                  <strong>Other possibilities:</strong>
                  <div className="match-tags">
                    {detected.allMatches.slice(1).map((match, idx) => (
                      <span key={idx} className="match-tag">{match.name}</span>
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
        </div>{/* end setup-right */}

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
