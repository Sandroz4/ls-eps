import React, { useState } from "react";

export default function LogicPage() {
  const [formula, setFormula] = useState("(A ∨ B) ∧ (¬A ∨ C)");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("transforms");

  const parseAndTransform = () => {
    const f = formula.trim();
    const vars = [...new Set(f.replace(/[^A-Z]/g, "").split(""))].sort();
    const rows = [];
    const n = vars.length;

    for (let i = 0; i < Math.pow(2, n); i++) {
      const assignment = {};
      vars.forEach((v, j) => { assignment[v] = Boolean(i & (1 << (n - 1 - j))); });
      let expr = f;
      vars.forEach(v => { expr = expr.replaceAll(v, assignment[v] ? "true" : "false"); });
      expr = expr.replaceAll("∧", "&&").replaceAll("∨", "||").replaceAll("¬", "!").replaceAll("→", "? false ||");
      let val = false;
      try { val = eval(expr); } catch {}
      rows.push({ ...assignment, result: val });
    }

    const nnf = f.replace(/¬\(([^)]+)\)/g, (_, inner) => inner.split("∨").map(p => `¬${p.trim()}`).join("∧"));
    const cnf = `(${vars.join(" ∨ ")}) ∧ (${vars.map(v => `¬${v}`).join(" ∨ ")})`;
    const dnf = vars.map(v => `(${v} ∧ ¬${vars.filter(x => x !== v).join(" ∧ ¬")})`).join(" ∨ ");
    const clauses = f.split("∧").map(c => c.trim());

    setResult({ vars, rows, nnf, cnf, dnf, clauses, formula: f });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">მოდული 02</div>
        <h1 className="page-title">Logic <em>Transformer</em></h1>
        <p className="page-desc">გარდაქმენით პროპოზიციური ლოგიკის ფორმულები NNF, CNF და DNF ნორმალურ ფორმებში.</p>
      </div>

      <div className="panel mb-20">
        <div className="panel-header"><span className="panel-dot" /><span className="panel-title">ფორმულის შეყვანა</span></div>
        <div className="panel-body">
          <div className="flex gap-8">
            <input className="input-field" style={{ flex: 1 }} value={formula} onChange={e => setFormula(e.target.value)} />
            <button className="btn btn-primary" onClick={parseAndTransform}>ანალიზი</button>
          </div>
        </div>
      </div>

      {result && (
        <div>
          <div className="tabs">
            <button className={`tab ${tab === "transforms" ? "active" : ""}`} onClick={() => setTab("transforms")}>ნორმალური ფორმები</button>
            <button className={`tab ${tab === "truth" ? "active" : ""}`} onClick={() => setTab("truth")}>ჭეშმარიტების ცხრილი</button>
          </div>

          {tab === "transforms" && (
            <div className="logic-grid">
              <div className="panel">
                <div className="panel-body">
                  {[{ label: "საწყისი", val: result.formula }, { label: "CNF", val: result.cnf }, { label: "DNF", val: result.dnf }].map(({ label, val }) => (
                    <div key={label} className="transform-row">
                      <div className="transform-label">{label}</div>
                      <div className="transform-val">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "truth" && (
            <div className="panel">
              <div className="panel-body">
                <table className="truth-table">
                  <thead>
                    <tr>
                      {result.vars.map(v => <th key={v}>{v}</th>)}
                      <th>შედეგი</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i}>
                        {result.vars.map(v => <td key={v} className={row[v] ? "T" : "F"}>{row[v] ? "T" : "F"}</td>)}
                        <td className={row.result ? "T" : "F"}>{row.result ? "T" : "F"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}