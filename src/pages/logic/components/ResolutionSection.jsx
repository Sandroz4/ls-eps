import React from "react";
import { useResolution } from "../useResolution";
import { clauseStr } from "../logicUtils";
import ResolutionTreeSVG from "./ResolutionTreeSVG";

const PRESET_LABELS = ["¬P∨Q, ¬Q, P → ⊥", "P(a), ¬P(x)∨Q(x)", "¬P∨Q∨R, ¬Q∨S, …", "სატყუარა (satisfiable)"];

export default function ResolutionSection() {
  const {
    clauseInput, setClauseInput, clauses, resTab, setResTab, proofData, error,
    addClause, loadPreset, runProof, insertSym, removeClause, resetAll
  } = useResolution();

  return (
    <div>
      <div className="panel mb-20">
        <div className="panel-header"><span className="panel-title">მაგალითები</span></div>
        <div className="panel-body">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PRESET_LABELS.map((label, i) => (
              <button key={i} className="btn btn-secondary" style={{ fontSize: 10, padding: "4px 10px" }} onClick={() => loadPreset(i)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="resolution-grid" style={{ display: "grid", gap: 16, marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-header"><span className="panel-title">ახალი კლაუზა</span></div>
          <div className="panel-body">
            <div className="flex gap-8 mb-12">
              <input
                className="input-field" style={{ flex: 1 }} value={clauseInput}
                onChange={(e) => setClauseInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addClause()}
                placeholder="მაგ: ¬P∨Q∨R"
              />
              <button className="btn btn-primary" onClick={addClause}>+</button>
            </div>
            {error && <div style={{ color: "var(--accent)", fontSize: 11, marginBottom: 8 }}>{error}</div>}
            <div style={{ display: "flex", gap: 6 }}>
              {["¬", "∨", "∧"].map((sym) => (
                <button key={sym} className="btn btn-secondary" style={{ fontSize: 13, padding: "4px 12px" }} onClick={() => insertSym(sym)}>
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><span className="panel-title">კლაუზების სიმრავლე S</span></div>
          <div className="panel-body">
            {clauses.length === 0 ? (
              <div style={{ fontSize: 11, color: "var(--text-mute)", padding: "8px 0" }}>კლაუზები ჯერ არ დამატებულა</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {clauses.map((c, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 4, fontSize: 12, background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--cyan)" }}>
                    <span style={{ color: "var(--text-mute)", fontSize: 10 }}>C{i + 1}</span>
                    {clauseStr(c)}
                    <button onClick={() => removeClause(i)} style={{ background: "none", border: "none", color: "var(--text-mute)", cursor: "pointer" }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-8">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={runProof}>▶ Refutation</button>
              <button className="btn btn-secondary" onClick={resetAll}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      {proofData && (
        <div>
          <div style={{ borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 12, ...(proofData.refutationFound ? { background: "#4ecb7111", border: "1px solid #4ecb7133", color: "#4ecb71" } : { background: "#ff5f5f11", border: "1px solid #ff5f5f33", color: "#ff5f5f" }) }}>
            {proofData.refutationFound ? "✓  კლაუზების სიმრავლე არის UNSATISFIABLE" : "✗  Empty clause არ მიიღება"}
          </div>

          <div className="tabs">
            <button className={`tab ${resTab === "steps" ? "active" : ""}`} onClick={() => setResTab("steps")}>Proof Steps</button>
            <button className={`tab ${resTab === "tree" ? "active" : ""}`} onClick={() => setResTab("tree")}>Proof Tree</button>
          </div>

          {resTab === "steps" && (
            <div className="panel">
              <div className="panel-body">
                {proofData.steps.map((s, i) => {
                  const p1 = proofData.steps[s.parent1];
                  const p2 = proofData.steps[s.parent2];
                  return (
                    <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 10, color: "var(--text-mute)", marginRight: 10 }}>{s.label}</span>
                      <strong style={{ color: "var(--cyan)" }}>{clauseStr(s.lits)}</strong>
                      <span style={{ fontSize: 10, color: "var(--text-mute)", marginLeft: 10 }}>
                        {s.origin === "input" ? "hypothesis" : `Res(${p1?.label}, ${p2?.label})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {resTab === "tree" && (
            <div className="panel">
              <div className="panel-body">
                {proofData.tree ? <ResolutionTreeSVG root={proofData.tree} /> : <div>ხე ხელმისაწვდომია მხოლოდ UNSATISFIABLE კლაუზებისთვის.</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}