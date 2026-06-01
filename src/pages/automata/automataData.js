export const AUTOMATA = {
  dfa: {
    id: "dfa",
    label: "DFA",
    fullName: "Deterministic Finite Automaton",
    description: 'იღებს სტრიქონებს, რომლებიც მთავრდება "ab"-ით',
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { a: ["q1"], b: ["q0"] },
      q1: { a: ["q1"], b: ["q2"] },
      q2: { a: ["q1"], b: ["q0"] },
    },
    statePositions: { q0: { x: 80, y: 110 }, q1: { x: 220, y: 110 }, q2: { x: 360, y: 110 } },
    defaultInput: "aab",
    theory:
      "DFA-ში ყოველი მდგომარეობიდან, ყოველი სიმბოლოსთვის ზუსტად ერთი გადასვლა არსებობს. გამოთვლა სრულად დეტერმინირებულია.",
  },

  nfa: {
    id: "nfa",
    label: "NFA",
    fullName: "Nondeterministic Finite Automaton",
    description: 'იღებს სტრიქონებს, რომლებში "a" მინ ორჯერ თანმიმდევრობით გვხვდება',
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2"],
    start: "q0",
    accepting: ["q2"],
    transitions: {
      q0: { a: ["q0", "q1"], b: ["q0"] },
      q1: { a: ["q2"], b: [] },
      q2: { a: ["q2"], b: ["q2"] },
    },
    statePositions: { q0: { x: 80, y: 110 }, q1: { x: 220, y: 110 }, q2: { x: 360, y: 110 } },
    defaultInput: "bab",
    theory:
      "NFA-ში შესაძლებელია რამდენიმე გადასვლა ერთი სიმბოლოსთვის. სიმულაცია ეძებს ყველა შესაძლო გზას პარალელურად სუბსეტების სიმრავლის სახით.",
  },

  enfa: {
    id: "enfa",
    label: "ε-NFA",
    fullName: "Epsilon-NFA",
    description: 'იღებს სტრიქონებს, რომლებიც შეიცავს „ab" ან „ba"-ს',
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q2", "q3", "q4"],
    start: "q0",
    accepting: ["q2", "q4"],
    transitions: {
      q0: { a: ["q1"], b: ["q3"], ε: [] },
      q1: { b: ["q2"], ε: [] },
      q2: { ε: [] },
      q3: { a: ["q4"], ε: [] },
      q4: { ε: [] },
    },
    statePositions: {
      q0: { x: 60, y: 110 },
      q1: { x: 185, y: 55 },
      q2: { x: 310, y: 55 },
      q3: { x: 185, y: 165 },
      q4: { x: 310, y: 165 },
    },
    defaultInput: "ab",
    theory: 'ε-NFA-ს შეუძლია „ε-გადასვლები", სიმბოლოს წაკითხვის გარეშე გადასვლა.',
  },

  pda: {
    id: "pda",
    label: "PDA",
    fullName: "Pushdown Automaton",
    description: "იღებს სტრიქონებს სახით aⁿbⁿ (n≥1)",
    alphabet: ["a", "b"],
    states: ["q0", "q1", "q3"],
    start: "q0",
    accepting: ["q3"],
    pdaTransitions: {
      q0: [
        { read: "a", pop: "ε", push: "A", next: "q0" },
        { read: "b", pop: "A", push: "ε", next: "q1" },
      ],
      q1: [
        { read: "b", pop: "A", push: "ε", next: "q1" },
        { read: "ε", pop: "Z", push: "Z", next: "q3" },
      ],
      q3: [],
    },
    statePositions: { q0: { x: 150, y: 110 }, q1: { x: 350, y: 110 }, q3: { x: 546, y: 190 } },
    defaultInput: "aabb",
    theory:
      "PDA-ს გააჩნია Stack (სტეკი) მეხსიერება. ეს საშუალებას იძლევა Context-Free ენების ამოცნობა, რაც DFA/NFA-ს ძალის მიღმაა. aⁿbⁿ DFA-ს ვერ ამოიცნობს.",
  },
}