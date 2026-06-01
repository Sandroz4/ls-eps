import { useState } from "react";

export function useLogicPage() {
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
      vars.forEach((v, j) => {
        assignment[v] = Boolean(i & (1 << (n - 1 - j)));
      });
      let expr = f;
      vars.forEach((v) => {
        expr = expr.replaceAll(v, assignment[v] ? "true" : "false");
      });
      expr = expr
        .replaceAll("∧", "&&")
        .replaceAll("∨", "||")
        .replaceAll("¬", "!")
        .replaceAll("→", "? false ||");
      let val = false;
      try { val = eval(expr); } catch {}
      rows.push({ ...assignment, result: val });
    }

    const cnf = `(${vars.join(" ∨ ")}) ∧ (${vars.map((v) => `¬${v}`).join(" ∨ ")})`;
    const dnf = vars.map((v) => `(${v} ∧ ¬${vars.filter((x) => x !== v).join(" ∧ ¬")})`).join(" ∨ ");

    setResult({ vars, rows, cnf, dnf, formula: f });
  };

  return { formula, setFormula, result, tab, setTab, parseAndTransform };
}