# Algorithm Visualizer with Code Analyzer

An interactive algorithm visualization tool. Visualize algorithms step-by-step, or paste your code and let the analyzer detect which algorithm it is and open the matching visualizer.

**Live site:** https://algorithm-visualizer-lac.vercel.app

## Features

- 📊 **Manual Algorithm Setup**: Choose from 60+ algorithms and visualize them step-by-step
- 🤖 **Code Analyzer**: Paste your code to get the detected algorithm, a confidence score, close alternatives, and a short explanation
- 🎯 **Blind 75 Coverage**: Visualizers for the Blind 75 LeetCode problems
- 📈 **Real-time Visualization**: Watch algorithms execute with detailed insights at each step
- 🎨 **Modern UI**: Responsive design with smooth animations

Everything runs in the browser. There is no backend, database, or API key.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Install and run

```bash
git clone https://github.com/NicholasVioral/Algorithm-Visualizer.git
cd Algorithm-Visualizer/frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** (or another port if 5173 is busy).

### Other commands (run from `frontend/`)

| Command | What it does |
|---------|--------------|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the code-analyzer detection tests |
| `npm run lint` | Run ESLint |

## Using the App

### Code Analyzer

1. Click the **"🤖 AI Code Analyzer"** tab
2. Paste your algorithm code (or click **Load Example**)
3. Click **"✨ Analyze with AI"**
4. Review the detected algorithm, confidence, alternatives, and explanation
5. Click **"Visualize This Algorithm →"** to open it in the visualizer

The analyzer uses weighted pattern scoring (`frontend/src/codeAnalyzer.js`), not a machine-learning model, so results are instant and work offline.

### Manual Algorithm Selection

1. Click the **"📊 Manual Setup"** tab
2. Select an algorithm from the dropdown
3. Enter input data (arrays, graphs, strings, etc.)
4. Click **"Start Full Visualization"**

## Supported Algorithms

### Sorting
- Bubble Sort, Merge Sort, Quick Sort, Insertion Sort, Selection Sort, Heap Sort

### Search
- Binary Search, Linear Search

### Graph
- BFS, DFS, Dijkstra's Algorithm

### Blind 75 Problems
- Two Sum, Maximum Subarray, Valid Parentheses, Longest Substring, Reverse Linked List
- Merge Intervals, Product Except Self, Contains Duplicate, Best Time to Buy/Sell Stock
- Valid Anagram, Valid Palindrome, Container With Most Water, 3Sum, House Robber
- Longest Increasing Subsequence, Unique Paths, Jump Game, Coin Change, and more

### Data Structures & Patterns
- BST Insert/Search, Recursion (Factorial, Fibonacci, Tower of Hanoi)
- Two Pointers, Sliding Window, Fast & Slow Pointers

## Project Structure

```
Algorithm-Visualizer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main app with view routing
│   │   ├── LandingPage.jsx          # Landing page
│   │   ├── AlgorithmVisualizer.jsx  # Manual setup + step generators
│   │   ├── CodeExplainer.jsx        # Code analyzer tab
│   │   ├── codeAnalyzer.js          # Weighted detector used by the analyzer tab
│   │   ├── algorithmDetector.jsx    # Older detector used by Manual Setup
│   │   └── NewVisualizer.jsx        # Full-screen visualization player
│   ├── scripts/test-detector.js     # Detection tests (npm test)
│   └── package.json
├── BLIND_75_MAPPING.md              # Blind 75 coverage roadmap
└── README.md
```

## Deployment

The site is a static Vite build hosted on Vercel. To deploy from your machine:

```bash
cd frontend
npx vercel deploy --prod
```

## Troubleshooting

### Port 5173 is already in use
- Close other Vite/React dev servers
- Or pick another port: `npm run dev -- --port 3000`

## Contributing

Contributions are welcome:
- Add more algorithm visualizations
- Improve detection rules in `codeAnalyzer.js` (and add a case to `scripts/test-detector.js`)
- Enhance the UI/UX
- Fix bugs or add features

## License

ISC
