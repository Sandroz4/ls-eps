import React from "react"

// ─── Shared arrow marker IDs per diagram to avoid conflicts ───────────────────

export function DFADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions
  const active = (s) => activeStates?.includes(s)
  return (
    <svg viewBox="0 0 440 220" style={{ width: "100%", height: 180 }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
      </defs>
      <path d="M110,110 L190,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="150" y="104" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">a</text>
      <path d="M250,110 L330,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="290" y="104" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">b</text>
      <path d="M65,96 Q50,68 80,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="48" y="72" fill="#3d5a8a" fontSize="15" fontFamily="monospace">b</text>
      <path d="M205,96 Q190,68 220,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="188" y="68" fill="#3d5a8a" fontSize="15" fontFamily="monospace">a</text>
      <path d="M340,96 Q290,60 240,96" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="290" y="53" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">a</text>
      <path d="M360,138 Q220,200 80,138" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr)" fill="none" />
      <text x="220" y="196" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">b</text>
      {automaton.states.map((s) => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={28}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && (
            <circle cx={pos[s].x} cy={pos[s].y} r={22} fill="none" stroke="#4ade80" strokeWidth="1" />
          )}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"}
            fontSize="12" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  )
}

export function NFADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions
  const active = (s) => activeStates?.includes(s)
  return (
    <svg viewBox="0 0 440 220" style={{ width: "100%", height: 180 }}>
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
      </defs>
      <path d="M65,96 Q50,68 80,74" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="45" y="72" fill="#3d5a8a" fontSize="15" fontFamily="monospace">b</text>
      <path d="M60,125 Q30,160 100,130" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="48" y="162" fill="#3d5a8a" fontSize="15" fontFamily="monospace">a</text>
      <path d="M110,105 L190,105" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="150" y="99" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">a</text>
      <path d="M250,110 L330,110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="290" y="104" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">a</text>
      <path d="M345,84 Q360,55 378,82" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr2)" fill="none" />
      <text x="373" y="60" fill="#3d5a8a" fontSize="15" fontFamily="monospace">a,b</text>
      {automaton.states.map((s) => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={28}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && (
            <circle cx={pos[s].x} cy={pos[s].y} r={22} fill="none" stroke="#4ade80" strokeWidth="1" />
          )}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"}
            fontSize="12" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  )
}

export function ENFADiagram({ automaton, activeStates }) {
  const pos = automaton.statePositions
  const active = (s) => activeStates?.includes(s)
  return (
    <svg viewBox="0 0 400 230" style={{ width: "100%", height: 200 }}>
      <defs>
        <marker id="arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
      </defs>
      <path d="M85,95 L160,68" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="115" y="72" fill="#3d5a8a" fontSize="15" fontFamily="monospace">a</text>
      <path d="M85,125 L160,155" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="108" y="155" fill="#3d5a8a" fontSize="15" fontFamily="monospace">b</text>
      <path d="M215,55 L285,55" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="250" y="49" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">b</text>
      <path d="M215,165 L285,165" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr3)" fill="none" />
      <text x="250" y="159" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">a</text>
      {automaton.states.map((s) => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={26}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && (
            <circle cx={pos[s].x} cy={pos[s].y} r={20} fill="none" stroke="#4ade80" strokeWidth="1" />
          )}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"}
            fontSize="11" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  )
}

export function PDADiagram({ automaton, activeStates }) {
  const pos = { q0: { x: 150, y: 110 }, q1: { x: 350, y: 110 }, q3: { x: 546, y: 190 } }
  const active = (s) => activeStates?.includes(s)
  return (
    <svg viewBox="0 0 680 250" style={{ width: "100%", height: 200 }}>
      <defs>
        <marker id="arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3d5a8a" />
        </marker>
      </defs>
      <path d="M126,78 Q140,42 160,42 Q182,42 194,78" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      <text x="160" y="30" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">a,ε/A</text>
      <line x1="196" y1="110" x2="304" y2="110" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" />
      <text x="250" y="100" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">b,A/ε</text>
      <path d="M326,78 Q340,42 360,42 Q382,42 394,78" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" fill="none" />
      <text x="360" y="30" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">b,A/ε</text>
      <line x1="390" y1="128" x2="504" y2="178" stroke="#3d5a8a" strokeWidth="1.5" markerEnd="url(#arr4)" />
      <text x="434" y="142" fill="#3d5a8a" fontSize="15" textAnchor="middle" fontFamily="monospace">ε,Z/Z</text>
      {automaton.states.map((s) => (
        <g key={s}>
          <circle cx={pos[s].x} cy={pos[s].y} r={30}
            fill={active(s) ? "#1a3a6e" : "var(--bg3,#1a1f2e)"}
            stroke={active(s) ? "#60a5fa" : automaton.accepting.includes(s) ? "#4ade80" : s === automaton.start ? "#22d3ee" : "#2d3a5a"}
            strokeWidth={active(s) ? 2.5 : 1.5} />
          {automaton.accepting.includes(s) && (
            <circle cx={pos[s].x} cy={pos[s].y} r={23} fill="none" stroke="#4ade80" strokeWidth="1" />
          )}
          <text x={pos[s].x} y={pos[s].y + 5} fill={active(s) ? "#fff" : "#8899bb"}
            fontSize="12" textAnchor="middle" fontFamily="monospace">{s}</text>
        </g>
      ))}
    </svg>
  )
}

export const DIAGRAMS = {
  dfa: DFADiagram,
  nfa: NFADiagram,
  enfa: ENFADiagram,
  pda: PDADiagram,
}