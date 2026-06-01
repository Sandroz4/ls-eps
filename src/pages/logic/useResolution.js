import { useState } from "react";
import { parseClause, runResolutionAlgorithm, buildTree } from "./logicUtils";

const PRESETS = [
  ["¬P∨Q", "¬Q", "P"],
  ["P(a)", "¬P(x)∨Q(x)", "¬Q(a)"],
  ["¬P∨Q∨R", "¬Q∨S", "¬P∨¬S", "P"],
  ["P∨Q", "¬P∨Q"],
];

export function useResolution() {
  const [clauseInput, setClauseInput] = useState("¬P∨Q");
  const [clauses, setClauses] = useState([]);
  const [resTab, setResTab] = useState("steps");
  const [proofData, setProofData] = useState(null);
  const [error, setError] = useState("");

  const addClause = () => {
    const lits = parseClause(clauseInput);
    if (!lits) {
      setError("კლაუზა ვერ დამუშავდა");
      return;
    }
    setClauses((prev) => [...prev, lits]);
    setClauseInput("");
    setError("");
  };

  const loadPreset = (i) => {
    setClauses(PRESETS[i].map((raw) => parseClause(raw)));
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
    setClauseInput((prev) => prev + sym);
  };

  const removeClause = (idx) => {
    setClauses((prev) => prev.filter((_, j) => j !== idx));
  };

  const resetAll = () => {
    setClauses([]);
    setProofData(null);
  };

  return {
    clauseInput, setClauseInput, clauses, resTab, setResTab, proofData, error,
    addClause, loadPreset, runProof, insertSym, removeClause, resetAll
  };
}