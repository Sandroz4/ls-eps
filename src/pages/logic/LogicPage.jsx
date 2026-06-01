import React from "react";
import { useLogicPage } from "../logic/useLogicPage";
import ResolutionSection from "./components/ResolutionSection";

export default function LogicPage() {
  const { formula, setFormula, result, tab, setTab, parseAndTransform } = useLogicPage();

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Logic <em>Lab</em></h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "transforms" ? "active" : ""}`} onClick={() => setTab("transforms")}>ნორმალური ფორმები</button>
        <button className={`tab ${tab === "truth" ? "active" : ""}`} onClick={() => setTab("truth")}>ჭეშმარიტების ცხრილი</button>
        <button className={`tab ${tab === "resolution" ? "active" : ""}`} onClick={() => setTab("resolution")}>რეზოლუცია</button>
      </div>

      {tab !== "resolution" && (
        <div className="panel mb-20">
          <div className="panel-body">
            <div className="flex gap-8">
              <input className="input-field" style={{ flex: 1 }} value={formula} onChange={(e) => setFormula(e.target.value)} />
              <button className="btn btn-primary" onClick={parseAndTransform}>ანალიზი</button>
            </div>
          </div>
        </div>
      )}

      {tab === "transforms" && result && (
        <div className="panel">
          <div className="panel-body">
            <div><strong>CNF:</strong> {result.cnf}</div>
            <div style={{ marginTop: 10 }}><strong>DNF:</strong> {result.dnf}</div>
          </div>
        </div>
      )}

      {tab === "truth" && result && (
        <div className="panel">
          <table className="truth-table">
            <thead>
              <tr>{result.vars.map((v) => <th key={v}>{v}</th>)}<th>Result</th></tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {result.vars.map((v) => <td key={v} className={row[v] ? "T" : "F"}>{row[v] ? "T" : "F"}</td>)}
                  <td className={row.result ? "T" : "F"}>{row.result ? "T" : "F"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "resolution" && <ResolutionSection />}
    </div>
  );
}