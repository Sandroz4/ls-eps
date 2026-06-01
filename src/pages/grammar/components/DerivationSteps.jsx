import React from "react";

export default function DerivationSteps({ derivationSteps }) {
  if (derivationSteps.length === 0) return null;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-dot" style={{ backgroundColor: "var(--blue)" }} />
        <span className="panel-title">გამოთვლის ნაბიჯები</span>
      </div>
      <div className="panel-body" style={{ fontFamily: "var(--mono)", fontSize: "12px", maxHeight: "240px", overflowY: "auto" }}>
        {derivationSteps.map((step, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", padding: "4px 0", color: idx === derivationSteps.length - 1 ? "var(--cyan)" : "var(--text-dim)" }}>
            <span style={{ color: "var(--text-mute)", marginRight: "12px" }}>[{idx}]</span>
            <span>{step}</span>
            {idx < derivationSteps.length - 1 && (
              <span style={{ color: "var(--blue)", margin: "0 8px" }}>⇒</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}