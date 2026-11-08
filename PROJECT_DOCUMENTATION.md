# Algorithm Visualizer — Complete Project Documentation

*An interactive, step-by-step algorithm visualization tool with in-browser code analysis, covering 60+ classic algorithms and the full Blind 75 LeetCode list.*

---

## Table of Contents

1. [What the Project Is](#1-what-the-project-is)
2. [What It Does (Feature Walkthrough)](#2-what-it-does-feature-walkthrough)
3. [Technology Stack](#3-technology-stack)
4. [Architecture & How It Works](#4-architecture--how-it-works)
5. [Frontend File-by-File Breakdown](#5-frontend-file-by-file-breakdown)
6. [Deployment & Hosting](#6-deployment--hosting)
7. [The Algorithm Catalog](#7-the-algorithm-catalog)
8. [The Algorithm Detection System](#8-the-algorithm-detection-system)
9. [How It Was Built — Development Timeline](#9-how-it-was-built--development-timeline)
10. [Running the Project Locally](#10-running-the-project-locally)
11. [Current State & Notable Details](#11-current-state--notable-details)
12. [Project Metrics](#12-project-metrics)

---

## 1. What the Project Is

**Algorithm Visualizer** (branded in-app as **"AlgoViz"**) is a web application that lets you *watch algorithms run one operation at a time*. Instead of reading static pseudocode, you pick an algorithm (or paste your own code), give it input, and step through the execution while the UI shows pointers, comparisons, swaps, data-structure state, and a plain-English explanation at every step.

It has two complementary entry points:

- **Manual Setup** — choose from a categorized dropdown of 60+ algorithms, supply input (an array, graph edges, a target, a string, etc.), and launch a full visualization.
- **AI Code Analyzer** — paste a snippet of code; the app detects which algorithm it most likely is, explains it, and offers a one-click jump straight into the matching visualizer.

The project's stated goal (from its README and the `BLIND_75_MAPPING.md` planning doc) is **full visual coverage of the Blind 75** — the well-known curated list of 75 LeetCode problems used for interview prep — plus the foundational sorting/searching/graph/tree algorithms those problems build on.

It is a **static, frontend-only web app**: a Vite + React single-page app with code analysis running entirely in the browser. There is no backend, database, auth, or API key. It is hosted on Vercel at **https://algorithm-visualizer-lac.vercel.app**.

---

## 2. What It Does (Feature Walkthrough)

### The landing page
A polished marketing-style landing screen ("See every step, understand every move") with:
- An animated background of 48 falling particles (a mix of dots and squares) generated once so they don't re-randomize on re-render.
- A spotlight ray and a soft center glow.
- A "How It Works" three-step section: *Choose an Algorithm → Configure Your Input → Watch It Execute*.
- A row of algorithm "chips" (Bubble Sort, Merge Sort, Binary Search, BFS/DFS, Dijkstra's, Two Sum, Sliding Window, etc.).
- Two CTAs: **Explore Algorithms** (→ Manual Setup) and **Try AI Analyzer** (→ AI Code Analyzer).

### Manual Setup
- A grouped `<select>` dropdown organized into optgroups: *Sorting Algorithms, Search Algorithms, Graph Traversal, Tree Algorithms, Recursion & Backtracking, Dynamic Programming*, plus Blind-75 category groups (*Array, DP, Graph, Tree, String, Interval, Linked List*).
- Input fields that **adapt to the selected algorithm** — an array box for sorting, edge list + start node for graphs, a target value for searches, two strings for anagram checks, intervals for interval problems, and so on.
- A **"Start Full Visualization"** button that hands off to the full-screen player.

### The visualization player (full screen)
- **Play / Pause / Step-forward / Step-back / Reset** transport controls.
- A **speed control** for autoplay.
- A large visual canvas that renders the data structure appropriate to the algorithm: bars for sorting, nodes/edges for graphs, a tree for BST/tree problems, a call-stack panel for recursion, a DP table/grid for dynamic-programming problems, pointers for two-pointer/sliding-window problems, a stack for parentheses matching, etc.
- A **step explanation** panel describing what just happened in plain English.
- Highlighting of the active elements (compared, swapped, visited, current pointer, etc.).

### AI Code Analyzer
- A code textarea (with a "Load Example" button that drops in a Python bubble-sort sample).
- An **"✨ Analyze with AI"** button that runs the detector in `codeAnalyzer.js` directly in the browser (no network call).
- Results panel showing the **detected algorithm** as a badge, a **confidence score** (0–99%), **close alternatives**, an **explanation** (with Big-O time complexity), and a **"Visualize This Algorithm →"** button that routes you into the corresponding visualizer with the algorithm preselected.

---

## 3. Technology Stack

### Frontend
| Tool | Version | Role |
|------|---------|------|
| **React** | ^19.2.0 | UI library (uses StrictMode, hooks) |
| **react-dom** | ^19.2.0 | DOM renderer |
| **Vite** | ^7.2.4 | Dev server + build tool |
| **@vitejs/plugin-react** | ^5.1.1 | React fast-refresh / JSX transform |
| **lucide-react** | ^0.562.0 | Icon set (note: the visualizer also hand-rolls its own inline SVG icons) |
| **ESLint** | ^9.39.1 | Linting, with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` |
| **@types/react / @types/react-dom** | ^19.x | Type definitions |

- Module type: ESM (`"type": "module"`).
- No CSS framework — all styling is hand-written CSS (one stylesheet per major component).
- No router library — view switching is done with a single `useState` ("landing" | "setup" | "ai-explainer" | "visualize") in `App.jsx`.
- No state-management library — local component state only.

### Hosting
- **Vercel** serves the static `vite build` output (framework preset: Vite).
- No server-side code. An Express backend existed earlier but was removed once detection moved into the browser (see the timeline).

---

## 4. Architecture & How It Works

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (static site on Vercel, or Vite dev server :5173)    │
│                                                               │
│  App.jsx  ── currentView state ──┬─ LandingPage.jsx           │
│                                  ├─ AlgorithmVisualizer.jsx   │
│                                  │     (Manual Setup +        │
│                                  │      ~45 step-generators)  │
│                                  │     uses algorithmDetector │
│                                  ├─ CodeExplainer.jsx         │
│                                  │     uses codeAnalyzer.js   │
│                                  │     (weighted scoring)     │
│                                  └─ NewVisualizer.jsx         │
│                                        (full-screen player)   │
└──────────────────────────────────────────────────────────────┘
```

### Core design ideas

1. **Step-list model.** Every algorithm is implemented as a *step generator* — a pure function such as `generateBubbleSortSteps(arr)` that runs the algorithm once and records an array of "step" snapshots (the array state, which indices are active, a description string, pointers, etc.). The player then simply indexes through that array forward/backward. This decouples *computing* the algorithm from *rendering* it and makes step-back trivial.

2. **View routing without a router.** `App.jsx` holds `currentView` and swaps top-level components. Visualization data and a preselected algorithm are passed down as props; the AI analyzer's "detected algorithm" flows back up via an `onAlgorithmDetected` callback that switches to Manual Setup with the algorithm chosen.

3. **Two independent detectors, both in the browser.**
   - `frontend/src/algorithmDetector.jsx` (~1,600 lines) with rich `algorithmPatterns` plus an `analyzeStructuralSignatures()` pass, used by Manual Setup.
   - `frontend/src/codeAnalyzer.js` (~630 lines), a weighted-scoring detector covering 52 algorithms, used by the Code Analyzer tab.

4. **Adaptive input + adaptive rendering.** The Manual Setup form and the player both branch on the selected algorithm id (e.g. `"bubble"`, `"dijkstra"`, `"two-sum"`, `"merge-intervals"`) to show the right inputs and the right visualization.

---

## 5. Frontend File-by-File Breakdown

| File | Lines | What it does |
|------|------:|--------------|
| `main.jsx` | 10 | React entry point; mounts `<App/>` in StrictMode. |
| `App.jsx` | 84 | Top-level view router (`landing`/`setup`/`ai-explainer`/`visualize`); wires callbacks between the analyzer and the visualizer. |
| `LandingPage.jsx` | 156 | Marketing landing page; particle field, hero, "how it works", algorithm chips, CTAs. |
| `AlgorithmVisualizer.jsx` | **7,434** | The heart of the app. Contains ~45 `generate…Steps` functions (one per algorithm), the `algorithmSummaries` metadata map, inline SVG control icons, the Manual Setup form with adaptive inputs, and the grouped algorithm dropdown. |
| `NewVisualizer.jsx` | 1,264 | The full-screen visualization player — transport controls, speed, the rendering canvas for each data-structure type, and the step-explanation panel. |
| `CodeExplainer.jsx` | 186 | Code Analyzer tab; textarea, "Load Example", runs `detectAlgorithm()` from `codeAnalyzer.js`, renders detected algorithm, confidence, alternatives and explanation, "Visualize This Algorithm →". |
| `codeAnalyzer.js` | 627 | Weighted detector: an `ALGORITHMS` table of 52 entries, each with weighted regex signals; the highest score wins and returns `{ key, name, explanation, confidence, alternatives }`. |
| `algorithmDetector.jsx` | 1,594 | Client-side detection library: `algorithmPatterns` (30+ named patterns), `analyzeStructuralSignatures()`, and the exported `detectAlgorithm()`. |
| `App.css` | 136 | App shell + view-toggle styling. |
| `AlgorithmVisualizer.css` | 1,436 | Styling for the setup form and visualizer canvases. |
| `NewVisualizer.css` | 2,428 | Styling for the full-screen player (largest stylesheet). |
| `CodeExplainer.css` | 357 | Analyzer tab styling. |
| `LandingPage.css` | 443 | Landing page styling, particle animation keyframes. |
| `index.css` | 0 | Empty (reset slot). |
| `scripts/test-detector.js` | 149 | 11 detection test cases for `codeAnalyzer.js`; run with `npm test`. |

### Detected-algorithm step generators (in `AlgorithmVisualizer.jsx`)
A representative list of the `generate…Steps` functions present:

`generateBubbleSortSteps`, `generateInsertionSortSteps`, `generateSelectionSortSteps`, `generateHeapSortSteps`, `generateMergeSortSteps`, `generateQuickSortSteps`, `generateLinearSearchSteps`, `generateBinarySearchSteps`, `generateBFSSteps`, `generateDFSSteps`, `generateDijkstraSteps`, `generateRecursionSteps` (factorial call stack), `generateBSTInsertSteps`, `generateBSTSearchSteps`, `generateFibonacciSteps`, `generateFibonacciDPSteps`, `generateTowerHanoiSteps`, `generateTwoSumSteps`, `generateMaxSubarraySteps` (Kadane's), `generateValidParenthesesSteps`, `generateLongestSubstringSteps`, `generateCoinChangeSteps`, `generateProductExceptSelfSteps`, `generateMergeIntervalsSteps`, `generateContainsDuplicateSteps`, `generateBestTimeStockSteps`, `generateValidAnagramSteps`, `generateValidPalindromeSteps`, `generateContainerMostWaterSteps`, `generateThreeSumSteps`, `generateHouseRobberSteps`, `generateLongestIncreasingSubsequenceSteps`, `generateUniquePathsSteps`, `generateJumpGameSteps`, `generateMissingNumberSteps`, `generateDecodeWaysSteps`, `generateWordBreakSteps`, `generateMaxProductSubarraySteps`, `generateFindMinRotatedSteps`, `generateReverseListSteps`, `generateTopKFrequentSteps`, `generateLongestPalindromeSteps`.

---

## 6. Deployment & Hosting

- **Host:** Vercel project `algorithm-visualizer`, live at **https://algorithm-visualizer-lac.vercel.app**.
- **Build:** Vercel detects Vite, runs `npm run build`, and serves `dist/`.
- **Deploy manually:** `cd frontend && npx vercel deploy --prod`.
- **Auto-deploy (optional):** connect the GitHub repo in the Vercel dashboard (Settings → Git) with root directory `frontend`, and every push to `master` deploys.
- **Config:** none needed. There are no environment variables or secrets.

---

## 7. The Algorithm Catalog

### Foundational algorithms (Manual Setup groups)
- **Sorting:** Bubble Sort, Merge Sort, Quick Sort, Insertion Sort, Selection Sort, Heap Sort
- **Search:** Binary Search, Linear Search
- **Graph Traversal:** BFS, DFS, Dijkstra's Algorithm (the client detector also knows Bellman-Ford, Topological Sort, Union-Find)
- **Tree:** BST Insert, BST Search (plus the Blind-75 tree problems below)
- **Recursion & Backtracking:** Factorial (call stack), Fibonacci (recursion), Tower of Hanoi, generic Backtracking
- **Dynamic Programming:** Fibonacci (DP), and the DP Blind-75 problems below

### Blind 75 coverage (✅ = full visualizer in the dropdown)
- **Array:** Two Sum ✅, Best Time to Buy/Sell Stock ✅, Contains Duplicate ✅, Product of Array Except Self ✅, Maximum Subarray (Kadane's) ✅, Maximum Product Subarray ✅, Find Minimum in Rotated Sorted Array ✅, Search in Rotated Sorted Array ✅, 3Sum ✅, Container With Most Water ✅
- **Dynamic Programming:** Climbing Stairs ✅, Coin Change ✅, Longest Increasing Subsequence ✅, Longest Common Subsequence ✅, Word Break ✅, House Robber ✅, Decode Ways ✅, Unique Paths ✅, Jump Game ✅
- **Graph:** Clone Graph ✅, Course Schedule ✅, Pacific Atlantic Water Flow ✅, Number of Islands ✅, Graph Valid Tree ✅
- **Tree:** Maximum Depth ✅, Same Tree ✅, Invert Binary Tree ✅, Binary Tree Maximum Path Sum ✅, Level Order Traversal ✅, Serialize/Deserialize ✅, Subtree of Another Tree ✅, Construct from Preorder/Inorder ✅, Validate BST ✅, Kth Smallest in BST ✅, Lowest Common Ancestor of BST ✅
- **String:** Longest Substring Without Repeating ✅, Valid Anagram ✅, Group Anagrams ✅, Valid Parentheses ✅, Valid Palindrome ✅, Longest Palindromic Substring ✅
- **Interval:** Merge Intervals ✅, Non-overlapping Intervals ✅
- **Linked List:** Reverse Linked List ✅, Detect Cycle ✅, Merge Two Sorted Lists ✅

The dropdown's optgroup labels show the intended Blind-75 tallies: Array (10), DP (11), Graph (6), Tree (11), String (8), Interval (5), Linked List (6).

### The planning document — `BLIND_75_MAPPING.md`
A 424-line living spec that maps **all 75** Blind-75 problems to a status (✅ Full Visualizer / 🔧 Related pattern / 📝 To be implemented), records the pattern each problem uses, and describes *what the user should see* in the visualization. It also tracks a "Currently Available (18 visualizers)" baseline and a "High Priority To Add (Top 10)" list — i.e. it's the project's roadmap/checklist that drove the build-out.

---

## 8. The Algorithm Detection System

There are two detectors, both heuristic (no ML at runtime despite the "AI" branding):

### Client-side — `algorithmDetector.jsx`
- **`algorithmPatterns`** — a large object keyed by algorithm name (`"Bubble Sort"`, `"Merge Sort"`, `"Quick Sort"`, `"Binary Search"`, `"Breadth-First Search"`, `"Dijkstra's Algorithm"`, `"Bellman-Ford Algorithm"`, `"BST Insert"`, `"Two Pointers"`, `"Sliding Window"`, `"Fast & Slow Pointers (Floyd's Cycle)"`, `"Kadane's Algorithm"`, `"Topological Sort"`, `"Union Find (Disjoint Set)"`, `"0/1 Knapsack"`, `"Longest Increasing Subsequence"`, `"Monotonic Stack"`, `"Backtracking"`, `"Prefix Sum"`, and more). Each entry carries keyword/regex signals and metadata.
- **`analyzeStructuralSignatures(code)`** — a second pass that looks at structural cues (nested loops, `while left <= right`, queue/stack usage, recursion shape) rather than just keywords, to disambiguate.
- **`detectAlgorithm(code)`** — the exported entry that combines the above and returns a best-guess algorithm (with graceful "No code provided" / "Unknown Algorithm" fallbacks).

### Code Analyzer — `codeAnalyzer.js`
Each of 52 algorithms defines weighted signals (`[weight, RegExp]`). The code is scored against every algorithm and the highest total wins, which fixes the old first-match-wins problem with overlapping names (e.g. memoized Fibonacci vs. plain recursion). Confidence follows a diminishing-returns curve capped at 99%, and the next-best matches are returned as alternatives. Covered by `scripts/test-detector.js`.

The detection rules were iterated repeatedly to handle both Python and JavaScript idioms (e.g. `for…in` vs `for…for`, `def merge_sort` vs `function mergeSort` vs `const merge =`, and binary-search bounds written as `left/right`, `l/r`, `lo/hi`, or `low/high`).

---

## 9. How It Was Built — Development Timeline

The project's git history tells a clear, incremental story: ~5 weeks of building (Jan 22 → Feb 21, 2026), then a cleanup and deployment pass on Nov 8, 2026.

| Date | Commit | What happened |
|------|--------|---------------|
| **Jan 22, 2026** | `dc145db` — *"Algorithm Visualizer"* | **Initial scaffold.** Vite+React frontend and Express backend created from scratch (18 files, ~4,500 lines incl. lock files). First version shipped with `CodeExplainer.jsx`/`.css`, a 42-line `backend.js`, and `.env`. The seed of the AI-analyzer idea. |
| **Feb 4, 2026** | `b0749eb` — *"Making massive changes"* | **The pivot to a real visualizer.** Introduced `AlgorithmVisualizer.jsx` (+732 lines) and its CSS (+359), reworked `App.jsx`, and *removed* the old `CodeExplainer` files — refocusing from "explain code" to "visualize algorithms." Backend tweaked. |
| **Feb 5, 2026** | `cb2aef8` — *"Added more algorithms"* | Big expansion of `AlgorithmVisualizer.jsx` (+1,035 lines); first real growth of `algorithmDetector.jsx`. |
| **Feb 7, 2026** | `ca5813a` — *"Updated algorithm detector"* | Detector overhauled (+462 lines) with richer patterns. |
| **Feb 8, 2026** | `ae0109c` — *"Added better rules for detecting algorithms"* | Detection accuracy pass (+198 lines in detector). |
| **Feb 9, 2026** | `7ed6b06` — *"Added way more algorithms and making detection system better"* | Largest single jump: detector +1,334 lines, visualizer +664, CSS +814. Detection became `algorithmPatterns` + structural-signature analysis. |
| **Feb 10, 2026** | `20bbc64` — *"Made new page for full visualizer"* | **The player is born.** Created `NewVisualizer.jsx` (+271) and `NewVisualizer.css` (+554); visualizer logic grew +960 lines. Split "setup" from "full-screen playback." |
| **Feb 11, 2026** | `310eec0` — *"Added more visualizers from blind 75"* | Authored the **`BLIND_75_MAPPING.md`** roadmap (+423) and a huge Blind-75 build-out: visualizer +1,230, NewVisualizer +862, its CSS +1,541. |
| **Feb 12, 2026** | `fa7a99b` — *"Adding backend and more visualizers"* | Re-introduced an AI tab: brought back `CodeExplainer.jsx`/`.css`, wrote the project **README** (+160), and added a massive +2,810 lines to the visualizer. Backend reworked toward the analyze endpoint. |
| **Feb 14, 2026** | `e459d90` — *"Changed css"* | Major styling overhaul across all stylesheets (NewVisualizer.css ±805, AlgorithmVisualizer.css ±643). Backend refactored (+253/−). Added `test-backend.js` and `.claude/settings.local.json`. |
| **Feb 21, 2026** | `30b30ee` — *"Fixed css and added more algorithms"* | Added the **`LandingPage.jsx`/`.css`** (+156/+438) marketing page, big visualizer expansion (+1,210), and broad CSS polish. App became the four-view experience it is today. |
| **Nov 8, 2026** | `15c9aa7` — *"Remove Hugging Face integration and untracked .env"* | Removed the committed `backend/.env` (unused Hugging Face key) and unused `node-fetch`; added a root `.gitignore`. |
| **Nov 8, 2026** | `6e402a3`, `e5b29f4` | New weighted detector with confidence + alternatives, `/health` endpoint, detector tests; UI shows confidence and alternatives. |
| **Nov 8, 2026** | `d6fdcc2` and follow-up | **Went frontend-only.** Detector moved into the browser as `codeAnalyzer.js`, the Express backend was deleted, tests moved to `frontend/scripts/`, and the site was deployed to Vercel. |

**Narrative arc:** the project started as an *AI code-explainer*, pivoted hard into a *step-by-step algorithm visualizer*, then systematically expanded to cover the Blind 75 (driven by the mapping doc), grew a dedicated full-screen player, folded the AI analyzer back in as a secondary feature, got a landing page and a visual polish pass, and was finally simplified into a static site and deployed.

---

## 10. Running the Project Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
cd frontend
npm install
npm run dev          # → http://localhost:5173
npm test             # detection tests
```

**Using the AI Analyzer:** open the *🤖 AI Code Analyzer* tab → paste code (or "Load Example") → *✨ Analyze with AI* → review the detected algorithm + explanation → *Visualize This Algorithm →*.

**Using Manual Setup:** open *📊 Manual Setup* → pick an algorithm → fill the adaptive input fields → *Start Full Visualization*.

**Troubleshooting:**
- *Port 5173 in use* → `npm run dev -- --port 3000`.

---

## 11. Current State & Notable Details

- **"AI" is heuristic, not ML.** Despite the branding, detection is fast deterministic pattern-matching, which makes the analyzer instant and offline-capable. The original Hugging Face integration has been fully removed.
- **One giant component.** `AlgorithmVisualizer.jsx` is ~7,400 lines and holds nearly all algorithm logic. This is the natural place to split/refactor if the project grows.
- **Two detectors to keep in sync.** `algorithmDetector.jsx` (Manual Setup) and `codeAnalyzer.js` (Code Analyzer) are independent; a pattern improvement in one doesn't automatically apply to the other. Merging them is a natural next step.
- **Old secret in history.** `backend/.env` (an unused Hugging Face key) was removed from the repo, but it remains in older commits, so the key should be revoked on Hugging Face.
- **Light testing, no CI.** `npm test` runs 11 detection cases; there's no CI pipeline. ESLint reports 10 pre-existing errors in older files that don't affect the build.
- **No router/state lib by design.** View routing is a single `useState`; state is local. Lightweight and dependency-free.
- **Blind 75 not 100% complete.** The mapping doc still lists 📝 "to be implemented" items (e.g. several backtracking, trie, heap, and matrix problems), so the catalog is intentionally a work in progress.

---

## 12. Project Metrics

- **Total source (excluding lock files / node_modules):** ~15,900 lines across JSX + CSS + JS.
- **Largest files:** `AlgorithmVisualizer.jsx` (7,434), `NewVisualizer.css` (2,428), `algorithmDetector.jsx` (1,594), `AlgorithmVisualizer.css` (1,436), `NewVisualizer.jsx` (1,264).
- **Algorithms with full visualizers:** 60+ entries in the dropdown (foundational + Blind 75).
- **Step generators:** ~45 distinct `generate…Steps` functions.
- **Commits:** 16, spanning Jan 22 – Nov 8, 2026.
- **License:** ISC.

---

*Document generated from a full read of the repository: source files, `README.md`, `BLIND_75_MAPPING.md`, `package.json` manifests, and the complete git history. Last updated Nov 8, 2026.*
