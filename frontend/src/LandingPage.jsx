import './LandingPage.css';

// Generate stable random particles outside the component so they don't re-randomise on re-render
const PARTICLES = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left:     `${(Math.random() * 100).toFixed(2)}%`,
  top:      `${(Math.random() * 110 - 10).toFixed(2)}%`,   // start slightly above viewport
  size:     Math.random() < 0.60 ? 1.5 : Math.random() < 0.88 ? 2.5 : 3.5,
  opacity:  parseFloat((0.20 + Math.random() * 0.55).toFixed(2)),
  duration: parseFloat((14 + Math.random() * 20).toFixed(1)),
  delay:    parseFloat((-Math.random() * 28).toFixed(1)),   // negative = start mid-fall
  square:   Math.random() < 0.55,                            // mix of squares & dots
}));

const steps = [
  {
    number: '01',
    title: 'Choose an Algorithm',
    description:
      'Pick from 40+ algorithms — sorting, searching, graphs, and Blind 75 LeetCode problems — or paste your own code for AI-powered detection.',
  },
  {
    number: '02',
    title: 'Configure Your Input',
    description:
      'Enter a custom array, graph edges, a target value, or a string. The visualizer adapts its input fields to whatever the algorithm needs.',
  },
  {
    number: '03',
    title: 'Watch It Execute',
    description:
      'Step through each operation at your own pace. See pointers, comparisons, and variables update live, with plain-English explanations at every step.',
  },
];

const chips = [
  'Bubble Sort',
  'Merge Sort',
  'Quick Sort',
  'Binary Search',
  'BFS / DFS',
  "Dijkstra's",
  'Two Sum',
  'Sliding Window',
  'Merge Intervals',
  'Two Pointers',
  'Longest Substring',
  '40+ more →',
];

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-container">

      {/* Falling particles */}
      <div className="landing-particles-layer" aria-hidden="true">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="particle-dot"
            style={{
              left:              p.left,
              top:               p.top,
              width:             `${p.size}px`,
              height:            `${p.size}px`,
              opacity:           p.opacity,
              borderRadius:      p.square ? '1px' : '50%',
              animationDuration: `${p.duration}s`,
              animationDelay:    `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Spotlight ray from top */}
      <div className="landing-bg-rays" aria-hidden="true" />

      {/* Soft center glow */}
      <div className="landing-bg-glow" aria-hidden="true" />

      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="logo-icon">
            <span /><span /><span /><span />
          </div>
          <span className="logo-text">AlgoViz</span>
        </div>
        <button className="nav-launch-btn" onClick={() => onNavigate('setup')}>
          Launch App
        </button>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          ALGORITHM VISUALIZER
        </div>

        <h1 className="hero-title">
          See every step,<br />understand every move
        </h1>

        <p className="hero-subtitle">
          Step through sorting, searching, and graph algorithms in real time.<br />
          Paste your code and watch it come alive — one operation at a time.
        </p>

        <div className="hero-ctas">
          <button className="cta-primary" onClick={() => onNavigate('setup')}>
            Explore Algorithms
          </button>
          <button className="cta-secondary" onClick={() => onNavigate('ai-explainer')}>
            Try AI Analyzer
          </button>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider"><hr /></div>

      {/* How it works */}
      <section className="landing-how">
        <p className="section-label">HOW IT WORKS</p>
        <div className="steps-row">
          {steps.map((s) => (
            <div className="step-card" key={s.number}>
              <span className="step-number">{s.number}</span>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Algorithm chips */}
      <section className="landing-chips">
        <p className="section-label">WHAT YOU CAN VISUALIZE</p>
        <div className="chips-row">
          {chips.map((c) => (
            <span className="algo-chip" key={c}>{c}</span>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-bottom-cta">
        <p>Ready to see algorithms in action?</p>
        <button className="cta-primary cta-large" onClick={() => onNavigate('setup')}>
          Start Visualizing
        </button>
      </section>
    </div>
  );
}
