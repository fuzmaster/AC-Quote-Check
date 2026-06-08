import { Icon } from "./Icon";
import { REPAIRS, HISTORY, type FormState, type RepairKey, type HistoryKey } from "../lib/engine";

/* ---------- Form primitives ---------- */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="field-top">
      <label className="field-label">{children}</label>
    </div>
  );
}

function Helper({ children }: { children: React.ReactNode }) {
  return <p className="field-help">{children}</p>;
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 40,
}: {
  value: number | "";
  onChange: (v: number | "") => void;
  min?: number;
  max?: number;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="stepper">
      <button
        type="button"
        className="step-btn"
        aria-label="Decrease"
        onClick={() => set((Number(value) || 0) - 1)}
      >
        <Icon name="minus" size={16} />
      </button>
      <input
        className="step-input"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, "");
          onChange(digits === "" ? "" : Math.min(max, Number(digits)));
        }}
        placeholder="—"
      />
      <span className="step-unit">yrs</span>
      <button
        type="button"
        className="step-btn"
        aria-label="Increase"
        onClick={() => set((Number(value) || 0) + 1)}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | "";
  onChange: (v: number | "") => void;
  placeholder?: string;
}) {
  return (
    <div className="money-input">
      <span className="money-prefix">$</span>
      <input
        className="money-field"
        inputMode="numeric"
        placeholder={placeholder}
        value={value ? Number(value).toLocaleString("en-US") : ""}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, "");
          onChange(digits === "" ? "" : Number(digits));
        }}
      />
    </div>
  );
}

function SelectField<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="select-wrap">
      <select className="select" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="select-caret"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

function RadioGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="radio-group" role="radiogroup">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            className={"radio-pill" + (active ? " is-active" : "")}
            aria-pressed={active}
            onClick={() => onChange(o.value)}
          >
            <span className="radio-dot">{active && <Icon name="check" size={13} stroke={2.4} />}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Quote form ---------- */
interface QuoteFormProps {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onSubmit: () => void;
  hasResult: boolean;
}

export function QuoteForm({ form, setField, onSubmit, hasResult }: QuoteFormProps) {
  const repairOpts = (Object.entries(REPAIRS) as [RepairKey, (typeof REPAIRS)[RepairKey]][]).map(
    ([value, r]) => ({ value, label: r.label })
  );
  const histOpts = (Object.entries(HISTORY) as [HistoryKey, (typeof HISTORY)[HistoryKey]][]).map(
    ([value, h]) => ({ value, label: h.label })
  );
  const ready = form.age !== "" && form.quote !== "" && Number(form.quote) > 0;

  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit();
      }}
    >
      <div className="form-head">
        <h2 className="form-title">Check your quote</h2>
        <p className="form-tagline">Five quick answers. Results first. No email wall.</p>
      </div>

      <div className="field">
        <FieldLabel>How old is your AC system?</FieldLabel>
        <Stepper value={form.age} onChange={(v) => setField("age", v)} />
        <Helper>Estimate if you're not sure.</Helper>
      </div>

      <div className="field">
        <FieldLabel>Repair quote amount</FieldLabel>
        <MoneyInput value={form.quote} onChange={(v) => setField("quote", v)} placeholder="2,300" />
        <Helper>Use the full quoted amount before discounts.</Helper>
      </div>

      <div className="field">
        <FieldLabel>What repair was quoted?</FieldLabel>
        <SelectField value={form.repair} onChange={(v) => setField("repair", v)} options={repairOpts} />
      </div>

      <div className="field">
        <FieldLabel>How has the system been performing?</FieldLabel>
        <RadioGroup value={form.history} onChange={(v) => setField("history", v)} options={histOpts} />
      </div>

      <div className="field">
        <FieldLabel>
          ZIP code <span className="field-optional">optional</span>
        </FieldLabel>
        <input
          className="text-input"
          inputMode="numeric"
          placeholder="e.g. 78704"
          maxLength={5}
          value={form.zip}
          onChange={(e) => setField("zip", e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
        />
        <Helper>Used later for local pricing context. Not required for your results.</Helper>
      </div>

      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={!ready}>
        {hasResult ? "Re-check my quote" : "Check my quote"} <Icon name="arrow" size={18} />
      </button>
      <p className="form-foot">
        <Icon name="shield" size={14} /> Your answers stay on this page.
      </p>
    </form>
  );
}
