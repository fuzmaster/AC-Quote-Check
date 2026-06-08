import { Icon, type IconName } from "./Icon";
import type { EvalResult, Tone, Warranty } from "../lib/engine";

/* ---------- Empty state ---------- */
export function EmptyState() {
  return (
    <div className="result-card empty">
      <div className="empty-badge">
        <Icon name="calc" size={26} />
      </div>
      <h3 className="empty-title">Your result will appear here.</h3>
      <p className="empty-sub">No email. No sales call. Just the math first.</p>
      <ul className="empty-list">
        <li>
          <Icon name="check" size={15} stroke={2.2} /> A plain-English verdict on the quote
        </li>
        <li>
          <Icon name="check" size={15} stroke={2.2} /> A risk score with the reasoning shown
        </li>
        <li>
          <Icon name="check" size={15} stroke={2.2} /> The exact questions to ask your tech next
        </li>
      </ul>
    </div>
  );
}

/* ---------- Risk meter ---------- */
function RiskMeter({ value, tone }: { value: number; tone: Tone }) {
  return (
    <div className="risk">
      <div className="risk-head">
        <span className="risk-label">Quote risk score</span>
        <span className="risk-num">
          {value}
          <span className="risk-den">/100</span>
        </span>
      </div>
      <div className="risk-bar">
        <div className="risk-track">
          <div className="risk-fill" style={{ left: value + "%" }} data-tone={tone} />
        </div>
        <div className="risk-thumb" style={{ left: value + "%" }} />
      </div>
      <div className="risk-scale">
        <span>Low</span>
        <span>Moderate</span>
        <span>Elevated</span>
        <span>High</span>
      </div>
    </div>
  );
}

/* ---------- Warranty alert (inside result) ---------- */
function WarrantyAlert({ warranty }: { warranty: Warranty | null }) {
  if (!warranty) return null;
  return (
    <div className={"warranty " + (warranty.level === "high" ? "warranty-high" : "")}>
      <div className="warranty-icon">
        <Icon name="shield" size={20} />
      </div>
      <div>
        <p className="warranty-title">{warranty.title}</p>
        <p className="warranty-body">{warranty.body}</p>
      </div>
    </div>
  );
}

const bandIcon = (tone: Tone): IconName =>
  tone === "positive" ? "check" : tone === "danger" ? "alert" : "info";

/* ---------- Result card ---------- */
interface ResultCardProps {
  result: EvalResult;
  onCopy: () => void;
  copied: boolean;
}

export function ResultCard({ result, onCopy, copied }: ResultCardProps) {
  const { verdict, risk, why, reasons, warranty, nextQuestions } = result;
  const urgent = verdict.tone === "danger" || verdict.tone === "warn";
  return (
    <div className={"result-card filled" + (urgent ? " is-urgent" : "")} data-tone={verdict.tone}>
      <div className="result-accent" data-tone={verdict.tone} />
      <div className="result-top" data-tone={verdict.tone}>
        <div className="result-band" data-tone={verdict.tone}>
          <Icon name={bandIcon(verdict.tone)} size={15} stroke={2.2} />
          {verdict.band}
        </div>
        <h3 className="result-headline">{verdict.headline}</h3>
        <p className="result-why">{why}</p>
      </div>

      <WarrantyAlert warranty={warranty} />

      <RiskMeter value={risk} tone={verdict.tone} />

      <div className="reasons">
        <p className="reasons-title">How we got here</p>
        <ul>
          {reasons.map((r, i) => (
            <li key={i} className="reason" data-t={r.t}>
              <span className="reason-mark" data-t={r.t}>
                <Icon name={r.t === "good" ? "check" : r.t === "warn" ? "alert" : "info"} size={13} stroke={2.2} />
              </span>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {nextQuestions.length > 0 && (
        <div className="next-q">
          <p className="next-q-title">Ask your tech before you approve</p>
          <ul>
            {nextQuestions.map((q, i) => (
              <li key={i}>
                <span className="next-q-num">{i + 1}</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-actions">
        {urgent ? (
          <>
            <button type="button" className="btn btn-primary btn-block" onClick={onCopy}>
              <Icon name="copy" size={16} /> {copied ? "Copied to clipboard" : "Copy my quote summary"}
            </button>
            <a className="btn btn-ghost btn-block" href="#second-quote">
              Get a second opinion before you sign <Icon name="arrow" size={17} />
            </a>
          </>
        ) : (
          <>
            <a className="btn btn-primary btn-block" href="#second-quote">
              Get a second opinion <Icon name="arrow" size={17} />
            </a>
            <button type="button" className="btn btn-ghost btn-block" onClick={onCopy}>
              <Icon name="copy" size={16} /> {copied ? "Copied to clipboard" : "Copy my quote summary"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
