import { Icon } from "./Icon";
import { fmtMoney, type EvalResult, type Projection } from "../lib/engine";

/* 5-Year Money Check — bespoke vertical stacked bars, ported pixel-for-pixel
   from the approved prototype. Pure CSS so it animates and scales without a
   charting runtime. */
export function MoneyChart({ result }: { result: EvalResult | null }) {
  const data: Projection = result
    ? result.projection
    : { repairNow: 1600, futureRepairs: 1400, repairTotal: 3000, replaceTotal: 7200 };

  const max = Math.max(data.repairTotal, data.replaceTotal) * 1.15;
  const h = (v: number) => Math.max(6, (v / max) * 100);

  return (
    <section className="section money" id="money-check">
      <div className="section-head">
        <span className="kicker">5-Year Money Check</span>
        <h2 className="section-title">Keep repairing, or replace and reset the risk?</h2>
        <p className="section-lede">
          This shows what you may be putting at risk over the next five summers — a rough
          projection for decision support, not a contractor quote.
        </p>
      </div>

      <div className="chart-card">
        <div className="chart-plot">
          {/* Repair column (stacked) */}
          <div className="bar-col">
            <div className="bar-stack" style={{ height: h(data.repairTotal) + "%" }}>
              <div
                className="bar repair-future"
                style={{ flexBasis: (data.futureRepairs / data.repairTotal) * 100 + "%" }}
              >
                <span className="bar-seg-label">
                  Likely future repairs<b>{fmtMoney(data.futureRepairs)}</b>
                </span>
              </div>
              <div
                className="bar repair-now"
                style={{ flexBasis: (data.repairNow / data.repairTotal) * 100 + "%" }}
              >
                <span className="bar-seg-label">
                  Today's repair<b>{fmtMoney(data.repairNow)}</b>
                </span>
              </div>
            </div>
            <div className="bar-total">{fmtMoney(data.repairTotal)}</div>
            <div className="bar-name">Keep repairing this system</div>
            <div className="bar-tag tag-warn">
              <Icon name="alert" size={13} stroke={2.2} /> Higher risk
            </div>
          </div>

          {/* Replace column */}
          <div className="bar-col">
            <div className="bar-stack" style={{ height: h(data.replaceTotal) + "%" }}>
              <div className="bar replace" style={{ flexBasis: "100%" }}>
                <span className="bar-seg-label">
                  Example replacement estimate<b>{fmtMoney(data.replaceTotal)}</b>
                </span>
              </div>
            </div>
            <div className="bar-total">{fmtMoney(data.replaceTotal)}</div>
            <div className="bar-name">Replace and reset the risk</div>
            <div className="bar-tag tag-good">
              <Icon name="shield" size={13} stroke={2.2} /> Lower risk · higher upfront
            </div>
          </div>
        </div>

        <div className="chart-foot">
          <Icon name="info" size={14} />
          <span>
            This is an estimate for decision support, not a contractor quote. Replacement figure assumes
            a similar-size, mid-efficiency system.
          </span>
        </div>
      </div>
    </section>
  );
}
