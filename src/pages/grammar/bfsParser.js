import { isNonTerminal } from "./grammarParser";

export const bfsParse = (rules, startSymbol, targetTokens) => {
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