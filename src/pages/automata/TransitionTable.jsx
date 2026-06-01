import React from "react"

const tblStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "monospace",
  fontSize: 12,
}
const thStyle = {
  padding: "5px 8px",
  color: "#445577",
  fontWeight: 400,
  textAlign: "left",
  borderBottom: "1px solid #1e2a42",
}
const tdStyle = { padding: "4px 8px", color: "#667799", borderBottom: "1px solid #161e2e" }

export default function TransitionTable({ automaton }) {
  if (automaton.id === "pda") {
    return (
      <table style={tblStyle}>
        <thead>
          <tr>
            <th style={thStyle}>state</th>
            <th style={thStyle}>read</th>
            <th style={thStyle}>pop</th>
            <th style={thStyle}>push</th>
            <th style={thStyle}>next</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(automaton.pdaTransitions).flatMap(([s, rules]) =>
            rules.map((r, i) => (
              <tr key={s + i}>
                <td style={tdStyle}>{s}</td>
                <td style={tdStyle}>{r.read}</td>
                <td style={tdStyle}>{r.pop}</td>
                <td style={tdStyle}>{r.push}</td>
                <td style={tdStyle}>{r.next}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    )
  }

  const alpha = automaton.id === "enfa" ? [...automaton.alphabet, "ε"] : automaton.alphabet
  return (
    <table style={tblStyle}>
      <thead>
        <tr>
          <th style={thStyle}>state</th>
          {alpha.map((a) => (
            <th key={a} style={thStyle}>{a}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {automaton.states.map((s) => (
          <tr key={s}>
            <td style={{
              ...tdStyle,
              color: s === automaton.start ? "#22d3ee" : automaton.accepting.includes(s) ? "#4ade80" : "#667799",
            }}>
              {s}
            </td>
            {alpha.map((a) => {
              const nexts = automaton.transitions[s]?.[a] || []
              return (
                <td key={a} style={tdStyle}>
                  {nexts.length ? nexts.join(",") : "—"}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}