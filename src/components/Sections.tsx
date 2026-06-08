import { useState } from "react";
import { Icon } from "./Icon";

/* ---------- Before-you-approve strip ---------- */
export function ApproveStrip() {
  return (
    <div className="approve-strip">
      <span className="approve-lead">
        <Icon name="alert" size={16} /> Before you approve a big repair
      </span>
      <ol className="approve-steps">
        <li>
          <b>1</b> Check the warranty
        </li>
        <li>
          <b>2</b> Check the quote math
        </li>
        <li>
          <b>3</b> Ask what fails next
        </li>
      </ol>
    </div>
  );
}

/* ---------- Questions checklist ---------- */
const CHECKLIST = [
  "Does this include parts, labor, refrigerant, and fees?",
  "Is the failed part under manufacturer warranty?",
  "How long is this repair guaranteed?",
  "If I repair this now, what is the next most likely failure?",
  "What would replacement cost for a similar-size system?",
  "Is there a cheaper repair option that gets me through the season?",
  "Can you show me the failed part or test reading?",
];

export function Checklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setChecked((c) => ({ ...c, [i]: !c[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <section className="section checklist" id="ask">
      <div className="section-head">
        <span className="kicker">Before you sign</span>
        <h2 className="section-title">Ask these before you approve the quote</h2>
        <p className="section-lede">
          Tap each one as you get an answer.{" "}
          {done > 0 && (
            <b>
              {done}/{CHECKLIST.length} covered.
            </b>
          )}
        </p>
      </div>
      <ul className="check-list">
        {CHECKLIST.map((q, i) => (
          <li
            key={i}
            className={"check-item" + (checked[i] ? " is-done" : "")}
            onClick={() => toggle(i)}
          >
            <span className="check-box">{checked[i] && <Icon name="check" size={15} stroke={2.6} />}</span>
            <span className="check-text">{q}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Second quote CTA ---------- */
interface SecondQuoteProps {
  summary: string;
  onCopy: () => void;
  copied: boolean;
}

export function SecondQuoteCTA({ summary, onCopy, copied }: SecondQuoteProps) {
  const [showGuide, setShowGuide] = useState(false);
  return (
    <section className="section second" id="second-quote">
      <div className="second-card">
        <div className="second-left">
          <span className="kicker on-dark">Optional next step</span>
          <h2 className="second-title">Want a second opinion?</h2>
          <p className="second-body">
            Copy your quote summary below and send it to a local HVAC pro — ask them to beat it,
            confirm it, or explain what's missing. No obligation, no sales call.
          </p>
          <div className="second-actions">
            <button className="btn btn-accent btn-lg" onClick={onCopy}>
              <Icon name="copy" size={17} /> {copied ? "Copied to clipboard" : "Copy my quote summary"}
            </button>
            <button className="btn btn-outline-light btn-lg" onClick={() => setShowGuide((s) => !s)}>
              What to send a second pro <Icon name={showGuide ? "minus" : "plus"} size={16} />
            </button>
          </div>
          {showGuide && (
            <ul className="send-guide">
              <li>
                <Icon name="check" size={14} stroke={2.4} /> Your system age and the exact repair quoted
              </li>
              <li>
                <Icon name="check" size={14} stroke={2.4} /> The full quoted amount, before any discount
              </li>
              <li>
                <Icon name="check" size={14} stroke={2.4} /> Ask: “Can you confirm this price and itemize it?”
              </li>
              <li>
                <Icon name="check" size={14} stroke={2.4} /> Ask: “Is the failed part under warranty?”
              </li>
            </ul>
          )}
        </div>
        <div className="second-right">
          <div className="summary-chip">
            <div className="summary-chip-head">
              <Icon name="quote" size={16} /> Quote summary
            </div>
            <pre className="summary-text">{summary}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS: [string, string][] = [
  [
    "Should I repair or replace my AC?",
    "It depends on age, repair cost, and history. A common rule of thumb: multiply the system's age by the repair cost. If the result clears $5,000 — or the system is past ~13 years and needs a major part — replacement is often the smarter long-term spend. A cheap repair on a newer unit is usually low-risk.",
  ],
  [
    "What is the $5,000 rule for AC repair?",
    "Multiply your system's age (in years) by the repair quote. If the total is over $5,000, replacement tends to make more financial sense than the repair. It's a quick gut-check, not a verdict — local labor rates and warranty status still matter.",
  ],
  [
    "Is a compressor repair worth it?",
    "A compressor is one of the most expensive parts of an AC system. On a newer unit it may still be under warranty (worth confirming before you pay). On a system past ~12 years, spending well over $1,500 on a compressor is often where people get burned — it's worth a second quote.",
  ],
  [
    "Is an evaporator coil repair worth it?",
    "Coil repairs are major and pricey. On a younger, registered system the coil may be covered by a parts warranty. On an older system, a coil replacement can signal that other components are nearing the end too — compare it against replacement before approving.",
  ],
  [
    "Should a newer AC system still be under warranty?",
    "Often yes. Many manufacturers offer 5–10 year parts warranties, sometimes 10+ if the system was registered after install. If your system is 10 years old or newer, ask whether the failed part is covered and whether you only owe labor, refrigerant, or fees.",
  ],
  [
    "Why is my AC repair quote so expensive?",
    "Quotes bundle parts, labor, refrigerant, diagnostic fees, and sometimes a markup. The same repair can vary widely between companies. Ask for an itemized breakdown — it's the fastest way to see whether a quote is fair or padded.",
  ],
  [
    "Should I get a second HVAC quote?",
    "For anything beyond a routine, low-cost fix, yes. A second quote either confirms the price is fair or saves you real money. Reputable techs expect it and won't be offended.",
  ],
  [
    "What should I ask before approving an AC repair?",
    "Confirm what's included (parts, labor, refrigerant, fees), whether the part is under warranty, how long the repair is guaranteed, what's likely to fail next, and what a comparable replacement would cost. The checklist above covers the essentials.",
  ],
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={"faq-item" + (open ? " is-open" : "")}>
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-icon">
          <Icon name={open ? "minus" : "plus"} size={18} />
        </span>
      </button>
      <div className="faq-a-wrap" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="faq-a-inner">
          <p className="faq-a">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="section-head">
        <span className="kicker">Common questions</span>
        <h2 className="section-title">Repair-or-replace, answered plainly</h2>
      </div>
      <div className="faq-list">
        {FAQS.map(([q, a], i) => (
          <FAQItem key={i} q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Scope note (what this is / is not) ---------- */
export function ScopeNote() {
  return (
    <section className="section scope">
      <div className="scope-grid">
        <div className="scope-card scope-do">
          <div className="scope-tag scope-tag-do">
            <Icon name="check" size={14} stroke={2.4} /> What this does
          </div>
          <p>
            Checks how risky a quote looks based on system age, repair type, price, warranty window,
            and how the system has been performing — and shows the reasoning.
          </p>
        </div>
        <div className="scope-card scope-dont">
          <div className="scope-tag scope-tag-dont">
            <Icon name="info" size={14} /> What this does not do
          </div>
          <p>
            Diagnose your AC, guarantee replacement pricing, or replace an in-person inspection by a
            licensed technician.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Icon name="shield" size={18} /> AC Quote Check
        </div>
        <p className="disclaimer">
          AC Quote Check is a quote sanity-checking tool, not a professional HVAC diagnosis. Actual
          repair and replacement decisions depend on system condition, installation quality, local
          labor rates, warranty status, and technician inspection.
        </p>
        <p className="footer-meta">
          Built as a quote sanity check, not a sales pitch · No email required · Results shown instantly
        </p>
      </div>
    </footer>
  );
}
