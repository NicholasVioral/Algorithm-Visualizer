// Quick sanity tests for the algorithm detector.
// Run with: npm test (from the frontend folder)
import { detectAlgorithm } from '../src/codeAnalyzer.js';

const cases = [
  {
    label: 'Bubble sort (Python)',
    expect: 'bubble',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
  },
  {
    label: 'Quick sort (no keyword, uses pivot/partition)',
    expect: 'quick',
    code: `def sort(a, lo, hi):
    if lo < hi:
        p = partition(a, lo, hi)
        sort(a, lo, p - 1)
        sort(a, p + 1, hi)
def partition(a, lo, hi):
    pivot = a[hi]
    i = lo - 1
    for j in range(lo, hi):
        if a[j] < pivot:
            i += 1
            a[i], a[j] = a[j], a[i]
    return i + 1`,
  },
  {
    label: 'Binary search (no keyword)',
    expect: 'binary',
    code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
  },
  {
    label: 'Merge Intervals (regression: used to match Merge Sort)',
    expect: 'merge-intervals',
    code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    res = []
    for interval in intervals:
        if not res or res[-1][1] < interval[0]:
            res.append(interval)
        else:
            res[-1][1] = max(res[-1][1], interval[1])
    return res`,
  },
  {
    label: 'Two Sum (regression: key must be two-sum, not twosum)',
    expect: 'two-sum',
    code: `def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i`,
  },
  {
    label: '3Sum (regression: key must be 3sum, not threesum)',
    expect: '3sum',
    code: `def threeSum(nums):
    nums.sort()
    res = []
    for i in range(len(nums)):
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0: res.append([nums[i], nums[l], nums[r]])
    return res`,
  },
  {
    label: 'BFS vs DFS (queue -> bfs)',
    expect: 'bfs',
    code: `from collections import deque
def bfs(graph, start):
    visited = set()
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for nb in graph[node]:
            queue.append(nb)`,
  },
  {
    label: 'Dijkstra (heap + distances)',
    expect: 'dijkstra',
    code: `import heapq
def dijkstra(graph, src):
    dist = {src: 0}
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        for v, w in graph[u]:
            heapq.heappush(pq, (d + w, v))
    return dist`,
  },
  {
    label: 'Memoized Fibonacci -> fibonacci-dp (not plain recursion)',
    expect: 'fibonacci-dp',
    code: `def fib(n, memo={}):
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`,
  },
  {
    label: 'Valid Parentheses',
    expect: 'valid-parentheses',
    code: `def isValid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack`,
  },
  {
    label: 'Gibberish -> no confident match',
    expect: null,
    code: `x = 5\ny = x + 2\nprint(y)`,
  },
];

let pass = 0;
for (const { label, code, expect } of cases) {
  const r = detectAlgorithm(code);
  const ok = r.key === expect;
  if (ok) pass += 1;
  const alt = r.alternatives.map((a) => `${a.key}:${a.score}`).join(', ') || '-';
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${label}\n      got=${r.key} (conf ${r.confidence}%) expect=${expect}  alts=[${alt}]`
  );
}
console.log(`\n${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
