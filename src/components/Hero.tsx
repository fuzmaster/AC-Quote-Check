import { Icon } from "./Icon";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="eyebrow">
          <span className="dot" /> Quote sanity check · not a sales pitch
        </div>
        <h1 className="hero-h1">Is your AC repair quote worth it?</h1>
        <p className="hero-sub">Check the math before you approve an expensive HVAC repair.</p>
        <p className="hero-support">
          Enter your system age, quote amount, and repair type. We'll flag warranty issues,
          overpriced repairs, and cases where a second quote is worth it.
        </p>
        <div className="hero-cta-row">
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Check My Quote <Icon name="arrow" size={18} />
          </button>
          <span className="trust-line">No email required. No sales call before results.</span>
        </div>
        <ul className="hero-chips">
          <li>
            <Icon name="bolt" size={15} /> Results shown instantly
          </li>
          <li>
            <Icon name="calc" size={15} /> Shows the reasoning, not just a score
          </li>
          <li>
            <Icon name="shield" size={15} /> Built to protect you, not upsell you
          </li>
        </ul>
      </div>
    </header>
  );
}
