import React, { useState } from "react";

export default function Navbar({ page, setPage }) {
  const navItems = [
    { id: "home", label: "მთავარი" },
    { id: "automata", label: "ავტომატები" },
    { id: "logic", label: "ლოგიკის ლაბი" },
    { id: "grammar", label: "გრამატიკა" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
    <div className="nav-logo" onClick={() => { setPage("home"); setOpen(false); }}>
      <span style={{
        fontFamily: "var(--serif)",
        fontSize: "22px",
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}>
        <span style={{ color: "var(--text)", fontStyle: "italic" }}>ls</span>
        <span style={{ color: "var(--cyan)", fontStyle: "italic" }}> -ℰ</span>
      </span>
    </div>

      <button
        className={`nav-toggle ${open ? "open" : ""}`}
        aria-label="Toggle navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        {navItems.map((n) => (
          <button
            key={n.id}
            className={`nav-btn ${page === n.id ? "active" : ""}`}
            onClick={() => setPage(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div className="nav-tag">2026</div>
    </nav>
  );
}