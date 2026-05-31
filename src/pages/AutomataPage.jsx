import React, { useState, useEffect, useRef } from "react";

// ─── AUTOMATA DEFINITIONS ────────────────────────────────────────────────────

const AUTOMATA = {
  dfa: {
    id: "dfa",
    label: "DFA",
    fullName: "Deterministic Finite Automaton",
    description: 'იღებს სტრიქონებს, რომლებიც მთავრდება "ab"-ით',
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { a: ["q1"], b: ["q0"] },
      q1: { a: ["q1"], b: ["q2"] },
      q2: { a: ["q1"], b: ["q0"] },
    },
    statePositions: { q0: { x: 80, y: 110 }, q1: { x: 220, y: 110 }, q2: { x: 360, y: 110 } },
    defaultInput: "aab",
    theory: "DFA-ში ყოველი მდგომარეობიდან, ყოველი სიმბოლოსთვის ზუსტად ერთი გადასვლა არსებობს. გამოთვლა სრულად დეტერმინირებულია.",
  },

  nfa: {
    id: "nfa",
    label: "NFA",
    fullName: "Nondeterministic Finite Automaton",
    description: 'იღებს სტრიქონებს, რომლებში "a" მინ ორჯერ თანმიმდევრობით გვხვდება',
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { a: ["q0", "q1"], b: ["q0"] },
      q1: { a: ["q2"], b: [] },
      q2: { a: ["q2"], b: ["q2"] },
    },
    statePositions: { q0: { x: 80, y: 110 }, q1: { x: 220, y: 110 }, q2: { x: 360, y: 110 } },
    defaultInput: "bab",
    theory: "NFA-ში შესაძლებელია რამდენიმე გადასვლა ერთი სიმბოლოსთვის. სიმულაცია ეძებს ყველა შესაძლო გზას პარალელურად სუბსეტების სიმრავლის სახით.",
  },

  enfa: {
    id: "enfa",
    label: "ε-NFA",
    fullName: "Epsilon-NFA",
    description: 'იღებს სტრიქონებს, რომლებიც შეიცავს „ab" ან „ba"-ს',
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2", "q3", "q4"],
    start: "q0",
    accepting: ["q2", "q4"],
    transitions: {
      q0: { a: ["q1"], b: ["q3"], ε: [] },
      q1: { b: ["q2"], ε: [] },
      q2: { ε: [] },
      q3: { a: ["q4"], ε: [] },
      q4: { ε: [] },
    },
    statePositions: {
      q0: { x: 60,  y: 110 },
      q1: { x: 185, y: 55  },
      q2: { x: 310, y: 55  },
      q3: { x: 185, y: 165 },
      q4: { x: 310, y: 165 },
    },
    defaultInput: "ab",
    theory: 'ε-NFA-ს შეუძლია „ε-გადასვლები" — სიმბოლოს წაკითხვის გარეშე გადასვლა. ε-closure გაფართოებს მდგომარეობების სიმრავლეს.',
  },

  pda: {
    id: "pda",
    label: "PDA",
    fullName: "Pushdown Automaton",
    description: "იღებს სტრიქონებს სახით aⁿbⁿ (n≥1)",
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2", "q3"],
    start: "q0",
    accepting: ["q3"],
    // PDA transitions: { state: [ {read, popStack, pushStack, next} ] }
    pdaTransitions: {
      q0: [{ read: "a", pop: "ε", push: "A", next: "q0" }, { read: "b", pop: "A", push: "ε", next: "q1" }],
      q1: [{ read: "b", pop: "A", push: "ε", next: "q1" }, { read: "ε", pop: "Z", push: "Z", next: "q3" }],
      q2: [],
      q3: [],
    },
    statePositions: { q0: { x: 70, y: 110 }, q1: { x: 195, y: 110 }, q2: { x: 320, y: 55 }, q3: { x: 320, y: 165 } },
    defaultInput: "aabb",
    theory: "PDA-ს გააჩნია Stack (სტეკი) — მეხსიერება. ეს საშუალებას იძლევა Context-Free ენების ამოცნობა, რაც DFA/NFA-ს ძალის მიღმაა. aⁿbⁿ DFA-ს ვერ ამოიცნობს.",
  },
};

// ─── SIMULATION LOGIC ─────────────────────────────────────────────────────────

