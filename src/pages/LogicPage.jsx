import React, { useState } from "react";

// ── Resolution helpers ──────────────────────────────────────────────────────
function normLit(s) {
  return s.trim().replace(/!/g, "¬").replace(/~/g, "¬");
}
function parseClause(raw) {
  const parts = raw.replace(/∧/g, "∨").split(/[|∨]/).map(normLit).filter(Boolean);
  return parts.length ? [...new Set(parts)] : null;
}
function clauseStr(lits) {
  return !lits || lits.length === 0 ? "⊥" : lits.join(" ∨ ");
}
function negOf(lit) { return lit.startsWith("¬") ? lit.slice(1) : "¬" + lit; }
function clauseKey(lits) { return [...lits].sort().join("|"); }

function resolve(a, b) {
  for (const l of a) {
    const comp = negOf(l);
    if (b.includes(comp)) {
      const res = [...new Set([...a.filter(x => x !== l), ...b.filter(x => x !== comp)])];
      return { resolved: res, pivot: l, pivot2: comp };
    }
  }
  return null;
}

function runResolutionAlgorithm(clauses) {
  const working = clauses.map((c, i) => ({
    lits: [...c], origin: "input", idx: i, label: `C${i + 1}`,
    parent1: -1, parent2: -1, pivot: "", pivot2: "",
  }));
  const seen = new Set(working.map(c => clauseKey(c.lits)));
  const steps = [...working];
  let refutationFound = working.some(s => s.lits.length === 0);

  let changed = true, iter = 0;
  while (changed && iter < 200 && !refutationFound) {
    changed = false; iter++;
    const n = steps.length;
    for (let i = 0; i < n && !refutationFound; i++) {
      for (let j = i; j < n && !refutationFound; j++) {
        const r = resolve(steps[i].lits, steps[j].lits);
        if (!r) continue;
        const key = clauseKey(r.resolved);
        if (seen.has(key)) continue;
        seen.add(key);
        const ni = steps.length;
        steps.push({
          lits: r.resolved, origin: "resolvent", idx: ni, label: `C${ni + 1}`,
          parent1: i, parent2: j, pivot: r.pivot, pivot2: r.pivot2,
        });
        changed = true;
        if (r.resolved.length === 0) refutationFound = true;
      }
    }
  }
  return { steps, refutationFound };
}

function buildTree(steps) {
  const emptyIdx = steps.findIndex(s => s.lits.length === 0 && s.origin === "resolvent");
  if (emptyIdx === -1) return null;
  function makeNode(idx) {
    const s = steps[idx];
    const node = { label: s.label, clause: clauseStr(s.lits), origin: s.origin, children: [] };
    if (s.origin === "resolvent") {
      node.children = [makeNode(s.parent1), makeNode(s.parent2)];
      node.pivot = s.pivot + "/" + s.pivot2;
    }
    return node;
  }
  return makeNode(emptyIdx);
}

// ── Proof Tree SVG ──────────────────────────────────────────────────────────
function ResolutionTreeSVG({ root }) {
  if (!root) return null;
  const LEVEL_H = 70, NODE_W = 110, NODE_H = 36, PAD = 16;
  const getWidth = n => (!n.children?.length ? 1 : n.children.reduce((s, c) => s + getWidth(c), 0));
  const getDepth = n => (!n.children?.length ? 0 : 1 + Math.max(...n.children.map(getDepth)));
  const leavesW = getWidth(root);
  const depth = getDepth(root);
  const svgW = Math.max(500, leavesW * (NODE_W + PAD) + PAD * 2);
  const svgH = (depth + 1) * LEVEL_H + NODE_H + 24;

  const shapes = [];
  let k = 0;
  const drawNode = (node, x, y, left, right) => {
    const isEmpty = node.clause === "⊥";
    const isInput = node.origin === "input";
    const fill = isEmpty ? "#4ecb7122" : isInput ? "var(--bg3)" : "#1a4a99";
    const stroke = isEmpty ? "#4ecb71" : isInput ? "var(--border2)" : "var(--blue)";
    const textCol = isEmpty ? "#4ecb71" : isInput ? "var(--text-dim)" : "var(--cyan)";
    shapes.push(
      <rect key={k++} x={x - NODE_W / 2} y={y} width={NODE_W} height={NODE_H} rx={6}
        fill={fill} stroke={stroke} strokeWidth={1.5} />,
      <text key={k++} x={x - NODE_W / 2 + 6} y={y + 11}
        fill="var(--text-mute)" fontSize={9} fontFamily="Space Mono">{node.label}</text>,
      <text key={k++} x={x} y={y + 25} fill={textCol} fontSize={11}
        fontFamily="Space Mono" textAnchor="middle">
        {node.clause.length > 14 ? node.clause.slice(0, 13) + "…" : node.clause}
      </text>
    );
    if (node.children?.length) {
      const span = right - left, step = span / node.children.length;
      node.children.forEach((child, i) => {
        const cx = left + step * i + step / 2, cy = y + LEVEL_H;
        const pivotPart = (i === 0 ? node.pivot?.split("/")[0] : node.pivot?.split("/")[1]) || "";
        shapes.push(
          <line key={k++} x1={x} y1={y + NODE_H} x2={cx} y2={cy}
            stroke="var(--border2)" strokeWidth={1} />,
          <text key={k++} x={(x + cx) / 2} y={(y + NODE_H + cy) / 2}
            fill="var(--accent)" fontSize={9} fontFamily="Space Mono" textAnchor="middle">
            {pivotPart}
          </text>
        );
        drawNode(child, cx, cy, left + step * i, left + step * (i + 1));
      });
    }
  };
  drawNode(root, svgW / 2, 16, 0, svgW);
  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ minHeight: svgH, width: "100%", minWidth: 400 }}>
        {shapes}
      </svg>
    </div>
  );
}

