import React, { useState } from "react";

const ARITHMETIC_GRAMMAR = "E → E + T | T\nT → T * F | F\nF → ( E ) | id";

export default function GrammarPage() {
  const [grammar, setGrammar] = useState("S → a S b\nS → b | k");
  const [targetStr, setTargetStr] = useState("ab");
  const [depth, setDepth] = useState(4);
  const [tree, setTree] = useState(null);
  const [generated, setGenerated] = useState([]);
  const [derivationSteps, setDerivationSteps] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isArithmetic, setIsArithmetic] = useState(false);
  const [exprResult, setExprResult] = useState(null);

  const templates = {
    custom: "",
    parentheses: "S → ( S )\nS → S S\nS → ε",
    palindromes: "S → a S a\nS → b S b\nS → a\nS → b\nS → ε",
    expressions: ARITHMETIC_GRAMMAR,
  };

  const handleTemplateChange = (key) => {
    if (templates[key] !== undefined) {
      const g = templates[key];
      setGrammar(g);
      setTree(null);
      setGenerated([]);
      setDerivationSteps([]);
      setErrorMsg("");
      setExprResult(null);
      const arith = key === "expressions";
      setIsArithmetic(arith);
      if (arith) setTargetStr("2+3*4");
      else setTargetStr("ab");
    }
  };

  const parseGrammar = (text) => {
    const rules = {};
    const lines = text.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (!line.includes("→")) {
        throw new Error(`არასწორი ფორმატი სტრიქონზე: "${line}". გამოიყენეთ "→" ისარი.`);
      }
      const [lhs, rhsAll] = line.split("→").map((s) => s.trim());
      if (!lhs || lhs.length !== 1 || lhs !== lhs.toUpperCase()) {
        throw new Error(`მარცხენა მხარე "${lhs}" უნდა იყოს ზუსტად ერთი დიდი ასო (არათერმინალი).`);
      }
      if (!rules[lhs]) rules[lhs] = [];
      const alternatives = rhsAll.split("|").map((alt) => alt.trim());
      for (const alt of alternatives) {
        const productionSymbols =
          alt === "ε" || alt === "" ? [] : alt.split(/\s+/).filter(Boolean);
        rules[lhs].push(productionSymbols);
      }
    }
    return rules;
  };

  const isNonTerminal = (sym, rules) => !!rules[sym];

  const generateStrings = () => {
    setErrorMsg("");
    setGenerated([]);
    try {
      const rules = parseGrammar(grammar);
      const startSymbol = rules["S"] ? "S" : Object.keys(rules)[0];
      if (!startSymbol) { setErrorMsg("შეცდომა: სწორი წესები არ მოიძებნა."); return; }
      const uniqueTerminals = new Set();
      const expand = (symbols, currentDepth) => {
        if (currentDepth > depth || symbols.length > 20) return;
        const ntIdx = symbols.findIndex((s) => isNonTerminal(s, rules));
        if (ntIdx === -1) { uniqueTerminals.add(symbols.join("") || "ε"); return; }
        const nt = symbols[ntIdx];
        for (const prod of rules[nt] || []) {
          const nextSequence = [...symbols.slice(0, ntIdx), ...prod, ...symbols.slice(ntIdx + 1)];
          expand(nextSequence, currentDepth + 1);
        }
      };
      expand([startSymbol], 0);
      setGenerated(
        [...uniqueTerminals]
          .sort((a, b) => a.length - b.length || a.localeCompare(b))
          .slice(0, 40)
      );
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Evaluates arithmetic expressions (numbers only) for displaying result
  const evalArithmetic = (expr) => {
    expr = expr.replace(/\s/g, "");
    let pos = 0;
    const parseE = () => {
      let t = parseT();
      while (pos < expr.length && expr[pos] === "+") { pos++; t += parseT(); }
      return t;
    };
    const parseT = () => {
      let f = parseF();
      while (pos < expr.length && expr[pos] === "*") { pos++; f *= parseF(); }
      return f;
    };
    const parseF = () => {
      if (expr[pos] === "(") { pos++; const v = parseE(); if (expr[pos] === ")") pos++; return v; }
      let s = "";
      while (pos < expr.length && /[0-9]/.test(expr[pos])) s += expr[pos++];
      if (s === "") throw new Error("unexpected");
      return Number(s);
    };
    const result = parseE();
    if (pos !== expr.length) throw new Error("leftover");
    return result;
  };

  // Tokenises arithmetic expression into grammar terminals for BFS
  const tokeniseArith = (expr) => {
    expr = expr.replace(/\s/g, "");
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (/[0-9]/.test(expr[i])) {
        let n = "";
        while (i < expr.length && /[0-9]/.test(expr[i])) n += expr[i++];
        tokens.push("id"); // map numbers to terminal 'id'
      } else if ("()+*".includes(expr[i])) {
        tokens.push(expr[i++]);
      } else {
        throw new Error(`უცნობი სიმბოლო: "${expr[i]}"`);
      }
    }
    return tokens;
  };

  const bfsParse = (rules, startSymbol, targetTokens) => {
    const targetStr = targetTokens.join("");
    const queue = [
      {
        sentential: [startSymbol],
        treeNode: { sym: startSymbol, children: [] },
        history: [startSymbol],
      },
    ];
    let foundMatch = null;
    let iterations = 0;
    const maxIterations = 8000;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const { sentential, treeNode, history } = queue.shift();
      const ntIdx = sentential.findIndex((sym) => isNonTerminal(sym, rules));

      if (ntIdx === -1) {
        if (sentential.join("") === targetStr) {
          foundMatch = { treeNode, history };
          break;
        }
        continue;
      }

      const compiledTerminalsLength = sentential
        .filter((s) => !isNonTerminal(s, rules))
        .join("").length;
      if (compiledTerminalsLength > targetStr.length + 2) continue;

      const nt = sentential[ntIdx];
      const productions = rules[nt] || [];

      for (const prod of productions) {
        const nextSentential = [
          ...sentential.slice(0, ntIdx),
          ...prod,
          ...sentential.slice(ntIdx + 1),
        ];

        const nextTreeObj = JSON.parse(JSON.stringify(treeNode));
        const attachChildrenToLeaf = (node) => {
          if (node.sym === nt && (!node.children || node.children.length === 0)) {
            node.children =
              prod.length === 0
                ? [{ sym: "ε", children: [] }]
                : prod.map((s) => ({ sym: s, children: [] }));
            return true;
          }
          if (node.children) {
            for (let child of node.children) {
              if (attachChildrenToLeaf(child)) return true;
            }
          }
          return false;
        };
        attachChildrenToLeaf(nextTreeObj);

        queue.push({
          sentential: nextSentential,
          treeNode: nextTreeObj,
          history: [...history, nextSentential.join(" ") || "ε"],
        });
      }
    }
    return foundMatch;
  };

  const buildTree = () => {
    setErrorMsg("");
    setTree(null);
    setDerivationSteps([]);
    setExprResult(null);

    try {
      const rules = parseGrammar(grammar);

      if (isArithmetic) {
        // Tokenise, evaluate, then parse
        let tokens;
        try {
          tokens = tokeniseArith(targetStr);
        } catch (e) {
          setErrorMsg(e.message);
          return;
        }

        // Try numeric evaluation for result display
        try {
          const numResult = evalArithmetic(targetStr);
          setExprResult(numResult);
        } catch (_) {
          setExprResult(null);
        }

        const startSymbol = "E";
        const found = bfsParse(rules, startSymbol, tokens);
        if (found) {
          setTree(found.treeNode);
          setDerivationSteps(found.history);
        } else {
          setErrorMsg(`"${targetStr}" parsing ვერ მოხერხდა. შეამოწმეთ, რომ გამოიყენეთ მხოლოდ +, * და ფრჩხილები.`);
        }
        return;
      }

      const startSymbol = rules["S"] ? "S" : Object.keys(rules)[0];
      if (!startSymbol) { setErrorMsg("შეცდომა: სწორი წესები არ მოიძებნა."); return; }

      const cleanTarget = targetStr === "ε" ? "" : targetStr.trim();
      const targetTokens = cleanTarget === "" ? [] : cleanTarget.split("");
      const found = bfsParse(rules, startSymbol, targetTokens);

      if (found) {
        setTree(found.treeNode);
        setDerivationSteps(found.history);
      } else {
        setErrorMsg(`სტრიქონის "${targetStr}" parsing ვერ მოხერხდა მიმდინარე წესებით.`);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Compute layout dimensions dynamically based on tree shape
  const computeTreeLayout = (node) => {
    const getWidth = (n) => {
      if (!n || !n.children || n.children.length === 0) return 1;
      return n.children.reduce((s, c) => s + getWidth(c), 0);
    };
    const getDepth = (n) => {
      if (!n || !n.children || n.children.length === 0) return 0;
      return 1 + Math.max(...n.children.map(getDepth));
    };
    const w = getWidth(node);
    const d = getDepth(node);
    return { leafCount: w, depth: d };
  };

  const TreeSVG = ({ node }) => {
    if (!node) return null;
    const { leafCount, depth } = computeTreeLayout(node);

    const NODE_R = 14;
    const LEVEL_H = 60;
    const MIN_NODE_SPACING = 36;
    const svgWidth = Math.max(400, leafCount * MIN_NODE_SPACING + 60);
    const svgHeight = (depth + 1) * LEVEL_H + 48;

    const shapes = [];
    let key = 0;

    const drawNode = (n, x, y, left, right) => {
      const isTerminal = !n.children || n.children.length === 0;
      const isEpsilon = n.sym === "ε";
      const fill = isTerminal ? "var(--bg3)" : "var(--bg2)";
      const stroke = isEpsilon
        ? "var(--text-mute)"
        : isTerminal
        ? "var(--border2)"
        : "var(--blue)";
      const textColor = isEpsilon
        ? "var(--text-mute)"
        : isTerminal
        ? "var(--text-dim)"
        : "var(--cyan)";

      shapes.push(
        <circle
          key={key++}
          cx={x} cy={y} r={NODE_R}
          fill={fill}
          stroke={stroke}
          strokeWidth={isTerminal ? 1 : 1.5}
        />
      );
      shapes.push(
        <text
          key={key++}
          x={x} y={y + 5}
          fill={textColor}
          fontSize="11"
          textAnchor="middle"
          fontFamily="Space Mono"
        >
          {n.sym}
        </text>
      );

      if (n.children && n.children.length > 0) {
        const span = right - left;
        const step = span / n.children.length;
        n.children.forEach((child, i) => {
          const cx = left + step * i + step / 2;
          const cy = y + LEVEL_H;
          shapes.push(
            <line
              key={key++}
              x1={x} y1={y + NODE_R}
              x2={cx} y2={cy - NODE_R}
              stroke="var(--border2)"
              strokeWidth="1"
            />
          );
          drawNode(child, cx, cy, left + step * i, left + step * (i + 1));
        });
      }
    };

    drawNode(node, svgWidth / 2, 28, 0, svgWidth);

    return (
      <svg
        width="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ minHeight: Math.min(svgHeight, 600), overflow: "visible" }}
      >
        {shapes}
      </svg>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Grammar <em>Workbench</em></h1>
        <p className="page-desc">
          კონტექსტ-თავისუფალი გრამატიკების კვლევა: სტრიქონების გენერაცია, პარსინგის ხის აგება და სტრუქტურის ანალიზი.
        </p>
      </div>

      <div className="grammar-grid">
        {/* LEFT COLUMN */}
        <div>
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
                ფორმატი: S → a S b · S → b | k · თითო წესი სტრიქონზე.<br />
                <span style={{ color: "var(--blue)" }}>შენიშვნა: ალტერნატივები გამოყავით "|" სიმბოლოთი!</span>
              </div>

              <textarea
                className="input-field"
                style={{ minHeight: 120, resize: "vertical", lineHeight: 1.7, fontFamily: "var(--mono)" }}
                value={grammar}
                onChange={(e) => {
                  setGrammar(e.target.value);
                  setIsArithmetic(false);
                  setTree(null);
                  setGenerated([]);
                  setDerivationSteps([]);
                  setErrorMsg("");
                  setExprResult(null);
                }}
              />

              <div className="flex gap-8" style={{ marginTop: 12, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-mute)", letterSpacing: "0.08em" }}>დონე</span>
                <input
                  type="range" min={1} max={6} value={depth}
                  onChange={(e) => setDepth(+e.target.value)}
                  style={{ flex: 1, accentColor: "var(--blue)" }}
                />
                <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--cyan)", minWidth: 16 }}>{depth}</span>
              </div>

              {/* Hide string input in arithmetic mode */}
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

          <div className="panel">
            <div className="panel-header">
              <span className="panel-dot" />
              <span className="panel-title">აქტიური წესები</span>
            </div>
            <div className="panel-body">
              {grammar.split("\n").filter((l) => l.trim()).map((line, i) => {
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
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Arithmetic result */}
          {isArithmetic && exprResult !== null && (
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
          )}

          {/* Generated strings (not shown in arithmetic mode) */}
          {generated.length > 0 && !isArithmetic && (
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
          )}

          {/* Parse tree — full size, scrollable */}
          {tree && (
            <div className="panel mb-16">
              <div className="panel-header">
                <span className="panel-dot" />
                <span className="panel-title">პარსინგის ხე — &ldquo;{targetStr}&rdquo;</span>
              </div>
              <div className="panel-body" style={{ overflowX: "auto", overflowY: "auto" }}>
                <TreeSVG node={tree} />
              </div>
            </div>
          )}

          {/* Derivation trace */}
          {derivationSteps.length > 0 && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-dot" style={{ backgroundColor: "var(--blue)" }} />
                <span className="panel-title">გამოთვლის ნაბიჯები</span>
              </div>
              <div className="panel-body" style={{ fontFamily: "var(--mono)", fontSize: "12px", maxHeight: "240px", overflowY: "auto" }}>
                {derivationSteps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "center", padding: "4px 0", color: idx === derivationSteps.length - 1 ? "var(--cyan)" : "var(--text-dim)" }}
                  >
                    <span style={{ color: "var(--text-mute)", marginRight: "12px" }}>[{idx}]</span>
                    <span>{step}</span>
                    {idx < derivationSteps.length - 1 && (
                      <span style={{ color: "var(--blue)", margin: "0 8px" }}>⇒</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!generated.length && !tree && exprResult === null && (
            <div className="panel" style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⟨S⟩</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-mute)" }}>
                გამოიყენეთ მართვის ელემენტები სტრიქონების გენერაციისთვის ან პარსინგის ხის ასაგებად.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}