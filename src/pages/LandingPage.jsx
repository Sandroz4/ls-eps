import React from "react";

export default function LandingPage({ navigate }) {
  const modules = [
    { 
      id: "automata", 
      num: "01", 
      icon: "◈", 
      title: "Automata Simulator", 
      desc: "ააგეთ და შეამოწმეთ DFA, NFA, ε-NFA და PDA ავტომატები. იხილეთ მდგომარეობებს შორის გადასვლები ნაბიჯ-ნაბიჯ და მიიღეთ accept/reject შედეგი." 
    },
    { 
      id: "logic", 
      num: "02", 
      icon: "⊢", 
      title: "Logic Transformer", 
      desc: "გარდაქმენით პროპოზიციური ფორმულები NNF, CNF, DNF ფორმებში. დააგენერირეთ ჭეშმარიტების ცხრილები და გამოიყენეთ რეზოლუციის მეთოდი." 
    },
    { 
      id: "grammar", 
      num: "03", 
      icon: "⟨⟩", 
      title: "Grammar Workbench", 
      desc: "განსაზღვრეთ კონტექსტ-თავისუფალი გრამატიკები, დააგენერირეთ გამოთვლადი სტრიქონები და ინტერაქტიულად ააგეთ შესაბამისი პარსინგის ხეები." 
    },
  ];

  return (
    <div className="hero">
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-eyebrow">ინტერაქტიული ლაბორატორია</div>

      <h1 className="hero-title">
        The Logic <em>&</em>
      </h1>

      <div className="hero-sub">Computation Lab</div>

      <p className="hero-desc">
        ვებ-პლატფორმა თეორიული კომპიუტერული მეცნიერების საფუძვლების შესასწავლად —
        ავტომატები, მათემატიკური ლოგიკა და ფორმალური გრამატიკები.
        მხარდაჭერილია DFA, NFA, ε-NFA და PDA მოდელები.
        ინსტალაცია საჭირო არ არის — გახსენი და ექსპერიმენტები ჩაატარე პირდაპირ ბრაუზერში.
      </p>

      <div className="hero-cards">
        {modules.map(m => (
          <div
            key={m.id}
            className="hero-card"
            onClick={() => navigate(m.id)}
          >
            <div className="card-num">მოდული {m.num}</div>

            <span
              className="card-icon"
              style={{
                fontFamily: "var(--mono)",
                color: "var(--blue)"
              }}
            >
              {m.icon}
            </span>

            <div className="card-title">{m.title}</div>
            <div className="card-desc">{m.desc}</div>
            <div className="card-arrow">ლაბის გახსნა →</div>
          </div>
        ))}
      </div>
    </div>
  );
}