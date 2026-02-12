# Algorithm Visualizer with AI Code Analyzer

An interactive algorithm visualization tool with AI-powered code analysis. Visualize algorithms step-by-step, or let AI analyze your code and suggest which algorithm to visualize!

## Features

- 📊 **Manual Algorithm Setup**: Choose from 40+ algorithms and visualize them step-by-step
- 🤖 **AI Code Analyzer**: Paste your code and get AI-powered explanations and algorithm suggestions
- 🎯 **Blind 75 Coverage**: All Blind 75 LeetCode problems have visualizers
- 📈 **Real-time Visualization**: Watch algorithms execute with detailed insights at each step
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if you haven't already)
   ```bash
   git clone <your-repo-url>
   cd visualizer
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

You need to run **both** the frontend and backend servers:

#### Terminal 1: Start the Backend (AI Service)

```bash
cd backend
npm start
```

The backend will start on **http://localhost:5000**

#### Terminal 2: Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port if 5173 is busy)

### Using the AI Code Analyzer

1. Click the **"🤖 AI Code Analyzer"** tab at the top
2. Paste your algorithm code into the text area
3. Click **"✨ Analyze with AI"**
4. The AI will:
   - Explain what your code does
   - Identify the algorithm
   - Suggest which visualizer to use
5. Click **"Visualize This Algorithm →"** to automatically set up the visualizer

### Manual Algorithm Selection

1. Click the **"📊 Manual Setup"** tab
2. Select an algorithm from the dropdown
3. Enter input data (arrays, graphs, strings, etc.)
4. Click **"Start Full Visualization"** to see it in action

## Supported Algorithms

### Sorting Algorithms
- Bubble Sort, Merge Sort, Quick Sort, Insertion Sort, Selection Sort, Heap Sort

### Search Algorithms
- Binary Search, Linear Search

### Graph Algorithms
- BFS, DFS, Dijkstra's Algorithm

### Blind 75 Problems
- Two Sum, Maximum Subarray, Valid Parentheses, Longest Substring, Reverse Linked List
- Merge Intervals, Product Except Self, Contains Duplicate, Best Time to Buy/Sell Stock
- Valid Anagram, Valid Palindrome, Container With Most Water, 3Sum, House Robber
- Longest Increasing Subsequence, Unique Paths, Jump Game, Coin Change, and more!

### Data Structures & Patterns
- BST Insert/Search, Recursion (Factorial, Fibonacci, Tower of Hanoi)
- Two Pointers, Sliding Window, Fast & Slow Pointers

## Environment Variables

The backend uses Hugging Face's API for AI code analysis. The API key is already configured in `backend/.env`:

```
HF_API_KEY=<your-api-key-here>
```

**Note**: The included API key is for demonstration purposes. For production use, get your own API key from [Hugging Face](https://huggingface.co/settings/tokens).

## Project Structure

```
visualizer/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── App.jsx              # Main app with view routing
│   │   ├── AlgorithmVisualizer.jsx  # Manual algorithm setup
│   │   ├── CodeExplainer.jsx        # AI code analyzer
│   │   ├── NewVisualizer.jsx        # Visualization display
│   │   └── algorithmDetector.jsx    # Pattern-based algorithm detection
│   └── package.json
└── backend/           # Express backend for AI
    ├── backend.js     # AI code analysis endpoint
    ├── .env           # Environment variables
    └── package.json
```

## Troubleshooting

### Backend not connecting

**Error**: "Failed to connect to backend. Make sure the server is running on port 5000."

**Solution**:
1. Make sure the backend is running: `cd backend && npm start`
2. Check that port 5000 is not being used by another application
3. Verify the `.env` file exists in the backend folder with `HF_API_KEY` set

### AI responses are slow

The Hugging Face API can take 5-15 seconds to respond, especially on first use (model loading). This is normal behavior for the free tier.

### Frontend won't start

If you see "Port 5173 is already in use":
- Close any other Vite/React dev servers
- Or use the port Vite suggests: `npm run dev -- --port 3000`

## Contributing

Contributions are welcome! Feel free to:
- Add more algorithm visualizations
- Improve the AI prompts for better detection
- Enhance the UI/UX
- Fix bugs or add features

## License

ISC
