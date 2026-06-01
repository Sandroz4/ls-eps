import React, { useState } from "react"
import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import AutomataPage from "./pages/automata/Automatapage"
import LogicPage from "./pages/logic/LogicPage"
import GrammarPage from "./pages/grammar/GrammarPage"
import "./styles/theme.css" // გლობალური სტილების იმპორტი

export default function App() {
  const [page, setPage] = useState("home")

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />

      {page === "home" && <LandingPage navigate={setPage} />}
      {page === "automata" && <AutomataPage />}
      {page === "logic" && <LogicPage />}
      {page === "grammar" && <GrammarPage />}
    </div>
  )
}