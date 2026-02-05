// Simple heuristic-based algorithm detector
export function detectAlgorithm(code) {
  const algorithms = [
    {
      key: "bubble",
      name: "Bubble Sort",
      explanation: "Nested loops with adjacent comparisons and swaps.",
      checks: [
        /for\s*\(/g,
        /\[\s*j\s*\]\s*>\s*\[\s*j\s*\+\s*1\s*\]/,
        /swap|temp/
      ]
    },
    {
      key: "insertion",
      name: "Insertion Sort",
      explanation: "Shifts elements backward to insert the current value.",
      checks: [
        /while\s*\(.*j.*>=.*0.*\)/,
        /\[\s*j\s*\+\s*1\s*\]\s*=/,
      ]
    },
    {
      key: "selection",
      name: "Selection Sort",
      explanation: "Finds the minimum element and swaps once per pass.",
      checks: [
        /min(Index)?/,
        /for\s*\(/,
        /swap|temp/
      ]
    },
    {
      key: "binary",
      name: "Binary Search",
      explanation: "Uses low, high, and mid to divide the search space.",
      checks: [
        /mid\s*=/,
        /low|left/,
        /high|right/
      ]
    }
  ];

  let bestMatch = { key: null, name: "Unknown", score: 0 };

  algorithms.forEach(algo => {
    let score = 0;
    algo.checks.forEach(regex => {
      if (regex.test(code)) score++;
    });

    if (score > bestMatch.score) {
      bestMatch = { ...algo, score };
    }
  });

  return {
    algorithmKey: bestMatch.key,
    name: bestMatch.name,
    confidence: bestMatch.score === 0 ? 0 : Math.min(95, bestMatch.score * 25),
    explanation: bestMatch.explanation || ""
  };
}
