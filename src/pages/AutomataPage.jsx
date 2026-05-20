import React, { useState, useEffect, useRef } from "react";

export default function AutomataPage() {
  const [inputStr, setInputStr] = useState("abba");
  const [currentStep, setCurrentStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [accepted, setAccepted] = useState(null);
  const [path, setPath] = useState([]);
  const intervalRef = useRef(null);

  const dfa = {
    states: ["q0", "q1", "q2"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { a: "q1", b: "q0" },
      q1: { a: "q1", b: "q2" },
      q2: { a: "q1", b: "q0" },
    },
    description: 'იღებს სტრიქონებს, რომლებიც მთავრდება "ab"-ით',
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
        <div className="page-eyebrow">მოდული 01</div>
        <h1 className="page-title">Automata <em>Simulator</em></h1>
        <p className="page-desc">სასრული ავტომატის მდგომარეობებისა და გადასვლების ცვლილების ვიზუალიზაცია ნაბიჯ-ნაბიჯ.</p>
      </div>

      <div className="automata-grid">
        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">DFA კონფიგურაცია</span></div>
            <div className="panel-body">
              <div className="mb-12">
                <div style={{ fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 6 }}>ავტომატი</div>
                <div style={{ fontSize: 13, color: "var(--cyan)", fontFamily: "var(--mono)" }}>{dfa.description}</div>
              </div>
              <hr className="divider" />
              <div className="mb-12">
                <div style={{ fontSize: 11, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 8, textTransform: "uppercase" }}>მდგომარეობები</div>
                <div className="state-row">
                  {dfa.states.map(s => (
                    <div key={s} className={`state-pill ${s === dfa.start ? "start" : ""} ${dfa.accepting.includes(s) ? "accepting" : ""} ${path[currentStep]?.state === s ? "active" : ""}`}>
                      {s}{s === dfa.start ? " ▶" : ""}{dfa.accepting.includes(s) ? " ✓" : ""}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-16">
                <table className="truth-table">
                  <thead><tr><th>მდგომარეობა</th>{dfa.alphabet.map(a => <th key={a}>{a}</th>)}</tr></thead>
                  <tbody>
                    {dfa.states.map(s => (
                      <tr key={s}>
                        <td style={{ color: s === dfa.start ? "var(--cyan)" : dfa.accepting.includes(s) ? "#4ecb71" : "var(--text-dim)" }}>{s}</td>
                        {dfa.alphabet.map(a => <td key={a}>{dfa.transitions[s]?.[a] || "—"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-8 mb-12">
                <input className="input-field" value={inputStr} onChange={e => setInputStr(e.target.value)} placeholder="შეიყვანეთ შემავალი სტრიქონი..." />
              </div>
              <button className="btn btn-primary" onClick={run} disabled={running} style={{ width: "100%" }}>
                {running ? "სიმულაცია მიმდინარეობს..." : "▶  სიმულაციის გაშვება"}
              </button>
            </div>
          </div>

          {accepted !== null && (
            <div className="panel">
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 28 }}>{accepted ? "✓" : "✗"}</div>
                  <div>
                    <span className={`badge ${accepted ? "badge-green" : "badge-red"}`}>{accepted ? "მიღებულია" : "უარყოფილია"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">მდგომარეობათა დიაგრამა</span></div>
            <div className="panel-body" style={{ padding: 12 }}>
              <svg className="svg-canvas" viewBox="0 0 440 220">
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
                  </marker>
                </defs>
                <path d="M110,110 L190,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="150" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">a</text>

                <path d="M250,110 L330,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="290" y="104" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">b</text>

                <path d="M65,96 Q50,68 80,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="55" y="72" fill="#3d5a8a" fontSize="10" fontFamily="Space Mono">b</text>

                <path d="M205,96 Q190,68 220,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="195" y="72" fill="#3d5a8a" fontSize="10" fontFamily="Space Mono">a</text>

                <path d="M340,96 Q290,60 240,96" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="290" y="55" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">a</text>

                <path d="M360,138 Q220,200 80,138" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arrow)" fill="none" />
                <text x="220" y="195" fill="#3d5a8a" fontSize="10" textAnchor="middle" fontFamily="Space Mono">b</text>

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
                      <text x={stateX[s]} y={stateY + 5} fill={isActive ? "#fff" : "var(--text-dim)"} fontSize="13" textAnchor="middle" fontFamily="Space Mono">
                        {s}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><span className="panel-dot" /><span className="panel-title">გამოთვლის მარშრუტი</span></div>
            <div className="panel-body">
              {path.length === 0 ? (
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-mute)" }}>შეიყვანეთ სტრიქონი და გაუშვით სიმულაცია.</div>
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