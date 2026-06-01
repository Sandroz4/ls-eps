export const ARITHMETIC_GRAMMAR = "E → E + T | T\nT → T * F | F\nF → ( E ) | id";

export const templates = {
  custom: "",
  parentheses: "S → ( S )\nS → S S\nS → ε",
  palindromes: "S → a S a\nS → b S b\nS → a\nS → b\nS → ε",
  expressions: ARITHMETIC_GRAMMAR,
};