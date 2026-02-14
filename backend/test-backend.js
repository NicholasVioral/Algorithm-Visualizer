// Test the detection function
function detectAlgorithmFromCode(code) {
  const patterns = {
    bubble: /bubble|(\[\s*j\s*\]\s*>\s*\[\s*j\s*\+\s*1\s*\])|adjacent.*swap/i,
    merge: /merge.*sort|mergesort|divide.*conquer|(mid|middle).*math\.floor.*\/\s*2/i,
  };

  for (const [algorithm, pattern] of Object.entries(patterns)) {
    if (pattern.test(code)) {
      return algorithm;
    }
  }

  return null;
}

function generateExplanation(_code, algorithm) {
  const explanations = {
    bubble: "This appears to be **Bubble Sort**",
    merge: "This looks like **Merge Sort**",
  };

  if (algorithm && explanations[algorithm]) {
    return explanations[algorithm];
  }

  return "Code analyzed. Try selecting an algorithm manually if detection was unsuccessful.";
}

// Test code
const testCode = "for i in range(n): for j in range(n-i-1): if arr[j] > arr[j+1]: swap";
const detected = detectAlgorithmFromCode(testCode);
const explanation = generateExplanation(testCode, detected);

console.log("Detected:", detected);
console.log("Explanation:", explanation);
console.log("\nJSON Response:");
console.log(JSON.stringify({
  explanation,
  suggestedAlgorithm: detected,
  success: true,
  method: 'Pattern-based Detection'
}, null, 2));
