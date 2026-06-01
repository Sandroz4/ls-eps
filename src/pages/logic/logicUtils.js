export function normLit(s) {
  return s.trim().replace(/!/g, "¬").replace(/~/g, "¬");
}

export function parseClause(raw) {
  const parts = raw.replace(/∧/g, "∨").split(/[|∨]/).map(normLit).filter(Boolean);
  return parts.length ? [...new Set(parts)] : null;
}

export function clauseStr(lits) {
  return !lits || lits.length === 0 ? "⊥" : lits.join(" ∨ ");
}

export function negOf(lit) {
  return lit.startsWith("¬") ? lit.slice(1) : "¬" + lit;
}

export function clauseKey(lits) {
  return [...lits].sort().join("|");
}

export function resolve(a, b) {
  for (const l of a) {
    const comp = negOf(l);
    if (b.includes(comp)) {
      const res = [...new Set([...a.filter((x) => x !== l), ...b.filter((x) => x !== comp)])];
      return { resolved: res, pivot: l, pivot2: comp };
    }
  }
  return null;
}

export function runResolutionAlgorithm(clauses) {
  const working = clauses.map((c, i) => ({
    lits: [...c], origin: "input", idx: i, label: `C${i + 1}`,
    parent1: -1, parent2: -1, pivot: "", pivot2: "",
  }));
  const seen = new Set(working.map((c) => clauseKey(c.lits)));
  const steps = [...working];
  let refutationFound = working.some((s) => s.lits.length === 0);

  let changed = true, iter = 0;
  while (changed && iter < 200 && !refutationFound) {
    changed = false;
    iter++;
    const n = steps.length;
    for (let i = 0; i < n && !refutationFound; i++) {
      for (let j = i; j < n && !refutationFound; j++) {
        const r = resolve(steps[i].lits, steps[j].lits);
        if (!r) continue;
        const key = clauseKey(r.resolved);
        if (seen.has(key)) continue;
        seen.add(key);
        const ni = steps.length;
        steps.push({
          lits: r.resolved, origin: "resolvent", idx: ni, label: `C${ni + 1}`,
          parent1: i, parent2: j, pivot: r.pivot, pivot2: r.pivot2,
        });
        changed = true;
        if (r.resolved.length === 0) refutationFound = true;
      }
    }
  }
  return { steps, refutationFound };
}

export function buildTree(steps) {
  const emptyIdx = steps.findIndex((s) => s.lits.length === 0 && s.origin === "resolvent");
  if (emptyIdx === -1) return null;
  function makeNode(idx) {
    const s = steps[idx];
    const node = { label: s.label, clause: clauseStr(s.lits), origin: s.origin, children: [] };
    if (s.origin === "resolvent") {
      node.children = [makeNode(s.parent1), makeNode(s.parent2)];
      node.pivot = s.pivot + "/" + s.pivot2;
    }
    return node;
  }
  return makeNode(emptyIdx);
}