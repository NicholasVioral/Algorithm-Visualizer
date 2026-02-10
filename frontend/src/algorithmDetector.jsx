// Algorithm Detection Module
// Analyzes code snippets to identify which algorithm is being used

const algorithmPatterns = {
  bubble: {
    name: "Bubble Sort",
    key: "bubble",
    patterns: [
      // Core bubble sort pattern: nested loops with adjacent comparison
      /for\s*\([^)]*[<>]\s*.*\)\s*{[\s\S]{0,500}for\s*\([^)]*[<>]\s*.*\)\s*{[\s\S]{0,200}if\s*\([^[]*\[[^\]]*\]\s*[><!]=?\s*[^[]*\[[^\]]*\]\s*\)/i,
      // Explicit bubble keyword
      /bubble.*sort|bubblesort/i,
      // Adjacent element swap pattern
      /swap.*adjacent|adjacent.*swap/i,
      // Classic arr[j] > arr[j+1] comparison
      /\[j\]\s*[><!]=?\s*\[j\s*\+\s*1\]|\[i\]\s*[><!]=?\s*\[i\s*\+\s*1\]/,
      // Python tuple swap for adjacent elements
      /arr\[j\],\s*arr\[j\s*\+\s*1\]\s*=\s*arr\[j\s*\+\s*1\],\s*arr\[j\]|arr\[i\],\s*arr\[i\s*\+\s*1\]\s*=\s*arr\[i\s*\+\s*1\],\s*arr\[i\]/,
      // Outer loop optimization: length - i - 1
      /range\(\s*\w+\s*-\s*\w+\s*-\s*1\)|(?:length|len)\s*-\s*[i]\s*-\s*1/,
      // Nested loop structure (more specific - must have 2 for loops)
      /for\s*\([^{]*\{[^}]*for\s*\([^{]*\{|for\s+\w+\s+in\s+range[^:]*:[^:]*for\s+\w+\s+in\s+range/s,
      // Swapping with temp variable
      /temp\s*=\s*arr\[\w+\][\s\S]{0,50}arr\[\w+\]\s*=\s*arr\[\w+\s*[+-]\s*1\][\s\S]{0,50}arr\[\w+\s*[+-]\s*1\]\s*=\s*temp/,
      // Boolean flag for optimization (swapped flag)
      /swapped\s*=\s*(true|false)|swapped\s*=\s*\d/i,
    ],
    keywords: ["swap", "adjacent", "bubble", "compare", "sort", "swapped"],
    weight: {
      nestedLoops: 3,
      adjacentComparison: 5,
      swap: 2,
      bubbleKeyword: 4
    }
  },
  
  merge: {
    name: "Merge Sort",
    key: "merge",
    patterns: [
      // Explicit merge sort keyword
      /merge.*sort|mergesort/i,
      // Divide and conquer keyword
      /divide.*conquer|divide-and-conquer/i,
      // Function named merge (strong indicator)
      /def\s+merge\s*\(|function\s+merge\s*\(|const\s+merge\s*=/i,
      // Midpoint calculation (standard names)
      /(mid|midpoint|middle)\s*=.*\(.*\+.*\)\s*\/\/?\s*2|mid\s*=.*Math\.floor/i,
      // Array slicing for left and right halves (standard names)
      /\.slice\(.*mid\)|\.slice\(0,\s*mid\)|arr\[.*:.*mid.*\]|arr\[mid.*:.*\]/i,
      // Base case: array length <= 1
      /(length|len)\s*<=\s*1|if.*length.*==\s*1.*return|if.*not.*arr.*return/i,
      // Recursive calls to merge sort (standard names)
      /merge.*sort\(.*\.slice|merge.*sort\(left|merge.*sort\(right/i,
      // Left and right arrays (standard names)
      /(left|leftHalf|l)\s*=[\s\S]{0,100}(right|rightHalf|r)\s*=/i,
      // Merge function combining left and right
      /merge\(left.*right\)|merge\(.*,.*left.*,.*right\)/i,
      // While loops for merging (i, j, k pointers)
      /while.*[ij].*<.*len\(left|while.*[ij].*<.*left\.length/i,
      // Merging pattern with index comparison
      /if.*left\[.*\].*right\[.*\]|if.*arr.*<=.*arr/is,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Base case: if len <= 1, return
      /if\s+len\(\w+\)\s*<=\s*1:[\s\S]{0,100}return\s+\w+/s,
      // Mid calculation: var = len(arr) // 2
      /\w+\s*=\s*len\(\w+\)\s*\/\/\s*2/,
      // Array slicing: arr[:var] and arr[var:]
      /\w+\s*=\s*\w+\[:\w+\][\s\S]{0,100}\w+\s*=\s*\w+\[\w+:\]/s,
      // Two recursive calls with slicing
      /\w+\s*=\s*\w+\(\w+\[:\w+\]\)[\s\S]{0,100}\w+\s*=\s*\w+\(\w+\[\w+:\]\)/s,
      // While both arrays/lists are not empty
      /while\s+\w+\s+and\s+\w+:/,
      // Compare first elements: if arr1[0] < arr2[0]
      /if\s+\w+\[0\]\s*[<>]=?\s*\w+\[0\]/,
      // Append with pop(0) pattern
      /\w+\.append\(\w+\.pop\(0\)\)/,
      // Return concatenated arrays: return result + left + right
      /return\s+\w+\s*\+\s*\w+\s*\+\s*\w+/,
      // Recursive function with base case, mid, and slicing
      /def\s+\w+\(\w+\):[\s\S]{0,200}if\s+len\(\w+\)[\s\S]{0,300}\/\/\s*2[\s\S]{0,400}\[:\w+\][\s\S]{0,200}\[\w+:\]/s,
      // Complete structure: base case + recursive calls + merge
      /if\s+len\([^)]+\)\s*<=\s*1[\s\S]{0,600}while\s+\w+\s+and\s+\w+:[\s\S]{0,300}return\s+\w+\s*\+/s,
    ],
    keywords: ["merge", "divide", "conquer", "mid", "split", "sort", "left", "right"],
    weight: {
      mergeKeyword: 5,
      divideConquer: 4,
      midpoint: 3,
      leftRight: 2
    }
  },
  
  quick: {
    name: "Quick Sort",
    key: "quick",
    patterns: [
      // Explicit quick sort keyword
      /quick.*sort|quicksort/i,
      // Pivot keyword (very strong indicator)
      /\bpivot\b/i,
      // Partition function (strong indicator)
      /def\s+partition|function\s+partition|const\s+partition\s*=/i,
      // Pivot selection patterns
      /pivot\s*=\s*(arr\[.*\]|array\[.*\]|nums\[.*\])/i,
      // Comparison with pivot
      /(arr|array|nums)\[.*\]\s*[<>]=?\s*pivot|pivot\s*[<>]=?\s*(arr|array|nums)/i,
      // Low and high pointers
      /(low|left)\s*=[\s\S]{0,100}(high|right)\s*=/i,
      // Partition index
      /(partitionIndex|pi|p)\s*=|i\s*=\s*low\s*-\s*1/i,
      // Swap with pivot
      /swap\(.*pivot|arr\[.*\],\s*arr\[.*pivot.*\]/i,
      // Recursive quicksort calls with partition
      /quick.*sort\(.*low.*partition|quick.*sort\(.*partition.*high\)/i,
      // While loop for partitioning
      /while.*(low|i).*<.*(high|j)[\s\S]{0,200}pivot/is,
      // Three-way partitioning
      /less.*than.*pivot|greater.*than.*pivot/i,
      // In-place partitioning
      /\[i\],\s*arr\[j\]\s*=\s*arr\[j\],\s*arr\[i\]/,
    ],
    keywords: ["pivot", "partition", "quick", "sort", "low", "high"],
    weight: {
      pivotKeyword: 5,
      partitionKeyword: 5,
      quickKeyword: 4
    }
  },
  
  insertion: {
    name: "Insertion Sort",
    key: "insertion",
    patterns: [
      // Explicit insertion sort keyword
      /insertion.*sort|insertionsort/i,
      // Key variable pattern (classic insertion sort with standard names)
      /(key|current|temp)\s*=\s*(arr|array|nums)\[i\]/i,
      // While loop with >= 0 condition (shifting elements)
      /while\s+.*>=\s*0\s*&&|while.*>=\s*0.*and/i,
      // Backward iteration while comparing (standard names)
      /while\s+[j]\s*>=\s*0.*arr\[j\].*[<>].*key/i,
      // Element shifting pattern
      /arr\[j\s*\+\s*1\]\s*=\s*arr\[j\]|arr\[.*\+.*1\].*=.*arr\[.*\]/i,
      // Insert key at correct position (standard names)
      /arr\[j\s*\+\s*1\]\s*=\s*key|arr\[.*\]\s*=\s*(key|current|temp)/i,
      // Outer loop starts from 1 or second element
      /for.*in.*range\(1,|for.*=\s*1;.*<.*length|for.*i\s*=\s*1/i,
      // Insert keyword
      /insert.*sorted|insert.*position/i,
      // Sorted portion concept
      /sorted.*portion|sorted.*part/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Loop from 1 with variable assignment from array
      /for\s+\w+\s+in\s+range\(1,[\s\S]{0,200}\w+\s*=\s*\w+\[\w+\]/s,
      // Variable set to loop_var - 1, then while >= 0
      /\w+\s*=\s*\w+\s*-\s*1[\s\S]{0,100}while\s+\w+\s*>=\s*0/s,
      // While loop with >= 0 and array comparison (generic)
      /while\s+\w+\s*>=\s*0\s+and\s+\w+\[\w+\]\s*>\s*\w+/,
      // Shifting pattern: arr[j+1] = arr[j] with any variable names
      /\w+\[\w+\s*\+\s*1\]\s*=\s*\w+\[\w+\][\s\S]{0,100}\w+\s*-=\s*1/s,
      // Decrement in while loop with shifting
      /while\s+\w+\s*>=\s*0[\s\S]{0,200}\w+\s*-=\s*1/s,
      // Insert after while loop: arr[var + 1] = saved_value
      /while[\s\S]{0,300}\w+\[\w+\s*\+\s*1\]\s*=\s*\w+(?!\[)/s,
      // Complete structure: for from 1, save value, while >=0 with shift
      /for\s+\w+\s+in\s+range\(1[\s\S]{0,100}\w+\s*=\s*\w+\[[\s\S]{0,200}while\s+\w+\s*>=\s*0[\s\S]{0,300}\w+\s*-=\s*1/s,
    ],
    keywords: ["insert", "key", "shift", "sorted", "current"],
    weight: {
      insertionKeyword: 5,
      keyPattern: 4,
      whileShift: 3
    }
  },
  
  selection: {
    name: "Selection Sort",
    key: "selection",
    patterns: [
      // Explicit selection sort keyword
      /selection.*sort|selectionsort/i,
      // Min index variable (classic pattern with standard names)
      /(min.*index|minIndex|min_index|min_idx|min_pos)/i,
      // Find minimum element
      /find.*min|minimum.*element/i,
      // Min index initialization (standard names)
      /(min.*index|minIndex)\s*=\s*i/i,
      // Inner loop to find minimum
      /for.*j.*in.*range\(i.*,|for.*j\s*=\s*i.*<.*length/i,
      // Comparison to update min index (standard names)
      /if.*arr\[j\].*<.*arr\[(min.*index|minIndex)\]|if.*arr\[.*\].*<.*arr\[min/i,
      // Update min index (standard names)
      /(min.*index|minIndex)\s*=\s*j/i,
      // Swap minimum with current position (standard names)
      /swap\(.*i.*min|arr\[i\],\s*arr\[(min.*index|minIndex)\]|arr\[(min.*index|minIndex)\],\s*arr\[i\]/i,
      // Select keyword
      /select.*minimum|select.*smallest/i,
      // Nested loops with minimum finding
      /for.*i.*for.*j.*min.*arr\[j\]/s,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Variable initialized to outer loop index
      /\w+\s*=\s*\w+[\s\S]{0,50}for\s+\w+\s+in\s+range\((\1)\s*\+\s*1/s,
      // Inner loop starting from i+1
      /for\s+\w+\s+in\s+range\(\w+\s*\+\s*1\s*,\s*len\(|for\s*\(\s*\w+\s*=\s*\w+\s*\+\s*1/i,
      // Comparison and index update pattern (if arr[j] < arr[var]: var = j)
      /if\s+\w+\[\w+\]\s*<\s*\w+\[\w+\][\s\S]{0,100}\w+\s*=\s*\w+/s,
      // Generic nested loop with comparison
      /for\s+\w+\s+in\s+range\([^)]+\):[\s\S]{0,200}for\s+\w+\s+in\s+range\(\w+\s*\+\s*1[\s\S]{0,300}if[\s\S]{0,200}<[\s\S]{0,200}\w+\s*=\s*\w+/s,
      // Swap pattern with outer loop variable
      /\w+\[\w+\]\s*,\s*\w+\[\w+\]\s*=\s*\w+\[\w+\]\s*,\s*\w+\[\w+\]/,
      // Finding minimum in remaining array (structural)
      /for\s+\w+\s+in\s+range\(1,[\s\S]{0,500}for\s+\w+\s+in\s+range\(\w+[\s\S]{0,300}<[\s\S]{0,200}=/s,
    ],
    keywords: ["selection", "minimum", "min", "select", "minIndex"],
    weight: {
      selectionKeyword: 5,
      minimumPattern: 4,
      findMin: 3
    }
  },
  
  heap: {
    name: "Heap Sort",
    key: "heap",
    patterns: [
      /heap/i,
      /heapify/i,
      /max.*heap|min.*heap/i,
      /parent|left.*child|right.*child/i,
    ],
    keywords: ["heap", "heapify", "parent", "child"],
    weight: {
      heapKeyword: 5,
      heapifyKeyword: 5,
      treeStructure: 3
    }
  },
  
  binary: {
    name: "Binary Search",
    key: "binary",
    patterns: [
      // Explicit binary search keyword
      /binary.*search|binarysearch/i,
      // Core pattern: left, right, and mid variables present (standard names)
      /(left|start|low|l)\s*=\s*0[\s\S]{0,100}(right|end|high|r)\s*=[\s\S]{0,100}(mid|m)\s*=/i,
      // While loop with left <= right condition (standard names)
      /while\s*\(\s*(left|start|low|l)\s*<=\s*(right|end|high|r)\s*\)|while\s+(left|l)\s*<=\s*(right|r)\s*:/i,
      // Mid calculation with Math.floor or integer division (standard names)
      /(mid|m)\s*=\s*Math\.floor\s*\(\s*\((left|start|low|l)\s*\+\s*(right|end|high|r)\s*\)\s*\/\s*2\s*\)|(mid|m)\s*=\s*\(\s*(left|l)\s*\+\s*(right|r)\s*\)\s*\/\/\s*2/i,
      // Simplified mid calculation (standard names)
      /(mid|m)\s*=\s*\(\s*(left|start|low|l)\s*\+\s*(right|end|high|r)\s*\)\s*\/\s*2|mid\s*=\s*\(l\s*\+\s*r\)\s*>>>\s*1/i,
      // Left pointer update: left = mid + 1 (standard names)
      /(left|start|low|l)\s*=\s*(mid|m)\s*\+\s*1/i,
      // Right pointer update: right = mid - 1 (standard names)
      /(right|end|high|r)\s*=\s*(mid|m)\s*-\s*1/i,
      // Array access at mid (standard names)
      /arr\[(mid|m)\]|array\[(mid|m)\]|nums\[(mid|m)\]|list\[(mid|m)\]/i,
      // Comparison with target (standard names)
      /(arr|array|nums|list)\[(mid|m)\]\s*[<>=!]+\s*(target|key|value|x)/i,
      // Binary search recursive pattern
      /return\s+binary.*\(.*mid\s*[+-]\s*1/i,
      // Python-style binary search
      /def\s+binary.*search.*\(.*\):.*while.*<=.*:.*\/\//s,
      // Bitshift for mid calculation (optimization)
      /\(left\s*\+\s*right\)\s*>>>\s*1|\(l\s*\+\s*r\)\s*>>>\s*1/,
      // Return statements typical of binary search
      /return\s+(mid|m|left|right|l|r)(?!\s*\+\s*\d)/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Two variables: one = 0, another = len(arr) - 1 or length - 1
      /\w+\s*=\s*0[\s\S]{0,100}\w+\s*=\s*(len\([^)]+\)\s*-\s*1|[^.]+\.length\s*-\s*1)/i,
      // While loop with <= between two variables
      /while\s+\w+\s*<=\s*\w+\s*:/,
      // Mid calculation: var = (var1 + var2) // 2 (Python integer division)
      /\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\/\s*2/,
      // Mid calculation: var = Math.floor((var1 + var2) / 2) (JS)
      /\w+\s*=\s*Math\.floor\s*\(\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2\s*\)/,
      // Generic mid calculation: var = (var1 + var2) / 2
      /\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\s*2(?!\/)/,
      // One pointer increases by mid + 1
      /\w+\s*=\s*\w+\s*\+\s*1(?![\d])/,
      // Other pointer decreases by mid - 1
      /\w+\s*=\s*\w+\s*-\s*1(?![\d])/,
      // Array access with comparison to target (generic)
      /if\s+\w+\[\w+\]\s*[=!<>]+\s*\w+/,
      // Array element comparison pattern (any array, any index, any target)
      /\w+\[\w+\]\s*[<>=!]+\s*\w+[\s\S]{0,100}\w+\s*=\s*\w+\s*[+-]\s*1/s,
      // Comparison and conditional update structure
      /if.*\[.*\].*[<>].*:[\s\S]{0,100}\w+\s*=\s*\w+\s*\+\s*1[\s\S]{0,100}else[\s\S]{0,100}\w+\s*=\s*\w+\s*-\s*1/s,
      // Return index pattern
      /return\s+\w+(?!\()/,
    ],
    keywords: ["binary", "search", "left", "right", "mid", "half", "target", "l", "r", "m", "logarithmic"],
    weight: {
      binaryKeyword: 5,
      leftRightMid: 4,
      whileLeftRight: 4,
      midCalculation: 5
    }
  },
  
  linear: {
    name: "Linear Search",
    key: "linear",
    patterns: [
      /linear.*search/i,
      /for.*length.*if.*==.*target/i,
      /sequential.*search/i,
    ],
    keywords: ["linear", "sequential", "search", "target"],
    weight: {
      linearKeyword: 5,
      sequentialSearch: 3,
      simpleLoop: 2
    }
  },
  
  bfs: {
    name: "Breadth-First Search",
    key: "bfs",
    patterns: [
      // Explicit BFS keyword
      /\bbfs\b|breadth.*first|breadth-first/i,
      // Queue keyword (strong indicator)
      /\bqueue\b|Queue\(/i,
      // Python deque import and usage
      /from\s+collections\s+import\s+deque|deque\(/i,
      // Queue operations
      /enqueue|dequeue|popleft/i,
      // Level order traversal
      /level.*order|level.*traversal/i,
      // Visited set/array usage
      /visited\s*=\s*(new\s+Set\(\)|\[\]|set\(\))|visited\[.*\]\s*=\s*true/i,
      // Queue initialization and loop
      /queue\s*=\s*\[.*\][\s\S]{0,200}while.*queue\.length|queue\s*=\s*deque\(.*\)[\s\S]{0,200}while.*queue/is,
      // JavaScript shift() for queue dequeue
      /\.shift\(\)|queue\.pop\(0\)/,
      // JavaScript push() for queue enqueue
      /queue\.push\(|queue\.append\(/,
      // Neighbor iteration in graph
      /for.*neighbor|for.*in.*graph\[.*\]|for.*of.*graph\[.*\]/i,
      // Structural: Set + Array + while + shift pattern
      /new\s+Set\(\)[\s\S]{0,300}=\s*\[[\s\S]{0,300}while[\s\S]{0,100}\.shift\(\)/s,
      // Structural: visited check before adding to queue
      /if\s*\(\s*!visited\.has|if\s*\(\s*not\s+visited|if.*not\s+in\s+visited/i,
      // Structural: add to visited when enqueuing
      /visited\.add\(|visited\[.*\]\s*=\s*true/,
      // While queue not empty pattern
      /while\s+(queue\.length\s*>\s*0|len\(queue\)\s*>\s*0|queue)/i,
      // Level-based BFS (tracking levels)
      /level\s*=\s*0|depth\s*=\s*0[\s\S]{0,100}for.*in.*range\(len\(queue\)\)/s,
    ],
    keywords: ["bfs", "breadth", "queue", "level", "enqueue", "dequeue", "visited", "neighbor", "graph", "deque", "shift"],
    weight: {
      bfsKeyword: 5,
      queueKeyword: 4,
      levelOrder: 3
    }
  },
  
  dfs: {
    name: "Depth-First Search",
    key: "dfs",
    patterns: [
      // Explicit DFS keyword
      /\bdfs\b|depth.*first|depth-first/i,
      // Stack keyword
      /\bstack\b/i,
      // Recursive approach detection
      /def\s+dfs|function\s+dfs|const\s+dfs\s*=/i,
      // Depth-first keyword
      /depth.*traversal|preorder|inorder|postorder/i,
      // Visited set/array
      /visited\s*=\s*(new\s+Set\(\)|set\(\)|\[\])|visited\[.*\]\s*=\s*true/i,
      // Stack operations (iterative DFS)
      /stack\.push\(|stack\.pop\(|stack\.append\(/i,
      // Graph traversal
      /for.*neighbor|for.*in.*graph\[.*\]|for.*of.*graph\[.*\]|for.*in.*adj/i,
      // Visited check pattern
      /if\s*\(\s*!visited\.has|if\s*\(\s*not\s+visited|if.*not\s+in\s+visited|if\s*\(\s*visited\[.*\]\s*===\s*false/i,
      // Marking as visited
      /visited\.add\(|visited\[.*\]\s*=\s*true/,
      // Recursive call to DFS
      /dfs\(.*neighbor|dfs\(.*node\.|dfs\(.*child/i,
      // Backtracking pattern
      /backtrack|visited\[.*\]\s*=\s*false|visited\.delete\(/i,
      // Base case for recursion
      /if\s*\(\s*!node\s*\)|if\s*\(\s*node\s*===\s*null\)|if\s*\(\s*not\s+node\s*\)/i,
      // Stack-based iterative DFS
      /while\s+(stack\.length|len\(stack\)|stack)[\s\S]{0,100}\.pop\(\)/is,
      // Return from recursive DFS
      /return\s+dfs\(/i,
      // Tree traversal patterns
      /node\.left|node\.right|root\.left|root\.right/i,
    ],
    keywords: ["dfs", "depth", "stack", "recursive", "backtrack", "visited", "neighbor", "graph", "preorder", "inorder", "postorder"],
    weight: {
      dfsKeyword: 5,
      stackKeyword: 4,
      recursivePattern: 3
    }
  },
  
  dijkstra: {
    name: "Dijkstra's Algorithm",
    key: "dijkstra",
    patterns: [
      // Explicit Dijkstra keyword
      /dijkstra/i,
      // Shortest path keyword
      /shortest.*path|minimum.*distance/i,
      // Priority queue or heap usage
      /priority.*queue|priorityqueue|minheap|min.*heap/i,
      // Python heapq library
      /import\s+heapq|from\s+heapq|heapq\./i,
      // Heap operations
      /heappush|heappop|heapify/i,
      // Distance initialization to infinity (standard names)
      /(dist|distance|distances)\s*=\s*\[.*inf|dist\s*=\s*\{.*:\s*inf|dist\s*=\s*defaultdict\(.*inf/i,
      // Starting distance set to 0 (standard names)
      /(dist|distance)\[.*\]\s*=\s*0|dist\s*=\s*\{.*:\s*0/i,
      // While heap is not empty
      /while\s+(heap|pq|priority|minHeap)[\s\S]{0,100}heappop|while\s+heap:/is,
      // Visited/visit set to avoid revisiting
      /(visit|visited)\s*=\s*set\(\)|(visit|visited)\s*=\s*\[.*\]|if.*in.*visit/i,
      // Skip visited nodes
      /if.*in.*visit.*continue|if.*visited\[.*\].*continue/i,
      // Add to visited set
      /(visit|visited)\.add\(|(visit|visited)\[.*\]\s*=\s*true/i,
      // Edge relaxation (standard names)
      /(new_dist|new_distance|tentative)\s*=\s*(dist|distance)\[.*\]\s*\+\s*(weight|cost)|dist\[.*\]\s*\+\s*weight/i,
      // Update distance if shorter path found (standard names)
      /if\s+.*<\s*(dist|distance)\[.*\].*heappush|if.*dist.*<.*dist.*heappush/is,
      // Neighbor iteration with weights
      /for.*neighbor.*weight|for.*\(neighbor.*weight\)|for.*edge.*in.*edges/i,
      // Graph with weights structure
      /(graph|adj|edges)\[.*\]\.append\(.*,.*\)|(graph|edges)\[.*\]\s*=.*weight/i,
      // JavaScript MinHeap or PriorityQueue class usage
      /new\s+(MinHeap|PriorityQueue)\(\)|minHeap\.insert|minHeap\.extractMin/i,
      // Maximum time/distance pattern (network delay time problems)
      /max\(.*dist|max.*distance|all.*dist.*inf/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Array/list initialized with infinity
      /\w+\s*=\s*\[float\(['"]inf['"]\)\]\s*\*|[\s\S]{0,100}=\s*\[[^\]]*inf[^\]]*\]/i,
      // heapq with list initialization and heappop in while loop
      /heappush[\s\S]{0,400}while\s+\w+[\s\S]{0,200}heappop/s,
      // Set for visited + heap pattern
      /\w+\s*=\s*set\(\)[\s\S]{0,300}heappop[\s\S]{0,300}if.*in.*\w+/s,
      // Array index set to 0 (starting node)
      /\w+\[[\w\s]+\]\s*=\s*0[\s\S]{0,300}heappush/s,
      // Generic relaxation: if new_value < array[index]
      /\w+\s*=\s*\w+\[[\w\s]+\]\s*\+[\s\S]{0,200}if\s+\w+\s*<\s*\w+\[/s,
      // heappush with tuple (cost, node)
      /heappush\(\w+\s*,\s*\([^)]+\)\)/,
      // Unpack tuple from heappop
      /\w+\s*,\s*\w+\s*=\s*heappop/,
      // Continue if already visited pattern
      /if\s+\w+\s+in\s+\w+:[\s\S]{0,100}continue/s,
      // Add to set after popping from heap
      /heappop[\s\S]{0,200}\w+\.add\(/s,
      // Loop through neighbors with tuple unpacking
      /for\s+\w+\s*,\s*\w+\s+in\s+\w+\[/,
    ],
    keywords: ["dijkstra", "shortest", "path", "distance", "weight", "priority", "heap", "heapq", "dist", "graph", "minHeap", "visit", "edges", "relax"],
    weight: {
      dijkstraKeyword: 5,
      shortestPath: 4,
      priorityQueue: 4
    }
  },

  bellmanford: {
    name: "Bellman-Ford Algorithm",
    key: "bellmanford",
    patterns: [
      // Explicit Bellman-Ford keyword
      /bellman.*ford|bellman-ford|bellmanford/i,
      // V-1 iterations over all edges (classic pattern)
      /for.*in.*range\(.*\d+.*\)[\s\S]{0,100}for.*in.*(edges|flights)/s,
      // K iterations pattern (k stops problem variant)
      /for.*k.*in.*range[\s\S]{0,200}for.*(edge|flight)/s,
      // Distance initialization to infinity
      /(dist|distance|prices|cost)\s*=\s*\[.*inf|dist\s*=\s*\{.*:\s*float\('inf'\)/i,
      // Source distance set to 0
      /(dist|distance|prices|cost)\[(src|source|start)\]\s*=\s*0/i,
      // Edge relaxation with condition
      /if.*(dist|prices)\[.*\]\s*\+.*(weight|cost|price).*<.*(dist|prices)\[.*\]/is,
      // Temporary array copy (for correct algorithm)
      /(tmpDist|tmpPrices|temp|new_dist)\s*=.*(dist|prices)\.copy\(\)|temp.*=.*dist\[:\]/i,
      // Relaxation keyword
      /relax.*edge|relaxation|edge.*relaxation/i,
      // Negative cycle detection
      /negative.*cycle|cycle.*detection/i,
      // Iterate through all edges
      /for.*edge.*in.*edges.*for.*in.*range|for.*u.*v.*weight.*in.*edges/s,
    ],
    keywords: ["bellman", "ford", "shortest", "path", "relax", "edges", "flights", "prices", "dist", "negative", "cycle"],
    weight: {
      bellmanKeyword: 5,
      relaxation: 4,
      iterativePattern: 4
    }
  },
  
  "bst-insert": {
    name: "BST Insert",
    key: "bst-insert",
    patterns: [
      /bst.*insert|binary.*search.*tree.*insert/i,
      /insert.*tree/i,
      /node\.left|node\.right/i,
      /new.*node/i,
    ],
    keywords: ["bst", "insert", "tree", "node", "left", "right"],
    weight: {
      bstInsertKeyword: 5,
      treeStructure: 3,
      newNode: 3
    }
  },
  
  "bst-search": {
    name: "BST Search",
    key: "bst-search",
    patterns: [
      /bst.*search|binary.*search.*tree.*search/i,
      /search.*tree/i,
      /node\.val|node\.data/i,
    ],
    keywords: ["bst", "search", "tree", "node", "find"],
    weight: {
      bstSearchKeyword: 5,
      treeSearch: 4
    }
  },
  
  recursion: {
    name: "Recursion (Factorial)",
    key: "recursion",
    patterns: [
      /factorial/i,
      /return.*n.*\*.*factorial|return.*factorial.*\*.*n/i,
      /base.*case/i,
      /n\s*<=\s*1|n\s*==\s*1|n\s*<\s*2/i,
      /if.*n.*1.*return|if.*n.*==.*0.*return/i,
      /def\s+factorial|function\s+factorial/i,
    ],
    keywords: ["factorial", "recursive", "base", "case"],
    weight: {
      factorialKeyword: 5,
      recursiveCall: 4,
      baseCase: 3
    }
  },
  
  fibonacci: {
    name: "Fibonacci (Recursive)",
    key: "fibonacci",
    patterns: [
      /fibonacci|fib\(/i,
      /fib\(n\s*-\s*1\).*\+.*fib\(n\s*-\s*2\)|fib\(n\s*-\s*2\).*\+.*fib\(n\s*-\s*1\)/i,
      /n\s*<=\s*1.*return.*n|if.*n.*<=.*1/i,
      /return.*fib.*fib/i,
      /def\s+fib|function\s+fib/i,
    ],
    keywords: ["fibonacci", "fib", "recursive"],
    weight: {
      fibonacciKeyword: 5,
      fibPattern: 5,
      baseCase: 3
    }
  },
  
  "fibonacci-dp": {
    name: "Fibonacci (Dynamic Programming)",
    key: "fibonacci-dp",
    patterns: [
      /fibonacci.*dp|fib.*memo/i,
      /memo|cache|dp/i,
      /\[i\s*-\s*1\].*\+.*\[i\s*-\s*2\]/i,
    ],
    keywords: ["fibonacci", "dp", "memoization", "cache", "table"],
    weight: {
      fibonacciDPKeyword: 5,
      memoization: 5,
      dpPattern: 4
    }
  },
  
  "tower-hanoi": {
    name: "Tower of Hanoi",
    key: "tower-hanoi",
    patterns: [
      /hanoi|tower/i,
      /source.*destination.*auxiliary/i,
      /move.*disk/i,
      /n\s*-\s*1.*disks/i,
    ],
    keywords: ["hanoi", "tower", "disk", "peg", "move", "auxiliary"],
    weight: {
      hanoiKeyword: 5,
      diskMovement: 4,
      recursiveHanoi: 4
    }
  },

  "two-pointers": {
    name: "Two Pointers",
    key: "two-pointers",
    patterns: [
      // Explicit two pointers keyword
      /two.*pointer|twopointer/i,
      // Left and right pointers - separate initialization
      /(left|l)\s*=\s*0[\s\S]{0,100}(right|r)\s*=.*(length|len\()/i,
      // Python tuple unpacking: l, r = 0, len(arr) - 1
      /(left|l)\s*,\s*(right|r)\s*=\s*0\s*,\s*.*(len\(|length)/i,
      // While left < right pattern
      /while\s*\(\s*(left|l)\s*<\s*(right|r)\s*\)|while\s+(left|l)\s*<\s*(right|r)\s*:/i,
      // Left increment pattern
      /(left|l)\s*\+\+|(left|l)\s*\+=\s*1|(left|l)\s*=\s*(left|l)\s*\+\s*1/i,
      // Right decrement pattern
      /(right|r)\s*--|(right|r)\s*-=\s*1|(right|r)\s*=\s*(right|r)\s*-\s*1/i,
      // Two pointers on same array/string
      /(left|start|i)\s*=\s*0[\s\S]{0,100}(right|end|j)\s*=\s*0/i,
      // Array/string access with both pointers
      /\w+\[(left|l)\][\s\S]{0,200}\w+\[(right|r)\]/s,
      // Pointer comparison in condition
      /if.*(left|l).*<.*(right|r)|if.*(right|r).*>.*(left|l)/i,
      // Move pointers based on comparison
      /(left|l)\s*\+\+.*else.*(right|r)\s*--|(left|l)\s*\+=.*else.*(right|r)\s*-=/s,
      // Distance calculation (r - l)
      /\((right|r)\s*-\s*(left|l)\)|distance|width|area/i,
    ],
    keywords: ["two", "pointer", "left", "right", "start", "end", "converge", "l", "r"],
    weight: {
      twoPointerKeyword: 5,
      leftRightPattern: 4,
      whileLeftRight: 4
    }
  },

  "sliding-window": {
    name: "Sliding Window",
    key: "sliding-window",
    patterns: [
      // Explicit sliding window keyword
      /sliding.*window|slidingwindow/i,
      // Window with left and right pointers (standard names)
      /(left|l|start)\s*=\s*0[\s\S]{0,200}(right|r|end)\s*=\s*0[\s\S]{0,200}for|while/is,
      // Variable = 0, for loop, nested while with increment (generic structure)
      /\w+\s*=\s*0[\s\S]{0,300}for\s+\w+\s+in\s+range[\s\S]{0,300}while[\s\S]{0,200}\w+\s*\+=\s*1/s,
      // Shrinking window: while condition with increment inside
      /while.*[><=].*:[\s\S]{0,100}\w+\s*\+=\s*1/s,
      // Window size calculation: variable subtraction + 1
      /\w+\s*-\s*\w+\s*\+\s*1/,
      // Max/min tracking with subtraction
      /max\([^,]+,\s*\w+\s*-\s*\w+|min\([^,]+,\s*\w+\s*-\s*\w+/,
      // Adding to sum/count in for loop
      /for.*range[\s\S]{0,200}\w+\s*\+=.*\[/s,
      // Subtracting from sum/count in while
      /while.*:[\s\S]{0,100}\w+\s*-=.*\[/s,
      // For loop with nested while (classic sliding window structure)
      /for\s+\w+\s+in\s+range\(len\([\s\S]{0,300}while[\s\S]{0,300}max\(/s,
      // Max/min window tracking (any variable names)
      /max.*window|min.*window|maxLen|maxSum|best.*max|result.*max/i,
      // Hash map with window
      /window\s*=\s*\{|map\s*=.*Map\(\)[\s\S]{0,200}for/s,
    ],
    keywords: ["window", "sliding", "left", "right", "subarray", "substring", "maxLen", "max", "min"],
    weight: {
      slidingWindowKeyword: 5,
      windowPattern: 4,
      expandShrink: 4
    }
  },

  "fast-slow-pointers": {
    name: "Fast & Slow Pointers (Floyd's Cycle)",
    key: "fast-slow-pointers",
    patterns: [
      // Explicit Floyd or cycle detection
      /floyd|cycle.*detect|detect.*cycle/i,
      // Fast and slow pointers
      /(slow|tortoise)\s*=[\s\S]{0,100}(fast|hare)\s*=/i,
      // Fast moves 2 steps, slow moves 1
      /fast\s*=\s*fast\.next\.next|fast\s*\+=\s*2/i,
      // Slow moves 1 step
      /slow\s*=\s*slow\.next|slow\s*\+=\s*1/i,
      // While fast and fast.next
      /while\s+fast.*fast\.next|while.*fast.*and.*fast\.next/i,
      // Cycle detection comparison
      /if\s+slow\s*===?\s*fast|if.*slow.*==.*fast/i,
      // Linked list cycle
      /cycle|circular.*list/i,
      // Meet point pattern
      /meet|intersection/i,
    ],
    keywords: ["fast", "slow", "cycle", "floyd", "tortoise", "hare", "detect"],
    weight: {
      floydKeyword: 5,
      fastSlowPattern: 5,
      cycleDetection: 4
    }
  },

  "kadane": {
    name: "Kadane's Algorithm (Max Subarray)",
    key: "kadane",
    patterns: [
      // Explicit Kadane keyword
      /kadane/i,
      // Max subarray keyword
      /max.*subarray|maximum.*subarray|maxSubarray/i,
      // Current sum and max sum pattern (standard names)
      /(currentSum|current|sum)\s*=[\s\S]{0,100}(maxSum|maximum|result)\s*=/i,
      // max(num, currentSum + num) pattern
      /max\(.*\[.*\].*,.*\+.*\[.*\]\)/i,
      // Reset current sum if negative
      /if.*sum.*<.*0.*sum\s*=\s*0/i,
      // Track maximum (standard names)
      /maxSum\s*=\s*max\(maxSum.*current\)|result\s*=\s*max\(/i,
      // Iterate through array tracking sum
      /for.*in.*:.*sum.*max|for.*arr.*currentSum.*maxSum/s,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Two variables initialized to array[0] or same value
      /\w+\s*=\s*\w+\[0\][\s\S]{0,100}\w+\s*=\s*\w+\[0\]/s,
      // Two variables initialized to same value or negative infinity
      /\w+\s*=\s*\w+[\s\S]{0,100}\w+\s*=\s*\1/s,
      // max(element, running_sum + element) pattern
      /\w+\s*=\s*max\(\w+\[\w+\]\s*,\s*\w+\s*\+\s*\w+\[\w+\]\)/,
      // Alternative: running_sum = max(arr[i], running + arr[i])
      /\w+\s*=\s*max\([^,]+,\s*\w+\s*\+/,
      // Track max with max(max_var, current_var)
      /\w+\s*=\s*max\(\w+\s*,\s*\w+\)/,
      // Loop with two max operations
      /for\s+\w+\s+in\s+range[\s\S]{0,300}max\([^)]+\)[\s\S]{0,200}max\([^)]+\)/s,
      // Single loop with accumulation and max tracking
      /for\s+\w+\s+in\s+range\([^)]*\)[\s\S]{0,400}\w+\s*=\s*max[\s\S]{0,200}\w+\s*=\s*max/s,
      // Pattern: initialize two vars, loop with max operations
      /\w+\s*=[\s\S]{0,100}\w+\s*=[\s\S]{0,200}for[\s\S]{0,400}max\([^)]+\)[\s\S]{0,200}max\(/s,
    ],
    keywords: ["kadane", "max", "subarray", "maximum", "sum", "currentSum", "maxSum"],
    weight: {
      kadaneKeyword: 5,
      maxSubarray: 5,
      sumTracking: 4
    }
  },

  "topological-sort": {
    name: "Topological Sort",
    key: "topological-sort",
    patterns: [
      // Explicit topological sort
      /topological.*sort|topo.*sort|toposort/i,
      // In-degree array (standard name)
      /indegree|in.*degree|in_degree/i,
      // Build graph with dependencies
      /prerequisites|dependencies|graph\[.*\]\.append/i,
      // Queue for nodes with in-degree 0 (standard name)
      /indegree\[.*\]\s*===?\s*0|in.*degree.*==.*0/i,
      // Decrement in-degree (standard name)
      /indegree\[.*\]\s*-=\s*1|indegree\[.*\]\s*--|in.*degree.*-=/i,
      // Course schedule / task scheduling
      /course|task.*order|schedule/i,
      // Detect cycle (in-degree check)
      /count.*!=.*numCourses|len.*!=.*n/i,
      // Kahn's algorithm pattern
      /queue.*indegree.*while.*queue/s,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Array initialized to zeros
      /\w+\s*=\s*\[0\]\s*\*[\s\S]{0,100}for.*in.*range/s,
      // Build graph with append in double loop
      /for\s+\w+\s*,\s*\w+\s+in[\s\S]{0,200}\w+\[\w+\]\.append/s,
      // Increment array element
      /\w+\[\w+\]\s*\+=\s*1/,
      // Queue with elements where array[i] == 0
      /\w+\s*=\s*\[[\s\S]{0,200}if\s+\w+\[\w+\]\s*==\s*0/s,
      // While queue with pop and decrement
      /while\s+\w+:[\s\S]{0,300}\w+\[\w+\]\s*-=\s*1/s,
      // Append to result when condition met
      /if\s+\w+\[\w+\]\s*==\s*0:[\s\S]{0,100}\w+\.append/s,
      // Check final count
      /return\s+len\(\w+\)\s*[=!]=|if\s+len\(\w+\)\s*[=!]=/,
    ],
    keywords: ["topological", "topo", "indegree", "prerequisites", "dependencies", "course", "schedule", "kahn"],
    weight: {
      topologicalKeyword: 5,
      indegreePattern: 5,
      courseSchedule: 4
    }
  },

  "union-find": {
    name: "Union Find (Disjoint Set)",
    key: "union-find",
    patterns: [
      // Explicit union find / disjoint set
      /union.*find|unionfind|disjoint.*set|dsu/i,
      // Parent array (standard name)
      /parent\s*=\s*\[.*for.*in.*range|parent\s*=\s*list\(range/i,
      // Find function with path compression (standard name)
      /def\s+find|function\s+find[\s\S]{0,200}parent\[.*\]\s*!=|parent\[x\]\s*===?\s*x/s,
      // Union function
      /def\s+union|function\s+union[\s\S]{0,200}parent\[/s,
      // Path compression (standard name)
      /parent\[x\]\s*=\s*find\(parent\[x\]\)|parent\[.*\]\s*=\s*find/i,
      // Rank array
      /rank\s*=\s*\[0\]\s*\*|rank\s*=.*Array/i,
      // Union by rank/size
      /if.*rank\[.*\].*rank\[.*\]|rank\[.*\]\s*\+=/i,
      // Connected components
      /connected.*component|number.*of.*islands/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Array initialized with range (parent array)
      /\w+\s*=\s*list\(range\([^)]+\)\)|\w+\s*=\s*\[\w+\s+for\s+\w+\s+in\s+range/i,
      // Recursive function that accesses array with condition
      /def\s+\w+\([^)]+\):[\s\S]{0,200}if\s+\w+\[[\w\s]+\]\s*[!=]=\s*\1/s,
      // Find pattern: if arr[x] != x, recurse
      /if\s+\w+\[\w+\]\s*!=\s*\w+:/,
      // Path compression pattern: arr[x] = recursive_call(arr[x])
      /\w+\[\w+\]\s*=\s*\w+\(\w+\[\w+\]\)/,
      // Union pattern: two find calls
      /\w+\s*=\s*\w+\([^)]+\)[\s\S]{0,100}\w+\s*=\s*\1\(/s,
      // Array update based on comparison
      /if\s+\w+\[\w+\]\s*[<>]=?\s*\w+\[\w+\]:/,
      // Two functions: find and union
      /def\s+\w+[\s\S]{0,400}def\s+\w+[\s\S]{0,400}\w+\[\w+\]\s*=/s,
    ],
    keywords: ["union", "find", "disjoint", "parent", "rank", "path", "compression", "connected"],
    weight: {
      unionFindKeyword: 5,
      parentArray: 5,
      pathCompression: 4
    }
  },

  "knapsack": {
    name: "0/1 Knapsack (DP)",
    key: "knapsack",
    patterns: [
      // Explicit knapsack keyword
      /knapsack|knap.*sack/i,
      // DP table with weight capacity (standard names)
      /dp\s*=.*\[.*capacity|dp.*weight/i,
      // Nested loops: items and capacity
      /for.*in.*range.*:.*for.*in.*range.*capacity/s,
      // Take or skip decision (standard names)
      /max\(dp\[.*\].*,.*dp\[.*\].*\+.*value|take.*skip/i,
      // Weight constraint (standard names)
      /if.*weight\[.*\].*<=.*capacity|if.*w.*<=.*j/i,
      // Value and weight arrays
      /value.*=.*\[|weight.*=.*\[|values.*weights/i,
      // 2D DP array for knapsack
      /dp\s*=.*\[\[0\].*for.*in.*range/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // 2D array initialization
      /\w+\s*=\s*\[\[[\d\s]+\][\s\S]{0,100}for.*in.*range/s,
      // Nested loops with condition checking array element
      /for\s+\w+\s+in\s+range[\s\S]{0,300}for\s+\w+\s+in\s+range[\s\S]{0,400}if\s+\w+\[\w+\]\s*<=\s*\w+/s,
      // Max with previous value and current value plus something
      /\w+\[\w+\]\[\w+\]\s*=\s*max\(\w+\[\w+[\s\S]{0,100},\s*\w+[\s\S]{0,100}\+\s*\w+\[/s,
      // Nested loops accessing 2D array
      /for.*range[\s\S]{0,300}for.*range[\s\S]{0,400}\w+\[\w+\]\[\w+\]/s,
      // Condition with <= and nested array access
      /if\s+\w+\[\w+\]\s*<=[\s\S]{0,200}max\(/s,
      // Two input arrays (weights and values pattern)
      /def\s+\w+\([^,]+,\s*\w+\s*,\s*\w+/,
    ],
    keywords: ["knapsack", "dp", "capacity", "weight", "value", "items", "take", "skip"],
    weight: {
      knapsackKeyword: 5,
      dpCapacity: 4,
      takeSkip: 4
    }
  },

  "lis": {
    name: "Longest Increasing Subsequence",
    key: "lis",
    patterns: [
      // Explicit LIS keyword
      /longest.*increasing.*subsequence|lis|lengthOfLIS/i,
      // DP array initialized to 1
      /dp\s*=\s*\[1\]\s*\*|dp.*fill\(1\)/i,
      // Nested loop comparing elements
      /for.*i.*range.*:.*for.*j.*range.*i.*:/s,
      // Compare arr[j] < arr[i] (standard names)
      /if.*arr\[j\].*<.*arr\[i\]|if.*nums\[j\].*<.*nums\[i\]/i,
      // Update dp with max (standard names)
      /dp\[i\]\s*=\s*max\(dp\[i\].*dp\[j\].*\+.*1\)/i,
      // Binary search approach with tails
      /tails.*=.*\[|sub.*=.*\[[\s\S]{0,200}bisect/s,
      // Return max of dp
      /return\s+max\(dp\)/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Array initialized with same value (typically 1)
      /\w+\s*=\s*\[\d+\]\s*\*\s*len\(|[\w\s]+\s*=\s*\[\d+\s+for/i,
      // Nested loop with inner loop up to i
      /for\s+\w+\s+in\s+range\([^)]+\):[\s\S]{0,200}for\s+\w+\s+in\s+range\(\w+\)/s,
      // Compare two array elements
      /if\s+\w+\[\w+\]\s*<\s*\w+\[\w+\]:/,
      // Update with max and +1
      /\w+\[\w+\]\s*=\s*max\(\w+\[\w+\]\s*,\s*\w+\[\w+\]\s*\+\s*1\)/,
      // Return max of array
      /return\s+max\(\w+\)/,
      // Nested loops with array comparison and max update
      /for.*range[\s\S]{0,300}for.*range[\s\S]{0,400}if.*\[.*\].*<[\s\S]{0,200}max\(/s,
      // DP pattern: nested loops with conditional max
      /\w+\s*=\s*\[[\s\S]{0,200}for\s+\w+[\s\S]{0,300}for\s+\w+[\s\S]{0,400}max\([^)]+\+\s*1/s,
    ],
    keywords: ["longest", "increasing", "subsequence", "lis", "dp", "max"],
    weight: {
      lisKeyword: 5,
      dpArray: 4,
      nestedComparison: 4
    }
  },

  "monotonic-stack": {
    name: "Monotonic Stack",
    key: "monotonic-stack",
    patterns: [
      // Explicit monotonic stack
      /monotonic.*stack/i,
      // Next greater/smaller element
      /next.*greater|next.*smaller|next.*larger/i,
      // Stack with while loop popping based on condition (standard name)
      /stack\s*=\s*\[[\s\S]{0,300}while.*stack.*and.*stack\[-1\][\s\S]{0,100}stack\.pop/s,
      // Stack pattern: pop while condition (standard name)
      /while.*stack.*and.*\[.*\].*[<>].*stack|while.*len\(stack\).*stack\.pop/s,
      // Append index to stack (standard name)
      /stack\.append\(i\)|stack\.push\(i\)/i,
      // Result array for answers
      /result\s*=\s*\[.*\]\s*\*|answer.*=.*Array/i,
      // Temperature/stock span/histogram problems
      /temperature|daily|stock.*span|histogram|largest.*rectangle/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Empty list initialized, loop with while and pop
      /\w+\s*=\s*\[\][\s\S]{0,400}while\s+\w+\s+and[\s\S]{0,200}\.pop\(\)/s,
      // While list and comparison, then pop
      /while\s+\w+\s+and\s+\w+\[[\s\S]{0,100}[<>][\s\S]{0,100}\.pop\(\)/s,
      // Append index or value to list in loop
      /for\s+\w+\s+in\s+range[\s\S]{0,400}\w+\.append\(\w+\)/s,
      // Result array initialized with default value
      /\w+\s*=\s*\[[-\d]+\]\s*\*\s*len\(/,
      // Access last element of list in comparison
      /\w+\[-1\]\s*[<>]=?\s*\w+\[/,
      // While loop with list, comparison, and pop
      /while\s+len\(\w+\)\s*>\s*0\s+and[\s\S]{0,200}\.pop\(\)/s,
      // Stack pattern: initialize, loop, while with conditional pop, append
      /\w+\s*=\s*\[\][\s\S]{0,400}for[\s\S]{0,400}while.*and[\s\S]{0,200}pop[\s\S]{0,200}append/s,
    ],
    keywords: ["monotonic", "stack", "next", "greater", "smaller", "temperature", "histogram"],
    weight: {
      monotonicKeyword: 5,
      nextGreater: 5,
      stackPop: 4
    }
  },

  "backtracking": {
    name: "Backtracking",
    key: "backtracking",
    patterns: [
      // Explicit backtracking keyword
      /backtrack/i,
      // Recursive DFS with state restoration
      /def\s+backtrack|function\s+backtrack|const\s+backtrack/i,
      // Add and remove pattern (choose/unchoose) with standard names
      /path\.append[\s\S]{0,100}backtrack[\s\S]{0,100}path\.pop|path\.push[\s\S]{0,100}backtrack[\s\S]{0,100}path\.pop/s,
      // Visited array with backtracking (standard names)
      /visited\[.*\]\s*=\s*true[\s\S]{0,100}backtrack[\s\S]{0,100}visited\[.*\]\s*=\s*false/s,
      // Base case with result collection (standard names)
      /if.*len\(path\).*==.*:.*result\.append|if.*path\.length.*result\.push/s,
      // Permutations/combinations/subsets
      /permutation|combination|subset|generate/i,
      // N-Queens, Sudoku patterns
      /n.*queen|sudoku|valid|board/i,
      // Choice loop with recursion
      /for.*in.*range.*:.*backtrack.*for/s,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Recursive function with list append and pop
      /def\s+\w+[\s\S]{0,400}\w+\.append[\s\S]{0,200}\w+\([\s\S]{0,200}\w+\.pop\(\)/s,
      // Array modification, recursive call, then restoration
      /\w+\[\w+\]\s*=\s*\w+[\s\S]{0,300}\w+\([\s\S]{0,300}\w+\[\w+\]\s*=\s*\w+/s,
      // Base case checking list length
      /if\s+len\(\w+\)\s*[=!]=[\s\S]{0,200}\.append\(\w+[\s\S]{0,100}\)/s,
      // Loop with recursive call inside
      /for\s+\w+\s+in\s+range[\s\S]{0,400}\w+\([\s\S]{0,100}for/s,
      // Pattern: append, recurse, pop (generic)
      /\.append\([^)]+\)[\s\S]{0,300}\w+\([^)]*\)[\s\S]{0,300}\.pop\(\)/s,
      // Visited pattern: set true, recurse, set false
      /\w+\[\w+\]\s*=\s*True[\s\S]{0,300}\w+\([\s\S]{0,300}\w+\[\w+\]\s*=\s*False/s,
      // Functional-style backtracking: recursive call with list concatenation
      /def\s+\w+[\s\S]{0,400}if\s+len\(\w+\)\s*[=!]=[\s\S]{0,400}\w+\(\w+\s*\+\s*\[/s,
      // Functional recursion with "not in" check
      /for\s+\w+\s+in\s+range[\s\S]{0,400}if\s+\w+\s+not\s+in\s+\w+:[\s\S]{0,200}\w+\(\w+\s*\+/s,
    ],
    keywords: ["backtrack", "backtracking", "permutation", "combination", "subset", "path", "visited", "choose"],
    weight: {
      backtrackKeyword: 5,
      addRemove: 5,
      recursiveChoice: 4
    }
  },

  "prefix-sum": {
    name: "Prefix Sum",
    key: "prefix-sum",
    patterns: [
      // Explicit prefix sum
      /prefix.*sum|prefixsum|cumulative.*sum/i,
      // Prefix array initialization (standard name)
      /prefix\s*=\s*\[0\]|prefixSum.*=.*Array|cumsum/i,
      // Building prefix sum (standard name)
      /prefix\[i\]\s*=\s*prefix\[i\s*-\s*1\]\s*\+|prefix.*\+=.*arr\[/i,
      // Prefix sum loop (standard name)
      /for.*in.*range.*prefix\[.*\]\s*=.*prefix\[.*\]\s*\+/s,
      // Range sum query using prefix (standard name)
      /prefix\[.*\]\s*-\s*prefix\[.*\]|prefix\[r\].*prefix\[l\]/i,
      // Subarray sum patterns
      /subarray.*sum|range.*sum|sum.*range/i,
      // Hash map with prefix sum
      /map.*prefix|prefix.*map|count.*prefix/i,

      // === VARIABLE-NAME-AGNOSTIC PATTERNS ===
      // Array with initial 0
      /\w+\s*=\s*\[0\][\s\S]{0,300}for\s+\w+\s+in\s+range/s,
      // Array with initial 0 + append-based loop (for element in array style)
      /\w+\s*=\s*\[0\][\s\S]{0,200}for\s+\w+\s+in\s+\w+:[\s\S]{0,200}\.append\(\w+\[-1\]\s*\+/s,
      // Array element equals previous plus current
      /\w+\[\w+\]\s*=\s*\w+\[\w+\s*-\s*1\]\s*\+\s*\w+\[/,
      // Append with running sum
      /\w+\.append\(\w+\[-1\]\s*\+/,
      // Subtraction of two array elements (range query)
      /\w+\[\w+\]\s*-\s*\w+\[\w+[\s\S]{0,50}-[\s\S]{0,50}1\]/,
      // Loop building cumulative array
      /for\s+\w+\s+in\s+range\(1,[\s\S]{0,300}\w+\[\w+\]\s*=\s*\w+\[\w+\s*-\s*1\]\s*\+/s,
      // HashMap/dict with running sum as key
      /\w+\s*=\s*\{[\s\S]{0,100}0:[\s\S]{0,400}\w+\s*\+=\s*\w+\[/s,
    ],
    keywords: ["prefix", "sum", "cumulative", "range", "subarray", "query"],
    weight: {
      prefixKeyword: 5,
      prefixArray: 4,
      rangeSum: 4
    }
  }
};

/**
 * Analyzes code structure to detect algorithm patterns regardless of variable names
 * @param {string} code - The code to analyze
 * @returns {object} - Structural signatures found
 */
function analyzeStructuralSignatures(code) {
  const signatures = {
    bfsSignature: false,
    dfsSignature: false,
    sortingSignature: false,
    binarySearchSignature: false,
    dijkstraSignature: false,
    mergeSortSignature: false,
    quickSortSignature: false,
    twoPointersSignature: false,
    slidingWindowSignature: false,
    monotonicStackSignature: false,
    backtrackingSignature: false,
    unionFindSignature: false,
    selectionSortSignature: false,
    insertionSortSignature: false,
    kadaneSignature: false,
    topologicalSortSignature: false,
    lisSignature: false,
    fastSlowSignature: false
  };

  // BFS Signature: Queue-based traversal with level-order pattern
  // JavaScript: Set + Array + while + shift + push pattern
  const bfsPattern1 = /new\s+Set\(\)[\s\S]{0,300}=\s*\[[\s\S]{0,300}while[\s\S]{0,200}\.shift\(\)/s;
  const bfsPattern2 = /queue\s*=\s*\[[\s\S]{0,300}while.*(queue\.length|len\(queue\))[\s\S]{0,200}shift\(\)|popleft\(\)/s;
  const bfsPattern3 = /deque\([\s\S]{0,200}while\s+queue[\s\S]{0,200}popleft\(\)/s;
  const bfsPattern4 = /visited.*=.*set\(\)[\s\S]{0,300}queue.*=[\s\S]{0,300}while.*queue/s;

  if (bfsPattern1.test(code) || bfsPattern2.test(code) || bfsPattern3.test(code) || bfsPattern4.test(code)) {
    signatures.bfsSignature = true;
  }

  // DFS Signature: Recursive call pattern OR stack with pop
  const dfsPattern1 = /(function|def)\s+\w+[\s\S]{0,300}for[\s\S]{0,200}\1\s+\w+\(/s; // Recursive with same function call
  const dfsPattern2 = /def\s+dfs[\s\S]{0,400}for[\s\S]{0,200}dfs\(/s; // Python recursive DFS
  const dfsPattern3 = /function\s+dfs[\s\S]{0,400}for[\s\S]{0,200}dfs\(/s; // JS recursive DFS
  const dfsPattern4 = /stack\s*=\s*\[[\s\S]{0,300}while.*(stack\.length|len\(stack\))[\s\S]{0,200}\.pop\(\)/s; // Iterative with stack
  const dfsPattern5 = /visited[\s\S]{0,200}(function|def)\s+\w+[\s\S]{0,300}for[\s\S]{0,200}\2/s; // Visited + recursion

  if (dfsPattern1.test(code) || dfsPattern2.test(code) || dfsPattern3.test(code) ||
      dfsPattern4.test(code) || dfsPattern5.test(code)) {
    signatures.dfsSignature = true;
  }

  // Dijkstra Signature: Priority queue/heap + distance array + visited set
  const dijkstraPattern1 = /heapq[\s\S]{0,300}heappop[\s\S]{0,300}(visit|dist)/s;
  const dijkstraPattern2 = /(minHeap|PriorityQueue)[\s\S]{0,400}(visit|visited|dist)[\s\S]{0,300}extract|pop/s;
  const dijkstraPattern3 = /dist.*=.*inf[\s\S]{0,300}heappush[\s\S]{0,300}heappop[\s\S]{0,300}dist/s;
  const dijkstraPattern4 = /import.*heapq[\s\S]{0,400}dist[\s\S]{0,300}while.*heap/s;

  if (dijkstraPattern1.test(code) || dijkstraPattern2.test(code) ||
      dijkstraPattern3.test(code) || dijkstraPattern4.test(code)) {
    signatures.dijkstraSignature = true;
  }

  // Sorting signature: nested loops with comparison and potential swap
  const sortPattern1 = /for[\s\S]{0,200}for[\s\S]{0,300}if[\s\S]{0,100}\[.*\]\s*[<>]=?\s*\[.*\]/s;
  const sortPattern2 = /for.*in.*range[\s\S]{0,300}for.*in.*range[\s\S]{0,300}if.*\[.*\].*[<>].*\[.*\]/s;
  if (sortPattern1.test(code) || sortPattern2.test(code)) {
    signatures.sortingSignature = true;
  }

  // Binary search signature: Two pointers with mid calculation and conditional updates
  // Standard names pattern
  const binaryPattern1 = /(left|start|low|l)\s*=\s*0[\s\S]{0,200}(right|end|high|r)\s*=[\s\S]{0,200}while[\s\S]{0,200}(mid|m)\s*=/s;
  const binaryPattern2 = /while.*(left|l)\s*<=\s*(right|r)[\s\S]{0,200}(mid|m)\s*=[\s\S]{0,100}(left|l)\s*=.*(mid|m)[\s\S]{0,100}(right|r)\s*=.*(mid|m)/s;
  const binaryPattern3 = /(left|l)\s*=.*(mid|m)\s*\+\s*1[\s\S]{0,100}(right|r)\s*=.*(mid|m)\s*-\s*1/s;
  // Variable-name-agnostic pattern
  const binaryPattern4 = /\w+\s*=\s*0[\s\S]{0,200}\w+\s*=[\s\S]{0,100}len\([\s\S]{0,300}while\s+\w+\s*<=\s*\w+[\s\S]{0,300}\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\/?\s*2/s;
  const binaryPattern5 = /while\s+\w+\s*<=\s*\w+[\s\S]{0,300}\w+\s*=\s*\w+\s*\+\s*1[\s\S]{0,300}\w+\s*=\s*\w+\s*-\s*1/s;
  const binaryPattern6 = /\w+\s*=\s*0[\s\S]{0,200}\w+\s*=.*len.*-\s*1[\s\S]{0,300}while[\s\S]{0,300}\/\/\s*2[\s\S]{0,300}if[\s\S]{0,200}\[/s;

  if ((binaryPattern1.test(code) && binaryPattern3.test(code)) ||
      binaryPattern2.test(code) ||
      (binaryPattern4.test(code) && binaryPattern5.test(code)) ||
      binaryPattern6.test(code)) {
    signatures.binarySearchSignature = true;
  }

  // Merge Sort signature: recursive splitting with mid calculation and merge
  const mergePattern1 = /(merge|mergeSort)[\s\S]{0,400}(mid|middle)[\s\S]{0,400}(left|leftHalf)[\s\S]{0,300}(right|rightHalf)[\s\S]{0,400}merge/s;
  const mergePattern2 = /\.slice\(0,.*mid\)[\s\S]{0,200}\.slice\(mid[\s\S]{0,200}merge/s;
  const mergePattern3 = /def\s+merge[\s\S]{0,400}while.*<.*len\(left\).*while.*<.*len\(right\)/s;
  // Generic patterns: recursive calls with slicing + merge
  const mergePattern4 = /if\s+len\([^)]+\)\s*<=\s*1[\s\S]{0,400}\/\/\s*2[\s\S]{0,400}\[:\w+\][\s\S]{0,400}\[\w+:\][\s\S]{0,400}while\s+\w+\s+and\s+\w+/s;
  const mergePattern5 = /\w+\s*=\s*\w+\(\w+\[:\w+\]\)[\s\S]{0,300}\w+\s*=\s*\w+\(\w+\[\w+:\]\)[\s\S]{0,400}while[\s\S]{0,300}pop\(0\)/s;
  const mergePattern6 = /def\s+\w+\(\w+\):[\s\S]{0,300}len\([^)]+\)\s*<=\s*1[\s\S]{0,600}while\s+\w+\s+and\s+\w+[\s\S]{0,300}return\s+\w+\s*\+/s;
  if (mergePattern1.test(code) || mergePattern2.test(code) || mergePattern3.test(code) ||
      mergePattern4.test(code) || mergePattern5.test(code) || mergePattern6.test(code)) {
    signatures.mergeSortSignature = true;
  }

  // Quick Sort signature: pivot selection with partitioning
  const quickPattern1 = /pivot[\s\S]{0,300}partition[\s\S]{0,400}(quick|recursion)/s;
  const quickPattern2 = /pivot\s*=[\s\S]{0,200}(low|left)[\s\S]{0,300}(high|right)[\s\S]{0,400}partition/s;
  const quickPattern3 = /def\s+partition[\s\S]{0,400}for[\s\S]{0,200}if[\s\S]{0,100}pivot/s;
  if (quickPattern1.test(code) || quickPattern2.test(code) || quickPattern3.test(code)) {
    signatures.quickSortSignature = true;
  }

  // Two Pointers signature: left and right pointers moving
  const twoPointerPattern1 = /(left|l)\s*=\s*0[\s\S]{0,200}(right|r)\s*=[\s\S]{0,200}while.*(left|l)\s*<\s*(right|r)/s;
  const twoPointerPattern2 = /(left|l)\s*,\s*(right|r)\s*=\s*0[\s\S]{0,200}while.*(left|l)\s*<\s*(right|r)/s; // Python tuple
  const twoPointerPattern3 = /while.*(left|l).*<.*(right|r)[\s\S]{0,300}(left|l)\s*(\+\+|\+=)/s;
  const twoPointerPattern4 = /while.*(left|l).*<.*(right|r)[\s\S]{0,300}(right|r)\s*(-=|--)/s;
  if (twoPointerPattern1.test(code) || twoPointerPattern2.test(code) ||
      twoPointerPattern3.test(code) || twoPointerPattern4.test(code)) {
    signatures.twoPointersSignature = true;
  }

  // Sliding Window signature: window with left/right expanding/shrinking
  const slidingPattern1 = /(left|l)\s*=\s*0[\s\S]{0,200}(right|r|end)[\s\S]{0,300}for.*(right|r)[\s\S]{0,300}while.*>|while.*>=[\s\S]{0,100}left\s*\+=/s;
  const slidingPattern2 = /window.*=.*\{[\s\S]{0,400}for.*right[\s\S]{0,300}while.*left/s;
  // Generic: variable = 0, for loop with range, nested while with increment
  const slidingPattern3 = /\w+\s*=\s*0[\s\S]{0,300}for\s+\w+\s+in\s+range\(len\([\s\S]{0,400}while.*[><=][\s\S]{0,200}\w+\s*\+=\s*1/s;
  // Pattern: for loop with while loop that has += inside, and max/min calculation
  const slidingPattern4 = /for.*in.*range[\s\S]{0,400}while[\s\S]{0,300}max\(|min\(/s;
  if (slidingPattern1.test(code) || slidingPattern2.test(code) ||
      slidingPattern3.test(code) || slidingPattern4.test(code)) {
    signatures.slidingWindowSignature = true;
  }

  // Monotonic Stack signature: stack with conditional popping
  const monotonicPattern1 = /stack\s*=\s*\[[\s\S]{0,300}while.*stack.*and.*\[.*\].*[<>].*stack[\s\S]{0,100}pop/s;
  const monotonicPattern2 = /while.*len\(stack\).*>.*0.*and[\s\S]{0,200}stack\.pop/s;
  const monotonicPattern3 = /stack.*=.*\[[\s\S]{0,400}while.*stack\.length.*stack\[-1\][\s\S]{0,100}stack\.pop/s;
  if (monotonicPattern1.test(code) || monotonicPattern2.test(code) || monotonicPattern3.test(code)) {
    signatures.monotonicStackSignature = true;
  }

  // Backtracking signature: recursive function with add/remove pattern
  const backtrackPattern1 = /def\s+backtrack[\s\S]{0,400}path[\s\S]{0,200}append[\s\S]{0,200}backtrack[\s\S]{0,200}pop/s;
  const backtrackPattern2 = /function\s+backtrack[\s\S]{0,400}path[\s\S]{0,200}push[\s\S]{0,200}backtrack[\s\S]{0,200}pop/s;
  const backtrackPattern3 = /visited\[.*\]\s*=\s*true[\s\S]{0,300}backtrack[\s\S]{0,300}visited\[.*\]\s*=\s*false/s;
  if (backtrackPattern1.test(code) || backtrackPattern2.test(code) || backtrackPattern3.test(code)) {
    signatures.backtrackingSignature = true;
  }

  // Union Find signature: parent array with find/union functions
  const unionFindPattern1 = /parent\s*=[\s\S]{0,200}def\s+find[\s\S]{0,300}parent\[.*\]\s*!=.*\1/s;
  const unionFindPattern2 = /parent.*=.*range[\s\S]{0,400}def\s+union|function\s+find[\s\S]{0,400}parent/s;
  const unionFindPattern3 = /parent\[x\]\s*=\s*find\(parent\[x\]\)/s;
  const unionFindPattern4 = /\w+\s*=\s*list\(range[\s\S]{0,400}def\s+\w+[\s\S]{0,400}if\s+\w+\[\w+\]\s*!=\s*\w+/s;
  if (unionFindPattern1.test(code) || unionFindPattern2.test(code) ||
      unionFindPattern3.test(code) || unionFindPattern4.test(code)) {
    signatures.unionFindSignature = true;
  }

  // Selection Sort signature: nested loops with min finding
  const selectionPattern1 = /for\s+\w+\s+in\s+range[\s\S]{0,300}\w+\s*=\s*\w+[\s\S]{0,300}for\s+\w+\s+in\s+range\(\w+\s*\+\s*1[\s\S]{0,400}if.*<[\s\S]{0,200}\w+\s*=\s*\w+/s;
  const selectionPattern2 = /for.*for.*range.*\+\s*1[\s\S]{0,400}if[\s\S]{0,200}<[\s\S]{0,200},.*=/s;
  if (selectionPattern1.test(code) || selectionPattern2.test(code)) {
    signatures.selectionSortSignature = true;
  }

  // Insertion Sort signature: loop from 1 with backwards shifting
  const insertionPattern1 = /for\s+\w+\s+in\s+range\(1[\s\S]{0,300}\w+\s*=[\s\S]{0,300}while\s+\w+\s*>=\s*0[\s\S]{0,300}\w+\s*-=\s*1/s;
  const insertionPattern2 = /for.*=\s*1[\s\S]{0,400}while.*>=\s*0[\s\S]{0,400}\[.*\+\s*1\]\s*=\s*\[/s;
  if (insertionPattern1.test(code) || insertionPattern2.test(code)) {
    signatures.insertionSortSignature = true;
  }

  // Kadane's Algorithm signature: two variables with max operations in loop
  const kadanePattern1 = /\w+\s*=[\s\S]{0,200}\w+\s*=[\s\S]{0,300}for[\s\S]{0,400}max\([^)]+\)[\s\S]{0,200}max\([^)]+\)/s;
  const kadanePattern2 = /for.*range[\s\S]{0,400}\w+\s*=\s*max\([\s\S]{0,200}\+[\s\S]{0,200}max\(/s;
  if (kadanePattern1.test(code) || kadanePattern2.test(code)) {
    signatures.kadaneSignature = true;
  }

  // Topological Sort signature: degree array + queue + decrement
  const topoPattern1 = /\w+\s*=\s*\[0\][\s\S]{0,400}for.*in.*\[[\s\S]{0,400}while.*:[\s\S]{0,400}\w+\[\w+\]\s*-=\s*1/s;
  const topoPattern2 = /indegree[\s\S]{0,400}queue[\s\S]{0,400}while.*queue[\s\S]{0,400}-=\s*1/s;
  if (topoPattern1.test(code) || topoPattern2.test(code)) {
    signatures.topologicalSortSignature = true;
  }

  // LIS signature: nested loops with conditional max and +1
  const lisPattern1 = /for\s+\w+\s+in\s+range[\s\S]{0,400}for\s+\w+\s+in\s+range\(\w+\)[\s\S]{0,400}if.*<[\s\S]{0,200}max\([^)]+\+\s*1/s;
  const lisPattern2 = /\w+\s*=\s*\[1\][\s\S]{0,400}for.*for[\s\S]{0,400}max\([^)]+,.*\+\s*1\)/s;
  if (lisPattern1.test(code) || lisPattern2.test(code)) {
    signatures.lisSignature = true;
  }

  // Fast & Slow Pointers signature: two pointers with different speeds
  const fastSlowPattern1 = /(slow|tortoise|tort)\s*=[\s\S]{0,200}(fast|hare)[\s\S]{0,300}while[\s\S]{0,300}\.next\.next/s;
  const fastSlowPattern2 = /\w+\s*=\s*\w+\.next[\s\S]{0,200}\w+\s*=\s*\w+\.next\.next[\s\S]{0,300}if\s+\w+\s*[=!]=\s*\w+/s;
  const fastSlowPattern3 = /\w+\s*=[\s\S]{0,100}\w+\s*=.*head[\s\S]{0,300}while.*\.next[\s\S]{0,300}\.next\.next[\s\S]{0,300}if\s+\w+\s*==\s*\w+/s;
  if (fastSlowPattern1.test(code) || fastSlowPattern2.test(code) || fastSlowPattern3.test(code)) {
    signatures.fastSlowSignature = true;
  }

  return signatures;
}

/**
 * Detects which algorithm is present in the given code
 * @param {string} code - The code snippet to analyze
 * @returns {object} - Detection result with algorithm name, key, confidence, and explanation
 */
export function detectAlgorithm(code) {
  if (!code || code.trim().length === 0) {
    return {
      name: "No code provided",
      algorithmKey: null,
      confidence: 0,
      explanation: "Please paste some code to analyze."
    };
  }

  const scores = {};
  const matches = {};

  // First, analyze structural signatures
  const structuralSigs = analyzeStructuralSignatures(code);

  // Analyze each algorithm
  for (const [algoKey, algo] of Object.entries(algorithmPatterns)) {
    let score = 0;
    const foundPatterns = [];

    // Check patterns - give more weight to pattern matches
    algo.patterns.forEach((pattern, idx) => {
      if (pattern.test(code)) {
        score += 5; // Increased from 3
        foundPatterns.push(`Pattern ${idx + 1}`);
      }
    });

    // Check keywords
    const lowerCode = code.toLowerCase();
    algo.keywords.forEach(keyword => {
      if (lowerCode.includes(keyword.toLowerCase())) {
        score += 2;
        foundPatterns.push(`Keyword: "${keyword}"`);
      }
    });

    // Bonus: Structural signature match (big boost!)
    if (algoKey === 'bfs' && structuralSigs.bfsSignature) {
      score += 20;
      foundPatterns.push("BFS structural signature");
    }
    if (algoKey === 'dfs' && structuralSigs.dfsSignature) {
      score += 20;
      foundPatterns.push("DFS structural signature");
    }
    if (algoKey === 'dijkstra' && structuralSigs.dijkstraSignature) {
      score += 20;
      foundPatterns.push("Dijkstra structural signature");
    }
    if (algoKey === 'merge' && structuralSigs.mergeSortSignature) {
      score += 20;
      foundPatterns.push("Merge sort structural signature");
    }
    if (algoKey === 'quick' && structuralSigs.quickSortSignature) {
      score += 20;
      foundPatterns.push("Quick sort structural signature");
    }
    if (['bubble', 'insertion', 'selection'].includes(algoKey) && structuralSigs.sortingSignature) {
      score += 12;
      foundPatterns.push("Sorting structural signature");
    }
    if (algoKey === 'binary' && structuralSigs.binarySearchSignature) {
      score += 20;
      foundPatterns.push("Binary search structural signature");
    }
    if (algoKey === 'two-pointers' && structuralSigs.twoPointersSignature) {
      score += 20;
      foundPatterns.push("Two pointers structural signature");
    }
    if (algoKey === 'sliding-window' && structuralSigs.slidingWindowSignature) {
      score += 20;
      foundPatterns.push("Sliding window structural signature");
    }
    if (algoKey === 'monotonic-stack' && structuralSigs.monotonicStackSignature) {
      score += 20;
      foundPatterns.push("Monotonic stack structural signature");
    }
    if (algoKey === 'backtracking' && structuralSigs.backtrackingSignature) {
      score += 20;
      foundPatterns.push("Backtracking structural signature");
    }
    if (algoKey === 'union-find' && structuralSigs.unionFindSignature) {
      score += 20;
      foundPatterns.push("Union find structural signature");
    }
    if (algoKey === 'selection' && structuralSigs.selectionSortSignature) {
      score += 20;
      foundPatterns.push("Selection sort structural signature");
    }
    if (algoKey === 'insertion' && structuralSigs.insertionSortSignature) {
      score += 20;
      foundPatterns.push("Insertion sort structural signature");
    }
    if (algoKey === 'kadane' && structuralSigs.kadaneSignature) {
      score += 20;
      foundPatterns.push("Kadane's algorithm structural signature");
    }
    if (algoKey === 'topological-sort' && structuralSigs.topologicalSortSignature) {
      score += 20;
      foundPatterns.push("Topological sort structural signature");
    }
    if (algoKey === 'lis' && structuralSigs.lisSignature) {
      score += 20;
      foundPatterns.push("LIS structural signature");
    }
    if (algoKey === 'fast-slow-pointers' && structuralSigs.fastSlowSignature) {
      score += 20;
      foundPatterns.push("Fast & slow pointers structural signature");
    }

    // Store results
    if (score > 0) {
      scores[algoKey] = score;
      matches[algoKey] = foundPatterns;
    }
  }

  // Algorithm differentiation: reduce scores for mutually exclusive patterns
  // BFS uses queue (FIFO), DFS uses stack (LIFO) or recursion
  if (scores.bfs && scores.dfs) {
    const hasQueue = /queue|shift\(\)|popleft/i.test(code);
    const hasStack = /stack|\.pop\(\)(?!left)/i.test(code);
    const hasRecursion = /def\s+dfs|function\s+dfs/i.test(code);

    if (hasQueue && !hasStack && !hasRecursion) {
      // Clearly BFS - reduce DFS score
      scores.dfs = Math.floor(scores.dfs * 0.6);
    } else if ((hasStack || hasRecursion) && !hasQueue) {
      // Clearly DFS - reduce BFS score
      scores.bfs = Math.floor(scores.bfs * 0.6);
    }
  }

  // Differentiate between sorting algorithms based on specific patterns
  if (scores.bubble && scores.insertion) {
    const hasAdjacentSwap = /\[j\]\s*>\s*\[j\s*\+\s*1\]/.test(code);
    const hasKeyPattern = /key\s*=.*\[i\]/.test(code);

    if (hasAdjacentSwap && !hasKeyPattern) {
      scores.insertion = Math.floor(scores.insertion * 0.7);
    } else if (hasKeyPattern && !hasAdjacentSwap) {
      scores.bubble = Math.floor(scores.bubble * 0.7);
    }
  }

  // Differentiate Dijkstra from general BFS
  if (scores.dijkstra && scores.bfs) {
    const hasHeap = /heapq|heappush|heappop|PriorityQueue|minHeap/i.test(code);
    const hasDistance = /dist|distance.*=.*inf/i.test(code);

    if (hasHeap && hasDistance) {
      // Clearly Dijkstra - reduce BFS score
      scores.bfs = Math.floor(scores.bfs * 0.5);
    } else if (!hasHeap && !hasDistance) {
      // More likely BFS - reduce Dijkstra score
      scores.dijkstra = Math.floor(scores.dijkstra * 0.5);
    }
  }

  // Differentiate Sliding Window from Two Pointers
  if (scores['sliding-window'] && scores['two-pointers']) {
    const hasForLoop = /for.*in.*range/i.test(code);
    const hasNestedWhile = /for[\s\S]{0,400}while/s.test(code);
    const hasSumTracking = /\+=.*\[.*\][\s\S]{0,300}-=.*\[.*\]/s.test(code);
    const hasBothPointersInit = /=\s*0[\s\S]{0,100}=.*len.*-.*1|,.*=.*0.*,.*len/s.test(code);

    if (hasForLoop && hasNestedWhile && hasSumTracking) {
      // Clearly sliding window - reduce two pointers score
      scores['two-pointers'] = Math.floor(scores['two-pointers'] * 0.5);
    } else if (hasBothPointersInit && !hasNestedWhile) {
      // Clearly two pointers - reduce sliding window score
      scores['sliding-window'] = Math.floor(scores['sliding-window'] * 0.5);
    }
  }

  // Differentiate Binary Search from Quick Sort
  if (scores.binary && scores.quick) {
    const hasPivot = /\bpivot\b/i.test(code);
    const hasPartition = /partition/i.test(code);
    const hasMidCalculation = /\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\/?\s*2/.test(code);
    const hasWhileLE = /while\s+\w+\s*<=\s*\w+/.test(code);
    const hasArrayComparison = /\[\w+\]\s*[=!<>]+\s*\w+/.test(code);

    if (hasMidCalculation && hasWhileLE && hasArrayComparison && !hasPivot && !hasPartition) {
      // Clearly binary search - reduce quick sort score
      scores.quick = Math.floor(scores.quick * 0.4);
    } else if (hasPivot || hasPartition) {
      // Clearly quick sort - reduce binary search score
      scores.binary = Math.floor(scores.binary * 0.4);
    }
  }

  // Differentiate Binary Search from Two Pointers
  if (scores.binary && scores['two-pointers']) {
    const hasMidCalculation = /\w+\s*=\s*\(\s*\w+\s*\+\s*\w+\s*\)\s*\/\/?\s*2/.test(code);
    const hasWhileLE = /while\s+\w+\s*<=\s*\w+/.test(code);
    const hasWhileLT = /while\s+\w+\s*<\s*\w+/.test(code);

    if (hasMidCalculation && hasWhileLE) {
      // Clearly binary search - reduce two pointers score
      scores['two-pointers'] = Math.floor(scores['two-pointers'] * 0.5);
    } else if (hasWhileLT && !hasMidCalculation) {
      // Clearly two pointers - reduce binary search score
      scores.binary = Math.floor(scores.binary * 0.5);
    }
  }

  // Differentiate Merge Sort from Binary Search
  if (scores.merge && scores.binary) {
    const hasRecursiveCalls = /\w+\s*=\s*\w+\(\w+\[:\w+\]\)[\s\S]{0,300}\w+\s*=\s*\w+\(\w+\[\w+:\]\)/.test(code);
    const hasSlicing = /\[:\w+\][\s\S]{0,200}\[\w+:\]/.test(code);
    const hasMergeWhile = /while\s+\w+\s+and\s+\w+:/.test(code);
    const hasPop0 = /\.pop\(0\)/.test(code);
    const hasWhileLE = /while\s+\w+\s*<=\s*\w+/.test(code);
    const hasBaseCase = /if\s+len\([^)]+\)\s*<=\s*1/.test(code);

    if (hasRecursiveCalls && hasSlicing && (hasMergeWhile || hasPop0) && hasBaseCase) {
      // Clearly merge sort - reduce binary search score significantly
      scores.binary = Math.floor(scores.binary * 0.3);
    } else if (hasWhileLE && !hasRecursiveCalls && !hasPop0) {
      // Clearly binary search - reduce merge sort score
      scores.merge = Math.floor(scores.merge * 0.3);
    }
  }

  // Find best match
  const sortedAlgos = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sortedAlgos.length === 0) {
    return {
      name: "Unknown Algorithm",
      algorithmKey: null,
      confidence: 0,
      explanation: "Could not identify a known algorithm pattern. Try adding comments or using standard algorithm variable names."
    };
  }

  const [bestAlgoKey, bestScore] = sortedAlgos[0];
  const bestAlgo = algorithmPatterns[bestAlgoKey];

  // Calculate confidence (0-100%) - improved formula
  const patternScore = bestScore;
  const foundMatches = matches[bestAlgoKey];
  const matchCount = foundMatches.length;

  // Calculate base confidence based on pattern score
  const maxPatternScore = (bestAlgo.patterns.length * 5) + (bestAlgo.keywords.length * 2) + 20; // +20 for structural bonus
  let confidence = Math.min(100, Math.round((patternScore / maxPatternScore) * 100));

  // Boost confidence based on match count (more matches = more confidence)
  if (matchCount >= 7) {
    confidence = Math.min(100, confidence + 20);
  } else if (matchCount >= 5) {
    confidence = Math.min(100, confidence + 15);
  } else if (matchCount >= 4) {
    confidence = Math.min(100, confidence + 10);
  } else if (matchCount >= 3) {
    confidence = Math.min(100, confidence + 5);
  }

  // If structural signature is found, boost confidence significantly
  const hasStructuralSignature = foundMatches.some(match => match.includes("structural signature"));
  if (hasStructuralSignature) {
    confidence = Math.min(100, confidence + 15);
  }

  // Set minimum confidence thresholds
  if (matchCount >= 5 && confidence < 60) {
    confidence = 60;
  } else if (matchCount >= 3 && confidence < 45) {
    confidence = 45;
  }

  // Reduce confidence if runner-up is very close (ambiguous detection)
  if (sortedAlgos.length > 1) {
    const [, runnerUpScore] = sortedAlgos[1];
    const scoreDiff = bestScore - runnerUpScore;
    if (scoreDiff < 3) {
      confidence = Math.max(30, confidence - 15); // High ambiguity
    } else if (scoreDiff < 7) {
      confidence = Math.max(40, confidence - 10); // Moderate ambiguity
    }
  }

  // Generate explanation
  const explanation = foundMatches.length > 0
    ? `Found ${foundMatches.length} matches: ${foundMatches.slice(0, 3).join(", ")}${foundMatches.length > 3 ? "..." : ""}`
    : "Detected based on code structure";

  // Show runner-up if close (better differentiation)
  let runnerUpText = "";
  if (sortedAlgos.length > 1) {
    const [runnerUpKey, runnerUpScore] = sortedAlgos[1];
    const scoreDiff = bestScore - runnerUpScore;

    // Show runner-up if the score difference is small
    if (scoreDiff < 3) {
      runnerUpText = ` (Very similar to: ${algorithmPatterns[runnerUpKey].name})`;
    } else if (scoreDiff < 7) {
      runnerUpText = ` (Could also be: ${algorithmPatterns[runnerUpKey].name})`;
    } else if (scoreDiff < 12 && sortedAlgos.length > 2) {
      // Show up to 2 alternatives if there's ambiguity
      const alternatives = sortedAlgos.slice(1, 3)
        .map(([key]) => algorithmPatterns[key].name)
        .join(", ");
      runnerUpText = ` (Other possibilities: ${alternatives})`;
    }
  }

  return {
    name: bestAlgo.name,
    algorithmKey: bestAlgo.key,
    confidence: confidence,
    explanation: explanation + runnerUpText,
    allMatches: sortedAlgos.slice(0, 3).map(([key, score]) => ({
      name: algorithmPatterns[key].name,
      key: key,
      score: score
    }))
  };
}

// Export for testing
export { algorithmPatterns };