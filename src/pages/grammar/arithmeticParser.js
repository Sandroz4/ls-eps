export const evalArithmetic = (expr) => {
  expr = expr.replace(/\s/g, "");
  let pos = 0;
  
  const parseE = () => {
    let t = parseT();
    while (pos < expr.length && expr[pos] === "+") {
      pos++;
      t += parseT();
    }
    return t;
  };

  const parseT = () => {
    let f = parseF();
    while (pos < expr.length && expr[pos] === "*") {
      pos++;
      f *= parseF();
    }
    return f;
  };

  const parseF = () => {
    if (expr[pos] === "(") {
      pos++;
      const v = parseE();
      if (expr[pos] === ")") pos++;
      return v;
    }
    let s = "";
    while (pos < expr.length && /[0-9]/.test(expr[pos])) s += expr[pos++];
    if (s === "") throw new Error("unexpected");
    return Number(s);
  };

  const result = parseE();
  if (pos !== expr.length) throw new Error("leftover");
  return result;
};

export const tokeniseArith = (expr) => {
  expr = expr.replace(/\s/g, "");
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (/[0-9]/.test(expr[i])) {
      while (i < expr.length && /[0-9]/.test(expr[i])) i++;
      tokens.push("id");
    } else if ("()+*".includes(expr[i])) {
      tokens.push(expr[i++]);
    } else {
      throw new Error(`უცნობი სიმბოლო: "${expr[i]}"`);
    }
  }
  return tokens;
};