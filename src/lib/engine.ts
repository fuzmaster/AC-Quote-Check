/* AC Quote Check — verdict engine
   Plain rules-based logic. Not a diagnosis; a check of the QUOTE's math.
   Ported verbatim from the approved prototype's engine.js. */

export type RepairKey =
  | "unsure"
  | "capacitor"
  | "contactor"
  | "thermostat"
  | "fanmotor"
  | "blower"
  | "compressor"
  | "evapcoil"
  | "condcoil"
  | "refrigerant"
  | "drain";

export type HistoryKey = "fine" | "struggle" | "breaks" | "never" | "unsure";

export interface Repair {
  label: string;
  low: number;
  high: number;
  major: boolean;
  warrantyLikely: boolean;
}

export interface History {
  label: string;
  weight: number;
}

export type Tone = "positive" | "caution" | "warn" | "danger";

export interface Verdict {
  key: "reasonable" | "checkquote" | "secondquote" | "replace" | "stop";
  headline: string;
  tone: Tone;
  band: string;
}

export type ReasonTone = "good" | "warn" | "neutral";
export interface Reason {
  t: ReasonTone;
  text: string;
}

export interface Warranty {
  level: "high" | "normal";
  title: string;
  body: string;
}

export interface Projection {
  repairNow: number;
  futureRepairs: number;
  repairTotal: number;
  replaceTotal: number;
}

export interface FormState {
  age: number | "";
  quote: number | "";
  repair: RepairKey;
  history: HistoryKey;
  zip: string;
}

export interface EvalResult {
  verdict: Verdict;
  risk: number;
  reasons: Reason[];
  warranty: Warranty | null;
  why: string;
  flags: { fiveK?: number; fiveKTriggered?: boolean; overpriced?: "high" | "mild" };
  nextQuestions: string[];
  repair: Repair;
  age: number;
  quote: number;
  fiveK: number;
  projection: Projection;
}

// Typical fair-cost ranges (parts + labor) and whether the part is a "major" component.
// Ranges are decision-support estimates, not exact quotes.
export const REPAIRS: Record<RepairKey, Repair> = {
  unsure: { label: "I'm not sure", low: 150, high: 1500, major: false, warrantyLikely: false },
  capacitor: { label: "Capacitor", low: 120, high: 400, major: false, warrantyLikely: true },
  contactor: { label: "Contactor", low: 120, high: 350, major: false, warrantyLikely: true },
  thermostat: { label: "Thermostat", low: 150, high: 450, major: false, warrantyLikely: false },
  fanmotor: { label: "Fan motor", low: 350, high: 800, major: false, warrantyLikely: true },
  blower: { label: "Blower motor", low: 450, high: 1100, major: false, warrantyLikely: true },
  compressor: { label: "Compressor", low: 1200, high: 2800, major: true, warrantyLikely: true },
  evapcoil: { label: "Evaporator coil", low: 1000, high: 2500, major: true, warrantyLikely: true },
  condcoil: { label: "Condenser coil", low: 1400, high: 3000, major: true, warrantyLikely: true },
  refrigerant: { label: "Refrigerant leak", low: 400, high: 1600, major: true, warrantyLikely: false },
  drain: { label: "Drain line / water issue", low: 100, high: 450, major: false, warrantyLikely: false },
};

export const HISTORY: Record<HistoryKey, History> = {
  fine: { label: "It worked fine before this", weight: 0 },
  struggle: { label: "It has been struggling", weight: 10 },
  breaks: { label: "It breaks every summer", weight: 20 },
  never: { label: "It never cooled well", weight: 16 },
  unsure: { label: "I'm not sure", weight: 4 },
};

export function fmtMoney(n: number | "" | null | undefined): string {
  const v = typeof n === "number" ? n : Number(n);
  if (n == null || n === "" || isNaN(v)) return "$0";
  return "$" + Math.round(v).toLocaleString("en-US");
}

// Verdict tiers, lowest risk -> highest
const VERDICTS: Record<Verdict["key"], Verdict> = {
  reasonable: {
    key: "reasonable",
    headline: "This repair looks reasonable.",
    tone: "positive",
    band: "Low risk",
  },
  checkquote: {
    key: "checkquote",
    headline: "Probably okay — but check the quote.",
    tone: "caution",
    band: "Moderate risk",
  },
  secondquote: {
    key: "secondquote",
    headline: "Get a second quote before approving this.",
    tone: "warn",
    band: "Elevated risk",
  },
  replace: {
    key: "replace",
    headline: "Replacement may be the smarter spend.",
    tone: "warn",
    band: "Elevated risk",
  },
  stop: {
    key: "stop",
    headline: "Don't approve this yet.",
    tone: "danger",
    band: "High risk",
  },
};