function simulateDFA(automaton, input) {
  let state = automaton.start;
  const steps = [{ states: [state], char: null, stack: null }];
  let valid = true;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const nexts = automaton.transitions[state]?.[c];
    if (!nexts || nexts.length === 0) { valid = false; break; }
    state = nexts[0];
    steps.push({ states: [state], char: c, stack: null });
  }
  return { steps, accepted: valid && automaton.accepting.includes(state) };
}

function simulateNFA(automaton, input) {
  let currentStates = new Set([automaton.start]);
  const steps = [{ states: [...currentStates], char: null, stack: null }];
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const next = new Set();
    for (const s of currentStates) {
      const nexts = automaton.transitions[s]?.[c] || [];
      nexts.forEach(n => next.add(n));
    }
    currentStates = next;
    steps.push({ states: [...currentStates], char: c, stack: null });
  }
  const accepted = [...currentStates].some(s => automaton.accepting.includes(s));
  return { steps, accepted };
}

function epsilonClosure(automaton, states) {
  const closure = new Set(states);
  const stack = [...states];
  while (stack.length > 0) {
    const s = stack.pop();
    const eps = automaton.transitions[s]?.["ε"] || [];
    eps.forEach(n => { if (!closure.has(n)) { closure.add(n); stack.push(n); } });
  }
  return closure;
}

function simulateENFA(automaton, input) {
  let currentStates = epsilonClosure(automaton, [automaton.start]);
  const steps = [{ states: [...currentStates], char: null, stack: null }];
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    const next = new Set();
    for (const s of currentStates) {
      const nexts = automaton.transitions[s]?.[c] || [];
      nexts.forEach(n => next.add(n));
    }
    const closed = epsilonClosure(automaton, [...next]);
    currentStates = closed;
    steps.push({ states: [...currentStates], char: c, stack: null });
  }
  const accepted = [...currentStates].some(s => automaton.accepting.includes(s));
  return { steps, accepted };
}

function simulatePDA(automaton, input) {
  // Simple deterministic PDA simulation for aⁿbⁿ
  const steps = [];
  let state = automaton.start;
  let stack = ["Z"];
  steps.push({ states: [state], char: null, stack: [...stack] });

  let i = 0;
  let ok = true;

  // Phase 1: read a's, push A
  while (i < input.length && input[i] === "a") {
    stack.push("A");
    state = "q0";
    steps.push({ states: [state], char: "a", stack: [...stack], action: `push A → stack: [${stack.join(",")}]` });
    i++;
  }

  if (i === 0) { ok = false; }

  // Phase 2: read b's, pop A
  while (ok && i < input.length && input[i] === "b") {
    if (stack[stack.length - 1] !== "A") { ok = false; break; }
    stack.pop();
    state = "q1";
    steps.push({ states: [state], char: "b", stack: [...stack], action: `pop A → stack: [${stack.join(",")}]` });
    i++;
  }

  // Check end: remaining input? leftover A's?
  if (ok && i === input.length && stack[stack.length - 1] === "Z" && stack.length === 1) {
    state = "q3";
    steps.push({ states: [state], char: null, stack: [...stack], action: "სტეკი სუფთაა ✓" });
  } else {
    ok = false;
    state = "q2";
    steps.push({ states: [state], char: null, stack: [...stack], action: "შეცდომა ✗" });
  }

  return { steps, accepted: ok && automaton.accepting.includes(state) };
}

function runSimulation(automaton, input) {
  if (automaton.id === "dfa") return simulateDFA(automaton, input);
  if (automaton.id === "nfa") return simulateNFA(automaton, input);
  if (automaton.id === "enfa") return simulateENFA(automaton, input);
  if (automaton.id === "pda") return simulatePDA(automaton, input);
}

// ─── SVG DIAGRAMS ─────────────────────────────────────────────────────────────

function DFADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions;
  const active = s => activeStates?.includes(s);
  return (
    <svg viewBox="0 0 440 220" style={{ width: "100%", height: 180 }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
        <marker id="arr-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#60a5fa" />
        </marker>
      </defs>
      {/* Edges */}
      <path d="M110,110 L190,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="150" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
      <path d="M250,110 L330,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="290" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">b</text>
      <path d="M65,96 Q50,68 80,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="48" y="72" fill="#3d5a8a" fontSize="10" fontFamily="monospace">b</text>
      <path d="M205,96 Q190,68 220,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="188" y="68" fill="#3d5a8a" fontSize="10" fontFamily="monospace">a</text>
      <path d="M340,96 Q290,60 240,96" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="290" y="53" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
      <path d="M360,138 Q220,200 80,138" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="220" y="196" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">b</text>
      {/* States */}
      {automaton.states.map(s => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={28}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && <circle cx={pos[s].x} cy={pos[s].y} r={22} fill="none" stroke="#4ade80" strokeWidth="1" />}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"} fontSize="12" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  );
}

function NFADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions;
  const active = s => activeStates?.includes(s);
  return (
    <svg viewBox="0 0 440 220" style={{ width: "100%", height: 180 }}>
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
      </defs>
      {/* q0→q0 on b */}
      <path d="M65,96 Q50,68 80,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="45" y="72" fill="#3d5a8a" fontSize="10" fontFamily="monospace">b</text>
      {/* q0→q0 on a (lower arc) */}
      <path d="M60,125 Q30,160 100,130" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="48" y="162" fill="#3d5a8a" fontSize="10" fontFamily="monospace">a</text>
      {/* q0→q1 on a */}
      <path d="M110,105 L190,105" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="150" y="99" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
      {/* q1→q2 on a */}
      <path d="M250,110 L330,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="290" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
      {/* q2 self on a,b */}
      <path d="M345,84 Q360,55 378,82" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="373" y="60" fill="#3d5a8a" fontSize="10" fontFamily="monospace">a,b</text>
      {automaton.states.map(s => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={28}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && <circle cx={pos[s].x} cy={pos[s].y} r={22} fill="none" stroke="#4ade80" strokeWidth="1" />}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"} fontSize="12" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  );
}

function ENFADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions;
  const active = s => activeStates?.includes(s);
  return (
    <svg viewBox="0 0 400 230" style={{ width: "100%", height: 200 }}>
      <defs>
        <marker id="arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
        <marker id="arr3e" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#7c5abf" />
        </marker>
      </defs>
      {/* q0→q1 on a */}
      <path d="M85,95 L160,68" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="115" y="72" fill="#3d5a8a" fontSize="10" fontFamily="monospace">a</text>
      {/* q0→q3 on b */}
      <path d="M85,125 L160,155" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="108" y="155" fill="#3d5a8a" fontSize="10" fontFamily="monospace">b</text>
      {/* q1→q2 on b */}
      <path d="M215,55 L285,55" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="250" y="49" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">b</text>
      {/* q3→q4 on a */}
      <path d="M215,165 L285,165" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="250" y="159" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="monospace">a</text>
      {automaton.states.map(s => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={26}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && <circle cx={pos[s].x} cy={pos[s].y} r={20} fill="none" stroke="#4ade80" strokeWidth="1" />}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"} fontSize="11" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  );
}

function PDADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions;
  const active = s => activeStates?.includes(s);
  return (
    <svg viewBox="0 0 420 220" style={{ width: "100%", height: 180 }}>
      <defs>
        <marker id="arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
      </defs>
      {/* q0 self on a */}
      <path d="M52,96 Q37,68 68,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      <text x="30" y="70" fill="#3d5a8a" fontSize="9" fontFamily="monospace">a,ε/A</text>
      {/* q0→q1 on b */}
      <path d="M100,110 L170,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      <text x="135" y="104" fill="#3d5a8a" fontSize="9" textAnchor="middle" fontFamily="monospace">b,A/ε</text>
      {/* q1 self on b */}
      <path d="M178,96 Q163,68 193,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      <text x="154" y="68" fill="#3d5a8a" fontSize="9" fontFamily="monospace">b,A/ε</text>
      {/* q1→q3 on ε */}
      <path d="M222,125 L295,155" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      <text x="268" y="150" fill="#3d5a8a" fontSize="9" fontFamily="monospace">ε,Z/Z</text>
      {automaton.states.map(s => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={26}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && <circle cx={pos[s].x} cy={pos[s].y} r={20} fill="none" stroke="#4ade80" strokeWidth="1" />}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"} fontSize="11" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  );
}

const DIAGRAMS = { dfa: DFADiagram, nfa: NFADiagram, enfa: ENFADiagram, pda: PDADiagram };

// ─── TRANSITION TABLE ─────────────────────────────────────────────────────────

function TransitionTable({ automaton }) {
  if (automaton.id === "pda") {
    return (
      <table style={tblStyle}>
        <thead>
          <tr>
            <th style={thStyle}>state</th>
            <th style={thStyle}>read</th>
            <th style={thStyle}>pop</th>
            <th style={thStyle}>push</th>
            <th style={thStyle}>next</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(automaton.pdaTransitions).flatMap(([s, rules]) =>
            rules.map((r, i) => (
              <tr key={s + i}>
                <td style={tdStyle}>{s}</td>
                <td style={tdStyle}>{r.read}</td>
                <td style={tdStyle}>{r.pop}</td>
                <td style={tdStyle}>{r.push}</td>
                <td style={tdStyle}>{r.next}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }
  const alpha = automaton.id === "enfa" ? [...automaton.alphabet, "ε"] : automaton.alphabet;
  return (
    <table style={tblStyle}>
      <thead>
        <tr>
          <th style={thStyle}>state</th>
          {alpha.map(a => <th key={a} style={thStyle}>{a}</th>)}
        </tr>
      </thead>
      <tbody>
        {automaton.states.map(s => (
          <tr key={s}>
            <td style={{ ...tdStyle, color: s === automaton.start ? "#22d3ee" : automaton.accepting.includes(s) ? "#4ade80" : "#667799" }}>{s}</td>
            {alpha.map(a => {
              const nexts = automaton.transitions[s]?.[a] || [];
              return <td key={a} style={tdStyle}>{nexts.length ? nexts.join(",") : "—"}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tblStyle = { width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 };
const thStyle = { padding: "5px 8px", color: "#445577", fontWeight: 400, textAlign: "left", borderBottom: "1px solid #1e2a42" };
const tdStyle = { padding: "4px 8px", color: "#667799", borderBottom: "1px solid #161e2e" };

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function AutomataPage() {
  const [selectedId, setSelectedId] = useState("dfa");
  const automaton = AUTOMATA[selectedId];

  const [inputStr, setInputStr] = useState(automaton.defaultInput);
  const [currentStep, setCurrentStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [accepted, setAccepted] = useState(null);
  const [path, setPath] = useState([]);
  const intervalRef = useRef(null);

  // Reset when automaton changes
  useEffect(() => {
    clearInterval(intervalRef.current);
    setInputStr(AUTOMATA[selectedId].defaultInput);
    setPath([]);
    setCurrentStep(-1);
    setAccepted(null);
    setRunning(false);
  }, [selectedId]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const run = () => {
    clearInterval(intervalRef.current);
    const { steps, accepted: acc } = runSimulation(automaton, inputStr);
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
    }, 600);
  };

  const activeStates = path[currentStep]?.states || [];
  const DiagramComponent = DIAGRAMS[selectedId];

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Automata <em>Simulator</em></h1>
        <p className="page-desc">სასრული ავტომატის მდგომარეობებისა და გადასვლების ვიზუალიზაცია ნაბიჯ-ნაბიჯ.</p>
      </div>

      {/* Automaton selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.values(AUTOMATA).map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedId(a.id)}
            style={{
              padding: "7px 18px",
              borderRadius: 6,
              border: selectedId === a.id ? "1.5px solid #60a5fa" : "1.5px solid #1e2a42",
              background: selectedId === a.id ? "#0d1e3a" : "transparent",
              color: selectedId === a.id ? "#60a5fa" : "#445577",
              fontFamily: "monospace",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {a.label}
            <span style={{ marginLeft: 6, fontSize: 10, color: "#334466" }}>{a.fullName.replace(a.label, "").trim()}</span>
          </button>
        ))}
      </div>

      {/* Theory callout */}
      <div style={{
        padding: "10px 16px", marginBottom: 20,
        background: "#0a1628", border: "1px solid #1e2a42",
        borderLeft: "3px solid #3b5ea6", borderRadius: 6,
        fontFamily: "monospace", fontSize: 12, color: "#5577aa", lineHeight: 1.6
      }}>
        <span style={{ color: "#22d3ee", marginRight: 8 }}>{automaton.label}</span>
        {automaton.theory}
      </div>

      <div className="automata-grid">
        {/* Left panel */}
        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">{automaton.label} კონფიგურაცია</span></div>
            <div className="panel-body">
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#334466", fontFamily: "monospace", marginBottom: 4 }}>პირობა</div>
                <div style={{ fontSize: 12, color: "#22d3ee", fontFamily: "monospace" }}>{automaton.description}</div>
              </div>
              <hr className="divider" />

              {/* State pills */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#334466", fontFamily: "monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>მდგომარეობები</div>
                <div className="state-row">
                  {automaton.states.map(s => (
                    <div key={s} className={`state-pill ${s === automaton.start ? "start" : ""} ${automaton.accepting.includes(s) ? "accepting" : ""} ${activeStates.includes(s) ? "active" : ""}`}>
                      {s}{s === automaton.start ? " ▶" : ""}{automaton.accepting.includes(s) ? " ✓" : ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transition table */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "#334466", fontFamily: "monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>გადასვლების ცხრილი</div>
                <TransitionTable automaton={automaton} />
              </div>

              {/* Input */}
              <input
                className="input-field"
                value={inputStr}
                onChange={e => { setInputStr(e.target.value); setPath([]); setCurrentStep(-1); setAccepted(null); }}
                placeholder="შეიყვანეთ სტრიქონი..."
                style={{ width: "100%", marginBottom: 10, boxSizing: "border-box" }}
              />
              <button className="btn btn-primary" onClick={run} disabled={running} style={{ width: "100%" }}>
                {running ? "სიმულაცია მიმდინარეობს..." : `▶  ${automaton.label} სიმულაცია`}
              </button>
            </div>
          </div>

          {accepted !== null && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 26, color: accepted ? "#4ade80" : "#f87171" }}>{accepted ? "✓" : "✗"}</div>
                  <div>
                    <span className={`badge ${accepted ? "badge-green" : "badge-red"}`}>{accepted ? "მიღებულია" : "უარყოფილია"}</span>
                    <div style={{ fontSize: 11, color: "#445577", fontFamily: "monospace", marginTop: 4 }}>
                      "{inputStr}" {accepted ? "ენის ნაწილია" : "ენაში არ შედის"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">მდგომარეობათა დიაგრამა</span></div>
            <div className="panel-body" style={{ padding: 12 }}>
              <DiagramComponent automaton={automaton} activeStates={activeStates} />
            </div>
          </div>

          {/* Stack visualization for PDA */}
          {selectedId === "pda" && path.length > 0 && currentStep >= 0 && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-header"><span className="panel-dot" /><span className="panel-title">სტეკი (Stack)</span></div>
              <div className="panel-body">
                <div style={{ display: "flex", gap: 4, alignItems: "flex-end", minHeight: 50 }}>
                  {(path[currentStep]?.stack || []).map((item, i) => (
                    <div key={i} style={{
                      padding: "4px 10px", borderRadius: 4,
                      background: item === "Z" ? "#0a1628" : "#0d1e3a",
                      border: `1px solid ${item === "Z" ? "#2d3a5a" : "#3b5ea6"}`,
                      fontFamily: "monospace", fontSize: 13,
                      color: item === "Z" ? "#445577" : "#60a5fa",
                    }}>{item}</div>
                  ))}
                </div>
                {path[currentStep]?.action && (
                  <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 11, color: "#445577" }}>
                    {path[currentStep].action}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Computation path */}
          <div className="panel" style={{ marginTop: 12 }}>
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">გამოთვლის მარშრუტი</span></div>
            <div className="panel-body">
              {path.length === 0 ? (
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334466" }}>შეიყვანეთ სტრიქონი და გაუშვით სიმულაცია.</div>
              ) : (
                <div>
                  {/* Input chars */}
                  <div style={{ marginBottom: 10 }}>
                    {inputStr.split("").map((c, i) => (
                      <span key={i} style={{
                        display: "inline-block", padding: "2px 8px", margin: "2px",
                        borderRadius: 4, fontFamily: "monospace", fontSize: 13,
                        background: i < currentStep ? "#0d1e3a" : "#0a1220",
                        border: `1px solid ${i === currentStep - 1 ? "#3b5ea6" : "#161e2e"}`,
                        color: i < currentStep ? "#60a5fa" : "#334466",
                      }}>{c}</span>
                    ))}
                  </div>
                  {/* Steps */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {path.map((step, i) => (
                      <span key={i} style={{
                        padding: "3px 8px", borderRadius: 4,
                        fontFamily: "monospace", fontSize: 11,
                        background: i === currentStep ? "#0d1e3a" : i < currentStep ? "#070e1a" : "transparent",
                        border: `1px solid ${i === currentStep ? "#3b5ea6" : i < currentStep ? "#1e2a42" : "transparent"}`,
                        color: i === currentStep ? "#60a5fa" : i < currentStep ? "#445577" : "#222d42",
                      }}>
                        {step.char ? `—${step.char}→ ` : ""}{step.states.join(",")}
                      </span>
                    ))}
                  </div>
                  {/* NFA active states note */}
                  {(selectedId === "nfa" || selectedId === "enfa") && currentStep >= 0 && (
                    <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: 11, color: "#445577" }}>
                      აქტიური მდგომარეობები: {"{" + (path[currentStep]?.states || []).join(", ") + "}"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}