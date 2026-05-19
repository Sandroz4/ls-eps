import React from "react";

export default function Navbar({ page, setPage }) {
  const navItems = [
    { id: "home", label: "მთავარი" },
    { id: "automata", label: "ავტომატები" },
    { id: "logic", label: "ლოგიკის ლაბი" },
    { id: "grammar", label: "გრამატიკა" },
  ];

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>
        <div className="nav-logo-dot" />
        ls -&
      </div>
      <div className="nav-links">
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
      <div className="nav-tag">TCS / 2026</div>
    </nav>
  );
}