// ── Resolution Section ──────────────────────────────────────────────────────
const PRESETS = [
  ["¬P∨Q", "¬Q", "P"],
  ["P(a)", "¬P(x)∨Q(x)", "¬Q(a)"],
  ["¬P∨Q∨R", "¬Q∨S", "¬P∨¬S", "P"],
  ["P∨Q", "¬P∨Q"],
];

const PRESET_LABELS = [
  "¬P∨Q, ¬Q, P → ⊥",
  "P(a), ¬P(x)∨Q(x), ¬Q(a) → ⊥",
  "¬P∨Q∨R, ¬Q∨S, … → ⊥",
  "სატყუარა (satisfiable)",
];

function ResolutionSection() {
  const [clauseInput, setClauseInput] = useState("¬P∨Q");
  const [clauses, setClauses] = useState([]);
  const [resTab, setResTab] = useState("steps");
  const [proofData, setProofData] = useState(null);
  const [error, setError] = useState("");

  const addClause = () => {
    const lits = parseClause(clauseInput);
    if (!lits) { setError("კლაუზა ვერ დამუშავდა"); return; }
    setClauses(prev => [...prev, lits]);
    setClauseInput("");
    setError("");
  };

  const loadPreset = (i) => {
    setClauses(PRESETS[i].map(raw => parseClause(raw)));
    setProofData(null);
  };

  const runProof = () => {
    if (!clauses.length) return;
    const result = runResolutionAlgorithm(clauses);
    result.tree = buildTree(result.steps);
    setProofData(result);
    setResTab("steps");
  };

  const insertSym = (sym) => {
    setClauseInput(prev => prev + sym);
  };

  return (
    <div>
      <div className="panel mb-20">
        <div className="panel-header">
          <span className="panel-dot" />
          <span className="panel-title">მაგალითები</span>
        </div>
        <div className="panel-body">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PRESET_LABELS.map((label, i) => (
              <button key={i} className="btn btn-secondary"
                style={{ fontSize: 10, padding: "4px 10px" }}
                onClick={() => loadPreset(i)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="resolution-grid" style={{ display: "grid", gap: 16, marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-dot" />
            <span className="panel-title">ახალი კლაუზა</span>
          </div>
          <div className="panel-body">
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)", marginBottom: 10, lineHeight: 1.7 }}>
              ფორმატი: <span style={{ color: "var(--cyan)" }}>¬P∨Q∨R</span><br />
              <span style={{ color: "var(--blue)" }}>!</span> ან <span style={{ color: "var(--blue)" }}>¬</span> უარყოფა &nbsp;·&nbsp;
              <span style={{ color: "var(--blue)" }}>|</span> ან <span style={{ color: "var(--blue)" }}>∨</span> — დიზიუნქცია
            </div>
            <div className="flex gap-8 mb-12">
              <input className="input-field" style={{ flex: 1 }}
                value={clauseInput}
                onChange={e => setClauseInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addClause()}
                placeholder="მაგ: ¬P∨Q∨R" />
              <button className="btn btn-primary" onClick={addClause}>+</button>
            </div>
            {error && (
              <div style={{ color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 11, marginBottom: 8 }}>
                {error}
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              {["¬", "∨", "∧"].map(sym => (
                <button key={sym} className="btn btn-secondary"
                  style={{ fontSize: 13, padding: "4px 12px" }}
                  onClick={() => insertSym(sym)}>
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-dot" />
            <span className="panel-title">კლაუზების სიმრავლე S</span>
          </div>
          <div className="panel-body">
            {clauses.length === 0 ? (
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", padding: "8px 0" }}>
                კლაუზები ჯერ არ დამატებულა
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {clauses.map((c, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 4,
                    fontFamily: "var(--mono)", fontSize: 12,
                    background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--cyan)",
                  }}>
                    <span style={{ color: "var(--text-mute)", fontSize: 10 }}>C{i + 1}</span>
                    {clauseStr(c)}
                    <button
                      onClick={() => setClauses(prev => prev.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: "var(--text-mute)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: "0 2px" }}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-8">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={runProof}>
                ▶ Refutation
              </button>
              <button className="btn btn-secondary" onClick={() => { setClauses([]); setProofData(null); }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {proofData && (
        <div>
          <div style={{
            borderRadius: 8, padding: "12px 16px", marginBottom: 16,
            fontFamily: "var(--mono)", fontSize: 12,
            ...(proofData.refutationFound
              ? { background: "#4ecb7111", border: "1px solid #4ecb7133", color: "#4ecb71" }
              : { background: "#ff5f5f11", border: "1px solid #ff5f5f33", color: "#ff5f5f" })
          }}>
            {proofData.refutationFound
              ? "✓  კლაუზების სიმრავლე არის UNSATISFIABLE"
              : "✗  Empty clause არ მიიღება, რადგან S შესაძლოა SATISFIABLE იყოს"}
          </div>

          <div className="tabs">
            <button className={`tab ${resTab === "steps" ? "active" : ""}`} onClick={() => setResTab("steps")}>
              Proof Steps
            </button>
            <button className={`tab ${resTab === "tree" ? "active" : ""}`} onClick={() => setResTab("tree")}>
              Proof Tree
            </button>
          </div>

          {resTab === "steps" && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-dot" />
                <span className="panel-title">Refutation-ის ნაბიჯები</span>
              </div>
              <div className="panel-body">
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    Input Clauses
                  </div>
                  {proofData.steps.filter(s => s.origin === "input").map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)", minWidth: 28, paddingTop: 2 }}>{s.label}</span>
                      <div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)" }}>{clauseStr(s.lits)}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)" }}>hypothesis</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    Derived Resolvents
                  </div>
                  {proofData.steps.filter(s => s.origin === "resolvent").map((s, i) => {
                    const p1 = proofData.steps[s.parent1];
                    const p2 = proofData.steps[s.parent2];
                    const isEmpty = s.lits.length === 0;
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "8px 0", borderBottom: "1px solid var(--border)",
                        ...(isEmpty ? { background: "var(--bg3)", borderRadius: 6, padding: "8px 10px" } : {})
                      }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: isEmpty ? "#4ecb71" : "var(--text-mute)", minWidth: 28, paddingTop: 2 }}>{s.label}</span>
                        <div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: isEmpty ? "#4ecb71" : "var(--cyan)" }}>{clauseStr(s.lits)}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--blue)" }}>
                            Res({p1?.label}, {p2?.label}) on{" "}
                            <span style={{ color: "var(--accent)" }}>{s.pivot} / {s.pivot2}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {resTab === "tree" && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-dot" />
                <span className="panel-title">Proof Tree</span>
              </div>
              <div className="panel-body">
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                  {[
                    { color: "var(--bg3)", border: "var(--border2)", label: "Input clause" },
                    { color: "#1a4a99", border: "var(--blue)", label: "Resolvent" },
                    { color: "#4ecb7122", border: "#4ecb71", label: "Empty clause ⊥" },
                  ].map(({ color, border, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-mute)" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, border: `1px solid ${border}` }} />
                      {label}
                    </div>
                  ))}
                </div>
                {proofData.tree
                  ? <ResolutionTreeSVG root={proofData.tree} />
                  : <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-mute)" }}>Refutation tree აიგება მხოლოდ unsatisfiable შემთხვევაში</div>
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main LogicPage ──────────────────────────────────────────────────────────
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

    setResult({ vars, rows, nnf, cnf, dnf, formula: f });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Logic <em>Lab</em></h1>
        <p className="page-desc">ნორმალური ფორმები, ჭეშმარიტების ცხრილები და რეზოლუციის მეთოდი.</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "transforms" ? "active" : ""}`} onClick={() => setTab("transforms")}>ნორმალური ფორმები</button>
        <button className={`tab ${tab === "truth" ? "active" : ""}`} onClick={() => setTab("truth")}>ჭეშმარიტების ცხრილი</button>
        <button className={`tab ${tab === "resolution" ? "active" : ""}`} onClick={() => setTab("resolution")}>რეზოლუცია</button>
      </div>

      {tab !== "resolution" && (
        <div className="panel mb-20">
          <div className="panel-header">
            <span className="panel-dot" />
            <span className="panel-title">ფორმულის შეყვანა</span>
          </div>
          <div className="panel-body">
            <div className="flex gap-8">
              <input className="input-field" style={{ flex: 1 }}
                value={formula}
                onChange={e => setFormula(e.target.value)} />
              <button className="btn btn-primary" onClick={parseAndTransform}>ანალიზი</button>
            </div>
          </div>
        </div>
      )}

      {tab === "transforms" && result && (
        <div className="logic-grid">
          <div className="panel">
            <div className="panel-body">
              {[
                { label: "საწყისი", val: result.formula },
                { label: "CNF", val: result.cnf },
                { label: "DNF", val: result.dnf },
              ].map(({ label, val }) => (
                <div key={label} className="transform-row">
                  <div className="transform-label">{label}</div>
                  <div className="transform-val">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "truth" && result && (
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
                    {result.vars.map(v => (
                      <td key={v} className={row[v] ? "T" : "F"}>{row[v] ? "T" : "F"}</td>
                    ))}
                    <td className={row.result ? "T" : "F"}>{row.result ? "T" : "F"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "resolution" && <ResolutionSection />}
    </div>
  );
}