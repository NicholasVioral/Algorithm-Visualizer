# Blind 75 LeetCode Problems - Visualizer Mapping

This document maps each of the Blind 75 problems to available visualizers or indicates which ones need to be created.

## Legend
- ✅ **Full Visualizer Available**
- 🔧 **Related Visualizer (similar pattern)**
- 📝 **To Be Implemented**

---

## Array (9 problems)

### ✅ 1. Two Sum
**Visualizer:** Two Sum
**Pattern:** Hash Map
**What you see:** Hash map building, complement search, solution highlighting

### 🔧 2. Best Time to Buy and Sell Stock
**Visualizer:** Maximum Subarray (Kadane's) - Similar Pattern
**Pattern:** Single pass tracking min/max
**What you see:** Track minimum price and maximum profit as we iterate

### 📝 3. Contains Duplicate
**Pattern:** Hash Set
**Similar to:** Two Sum (uses hash map)

### 📝 4. Product of Array Except Self
**Pattern:** Prefix/Suffix products
**What you see:** Build left products, right products, combine

### 📝 5. Maximum Subarray (Kadane's Algorithm)
**Pattern:** Dynamic Programming
**What you see:** Current sum vs. start new subarray decision

### 📝 6. Maximum Product Subarray
**Pattern:** Dynamic Programming (track min/max)
**Similar to:** Maximum Subarray

### 📝 7. Find Minimum in Rotated Sorted Array
**Visualizer:** Binary Search - Similar Pattern
**Pattern:** Modified binary search

### ✅ 8. Search in Rotated Sorted Array
**Visualizer:** Binary Search (with modifications)
**Pattern:** Binary Search with pivot detection

### 📝 9. 3Sum
**Pattern:** Two pointers + sorting
**What you see:** Sort array, fix one number, two-pointer on rest

---

## Binary (2 problems)

### 📝 10. Sum of Two Integers
**Pattern:** Bit manipulation
**What you see:** XOR for sum, AND+shift for carry

### 📝 11. Number of 1 Bits
**Pattern:** Bit manipulation
**What you see:** Check each bit, count ones

---

## Dynamic Programming (11 problems)

### ✅ 12. Climbing Stairs
**Visualizer:** Fibonacci DP
**Pattern:** Same as Fibonacci!
**What you see:** dp[i] = dp[i-1] + dp[i-2]

### 📝 13. Coin Change
**Pattern:** Unbounded knapsack DP
**What you see:** DP table, try each coin, take minimum

### 📝 14. Longest Increasing Subsequence
**Pattern:** DP or Binary Search
**What you see:** Build LIS array, track sequences

### 📝 15. Longest Common Subsequence
**Pattern:** 2D DP table
**What you see:** Grid filling, diagonal matches

### 📝 16. Word Break
**Pattern:** DP with dictionary
**What you see:** Check each position if word breakable

### 📝 17. Combination Sum IV
**Pattern:** Unbounded knapsack
**Similar to:** Coin Change

### 📝 18. House Robber
**Pattern:** DP with constraints
**What you see:** Rob or skip decision at each house

### 📝 19. House Robber II
**Pattern:** House Robber x2 (circular)
**What you see:** Two DP arrays (with/without first house)

### 📝 20. Decode Ways
**Pattern:** DP counting paths
**What you see:** Single digit vs. two digit decisions

### 📝 21. Unique Paths
**Pattern:** 2D DP grid
**What you see:** Grid filling, path counting

### 📝 22. Jump Game
**Pattern:** Greedy/DP
**What you see:** Track furthest reachable position

---

## Graph (6 problems)

### ✅ 23. Clone Graph
**Visualizer:** BFS/DFS
**Pattern:** Graph traversal with HashMap
**What you see:** Original vs. cloned graph side-by-side

### ✅ 24. Course Schedule
**Visualizer:** DFS (Cycle Detection)
**Pattern:** Topological sort / cycle detection
**What you see:** Graph with cycles highlighted

### ✅ 25. Pacific Atlantic Water Flow
**Visualizer:** BFS/DFS
**Pattern:** Multi-source BFS/DFS
**What you see:** Water flow from both oceans

### ✅ 26. Number of Islands
**Visualizer:** BFS/DFS on Grid
**Pattern:** Connected components
**What you see:** Grid with islands, BFS/DFS coloring

### 🔧 27. Longest Consecutive Sequence
**Pattern:** Hash Set
**Similar to:** Two Sum (uses hash set)

### ✅ 28. Graph Valid Tree
**Visualizer:** BFS/DFS
**Pattern:** Cycle detection + connectivity
**What you see:** Graph traversal checking for cycles

---

## Interval (6 problems)

### 📝 29. Insert Interval
**Pattern:** Merge intervals
**What you see:** Timeline with intervals, merge overlaps

### 📝 30. Merge Intervals
**Pattern:** Sort + merge
**What you see:** Timeline with merging intervals

### 📝 31. Non-overlapping Intervals
**Pattern:** Greedy interval scheduling
**What you see:** Keep earliest ending intervals

### 📝 32. Meeting Rooms
**Pattern:** Sort by start time
**What you see:** Timeline showing conflicts

### 📝 33. Meeting Rooms II
**Pattern:** Min heap / sweep line
**What you see:** Active meetings count over time

### 📝 34. Minimum Window Substring
**Pattern:** Sliding window
**What you see:** Window expanding/contracting

---

## Linked List (6 problems)

### 📝 35. Reverse Linked List
**Pattern:** Iterative/Recursive pointer reversal
**What you see:** Pointers flipping one by one

### 📝 36. Detect Cycle in Linked List
**Pattern:** Floyd's cycle detection (fast/slow pointers)
**What you see:** Two pointers moving, meeting at cycle

### 📝 37. Merge Two Sorted Lists
**Pattern:** Two pointers merge
**What you see:** Two lists merging into one

### 📝 38. Merge K Sorted Lists
**Pattern:** Min heap / divide & conquer
**What you see:** Multiple lists merging

### 📝 39. Remove Nth Node From End
**Pattern:** Two pointers (gap = n)
**What you see:** Fast pointer n ahead, both move

### 📝 40. Reorder List
**Pattern:** Find middle + reverse + merge
**What you see:** Split, reverse, interleave

---

## Matrix (4 problems)

### 📝 41. Set Matrix Zeroes
**Pattern:** In-place marking
**What you see:** Matrix with zeros propagating

### 📝 42. Spiral Matrix
**Pattern:** Layer-by-layer traversal
**What you see:** Spiral path highlighted

### 📝 43. Rotate Image
**Pattern:** Transpose + reverse
**What you see:** Matrix rotating 90 degrees

### 📝 44. Word Search
**Pattern:** Backtracking on grid
**What you see:** Path exploration, backtracking

---

## String (9 problems)

### 📝 45. Longest Substring Without Repeating Characters
**Pattern:** Sliding window + hash set
**What you see:** Window expanding/contracting

### 📝 46. Longest Repeating Character Replacement
**Pattern:** Sliding window
**What you see:** Window with character counts

### 📝 47. Valid Anagram
**Pattern:** Hash map / frequency count
**What you see:** Character frequency comparison

### 📝 48. Group Anagrams
**Pattern:** Hash map with sorted key
**What you see:** Strings grouping by anagram signature

### 📝 49. Valid Parentheses
**Pattern:** Stack
**What you see:** Stack pushing/popping brackets

### 📝 50. Valid Palindrome
**Pattern:** Two pointers
**What you see:** Pointers moving inward

### 📝 51. Longest Palindromic Substring
**Pattern:** Expand around center
**What you see:** Expansion from each center

### 📝 52. Palindromic Substrings
**Pattern:** Expand around center
**Similar to:** Longest Palindromic Substring

### 📝 53. Encode and Decode Strings
**Pattern:** Design (delimiter strategy)
**What you see:** Encoding with length prefixes

---

## Tree (11 problems)

### ✅ 54. Maximum Depth of Binary Tree
**Visualizer:** BST Traversal
**Pattern:** DFS recursion
**What you see:** Tree with depth levels highlighted

### ✅ 55. Same Tree
**Visualizer:** BST Comparison
**Pattern:** DFS comparison
**What you see:** Two trees side-by-side, matching nodes highlighted

### ✅ 56. Invert Binary Tree
**Visualizer:** Tree Transformation
**Pattern:** DFS swap children
**What you see:** Tree inverting left/right

### ✅ 57. Binary Tree Maximum Path Sum
**Visualizer:** Tree DFS
**Pattern:** DFS with global max
**What you see:** Paths with sums

### ✅ 58. Binary Tree Level Order Traversal
**Visualizer:** BFS on Tree
**Pattern:** BFS level by level
**What you see:** Tree nodes colored by level

### ✅ 59. Serialize and Deserialize Binary Tree
**Visualizer:** Tree Encoding
**Pattern:** DFS/BFS with null markers
**What you see:** Tree → string → tree

### ✅ 60. Subtree of Another Tree
**Visualizer:** Tree Matching
**Pattern:** DFS checking
**What you see:** Subtree highlighted in main tree

### ✅ 61. Construct Binary Tree from Preorder and Inorder
**Visualizer:** Tree Building
**Pattern:** Recursive construction
**What you see:** Tree building step by step

### ✅ 62. Validate Binary Search Tree
**Visualizer:** BST Validation
**Pattern:** DFS with min/max bounds
**What you see:** Nodes with valid ranges

### ✅ 63. Kth Smallest Element in BST
**Visualizer:** BST Inorder Traversal
**Pattern:** Inorder traversal
**What you see:** Inorder sequence, kth element highlighted

### ✅ 64. Lowest Common Ancestor of BST
**Visualizer:** BST Path Finding
**Pattern:** BST property navigation
**What you see:** Paths to both nodes, LCA highlighted

---

## Heap (3 problems)

### ✅ 65. Top K Frequent Elements
**Visualizer:** Heap/Bucket Sort
**Pattern:** Hash map + min heap
**What you see:** Frequency map, heap operations

### 📝 66. Find Median from Data Stream
**Pattern:** Two heaps (max heap + min heap)
**What you see:** Two heaps balancing

### 📝 67. Merge K Sorted Lists
**Pattern:** Min heap
**What you see:** Heap with k list heads

---

## Trie (2 problems)

### 📝 68. Implement Trie
**Pattern:** Tree with character nodes
**What you see:** Trie structure building

### 📝 69. Design Add and Search Words Data Structure
**Pattern:** Trie + DFS (wildcards)
**What you see:** Trie with wildcard search paths

---

## Backtracking (6 problems)

### 📝 70. Combination Sum
**Pattern:** Backtracking
**What you see:** Decision tree, prune branches

### 📝 71. Word Search
**Pattern:** Backtracking on grid
**What you see:** Path exploration, backtrack steps

### 📝 72. Letter Combinations of Phone Number
**Pattern:** Backtracking combinations
**What you see:** Decision tree of choices

### 📝 73. Generate Parentheses
**Pattern:** Backtracking with constraints
**What you see:** Valid parentheses building

### 📝 74. Subsets
**Pattern:** Backtracking power set
**What you see:** Inclusion/exclusion tree

### 📝 75. Palindrome Partitioning
**Pattern:** Backtracking partition
**What you see:** String partitioning, palindrome checks

---

## Summary

### Currently Available (18 visualizers):
1. Two Sum ✅
2. Binary Search ✅
3. BFS/DFS ✅
4. Dijkstra ✅
5. BST Insert ✅
6. BST Search ✅
7. Bubble Sort ✅
8. Quick Sort ✅
9. Merge Sort ✅
10. Heap Sort ✅
11. Insertion Sort ✅
12. Selection Sort ✅
13. Linear Search ✅
14. Factorial (Recursion) ✅
15. Fibonacci (Recursive) ✅
16. Fibonacci (DP) ✅
17. Tower of Hanoi ✅
18. Graph Traversals ✅

### High Priority To Add (Top 10):
1. Maximum Subarray (Kadane's) - Core DP pattern
2. Container With Most Water - Two pointers
3. Product of Array Except Self - Array manipulation
4. Coin Change - Classic DP
5. Longest Increasing Subsequence - DP/Binary Search
6. Valid Parentheses - Stack
7. Merge Intervals - Interval problems
8. Reverse Linked List - Linked list basics
9. Word Search - Backtracking
10. Longest Substring Without Repeating - Sliding window

### Related Patterns:
- **Hash Map/Set**: Two Sum, Contains Duplicate, Group Anagrams
- **Two Pointers**: 3Sum, Container With Most Water, Valid Palindrome
- **Sliding Window**: Longest Substring, Minimum Window
- **Binary Search**: Variants, Rotated Array Search
- **DP**: Kadane's, Coin Change, LIS, LCS, House Robber
- **Graph**: All use BFS/DFS/Dijkstra base
- **Tree**: All use BST base with variations
- **Backtracking**: Combinations, Permutations, Subsets
- **Linked List**: Pointer manipulation patterns
