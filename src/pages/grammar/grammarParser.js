export const parseGrammar = (text) => {
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
      const productionSymbols = alt === "ε" || alt === "" ? [] : alt.split(/\s+/).filter(Boolean);
      rules[lhs].push(productionSymbols);
    }
  }
  return rules;
};

export const isNonTerminal = (sym, rules) => !!rules[sym];