import React from "react";

export default function GrammarEditor({
  grammar,
  setGrammar,
  depth,
  setDepth,
  targetStr,
  setTargetStr,
  isArithmetic,
  errorMsg,
  handleTemplateChange,
  generateStrings,
  buildTree,
}) {
  return (
    <div className="panel mb-16">
      <div className="panel-header">
        <span className="panel-dot" />
        <span className="panel-title">გრამატიკის რედაქტორი</span>
      </div>
      <div className="panel-body">
        <div className="mb-12">
          <label style={{ fontSize: 11, color: "var(--text-mute)", fontFamily: "var(--mono)", display: "block", marginBottom: 6, letterSpacing: "0.08em" }}>
            შაბლონის ჩატვირთვა
          </label>
          <select
            onChange={(e) => handleTemplateChange(e.target.value)}
            style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", padding: "10px", borderRadius: "8px", color: "var(--text)", fontFamily: "var(--mono)", fontSize: "12px", outline: "none" }}
          >
            <option value="">-- აირჩიეთ სტრუქტურული მაგალითი --</option>
            <option value="parentheses">დაბალანსებული ფრჩხილები</option>
            <option value="palindromes">პალინდრომები (a, b)</option>
            <option value="expressions">არითმეტიკული გამოსახულებები</option>
            <option value="custom">გასუფთავება / საკუთარი გრამატიკა</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: "var(--text-mute)", fontFamily: "var(--mono)", marginBottom: 8, lineHeight: "1.5" }}>
          ფორმატი: S → a S b · S → b | k · თითო წესი სტრიქონზე.
          <br />
          <span style={{ color: "var(--blue)" }}>შენიშვნა: ალტერნატივები გამოყავით "|" სიმბოლოთი!</span>
        </div>

        <textarea
          className="input-field"
          style={{ minHeight: 120, resize: "vertical", lineHeight: 1.7, fontFamily: "var(--mono)" }}
          value={grammar}
          onChange={(e) => setGrammar(e.target.value)}
        />

        <div className="flex gap-8" style={{ marginTop: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", letterSpacing: "0.08em" }}>დონე</span>
          <input
            type="range"
            min={1}
            max={6}
            value={depth}
            onChange={(e) => setDepth(+e.target.value)}
            style={{ flex: 1, accentColor: "var(--blue)" }}
          />
          <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", minWidth: 16 }}>{depth}</span>
        </div>

        {!isArithmetic && (
          <div className="flex gap-8" style={{ marginTop: 12 }}>
            <input
              className="input-field"
              style={{ flex: 1 }}
              value={targetStr}
              onChange={(e) => setTargetStr(e.target.value)}
              placeholder="სამიზნე სტრიქონი (მაგ. ab)"
            />
          </div>
        )}

        {isArithmetic && (
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, color: "var(--text-mute)", fontFamily: "var(--mono)", display: "block", marginBottom: 6, letterSpacing: "0.08em" }}>
              გამოსახულება (მაგ. 2+3*4 ან (2+3)*4)
            </label>
            <input
              className="input-field"
              style={{ width: "100%" }}
              value={targetStr}
              onChange={(e) => setTargetStr(e.target.value)}
              placeholder="შეიყვანეთ გამოსახულება..."
            />
          </div>
        )}

        <div className="flex gap-8" style={{ marginTop: 12 }}>
          {!isArithmetic && (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={generateStrings}>
              სტრიქონების გენერაცია
            </button>
          )}
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={buildTree}>
            პარსინგის ხე
          </button>
        </div>

        {errorMsg && (
          <div style={{ marginTop: "12px", color: "var(--accent)", fontFamily: "var(--mono)", fontSize: "12px" }}>
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}