export function simulateDFA(automaton, input) {
  let state = automaton.start
  const steps = [{ states: [state], char: null, stack: null }]
  let valid = true
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    const nexts = automaton.transitions[state]?.[c]
    if (!nexts || nexts.length === 0) {
      valid = false
      break
    }
    state = nexts[0]
    steps.push({ states: [state], char: c, stack: null })
  }
  return { steps, accepted: valid && automaton.accepting.includes(state) }
}

export function simulateNFA(automaton, input) {
  let currentStates = new Set([automaton.start])
  const steps = [{ states: [...currentStates], char: null, stack: null }]
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    const next = new Set()
    for (const s of currentStates) {
      const nexts = automaton.transitions[s]?.[c] || []
      nexts.forEach((n) => next.add(n))
    }
    currentStates = next
    steps.push({ states: [...currentStates], char: c, stack: null })
  }
  const accepted = [...currentStates].some((s) => automaton.accepting.includes(s))
  return { steps, accepted }
}

function epsilonClosure(automaton, states) {
  const closure = new Set(states)
  const stack = [...states]
  while (stack.length > 0) {
    const s = stack.pop()
    const eps = automaton.transitions[s]?.["ε"] || []
    eps.forEach((n) => {
      if (!closure.has(n)) {
        closure.add(n)
        stack.push(n)
      }
    })
  }
  return closure
}

export function simulateENFA(automaton, input) {
  let currentStates = epsilonClosure(automaton, [automaton.start])
  const steps = [{ states: [...currentStates], char: null, stack: null }]
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    const next = new Set()
    for (const s of currentStates) {
      const nexts = automaton.transitions[s]?.[c] || []
      nexts.forEach((n) => next.add(n))
    }
    const closed = epsilonClosure(automaton, [...next])
    currentStates = closed
    steps.push({ states: [...currentStates], char: c, stack: null })
  }
  const accepted = [...currentStates].some((s) => automaton.accepting.includes(s))
  return { steps, accepted }
}

export function simulatePDA(automaton, input) {
  const steps = []
  let state = automaton.start
  let stack = ["Z"]
  steps.push({ states: [state], char: null, stack: [...stack] })

  let i = 0
  let ok = true

  while (i < input.length && input[i] === "a") {
    stack.push("A")
    state = "q0"
    steps.push({
      states: [state],
      char: "a",
      stack: [...stack],
      action: `push A → stack: [${stack.join(",")}]`,
    })
    i++
  }

  if (i === 0) ok = false

  while (ok && i < input.length && input[i] === "b") {
    if (stack[stack.length - 1] !== "A") {
      ok = false
      break
    }
    stack.pop()
    state = "q1"
    steps.push({
      states: [state],
      char: "b",
      stack: [...stack],
      action: `pop A → stack: [${stack.join(",")}]`,
    })
    i++
  }

  if (ok && i === input.length && stack[stack.length - 1] === "Z" && stack.length === 1) {
    state = "q3"
    steps.push({ states: ["q3"], char: null, stack: [...stack], action: "სტეკი სუფთაა ✓" })
  } else {
    ok = false
    steps.push({ states: ["q1"], char: null, stack: [...stack], action: "შეცდომა ✗" })
  }

  return { steps, accepted: ok }
}

export function runSimulation(automaton, input) {
  if (automaton.id === "dfa") return simulateDFA(automaton, input)
  if (automaton.id === "nfa") return simulateNFA(automaton, input)
  if (automaton.id === "enfa") return simulateENFA(automaton, input)
  if (automaton.id === "pda") return simulatePDA(automaton, input)
}