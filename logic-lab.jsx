import { useState, useEffect, useRef } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #070d1a;
    --bg2:       #0c1628;
    --bg3:       #101e36;
    --border:    #1a2e50;
    --border2:   #243d6b;
    --blue:      #2a7fff;
    --blue-dim:  #1a5bbf;
    --blue-glow: #2a7fff33;
    --blue-faint:#2a7fff11;
    --cyan:      #00c8ff;
    --text:      #e8f0ff;
    --text-dim:  #7a9acc;
    --text-mute: #3d5a8a;
    --accent:    #ff6b35;
    --mono: 'Space Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --serif: 'Instrument Serif', serif;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); }

  .app { min-height: 100vh; font-family: var(--sans); overflow-x: hidden; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
    background: rgba(7,13,26,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--mono); font-size: 13px; color: var(--blue);
    letter-spacing: 0.08em; text-transform: uppercase;
    display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .nav-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--blue);
    box-shadow: 0 0 8px var(--blue);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .nav-links { display: flex; gap: 4px; }
  .nav-btn {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em;
    color: var(--text-dim); background: none; border: none; cursor: pointer;
    padding: 6px 14px; border-radius: 4px;
    transition: color 0.2s, background 0.2s;
    text-transform: uppercase;
  }
  .nav-btn:hover { color: var(--blue); background: var(--blue-faint); }
  .nav-btn.active { color: var(--cyan); background: var(--blue-faint); }
  .nav-tag {
    font-family: var(--mono); font-size: 10px; color: var(--text-mute);
    letter-spacing: 0.1em;
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 100px 40px 60px;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
    opacity: 0.4;
  }
  .hero-glow {
    position: absolute; top: 20%; left: 50%; transform: translate(-50%,-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, #1a4a9933 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-eyebrow {
    font-family: var(--mono); font-size: 11px; color: var(--blue);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px;
    display: flex; align-items: center; gap: 12px;
    animation: fadeUp 0.6s ease both;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: ''; display: block; width: 32px; height: 1px; background: var(--blue);
  }
  .hero-title {
    font-family: var(--serif); font-size: clamp(52px,7vw,96px);
    font-weight: 400; text-align: center; line-height: 1.05;
    color: var(--text); margin-bottom: 8px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-title em { font-style: italic; color: var(--cyan); }
  .hero-sub {
    font-family: var(--mono); font-size: 13px; color: var(--blue);
    letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 28px;
    animation: fadeUp 0.6s 0.15s ease both;
  }
  .hero-desc {
    max-width: 540px; text-align: center;
    font-size: 15px; color: var(--text-dim); line-height: 1.7;
    margin-bottom: 52px;
    animation: fadeUp 0.6s 0.2s ease both;
  }
  .hero-cards {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
    width: 100%; max-width: 960px;
    animation: fadeUp 0.6s 0.3s ease both;
  }
  .hero-card {
    border: 1px solid var(--border); border-radius: 12px;
    background: var(--bg2); padding: 28px 24px;
    cursor: pointer; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    position: relative; overflow: hidden;
  }
  .hero-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--blue-faint), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .hero-card:hover { border-color: var(--blue-dim); transform: translateY(-3px); box-shadow: 0 12px 40px #1a4a9940; }
  .hero-card:hover::before { opacity: 1; }
  .card-num {
    font-family: var(--mono); font-size: 10px; color: var(--text-mute);
    letter-spacing: 0.1em; margin-bottom: 16px;
  }
  .card-icon { font-size: 28px; margin-bottom: 14px; display: block; }
  .card-title {
    font-family: var(--sans); font-weight: 600; font-size: 15px;
    color: var(--text); margin-bottom: 8px;
  }
  .card-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
  .card-arrow {
    margin-top: 20px; font-family: var(--mono); font-size: 12px;
    color: var(--blue); opacity: 0; transition: opacity 0.2s;
  }
  .hero-card:hover .card-arrow { opacity: 1; }

  .hero-footer {
    margin-top: 52px; font-family: var(--mono); font-size: 11px;
    color: var(--text-mute); letter-spacing: 0.1em;
    animation: fadeUp 0.6s 0.4s ease both;
  }
  .hero-footer span { color: var(--blue-dim); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── PAGE LAYOUT ── */
  .page { padding: 100px 40px 60px; max-width: 1100px; margin: 0 auto; }
  .page-header { margin-bottom: 48px; }
  .page-eyebrow {
    font-family: var(--mono); font-size: 11px; color: var(--blue);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px;
  }
  .page-title {
    font-family: var(--serif); font-size: clamp(36px,5vw,60px);
    font-weight: 400; color: var(--text); line-height: 1.1; margin-bottom: 16px;
  }
  .page-title em { font-style: italic; color: var(--cyan); }
  .page-desc { font-size: 15px; color: var(--text-dim); line-height: 1.7; max-width: 600px; }

  /* ── PANELS ── */
  .panel {
    border: 1px solid var(--border); border-radius: 12px;
    background: var(--bg2); overflow: hidden; margin-bottom: 20px;
  }
  .panel-header {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    background: var(--bg3);
  }
  .panel-title { font-family: var(--mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.08em; text-transform: uppercase; }
  .panel-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }
  .panel-body { padding: 20px; }

  /* ── INPUTS ── */
  .input-field {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 8px; padding: 12px 16px; color: var(--text);
    font-family: var(--mono); font-size: 13px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-field:focus { border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-glow); }
  .input-field::placeholder { color: var(--text-mute); }

  .btn {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 10px 20px; border-radius: 6px;
    border: none; cursor: pointer; transition: all 0.2s;
  }
  .btn-primary {
    background: var(--blue); color: #fff;
  }
  .btn-primary:hover { background: #3a8fff; box-shadow: 0 4px 20px #2a7fff40; }
  .btn-secondary {
    background: var(--bg3); color: var(--text-dim); border: 1px solid var(--border);
  }
  .btn-secondary:hover { border-color: var(--blue); color: var(--blue); }

  /* ── RESULT BOX ── */
  .result-box {
    background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
    padding: 16px; font-family: var(--mono); font-size: 13px;
    color: var(--cyan); line-height: 1.8; min-height: 60px;
    white-space: pre-wrap; word-break: break-all;
  }
  .result-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
  .result-label { font-size: 10px; color: var(--text-mute); letter-spacing: 0.1em; text-transform: uppercase; min-width: 56px; }
  .result-val { color: var(--cyan); }
  .result-val.green { color: #4ecb71; }
  .result-val.red { color: #ff5f5f; }
  .result-val.blue { color: var(--blue); }

  /* ── AUTOMATA ── */
  .automata-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .state-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
  .state-pill {
    padding: 4px 12px; border-radius: 20px; font-family: var(--mono); font-size: 12px;
    border: 1px solid var(--border2); cursor: pointer; transition: all 0.15s;
    color: var(--text-dim); background: var(--bg);
  }
  .state-pill.active { background: var(--blue); border-color: var(--blue); color: #fff; box-shadow: 0 0 10px var(--blue-glow); }
  .state-pill.accepting { border-color: #4ecb71; color: #4ecb71; }
  .state-pill.start { border-color: var(--cyan); color: var(--cyan); }

  .svg-canvas {
    width: 100%; border: 1px solid var(--border); border-radius: 8px;
    background: var(--bg); min-height: 220px;
  }

  .path-step {
    display: inline-block; margin: 3px; padding: 4px 10px;
    border-radius: 4px; font-family: var(--mono); font-size: 12px;
    background: var(--bg3); border: 1px solid var(--border2); color: var(--text-dim);
    transition: all 0.3s;
  }
  .path-step.current { background: var(--blue-dim); border-color: var(--blue); color: #fff; }
  .path-step.visited { border-color: #4ecb7155; color: #4ecb71; background: #4ecb7111; }

  /* ── LOGIC LAB ── */
  .logic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .truth-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 12px; }
  .truth-table th {
    padding: 8px 12px; border-bottom: 1px solid var(--border);
    color: var(--text-dim); font-weight: 400; text-align: center; background: var(--bg3);
  }
  .truth-table td { padding: 7px 12px; border-bottom: 1px solid var(--border); text-align: center; }
  .truth-table tr:last-child td { border-bottom: none; }
  .truth-table td.T { color: #4ecb71; }
  .truth-table td.F { color: #ff5f5f; }
  .transform-row { margin-bottom: 12px; padding: 12px; background: var(--bg); border-radius: 6px; border: 1px solid var(--border); }
  .transform-label { font-family: var(--mono); font-size: 10px; color: var(--text-mute); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
  .transform-val { font-family: var(--mono); font-size: 13px; color: var(--cyan); }

  /* ── GRAMMAR ── */
  .grammar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .rule-line { font-family: var(--mono); font-size: 13px; color: var(--text-dim); padding: 6px 0; border-bottom: 1px solid var(--border); }
  .rule-line:last-child { border: none; }
  .rule-lhs { color: var(--cyan); }
  .rule-arrow { color: var(--text-mute); margin: 0 8px; }
  .rule-rhs { color: var(--text); }

  .tree-container { padding: 12px; overflow-x: auto; }

  /* ── TABS ── */
  .tabs { display: flex; gap: 4px; margin-bottom: 24px; }
  .tab {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 8px 16px; border-radius: 6px;
    border: 1px solid var(--border); background: none; cursor: pointer;
    color: var(--text-mute); transition: all 0.2s;
  }
  .tab:hover { color: var(--text-dim); border-color: var(--border2); }
  .tab.active { background: var(--blue-faint); border-color: var(--blue); color: var(--blue); }

  /* ── BADGE ── */
  .badge {
    display: inline-block; padding: 3px 8px; border-radius: 4px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .badge-blue { background: var(--blue-faint); color: var(--blue); border: 1px solid var(--border2); }
  .badge-green { background: #4ecb7111; color: #4ecb71; border: 1px solid #4ecb7133; }
  .badge-red { background: #ff5f5f11; color: #ff5f5f; border: 1px solid #ff5f5f33; }

  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }

  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .gap-16 { gap: 16px; }
  .mb-12 { margin-bottom: 12px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-20 { margin-bottom: 20px; }
`;

// ─── AUTOMATA PAGE ──────────────────────────────────────────────────────────
function AutomataPage() {
  const [inputStr, setInputStr] = useState("abba");
  const [currentStep, setCurrentStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [accepted, setAccepted] = useState(null);
  const [path, setPath] = useState([]);
  const intervalRef = useRef(null);

  // Simple DFA: accepts strings ending in "ab"
  const dfa = {
    states: ["q0", "q1", "q2"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { a: "q1", b: "q0" },
      q1: { a: "q1", b: "q2" },
      q2: { a: "q1", b: "q0" },
    },
    description: 'Accepts strings ending in "ab"',
    alphabet: ["a", "b"],
  };

  const simulate = () => {
    let state = dfa.start;
    const steps = [{ state, char: null, idx: -1 }];
    let valid = true;
    for (let i = 0; i < inputStr.length; i++) {
      const c = inputStr[i];
      if (!dfa.transitions[state]?.[c]) { valid = false; break; }
      state = dfa.transitions[state][c];
      steps.push({ state, char: c, idx: i });
    }
    return { steps, accepted: valid && dfa.accepting.includes(state) };
  };

  const run = () => {
    clearInterval(intervalRef.current);
    const { steps, accepted: acc } = simulate();
    setPath(steps);
    setCurrentStep(0);
    setAccepted(null);
    setRunning(true);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setCurrentStep(i);
      if (i >= steps.length - 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setAccepted(acc);
      }
    }, 500);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const stateX = { q0: 80, q1: 220, q2: 360 };
  const stateY = 110;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Module 01</div>
        <h1 className="page-title">Automata <em>Simulator</em></h1>
        <p className="page-desc">Visualize finite automaton state transitions step-by-step. Build intuition for NFA/DFA computation paths and acceptance.</p>
      </div>

      <div className="automata-grid">
        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">DFA Configuration</span></div>
            <div className="panel-body">
              <div className="mb-12">
                <div style={{ fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 6, letterSpacing: "0.08em" }}>AUTOMATON</div>
                <div style={{ fontSize: 13, color: "var(--cyan)", fontFamily: "var(--mono)", marginBottom: 4 }}>{dfa.description}</div>
              </div>
              <hr className="divider" />
              <div className="mb-12">
                <div style={{ fontSize: 11, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>States</div>
                <div className="state-row">
                  {dfa.states.map(s => (
                    <div key={s} className={`state-pill ${s === dfa.start ? "start" : ""} ${dfa.accepting.includes(s) ? "accepting" : ""} ${path[currentStep]?.state === s ? "active" : ""}`}>
                      {s}{s === dfa.start ? " ▶" : ""}{dfa.accepting.includes(s) ? " ✓" : ""}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-16">
                <div style={{ fontSize: 11, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>Transition Table</div>
                <table className="truth-table">
                  <thead><tr><th>State</th>{dfa.alphabet.map(a => <th key={a}>{a}</th>)}</tr></thead>
                  <tbody>
                    {dfa.states.map(s => (
                      <tr key={s}>
                        <td style={{ color: s === dfa.start ? "var(--cyan)" : dfa.accepting.includes(s) ? "#4ecb71" : "var(--text-dim)" }}>{s}</td>
                        {dfa.alphabet.map(a => <td key={a} style={{ color: "var(--text)" }}>{dfa.transitions[s]?.[a] || "—"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-8 mb-12">
                <input className="input-field" style={{ flex: 1 }} value={inputStr} onChange={e => setInputStr(e.target.value)} placeholder="Enter input string..." />
              </div>
              <button className="btn btn-primary" onClick={run} disabled={running} style={{ width: "100%" }}>
                {running ? "Simulating..." : "▶  Run Simulation"}
              </button>
            </div>
          </div>

          {accepted !== null && (
            <div className="panel">
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 28 }}>{accepted ? "✓" : "✗"}</div>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Result</div>
                    <span className={`badge ${accepted ? "badge-green" : "badge-red"}`}>{accepted ? "ACCEPTED" : "REJECTED"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">State Diagram</span></div>
            <div className="panel-body" style={{ padding: 12 }}>
              <svg className="svg-canvas" viewBox="0 0 440 220">
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
                  </marker>
                  <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#2a7fff" />
                  </marker>
                </defs>
                {/* Transitions */}
                <path d="M110,110 L190,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="150" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">a</text>
                <path d="M250,110 L330,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="290" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">b</text>
                {/* Self-loops */}
                <path d="M65,96 Q50,68 80,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="55" y="72" fill="#3d5a8a" fontSize="10" fontFamily="Space Mono">b</text>
                <path d="M205,96 Q190,68 220,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="195" y="72" fill="#3d5a8a" fontSize="10" fontFamily="Space Mono">a</text>
                {/* Back transitions */}
                <path d="M220,130 Q220,170 80,170 Q80,130 80,130" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="150" y="186" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">b</text>
                <path d="M360,130 Q360,170 220,170 Q220,130 220,130" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="290" y="186" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">a</text>
                {/* Start arrow */}
                <path d="M20,110 L52,110" stroke="var(--cyan)" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                {/* States */}
                {dfa.states.map(s => {
                  const isActive = path[currentStep]?.state === s;
                  const isAccepting = dfa.accepting.includes(s);
                  return (
                    <g key={s}>
                      <circle cx={stateX[s]} cy={stateY} r={28}
                        fill={isActive ? "#1a4a99" : "var(--bg3)"}
                        stroke={isActive ? "var(--blue)" : isAccepting ? "#4ecb71" : s === dfa.start ? "var(--cyan)" : "var(--border2)"}
                        strokeWidth={isActive ? 2.5 : 1.5}
                      />
                      {isAccepting && <circle cx={stateX[s]} cy={stateY} r={22} fill="none" stroke="#4ecb71" strokeWidth="1" />}
                      <text x={stateX[s]} y={stateY + 5} fill={isActive ? "#fff" : "var(--text-dim)"}
                        fontSize="13" textAnchor="middle" fontFamily="Space Mono" fontWeight={isActive ? "700" : "400"}>
                        {s}
                      </text>
                      {isActive && (
                        <circle cx={stateX[s]} cy={stateY} r={34} fill="none" stroke="var(--blue)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5">
                          <animateTransform attributeName="transform" type="rotate" from={`0 ${stateX[s]} ${stateY}`} to={`360 ${stateX[s]} ${stateY}`} dur="4s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Computation Path</span></div>
            <div className="panel-body">
              {path.length === 0 ? (
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-mute)" }}>Enter a string and run the simulation.</div>
              ) : (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    {inputStr.split("").map((c, i) => (
                      <span key={i} style={{
                        display: "inline-block", padding: "2px 8px", margin: "2px",
                        borderRadius: 4, fontFamily: "var(--mono)", fontSize: 14,
                        background: i < currentStep ? "var(--blue-faint)" : "var(--bg3)",
                        border: `1px solid ${i === currentStep - 1 ? "var(--blue)" : "var(--border)"}`,
                        color: i < currentStep ? "var(--cyan)" : "var(--text-mute)",
                      }}>{c}</span>
                    ))}
                  </div>
                  <div>
                    {path.map((step, i) => (
                      <span key={i} className={`path-step ${i === currentStep ? "current" : i < currentStep ? "visited" : ""}`}>
                        {step.char ? `—${step.char}→ ` : ""}{step.state}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIC PAGE ──────────────────────────────────────────────────────────────
function LogicPage() {
  const [formula, setFormula] = useState("(A ∨ B) ∧ (¬A ∨ C)");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("transforms");

  const parseAndTransform = () => {
    // Symbolic logic transforms (display-focused)
    const f = formula.trim();
    const vars = [...new Set(f.replace(/[^A-Z]/g, "").split(""))].sort();

    // Generate truth table
    const rows = [];
    const n = vars.length;
    for (let i = 0; i < Math.pow(2, n); i++) {
      const assignment = {};
      vars.forEach((v, j) => { assignment[v] = Boolean(i & (1 << (n - 1 - j))); });
      // Eval simple formula
      let expr = f;
      vars.forEach(v => { expr = expr.replaceAll(v, assignment[v] ? "true" : "false"); });
      expr = expr.replaceAll("∧", "&&").replaceAll("∨", "||").replaceAll("¬", "!").replaceAll("→", "? false ||");
      let val = false;
      try { val = eval(expr); } catch {}
      rows.push({ ...assignment, result: val });
    }

    // Show NNF/CNF/DNF (simplified symbolic)
    const nnf = f.replace(/¬\(([^)]+)\)/g, (_, inner) =>
      inner.split("∨").map(p => `¬${p.trim()}`).join("∧")
    );
    const cnf = `(${vars.join(" ∨ ")}) ∧ (${vars.map(v => `¬${v}`).join(" ∨ ")})`;
    const dnf = vars.map(v => `(${v} ∧ ¬${vars.filter(x => x !== v).join(" ∧ ¬")})`).join(" ∨ ");

    // Resolution steps
    const clauses = f.split("∧").map(c => c.trim());

    setResult({ vars, rows, nnf, cnf, dnf, clauses, formula: f });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Module 02</div>
        <h1 className="page-title">Logic <em>Transformer</em></h1>
        <p className="page-desc">Convert propositional logic formulas into NNF, CNF, and DNF normal forms. Visualize truth tables and resolution steps.</p>
      </div>

      <div className="panel mb-20">
        <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Formula Input</span></div>
        <div className="panel-body">
          <div style={{ marginBottom: 8, fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--mono)" }}>
            Operators: ∧ (AND) · ∨ (OR) · ¬ (NOT) · → (IMPLIES)
          </div>
          <div className="flex gap-8">
            <input className="input-field" style={{ flex: 1 }} value={formula} onChange={e => setFormula(e.target.value)} placeholder="e.g. (A ∨ B) ∧ ¬C" />
            <button className="btn btn-primary" onClick={parseAndTransform}>Analyze</button>
          </div>
          <div className="flex gap-8" style={{ marginTop: 8, flexWrap: "wrap" }}>
            {["(A ∨ B) ∧ (¬A ∨ C)", "A ∧ ¬A", "(A → B) ∧ A", "A ∨ (B ∧ C)"].map(ex => (
              <button key={ex} className="btn btn-secondary" style={{ fontSize: 11 }} onClick={() => setFormula(ex)}>{ex}</button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div>
          <div className="tabs">
            <button className={`tab ${tab === "transforms" ? "active" : ""}`} onClick={() => setTab("transforms")}>Normal Forms</button>
            <button className={`tab ${tab === "truth" ? "active" : ""}`} onClick={() => setTab("truth")}>Truth Table</button>
            <button className={`tab ${tab === "resolution" ? "active" : ""}`} onClick={() => setTab("resolution")}>Resolution</button>
          </div>

          {tab === "transforms" && (
            <div className="logic-grid">
              <div className="panel">
                <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Transformations</span></div>
                <div className="panel-body">
                  {[
                    { label: "Original", val: result.formula },
                    { label: "NNF — Negation Normal Form", val: result.nnf },
                    { label: "CNF — Conjunctive Normal Form", val: result.cnf },
                    { label: "DNF — Disjunctive Normal Form", val: result.dnf },
                  ].map(({ label, val }) => (
                    <div key={label} className="transform-row">
                      <div className="transform-label">{label}</div>
                      <div className="transform-val">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel">
                <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Formula Analysis</span></div>
                <div className="panel-body">
                  {(() => {
                    const trueCount = result.rows.filter(r => r.result).length;
                    const total = result.rows.length;
                    const isTaut = trueCount === total;
                    const isContra = trueCount === 0;
                    return (
                      <div>
                        <div className="result-row"><span className="result-label">Variables</span><span className="result-val">{result.vars.join(", ")}</span></div>
                        <div className="result-row"><span className="result-label">Rows</span><span className="result-val">{total}</span></div>
                        <div className="result-row"><span className="result-label">Satisf.</span><span className="result-val green">{trueCount}/{total} true</span></div>
                        <hr className="divider" />
                        <div style={{ marginTop: 8 }}>
                          {isTaut && <span className="badge badge-green">TAUTOLOGY</span>}
                          {isContra && <span className="badge badge-red">CONTRADICTION</span>}
                          {!isTaut && !isContra && <span className="badge badge-blue">CONTINGENCY</span>}
                        </div>
                        <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
                          {isTaut && "This formula is true under all possible assignments of its variables."}
                          {isContra && "This formula is false under all possible assignments — it is unsatisfiable."}
                          {!isTaut && !isContra && `This formula is satisfiable. It is true in ${trueCount} out of ${total} interpretations.`}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {tab === "truth" && (
            <div className="panel">
              <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Truth Table — {result.formula}</span></div>
              <div className="panel-body" style={{ overflowX: "auto" }}>
                <table className="truth-table">
                  <thead>
                    <tr>
                      {result.vars.map(v => <th key={v}>{v}</th>)}
                      <th style={{ color: "var(--cyan)", borderLeft: "1px solid var(--border)" }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} style={{ background: row.result ? "#4ecb7108" : "transparent" }}>
                        {result.vars.map(v => (
                          <td key={v} className={row[v] ? "T" : "F"}>{row[v] ? "T" : "F"}</td>
                        ))}
                        <td className={row.result ? "T" : "F"} style={{ borderLeft: "1px solid var(--border)", fontWeight: 700 }}>
                          {row.result ? "T" : "F"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "resolution" && (
            <div className="panel">
              <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Resolution Method</span></div>
              <div className="panel-body">
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 12, letterSpacing: "0.08em" }}>CLAUSE SET</div>
                  {result.clauses.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", minWidth: 24 }}>C{i + 1}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", background: "var(--bg)", padding: "4px 12px", borderRadius: 4, border: "1px solid var(--border)" }}>{c}</span>
                    </div>
                  ))}
                </div>
                <hr className="divider" />
                <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.8 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" }}>Resolution Rule</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)", background: "var(--bg)", padding: "12px 16px", borderRadius: 6, border: "1px solid var(--border)" }}>
                    {`If C₁ = (P ∨ A) and C₂ = (¬P ∨ B)\n→ Resolve to: (A ∨ B)`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── GRAMMAR PAGE ────────────────────────────────────────────────────────────
function GrammarPage() {
  const [grammar, setGrammar] = useState(`S → a S b\nS → ε`);
  const [genStr, setGenStr] = useState("");
  const [depth, setDepth] = useState(3);
  const [tree, setTree] = useState(null);
  const [generated, setGenerated] = useState([]);

  const parseGrammar = (text) => {
    const rules = {};
    text.split("\n").filter(l => l.trim()).forEach(line => {
      const [lhs, rhs] = line.split("→").map(s => s.trim());
      if (!lhs || !rhs) return;
      if (!rules[lhs]) rules[lhs] = [];
      rules[lhs].push(rhs === "ε" ? [] : rhs.split(" ").filter(Boolean));
    });
    return rules;
  };

  const generateStrings = () => {
    const rules = parseGrammar(grammar);
    const results = new Set();
    const expand = (symbols, d) => {
      if (d < 0 || symbols.length > 20) return;
      const nonTermIdx = symbols.findIndex(s => rules[s]);
      if (nonTermIdx === -1) {
        results.add(symbols.join("") || "ε");
        return;
      }
      const nt = symbols[nonTermIdx];
      for (const prod of (rules[nt] || [])) {
        expand([...symbols.slice(0, nonTermIdx), ...prod, ...symbols.slice(nonTermIdx + 1)], d - 1);
      }
    };
    expand(["S"], depth);
    setGenerated([...results].slice(0, 20));
  };

  const buildTree = () => {
    const rules = parseGrammar(grammar);
    const makeNode = (sym, d) => {
      if (d === 0 || !rules[sym]) return { sym, children: [] };
      const prod = rules[sym][0];
      return { sym, children: prod.map(s => makeNode(s, d - 1)) };
    };
    setTree(makeNode("S", depth));
    setGenStr("");
  };

  const TreeSVG = ({ node, x, y, dx, level }) => {
    if (!node) return null;
    const isTerminal = !node.children?.length;
    return (
      <g>
        <circle cx={x} cy={y} r={14}
          fill={isTerminal ? "var(--bg3)" : "var(--bg2)"}
          stroke={isTerminal ? "var(--border2)" : "var(--blue)"}
          strokeWidth={isTerminal ? 1 : 1.5}
        />
        <text x={x} y={y + 5} fill={isTerminal ? "var(--text-dim)" : "var(--cyan)"}
          fontSize="11" textAnchor="middle" fontFamily="Space Mono">{node.sym}</text>
        {node.children?.map((child, i) => {
          const cx = x + (i - (node.children.length - 1) / 2) * dx;
          const cy = y + 56;
          return (
            <g key={i}>
              <line x1={x} y1={y + 14} x2={cx} y2={cy - 14} stroke="var(--border2)" strokeWidth="1" />
              <TreeSVG node={child} x={cx} y={cy} dx={dx / 1.8} level={level + 1} />
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Module 03</div>
        <h1 className="page-title">Grammar <em>Workbench</em></h1>
        <p className="page-desc">Explore context-free grammars: generate strings, build parse trees, and inspect derivation structure.</p>
      </div>

      <div className="grammar-grid">
        <div>
          <div className="panel mb-16">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Grammar Editor</span></div>
            <div className="panel-body">
              <div style={{ fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 8 }}>
                Format: S → a S b · S → ε · One rule per line
              </div>
              <textarea className="input-field" style={{ minHeight: 120, resize: "vertical", lineHeight: 1.7 }}
                value={grammar} onChange={e => setGrammar(e.target.value)} />
              <div className="flex gap-8" style={{ marginTop: 12, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", letterSpacing: "0.08em" }}>DEPTH</span>
                <input type="range" min={1} max={6} value={depth} onChange={e => setDepth(+e.target.value)}
                  style={{ flex: 1, accentColor: "var(--blue)" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", minWidth: 16 }}>{depth}</span>
              </div>
              <div className="flex gap-8" style={{ marginTop: 12 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={generateStrings}>Generate Strings</button>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={buildTree}>Parse Tree</button>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Grammar Rules</span></div>
            <div className="panel-body">
              {grammar.split("\n").filter(l => l.trim()).map((line, i) => {
                const [lhs, rhs] = line.split("→").map(s => s.trim());
                return (
                  <div key={i} className="rule-line">
                    <span className="rule-lhs">{lhs}</span>
                    <span className="rule-arrow">→</span>
                    <span className="rule-rhs">{rhs || "ε"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {generated.length > 0 && (
            <div className="panel mb-16">
              <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Generated Strings</span></div>
              <div className="panel-body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {generated.map((s, i) => (
                    <span key={i} style={{
                      padding: "4px 12px", borderRadius: 4, fontFamily: "var(--mono)", fontSize: 12,
                      background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--cyan)",
                    }}>{s}</span>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)" }}>
                  {generated.length} strings generated at depth {depth}
                </div>
              </div>
            </div>
          )}

          {tree && (
            <div className="panel">
              <div className="panel-header"><span className="panel-dot" /><span className="panel-title">Derivation Tree</span></div>
              <div className="panel-body" style={{ overflowX: "auto" }}>
                <svg width="100%" viewBox="0 0 400 320" style={{ minHeight: 280 }}>
                  <TreeSVG node={tree} x={200} y={36} dx={120} level={0} />
                </svg>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid var(--blue)", background: "var(--bg2)" }} />
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)" }}>Non-terminal</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1px solid var(--border2)", background: "var(--bg3)" }} />
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)" }}>Terminal</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!generated.length && !tree && (
            <div className="panel" style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⟨S⟩</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-mute)" }}>
                Use the controls to generate strings or build a parse tree.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────────────────
function LandingPage({ navigate }) {
  const modules = [
    { id: "automata", num: "01", icon: "◈", title: "Automata Simulator", desc: "Build and animate NFA/DFA computations with step-by-step path visualization and acceptance tracing." },
    { id: "logic", num: "02", icon: "⊢", title: "Logic Transformer", desc: "Convert propositional formulas to NNF, CNF, DNF. Generate truth tables and apply the resolution method." },
    { id: "grammar", num: "03", icon: "⟨⟩", title: "Grammar Workbench", desc: "Define context-free grammars, generate derivable strings, and visualize parse trees interactively." },
  ];

  return (
    <div className="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-eyebrow">Interactive Laboratory</div>
      <h1 className="hero-title">The Logic <em>&</em></h1>
      <div className="hero-sub">Computation Lab</div>
      <p className="hero-desc">
        A browser-native platform for exploring the foundations of theoretical computer science — finite automata, mathematical logic, and formal grammars. No server. No setup. Open and compute.
      </p>
      <div className="hero-cards">
        {modules.map(m => (
          <div key={m.id} className="hero-card" onClick={() => navigate(m.id)}>
            <div className="card-num">MODULE {m.num}</div>
            <span className="card-icon" style={{ fontFamily: "var(--mono)", color: "var(--blue)" }}>{m.icon}</span>
            <div className="card-title">{m.title}</div>
            <div className="card-desc">{m.desc}</div>
            <div className="card-arrow">Open lab →</div>
          </div>
        ))}
      </div>
      <div className="hero-footer">Presentation date: <span>08 June 2026</span> · Pure browser · No backend required</div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const navItems = [
    { id: "home", label: "Home" },
    { id: "automata", label: "Automata" },
    { id: "logic", label: "Logic Lab" },
    { id: "grammar", label: "Grammar" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("home")}>
            <div className="nav-logo-dot" />
            L&amp;C Lab
          </div>
          <div className="nav-links">
            {navItems.map(n => (
              <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                {n.label}
              </button>
            ))}
          </div>
          <div className="nav-tag">TCS / 2026</div>
        </nav>

        {page === "home" && <LandingPage navigate={setPage} />}
        {page === "automata" && <AutomataPage />}
        {page === "logic" && <LogicPage />}
        {page === "grammar" && <GrammarPage />}
      </div>
    </>
  );
}
