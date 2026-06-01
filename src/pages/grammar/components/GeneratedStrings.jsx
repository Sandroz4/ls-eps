import React from "react";

export default function GeneratedStrings({ generated, depth, setTargetStr }) {
  if (generated.length === 0) return null;

  return (
    <div className="panel mb-16">
      <div className="panel-header">
        <span className="panel-dot" />
        <span className="panel-title">გენერირებული სტრიქონები</span>
      </div>
      <div className="panel-body">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: "140px", overflowY: "auto" }}>
          {generated.map((s, i) => (
            <span
              key={i}
              onClick={() => setTargetStr(s)}
              style={{ padding: "4px 12px", borderRadius: 4, fontFamily: "var(--mono)", fontSize: 12, background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--cyan)", cursor: "pointer" }}
              title="დაკლიკეთ სატესტოდ"
            >
              {s}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)" }}>
          {generated.length} სტრიქონი გენერირდა დონით {depth}
        </div>
      </div>
    </div>
  );
}