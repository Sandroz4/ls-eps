import React, { useState } from "react";
import GrammarEditor from "./components/GrammarEditor";
import GrammarRules from "./components/GrammarRules";
import ArithmeticResult from "./components/ArithmeticResult";
import GeneratedStrings from "./components/GeneratedStrings";
import ParseTree from "./components/ParseTree";
import DerivationSteps from "./components/DerivationSteps";

import { parseGrammar, isNonTerminal } from "./grammarParser";
import { evalArithmetic, tokeniseArith } from "./arithmeticParser";
import { bfsParse } from "./bfsParser";
import { templates } from "./grammarTemplates";

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

  const handleGrammarChange = (val) => {
    setGrammar(val);
    setIsArithmetic(false);
    setTree(null);
    setGenerated([]);
    setDerivationSteps([]);
    setErrorMsg("");
    setExprResult(null);
  };

  const generateStrings = () => {
    setErrorMsg("");
    setGenerated([]);
    try {
      const rules = parseGrammar(grammar);
      const startSymbol = rules["S"] ? "S" : Object.keys(rules)[0];
      if (!startSymbol) {
        setErrorMsg("შეცდომა: სწორი წესები არ მოიძებნა.");
        return;
      }
      const uniqueTerminals = new Set();
      const expand = (symbols, currentDepth) => {
        if (currentDepth > depth || symbols.length > 20) return;
        const ntIdx = symbols.findIndex((s) => isNonTerminal(s, rules));
        if (ntIdx === -1) {
          uniqueTerminals.add(symbols.join("") || "ε");
          return;
        }
        const nt = symbols[ntIdx];
        for (const prod of rules[nt] || []) {
          const nextSequence = [...symbols.slice(0, ntIdx), ...prod, ...symbols.slice(ntIdx + 1)];
          expand(nextSequence, currentDepth + 1);
        }
      };
      expand([startSymbol], 0);
      setGenerated(
        [...uniqueTerminals].sort((a, b) => a.length - b.length || a.localeCompare(b)).slice(0, 40)
      );
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const buildTree = () => {
    setErrorMsg("");
    setTree(null);
    setDerivationSteps([]);
    setExprResult(null);

    try {
      const rules = parseGrammar(grammar);

      if (isArithmetic) {
        let tokens;
        try {
          tokens = tokeniseArith(targetStr);
        } catch (e) {
          setErrorMsg(e.message);
          return;
        }

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
      if (!startSymbol) {
        setErrorMsg("შეცდომა: სწორი წესები არ მოიძებნა.");
        return;
      }

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
          <GrammarEditor
            grammar={grammar}
            setGrammar={handleGrammarChange}
            depth={depth}
            setDepth={setDepth}
            targetStr={targetStr}
            setTargetStr={setTargetStr}
            isArithmetic={isArithmetic}
            errorMsg={errorMsg}
            handleTemplateChange={handleTemplateChange}
            generateStrings={generateStrings}
            buildTree={buildTree}
          />
          <GrammarRules grammar={grammar} />
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {isArithmetic && <ArithmeticResult targetStr={targetStr} exprResult={exprResult} />}
          
          {!isArithmetic && (
            <GeneratedStrings generated={generated} depth={depth} setTargetStr={setTargetStr} />
          )}

          <ParseTree tree={tree} targetStr={targetStr} />
          
          <DerivationSteps derivationSteps={derivationSteps} />

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