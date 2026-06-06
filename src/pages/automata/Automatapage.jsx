import React, { useState, useEffect, useRef } from "react"
import { AUTOMATA } from "./automataData"
import { runSimulation } from "./simulation"
import { DIAGRAMS } from "./Diagrams"
import TransitionTable from "./TransitionTable"

export default function AutomataPage() {
  const [selectedId, setSelectedId] = useState("dfa")
  const automaton = AUTOMATA[selectedId]

  const [inputStr, setInputStr] = useState(automaton.defaultInput)
  const [currentStep, setCurrentStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const [accepted, setAccepted] = useState(null)
  const [path, setPath] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)
    setInputStr(AUTOMATA[selectedId].defaultInput)
    setPath([])
    setCurrentStep(-1)
    setAccepted(null)
    setRunning(false)
  }, [selectedId])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const run = () => {
    clearInterval(intervalRef.current)
    const { steps, accepted: acc } = runSimulation(automaton, inputStr)
    setPath(steps)
    setCurrentStep(0)
    setAccepted(null)
    setRunning(true)
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setCurrentStep(i)
      if (i >= steps.length - 1) {
        clearInterval(intervalRef.current)
        setRunning(false)
        setAccepted(acc)
      }
    }, 600)
  }

  const activeStates = path[currentStep]?.states || []
  const DiagramComponent = DIAGRAMS[selectedId]

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Automata <em>Simulator</em>
        </h1>
        <p className="page-desc">
          სასრული ავტომატის მდგომარეობებისა და გადასვლების ვიზუალიზაცია ნაბიჯ-ნაბიჯ.
        </p>
      </div>

      {/* Automaton selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.values(AUTOMATA).map((a) => (
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
            <span style={{ marginLeft: 6, fontSize: 10, color: "#334466" }}>
              {a.fullName.replace(a.label, "").trim()}
            </span>
          </button>
        ))}
      </div>

      {/* Theory callout */}
      <div style={{
        padding: "10px 16px",
        marginBottom: 20,
        background: "#0a1628",
        border: "1px solid #1e2a42",
        borderLeft: "3px solid #3b5ea6",
        borderRadius: 6,
        fontFamily: "monospace",
        fontSize: 12,
        color: "#5577aa",
        lineHeight: 1.6,
      }}>
        <span style={{ color: "#22d3ee", marginRight: 8 }}>{automaton.label}</span>
        {automaton.theory}
      </div>

      <div className="automata-grid">
        {/* Left panel */}
        <div>
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">{automaton.label} კონფიგურაცია</span>
            </div>
            <div className="panel-body">
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#334466", fontFamily: "monospace", marginBottom: 4 }}>
                  პირობა
                </div>
                <div style={{ fontSize: 12, color: "#22d3ee", fontFamily: "monospace" }}>
                  {automaton.description}
                </div>
              </div>
              <hr className="divider" />

              {/* State pills */}
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontSize: 10, color: "#334466", fontFamily: "monospace",
                  marginBottom: 6, textTransform: "uppercase", letterSpacing: 1,
                }}>
                  მდგომარეობები
                </div>
                <div className="state-row">
                  {automaton.states.map((s) => (
                    <div
                      key={s}
                      className={`state-pill ${s === automaton.start ? "start" : ""} ${automaton.accepting.includes(s) ? "accepting" : ""} ${activeStates.includes(s) ? "active" : ""}`}
                    >
                      {s}
                      {s === automaton.start ? " ▶" : ""}
                      {automaton.accepting.includes(s) ? " ✓" : ""}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transition table */}
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 10, color: "#334466", fontFamily: "monospace",
                  marginBottom: 6, textTransform: "uppercase", letterSpacing: 1,
                }}>
                  გადასვლების ცხრილი
                </div>
                <TransitionTable automaton={automaton} />
              </div>

              {/* Input */}
              <input
                className="input-field"
                value={inputStr}
                onChange={(e) => {
                  setInputStr(e.target.value)
                  setPath([])
                  setCurrentStep(-1)
                  setAccepted(null)
                }}
                placeholder="შეიყვანეთ სტრიქონი..."
                style={{ width: "100%", marginBottom: 10, boxSizing: "border-box" }}
              />
              <button
                className="btn btn-primary"
                onClick={run}
                disabled={running}
                style={{ width: "100%" }}
              >
                {running ? "სიმულაცია მიმდინარეობს..." : `▶  ${automaton.label} სიმულაცია`}
              </button>
            </div>
          </div>

          {accepted !== null && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-body">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 26, color: accepted ? "#4ade80" : "#f87171" }}>
                    {accepted ? "✓" : "✗"}
                  </div>
                  <div>
                    <span className={`badge ${accepted ? "badge-green" : "badge-red"}`}>
                      {accepted ? "მიღებულია" : "უარყოფილია"}
                    </span>
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
            <div className="panel-header">
              <span className="panel-title">მდგომარეობათა დიაგრამა</span>
            </div>
            <div className="panel-body" style={{ padding: 12 }}>
              <DiagramComponent automaton={automaton} activeStates={activeStates} />
            </div>
          </div>

          {/* Stack visualization for PDA */}
          {selectedId === "pda" && path.length > 0 && currentStep >= 0 && (
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-header">
                <span className="panel-title">სტეკი (Stack)</span>
              </div>
              <div className="panel-body">
                <div style={{ display: "flex", gap: 4, alignItems: "flex-end", minHeight: 50 }}>
                  {(path[currentStep]?.stack || []).map((item, i) => (
                    <div key={i} style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      background: item === "Z" ? "#0a1628" : "#0d1e3a",
                      border: `1px solid ${item === "Z" ? "#2d3a5a" : "#3b5ea6"}`,
                      fontFamily: "monospace",
                      fontSize: 13,
                      color: item === "Z" ? "#445577" : "#60a5fa",
                    }}>
                      {item}
                    </div>
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
            <div className="panel-header">
              <span className="panel-title">გამოთვლის მარშრუტი</span>
            </div>
            <div className="panel-body">
              {path.length === 0 ? (
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "#334466" }}>
                  შეიყვანეთ სტრიქონი და გაუშვით სიმულაცია.
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 10 }}>
                    {inputStr.split("").map((c, i) => (
                      <span key={i} style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        margin: "2px",
                        borderRadius: 4,
                        fontFamily: "monospace",
                        fontSize: 13,
                        background: i < currentStep ? "#0d1e3a" : "#0a1220",
                        border: `1px solid ${i === currentStep - 1 ? "#3b5ea6" : "#161e2e"}`,
                        color: i < currentStep ? "#60a5fa" : "#334466",
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {path.map((step, i) => (
                      <span key={i} style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontFamily: "monospace",
                        fontSize: 11,
                        background: i === currentStep ? "#0d1e3a" : i < currentStep ? "#070e1a" : "transparent",
                        border: `1px solid ${i === currentStep ? "#3b5ea6" : i < currentStep ? "#1e2a42" : "transparent"}`,
                        color: i === currentStep ? "#60a5fa" : i < currentStep ? "#445577" : "#222d42",
                      }}>
                        {step.char ? `—${step.char}→ ` : ""}
                        {step.states.join(",")}
                      </span>
                    ))}
                  </div>
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
  )
}