export function evaluate(input: FormState): EvalResult {
  const age = Math.max(0, Math.min(40, Number(input.age) || 0));
  const quote = Math.max(0, Number(input.quote) || 0);
  const repair = REPAIRS[input.repair] || REPAIRS.unsure;
  const hist = HISTORY[input.history] || HISTORY.unsure;

  let risk = 0;
  const reasons: Reason[] = []; // plain-English contributing factors
  const flags: EvalResult["flags"] = {};

  // --- Age factor ---
  let ageBand: "young" | "mid" | "older" | "old" | "very old";
  if (age <= 6) {
    risk += 0;
    ageBand = "young";
  } else if (age <= 10) {
    risk += 12;
    ageBand = "mid";
  } else if (age <= 13) {
    risk += 26;
    ageBand = "older";
  } else if (age <= 16) {
    risk += 42;
    ageBand = "old";
  } else {
    risk += 56;
    ageBand = "very old";
  }

  if (ageBand === "young") {
    reasons.push({ t: "good", text: `At ${age} years, your system is still early in its useful life — repairs usually pay off here.` });
  } else if (ageBand === "mid") {
    reasons.push({ t: "neutral", text: `At ${age} years, the system is middle-aged. A repair can still be worth it if the price is right.` });
  } else if (ageBand === "older") {
    reasons.push({ t: "warn", text: `At ${age} years, the system is past the halfway point of a typical lifespan, so a big spend carries more risk.` });
  } else {
    reasons.push({ t: "warn", text: `At ${age} years, the system is near the end of its useful life. Another major part could fail soon.` });
  }

  // --- $5,000 rule (age × repair cost) — only meaningful once a system has some age ---
  const fiveK = age * quote;
  flags.fiveK = fiveK;
  if (quote > 0) {
    if (age < 8) {
      reasons.push({ t: "neutral", text: `On a system this new, the "$5,000 rule" isn't the right test — warranty status matters more. Confirm whether the failed part is still covered before you weigh the price.` });
    } else if (fiveK > 5000) {
      const over = Math.min(34, 8 + (fiveK - 5000) / 700);
      risk += over;
      reasons.push({ t: "warn", text: `The "$5,000 rule" (age × repair cost) comes out to ${fmtMoney(fiveK)}. Above $5,000, replacement often beats repair.` });
      flags.fiveKTriggered = true;
    } else {
      reasons.push({ t: "good", text: `The "$5,000 rule" (age × repair cost) is ${fmtMoney(fiveK)} — under the $5,000 line where replacement usually wins.` });
    }
  }

  // --- Overpricing vs typical range ---
  let ratio: number | null = null;
  if (quote > 0 && input.repair !== "unsure") {
    ratio = quote / repair.high;
    if (ratio > 1.5) {
      risk += 26;
      reasons.push({ t: "warn", text: `${fmtMoney(quote)} is well above the typical ${fmtMoney(repair.low)}–${fmtMoney(repair.high)} range for a ${repair.label.toLowerCase()} repair. Ask for an itemized breakdown.` });
      flags.overpriced = "high";
    } else if (ratio > 1.2) {
      risk += 14;
      reasons.push({ t: "warn", text: `${fmtMoney(quote)} is on the high side of the ${fmtMoney(repair.low)}–${fmtMoney(repair.high)} typical range for a ${repair.label.toLowerCase()}.` });
      flags.overpriced = "mild";
    } else if (ratio >= 0.85) {
      reasons.push({ t: "neutral", text: `${fmtMoney(quote)} sits inside the typical ${fmtMoney(repair.low)}–${fmtMoney(repair.high)} range for a ${repair.label.toLowerCase()}.` });
    } else {
      reasons.push({ t: "good", text: `${fmtMoney(quote)} is at or below the typical range for a ${repair.label.toLowerCase()} — the price itself looks fair.` });
    }
  } else if (quote > 0) {
    reasons.push({ t: "neutral", text: `Since the repair type isn't pinned down, ask the tech exactly which part failed before you compare the price.` });
  }

  // --- Major component on an aging system ---
  if (repair.major && age >= 12) {
    risk += 16;
    reasons.push({ t: "warn", text: `A ${repair.label.toLowerCase()} is a major component. Replacing one on a ${age}-year-old system is often a sign the rest is close behind.` });
  } else if (repair.major) {
    reasons.push({ t: "neutral", text: `A ${repair.label.toLowerCase()} is a major component — worth confirming the diagnosis before approving.` });
  }

  // --- History ---
  risk += hist.weight;
  if (hist.weight >= 16) {
    reasons.push({ t: "warn", text: `You said "${hist.label.toLowerCase()}." Repeated trouble means this repair may not be the last one.` });
  } else if (hist.weight >= 10) {
    reasons.push({ t: "neutral", text: `You said "${hist.label.toLowerCase()}." Keep that in mind — a fix here may not solve everything.` });
  } else if (input.history === "fine") {
    reasons.push({ t: "good", text: `It worked fine until now, which makes a one-time repair more likely to hold.` });
  }

  risk = Math.max(0, Math.min(100, Math.round(risk)));

  // --- Warranty module ---
  let warranty: Warranty | null = null;
  if (age <= 5) {
    warranty = {
      level: "high",
      title: "Wait before approving — this may be under warranty.",
      body: `A major part on a ${age}-year-old system is often still covered by a manufacturer parts warranty (typically 5–10 years, longer if registered). Ask whether the failed part is covered and whether you'd only owe labor, refrigerant, or fees.`,
    };
  } else if (age <= 10) {
    warranty = {
      level: "normal",
      title: "Warranty check: your system may still have parts coverage.",
      body: `Many ${age}-year-old systems still carry a manufacturer parts warranty, especially if it was registered after install. Before approving, ask whether the failed part is covered and what you're actually paying for.`,
    };
  }

  // --- Pick the verdict ---
  let verdict: Verdict;
  const replaceSignal = repair.major && age >= 13 && (fiveK > 7000 || (ratio != null && ratio > 1.2) || hist.weight >= 16);

  if (replaceSignal && risk >= 55) {
    verdict = VERDICTS.replace;
  } else if (risk >= 70) {
    verdict = VERDICTS.stop;
  } else if (risk >= 48) {
    verdict = VERDICTS.secondquote;
  } else if (risk >= 26) {
    verdict = VERDICTS.checkquote;
  } else {
    verdict = VERDICTS.reasonable;
  }

  // Overpriced (high) is a hard nudge toward "don't approve yet" regardless of age
  if (flags.overpriced === "high" && verdict.key === "checkquote") {
    verdict = VERDICTS.secondquote;
  }

  // A newer system likely under warranty shouldn't read "reasonable" for a real bill —
  // the warranty question has to be answered first.
  if (warranty && warranty.level === "high" && (repair.major || quote >= 700)) {
    if (verdict.key === "reasonable" || verdict.key === "checkquote") {
      verdict = VERDICTS.secondquote;
    }
  }

  // Build the "why" sentence
  const ageWord = ageBand === "young" ? "newer" : ageBand === "mid" ? "" : "older";
  let why: string;
  if (verdict.key === "reasonable") {
    why = `You're looking at a ${fmtMoney(quote)} ${repair.label.toLowerCase()} repair on a ${age}-year-old system. The price is in range and the system has plenty of life left, so this is a reasonable spend.`;
  } else if (verdict.key === "checkquote") {
    why = `A ${fmtMoney(quote)} ${repair.label.toLowerCase()} repair on a ${age}-year-old system can make sense — but confirm the quote includes everything before you sign.`;
  } else if (verdict.key === "secondquote") {
    why = `You're considering a ${fmtMoney(quote)} ${repair.label.toLowerCase()} repair on a ${age}-year-old system. That's enough money, on a system ${ageWord ? "that's " + ageWord : "with some history"}, to be worth a second set of eyes before approving.`;
  } else if (verdict.key === "replace") {
    why = `You're weighing a ${fmtMoney(quote)} repair on a ${age}-year-old system. A spend this size on a major part this late in the system's life is often better put toward replacement.`;
  } else {
    why = `A ${fmtMoney(quote)} ${repair.label.toLowerCase()} repair on a ${age}-year-old system raises enough flags that you shouldn't approve it as-is. Get the details below answered first.`;
  }

  // Tailored questions to ask next (subset, verdict-aware)
  const nextQuestions: string[] = [];
  if (warranty) nextQuestions.push("Is the failed part still under manufacturer warranty?");
  if (flags.overpriced) nextQuestions.push("Can you itemize parts, labor, refrigerant, and fees?");
  if (repair.major && age >= 12) nextQuestions.push(`What would replacing a similar-size system cost?`);
  nextQuestions.push("How long is this repair guaranteed?");
  if (hist.weight >= 10) nextQuestions.push("If I fix this now, what's the next most likely failure?");
  if (input.repair === "unsure") nextQuestions.push("Which exact part failed — can you show me the reading?");
  // de-dup + cap at 4
  const seen = new Set<string>();
  const trimmedQs = nextQuestions.filter((q) => (seen.has(q) ? false : seen.add(q))).slice(0, 4);

  return {
    verdict,
    risk,
    reasons,
    warranty,
    why,
    flags,
    nextQuestions: trimmedQs,
    repair,
    age,
    quote,
    fiveK,
    // chart projection inputs
    projection: buildProjection(age, quote, repair),
  };
}

// 5-year money check projection
function buildProjection(age: number, quote: number, repair: Repair): Projection {
  const q = quote || repair.high;
  // Repairing old unit: this repair now + expected future repairs over 5y, scaled by age/severity
  const futureRiskFactor = Math.min(1, Math.max(0.15, (age - 6) / 12)) * (repair.major ? 1.25 : 1);
  const futureRepairs = Math.round(((900 + (repair.major ? 700 : 0)) * (0.6 + futureRiskFactor)) / 50) * 50;
  const repairPath = Math.round((q + futureRepairs) / 50) * 50;
  // Replacing: typical mid-efficiency system installed, minus little future repair (under warranty)
  const replacePath = 7200; // representative installed cost, decision-support only
  return {
    repairNow: q,
    futureRepairs,
    repairTotal: repairPath,
    replaceTotal: replacePath,
  };
}
