import React from "react";

export default function ArithmeticResult({ targetStr, exprResult }) {
  if (exprResult === null) return null;

  return (
    <div className="panel mb-16">
      <div className="panel-header">
        <span className="panel-dot" style={{ backgroundColor: "var(--blue)" }} />
        <span className="panel-title">გამოთვლის შედეგი</span>
      </div>
      <div className="panel-body" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--text-dim)" }}>
          {targetStr} =
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 28, fontWeight: 600, color: "var(--cyan)" }}>
          {exprResult}
        </span>
      </div>
    </div>
  );
}