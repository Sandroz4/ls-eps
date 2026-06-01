import React from "react";

export default function GrammarRules({ grammar }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-dot" />
        <span className="panel-title">აქტიური წესები</span>
      </div>
      <div className="panel-body">
        {grammar
          .split("\n")
          .filter((l) => l.trim())
          .map((line, i) => {
            if (!line.includes("→")) return null;
            const [lhs, rhs] = line.split("→").map((s) => s.trim());
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
  );
}